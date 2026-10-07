import { Router, Response, Request } from 'express';
import { cloudDb } from '../cloudDb';
import { gatewayManager } from '../gateways/gatewayManager';
import { CanonicalPaymentStatus, PaymentMethodType } from '../gateways/types';
import { requireAuth, requireRole, AuthenticatedRequest } from '../auth';

export const paymentRouter = Router();

/**
 * 1. POST /api/payments/create
 * Iniciar Cobrança (Pix ou Cartão) através do Gateway Ativo (Mercado Pago)
 * Regra #6 & #7: O pagamento nasce como PAYMENT_PENDING. O backend persiste no banco.
 * Regra #17: Impede pagamento duplicado reutilizando pagamento pendente existente.
 */
paymentRouter.post('/create', async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const user = authReq.user;
  const { orderId, method, payer, cardDetails, idempotencyKey, testScenario } = req.body;

  if (!orderId || !method) {
    return res.status(400).json({ error: 'orderId e method (pix | credit_card | debit_card) são obrigatórios.' });
  }

  try {
    const order = await cloudDb.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: `Pedido #${orderId} não foi encontrado no sistema.` });
    }

    // Regra #17: Evitar duplicidade de pagamento ativo
    const existingPayment = await cloudDb.getPaymentByOrderId(orderId);
    if (existingPayment && existingPayment.status === 'PAYMENT_PENDING') {
      // Se for PIX e ainda não expirou, reutiliza o mesmo
      const isExpired = existingPayment.pixExpiresAt ? new Date(existingPayment.pixExpiresAt) < new Date() : false;
      if (!isExpired) {
        return res.json({
          success: true,
          message: 'Transação de pagamento ativa recuperada.',
          reused: true,
          payment: existingPayment,
          pix: existingPayment.method === 'pix' ? {
            qrCode: existingPayment.pixQrCode,
            qrCodeBase64: existingPayment.pixQrCodeBase64,
            copyPaste: existingPayment.pixCopyPaste,
            expiresAt: existingPayment.pixExpiresAt?.toISOString(),
          } : undefined,
        });
      }
    }

    const payerInfo = {
      email: payer?.email || order.customerEmail || user?.email || 'cliente@mermifitlife.com.br',
      name: payer?.name || order.customerName || user?.name || 'Cliente MerMi',
      identification: payer?.identification || {
        type: 'CPF',
        number: payer?.cpf?.replace(/\D/g, '') || '19119119100',
      },
    };

    const idempKey = idempotencyKey || `idemp_${orderId}_${method}_${Date.now()}`;

    // Chamar o Gateway Manager (Mercado Pago)
    const gatewayResult = await gatewayManager.createPayment({
      orderId,
      amount: order.total,
      currency: 'BRL',
      method: method as PaymentMethodType,
      description: `MerMi Fit Life - Pedido #${orderId}`,
      payer: payerInfo,
      cardDetails,
      idempotencyKey: idempKey,
      testScenario,
    });

    if (!gatewayResult.success && gatewayResult.status === 'PAYMENT_REJECTED') {
      return res.status(400).json({
        success: false,
        error: gatewayResult.error || 'Pagamento recusado pelo gateway.',
        status: 'PAYMENT_REJECTED',
        statusDetail: gatewayResult.statusDetail,
      });
    }

    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const expiresAt = gatewayResult.pix?.expiresAt ? new Date(gatewayResult.pix.expiresAt) : new Date(Date.now() + 15 * 60000);

    // Gravar no Banco de Dados Central Cloud SQL (Regra #7)
    const savedPayment = await cloudDb.createPaymentRecord({
      id: paymentId,
      orderId,
      userId: user?.id || order.userId || undefined,
      externalReference: orderId,
      gateway: gatewayResult.gateway,
      gatewayPaymentId: gatewayResult.gatewayPaymentId,
      amount: order.total,
      currency: 'BRL',
      method,
      status: 'PAYMENT_PENDING',
      statusDetail: gatewayResult.statusDetail || 'pending_payment',
      environment: gatewayResult.environment,
      idempotencyKey: idempKey,
      pixQrCode: gatewayResult.pix?.qrCode,
      pixQrCodeBase64: gatewayResult.pix?.qrCodeBase64,
      pixCopyPaste: gatewayResult.pix?.copyPaste,
      pixExpiresAt: expiresAt,
      cardLastFour: gatewayResult.card?.lastFour,
      cardBrand: gatewayResult.card?.brand,
      installments: gatewayResult.card?.installments || 1,
      payerEmail: payerInfo.email,
      payerName: payerInfo.name,
      metadataJson: JSON.stringify({
        subtotal: order.subtotal,
        deliveryFee: order.delivery_fee,
        discount: order.points_discount,
      }),
    });

    res.status(201).json({
      success: true,
      message: 'Cobrança gerada com sucesso. Aguardando pagamento.',
      payment: savedPayment,
      pix: gatewayResult.pix,
      card: gatewayResult.card,
    });
  } catch (err: any) {
    console.error('Error creating payment:', err);
    res.status(500).json({ error: 'Erro ao gerar pagamento no servidor: ' + err.message });
  }
});

/**
 * 2. GET /api/payments/:id/status
 * Consulta de Status em Tempo Real pelo Frontend (Regra #15: Retorno do Checkout)
 */
paymentRouter.get('/:id/status', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    let payment = await cloudDb.getPaymentById(id);
    if (!payment) {
      payment = await cloudDb.getPaymentByOrderId(id);
    }
    if (!payment) {
      return res.status(404).json({ error: 'Pagamento não encontrado.' });
    }

    const order = await cloudDb.getOrderById(payment.orderId);

    res.json({
      success: true,
      payment: {
        id: payment.id,
        orderId: payment.orderId,
        gateway: payment.gateway,
        method: payment.method,
        status: payment.status,
        statusDetail: payment.statusDetail,
        amount: payment.amount,
        pixExpiresAt: payment.pixExpiresAt,
        cardLastFour: payment.cardLastFour,
        cardBrand: payment.cardBrand,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      },
      order: order ? {
        id: order.id,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        total: order.total,
        timeline: order.timeline,
      } : null,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao consultar status do pagamento: ' + err.message });
  }
});

/**
 * Health Check Exclusivo do Webhook (GET /api/payments/webhook/health)
 * Requisito estrito do teste de diagnóstico do Mercado Pago
 */
paymentRouter.get('/webhook/health', (_req: Request, res: Response) => {
  res.status(200).json({
    ok: true,
    service: 'mercado-pago-webhook',
  });
});

/**
 * Verificação do Webhook (GET /api/payments/webhook)
 * Responde 200 OK a testes de validação de URL do Mercado Pago
 */
paymentRouter.get('/webhook', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ONLINE',
    gateway: 'mercadopago',
    message: 'MerMi Fit Life Mercado Pago Webhook is active and listening.',
    timestamp: new Date().toISOString(),
  });
});

/**
 * 3. POST /api/payments/webhook
 * Webhook Oficial do Gateway (Mercado Pago -> Servidor)
 * Regra #10: Validar evento, consultar gateway, confirmar status real, atualizar pedido e registrar auditoria.
 * Regra #11: Idempotência estrita (evitar duplicidade de pedido, estoque, produção e pontos).
 * Regra #13: Somente passar para PAID após confirmação autoritativa!
 * Regra #19: Creditar pontos apenas após APPROVED e de forma estritamente idempotente.
 */
paymentRouter.post('/webhook', async (req: Request, res: Response) => {
  try {
    const xSignature = (req.headers['x-signature'] as string) || '';
    const xRequestId = (req.headers['x-request-id'] as string) || '';
    const hasDataId = Boolean(req.body?.data?.id || req.query?.['data.id'] || req.body?.id || req.query?.id);
    const webhookType = String(req.body?.type || req.query?.topic || req.query?.type || 'unknown');
    const webhookAction = String(req.body?.action || req.query?.topic || 'unknown');

    console.log('[WEBHOOK_RECEIVED]', {
      WEBHOOK_TYPE: webhookType,
      WEBHOOK_ACTION: webhookAction,
      HAS_X_SIGNATURE: Boolean(xSignature),
      HAS_X_REQUEST_ID: Boolean(xRequestId),
      HAS_DATA_ID: hasDataId,
    });

    // 1 & 2. Validar a requisição e extrair metadados
    const verification = await gatewayManager.verifyWebhook(req);

    // Caso especial: Teste oficial de conectividade do painel Mercado Pago (Botão Simular / Testar)
    if (verification.isTestEvent) {
      console.log('[HTTP_STATUS] 200');
      console.log('[SIGNATURE_VALID] N/A (Teste de Conectividade)');
      console.log('[PROCESSING_RESULT] Teste de conectividade do Mercado Pago recebido e respondido com sucesso.');

      // Registrar recebimento do teste para histórico de auditoria
      await cloudDb.addAuditLog({
        action: 'WEBHOOK_CONNECTIVITY_TEST',
        targetType: 'GATEWAY',
        targetId: 'mercadopago',
        detailsJson: JSON.stringify({
          action: webhookAction,
          type: webhookType,
          receivedAt: new Date().toISOString(),
        }),
      });

      return res.status(200).json({
        received: true,
        status: 'ONLINE',
        service: 'mercado-pago-webhook',
        message: 'Teste de conectividade do Mercado Pago recebido com sucesso.',
      });
    }

    if (!verification.isValid) {
      console.warn('[HTTP_STATUS] 401 [SIGNATURE_VALID] FALSE [PROCESSING_RESULT] Rejeitado por assinatura inválida ou ausente:', verification.error);
      return res.status(401).json({ error: verification.error || 'Webhook inválido.' });
    }

    console.log('[SIGNATURE_VALID] TRUE');
    console.log('[HTTP_STATUS] 200');

    const gateway = 'mercadopago';
    const eventId = verification.eventId;
    const eventType = verification.eventType;

    // Regra #11: Garantia de Idempotência
    const alreadyProcessed = await cloudDb.isWebhookProcessed(gateway, eventId);
    if (alreadyProcessed) {
      console.log('[PROCESSING_RESULT] Evento já processado anteriormente (idempotência garantida).');
      return res.json({
        received: true,
        success: true,
        message: 'Evento já processado anteriormente (idempotência garantida).',
        eventId,
      });
    }

    // Identificar pagamento associado
    let payment = null;
    if (verification.gatewayPaymentId) {
      payment = await cloudDb.getPaymentByGatewayPaymentId(verification.gatewayPaymentId);
    }
    if (!payment && verification.orderId) {
      payment = await cloudDb.getPaymentByOrderId(verification.orderId);
    }
    if (!payment && req.body.payment_id) {
      payment = await cloudDb.getPaymentById(req.body.payment_id);
    }

    if (!payment) {
      console.log('[PROCESSING_RESULT] Webhook válido registrado, sem transação de pagamento pendente correspondente.');
      // Registrar recebimento mesmo sem pagamento localizado para auditoria
      await cloudDb.logPaymentWebhook({
        id: `whk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        gateway,
        eventId,
        eventType,
        orderId: verification.orderId,
        payloadJson: JSON.stringify(req.body),
        signatureHeader: (req.headers['x-signature'] as string) || undefined,
        status: 'IGNORED',
      });
      return res.json({ received: true, success: true, message: 'Webhook registrado, sem transação pendente correspondente.' });
    }

    const targetOrderId = payment.orderId;
    const targetStatus = verification.status || 'PAYMENT_PENDING';
    const now = new Date();

    // 7 & 8. Atualizar status conforme confirmação do Gateway
    if (targetStatus === 'PAYMENT_APPROVED') {
      // 1. Atualizar pagamento
      await cloudDb.updatePaymentStatus({
        paymentId: payment.id,
        status: 'PAYMENT_APPROVED',
        statusDetail: verification.statusDetail || 'accredited',
        gatewayPaymentId: verification.gatewayPaymentId || payment.gatewayPaymentId || undefined,
      });

      // 2. Atualizar Pedido para PAID (Regra #13)
      const order = await cloudDb.getOrderById(targetOrderId);
      if (order) {
        let timeline = order.timeline || [];
        const hasPaid = timeline.some((t: any) => t.status === 'PAID' && t.completed);
        if (!hasPaid) {
          timeline = timeline.map((t: any) => {
            if (t.status === 'PAID') {
              return { ...t, completed: true, timestamp: now.toISOString() };
            }
            return t;
          });
        }

        await cloudDb.updateOrderStatusAndTimeline({
          orderId: targetOrderId,
          orderStatus: 'PAID', // Pedido liquidado, pronto para entrar no fluxo de cozinha PREPARING (Regra #21)
          paymentStatus: 'PAYMENT_APPROVED',
          timelineJson: JSON.stringify(timeline),
        });

        // 3. Creditar MerMi Points de forma idempotente (Regra #19)
        const pointsToEarn = order.points_earned || Math.floor(order.total);
        if (pointsToEarn > 0 && order.userId) {
          const idempotencyKey = `pts_earn_${targetOrderId}`;
          await cloudDb.addPointsEntry({
            userId: order.userId,
            amount: pointsToEarn,
            type: 'ganho',
            source: 'compra',
            reason: `Cashback MerMi Points pelo pedido #${targetOrderId} aprovado`,
            idempotencyKey,
          });
        }

        // 4. Registrar Log de Auditoria
        await cloudDb.addAuditLog({
          action: 'PAYMENT_APPROVED',
          targetType: 'ORDER',
          targetId: targetOrderId,
          detailsJson: JSON.stringify({
            paymentId: payment.id,
            gatewayPaymentId: verification.gatewayPaymentId,
            amount: payment.amount,
            method: payment.method,
            processedAt: now.toISOString(),
          }),
        });
      }
    } else if (targetStatus === 'PAYMENT_REJECTED') {
      await cloudDb.updatePaymentStatus({
        paymentId: payment.id,
        status: 'PAYMENT_REJECTED',
        statusDetail: verification.statusDetail || 'cc_rejected_other',
      });
      await cloudDb.updateOrderStatusAndTimeline({
        orderId: targetOrderId,
        orderStatus: 'PENDING_PAYMENT',
        paymentStatus: 'PAYMENT_REJECTED',
      });
      await cloudDb.addAuditLog({
        action: 'PAYMENT_REJECTED',
        targetType: 'ORDER',
        targetId: targetOrderId,
        detailsJson: JSON.stringify({ paymentId: payment.id, reason: verification.statusDetail }),
      });
    } else if (targetStatus === 'PAYMENT_CANCELLED' || targetStatus === 'PAYMENT_EXPIRED') {
      await cloudDb.updatePaymentStatus({
        paymentId: payment.id,
        status: targetStatus,
        statusDetail: verification.statusDetail || 'expired_or_cancelled',
      });
      await cloudDb.updateOrderStatusAndTimeline({
        orderId: targetOrderId,
        orderStatus: 'CANCELLED',
        paymentStatus: targetStatus,
      });
      await cloudDb.addAuditLog({
        action: targetStatus,
        targetType: 'ORDER',
        targetId: targetOrderId,
        detailsJson: JSON.stringify({ paymentId: payment.id }),
      });
    }

    // 9. Registrar no log de webhooks para auditoria e controle de idempotência
    await cloudDb.logPaymentWebhook({
      id: `whk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      gateway,
      eventId,
      eventType,
      paymentId: payment.id,
      orderId: targetOrderId,
      payloadJson: JSON.stringify(req.body),
      signatureHeader: (req.headers['x-signature'] as string) || undefined,
      status: 'PROCESSED',
    });

    res.json({
      success: true,
      message: `Webhook processado com sucesso. Status: ${targetStatus}`,
      orderId: targetOrderId,
      status: targetStatus,
    });
  } catch (err: any) {
    console.error('[Webhook] Erro no processamento:', err);
    res.status(500).json({ error: 'Erro no processamento do webhook: ' + err.message });
  }
});

/**
 * 4. POST /api/payments/:id/refund
 * Reembolso no MERMI CONTROL (Regra #16)
 * Registra quem solicitou, quando, valor, motivo, gateway_refund_id, auditoria e estorno de pontos.
 */
paymentRouter.post('/:id/refund', requireAuth, requireRole('OWNER', 'ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { reason, amount } = req.body;
  const user = req.user!;

  try {
    let payment = await cloudDb.getPaymentById(id);
    if (!payment) {
      payment = await cloudDb.getPaymentByOrderId(id);
    }
    if (!payment) {
      return res.status(404).json({ error: 'Pagamento não encontrado para estorno.' });
    }

    if (payment.status !== 'PAYMENT_APPROVED') {
      return res.status(400).json({ error: 'Apenas pagamentos aprovados podem ser reembolsados.' });
    }

    const refundAmount = amount ? Number(amount) : payment.amount;

    // Disparar estorno no Gateway
    const refundRes = await gatewayManager.refundPayment({
      paymentId: payment.id,
      gatewayPaymentId: payment.gatewayPaymentId || undefined,
      orderId: payment.orderId,
      amount: refundAmount,
      reason: reason || 'Cancelamento administrativo no Mermi Control',
      requestedBy: {
        userId: user.id,
        userName: user.name,
      },
    });

    if (!refundRes.success) {
      return res.status(400).json({ error: refundRes.error || 'Falha ao estornar no gateway de pagamento.' });
    }

    // Gravar registro oficial de Reembolso (Regra #16)
    const refundRecordId = `ref_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await cloudDb.createPaymentRefundRecord({
      id: refundRecordId,
      paymentId: payment.id,
      orderId: payment.orderId,
      gateway: payment.gateway,
      gatewayRefundId: refundRes.refundId,
      amount: refundAmount,
      reason: reason || 'Reembolso autorizado pelo OWNER',
      requestedByUserId: user.id,
      requestedByUserName: user.name,
      status: 'APPROVED',
    });

    // Atualizar status do pagamento para PAYMENT_REFUNDED
    await cloudDb.updatePaymentStatus({
      paymentId: payment.id,
      status: 'PAYMENT_REFUNDED',
      statusDetail: `Reembolsado por ${user.name}: ${reason || 'Sem motivo informado'}`,
    });

    // Atualizar status do pedido para REFUNDED
    const order = await cloudDb.getOrderById(payment.orderId);
    if (order) {
      let timeline = order.timeline || [];
      timeline.push({
        status: 'REFUNDED',
        label: 'Reembolso Realizado',
        description: `Estorno de R$ ${refundAmount.toFixed(2)} processado com sucesso.`,
        completed: true,
        timestamp: new Date().toISOString(),
      });

      await cloudDb.updateOrderStatusAndTimeline({
        orderId: payment.orderId,
        orderStatus: 'REFUNDED',
        paymentStatus: 'PAYMENT_REFUNDED',
        timelineJson: JSON.stringify(timeline),
      });

      // Estorno proporcional de MerMi Points concedidos (Regra #19)
      if (order.userId && order.points_earned && order.points_earned > 0) {
        await cloudDb.addPointsEntry({
          userId: order.userId,
          amount: -Math.abs(order.points_earned),
          type: 'estornado',
          source: 'reembolso',
          reason: `Estorno de pontos concedidos pelo pedido #${order.id} reembolsado`,
          idempotencyKey: `pts_rev_${order.id}_${Date.now()}`,
        });
      }
    }

    // Auditoria
    await cloudDb.addAuditLog({
      action: 'PAYMENT_REFUNDED',
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      targetType: 'ORDER',
      targetId: payment.orderId,
      detailsJson: JSON.stringify({
        refundId: refundRes.refundId,
        paymentId: payment.id,
        amount: refundAmount,
        reason,
      }),
    });

    res.json({
      success: true,
      message: `Reembolso de R$ ${refundAmount.toFixed(2)} processado com sucesso!`,
      refundId: refundRes.refundId,
      orderId: payment.orderId,
    });
  } catch (err: any) {
    console.error('Error processing refund:', err);
    res.status(500).json({ error: 'Erro ao processar reembolso: ' + err.message });
  }
});

/**
 * 5. GET /api/payments/config
 * Configuração da Integração para o Painel MERMI CONTROL (Regra #1 & #2: Sem expor tokens secretos)
 */
paymentRouter.get('/config', requireAuth, requireRole('OWNER', 'ADMIN'), (req: Request, res: Response) => {
  const host = req.get('host');
  const protocol = req.protocol;
  const baseUrl = `${protocol}://${host}`;
  const config = gatewayManager.getConfig(baseUrl);
  res.json({ success: true, config });
});

/**
 * 6. POST /api/payments/config
 * Atualização das Configurações do Gateway pelo OWNER
 * Regra #3: Permite alternar entre Sandbox e Produção com verificação de credenciais
 */
paymentRouter.post('/config', requireAuth, requireRole('OWNER', 'ADMIN'), (req: AuthenticatedRequest, res: Response) => {
  const { environment, enabledMethods, credentials } = req.body;

  if (environment) {
    if (environment === 'production') {
      const config = gatewayManager.getConfig();
      if (!config.hasAccessToken && (!credentials || !credentials.accessToken)) {
        return res.status(400).json({
          error: 'Para ativar o ambiente de Produção, é obrigatório fornecer o Access Token de Produção do Mercado Pago.',
        });
      }
    }
    gatewayManager.setEnvironment(environment);
  }

  if (enabledMethods) {
    gatewayManager.setEnabledMethods(enabledMethods);
  }

  if (credentials) {
    gatewayManager.updateCredentials('mercadopago', credentials);
  }

  const host = req.get('host');
  const protocol = req.protocol;
  const baseUrl = `${protocol}://${host}`;
  const updatedConfig = gatewayManager.getConfig(baseUrl);

  res.json({
    success: true,
    message: 'Configurações de pagamento atualizadas com sucesso!',
    config: updatedConfig,
  });
});

/**
 * 7. GET /api/payments/transactions
 * Transações para o MERMI CONTROL (Regra #1)
 */
paymentRouter.get('/transactions', requireAuth, requireRole('OWNER', 'ADMIN'), async (_req: Request, res: Response) => {
  try {
    const transactions = await cloudDb.getPaymentTransactions();
    res.json({ success: true, transactions });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao listar transações: ' + err.message });
  }
});

/**
 * 8. GET /api/payments/webhooks
 * Logs de Webhook para o MERMI CONTROL (Regra #1)
 */
paymentRouter.get('/webhooks', requireAuth, requireRole('OWNER', 'ADMIN'), async (_req: Request, res: Response) => {
  try {
    const logs = await cloudDb.getPaymentLogs();
    res.json({ success: true, logs });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao listar logs de webhook: ' + err.message });
  }
});

/**
 * 9. GET /api/payments/refunds
 * Reembolsos para o MERMI CONTROL (Regra #1)
 */
paymentRouter.get('/refunds', requireAuth, requireRole('OWNER', 'ADMIN'), async (_req: Request, res: Response) => {
  try {
    const refunds = await cloudDb.getPaymentRefunds();
    res.json({ success: true, refunds });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao listar reembolsos: ' + err.message });
  }
});

/**
 * 10. POST /api/payments/sandbox/simulate-webhook
 * Execução de Testes Sandbox pelo OWNER (Regra #3: Pix, cartão aprovado, cartão recusado, pendente, cancelado, expirado)
 */
paymentRouter.post('/sandbox/simulate-webhook', requireAuth, requireRole('OWNER', 'ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  const { paymentId, orderId, scenario } = req.body;

  if (!paymentId && !orderId) {
    return res.status(400).json({ error: 'Informe paymentId ou orderId para simulação de teste no Sandbox.' });
  }

  let payment = null;
  if (paymentId) payment = await cloudDb.getPaymentById(paymentId);
  if (!payment && orderId) payment = await cloudDb.getPaymentByOrderId(orderId);

  if (!payment) {
    return res.status(404).json({ error: 'Transação não encontrada.' });
  }

  // Mapear status do cenário
  let simulatedStatus = 'approved';
  let statusDetail = 'accredited';

  switch (scenario) {
    case 'APPROVED':
      simulatedStatus = 'approved';
      statusDetail = 'accredited';
      break;
    case 'REJECTED':
      simulatedStatus = 'rejected';
      statusDetail = 'cc_rejected_insufficient_amount';
      break;
    case 'PENDING':
      simulatedStatus = 'in_process';
      statusDetail = 'pending_contingency';
      break;
    case 'CANCELLED':
      simulatedStatus = 'cancelled';
      statusDetail = 'by_collector';
      break;
    case 'EXPIRED':
      simulatedStatus = 'expired';
      statusDetail = 'time_out';
      break;
    default:
      simulatedStatus = 'approved';
  }

  // Disparar chamada interna simulando o webhook oficial
  const simEventId = `whk_sim_${scenario}_${Date.now()}`;
  const simulatedWebhookBody = {
    id: simEventId,
    action: 'payment.updated',
    type: 'payment',
    is_simulation: true,
    simulated_status: simulatedStatus,
    status_detail: statusDetail,
    payment_id: payment.id,
    order_id: payment.orderId,
    amount: payment.amount,
    data: { id: payment.gatewayPaymentId || payment.id },
  };

  // Reutiliza a lógica do webhook oficial
  try {
    const fakeReq: any = {
      body: simulatedWebhookBody,
      query: {},
      headers: {
        'x-request-id': simEventId,
      },
    };

    const verification = await gatewayManager.verifyWebhook(fakeReq);
    const targetStatus = verification.status!;
    const now = new Date();

    if (targetStatus === 'PAYMENT_APPROVED') {
      await cloudDb.updatePaymentStatus({
        paymentId: payment.id,
        status: 'PAYMENT_APPROVED',
        statusDetail,
      });

      const order = await cloudDb.getOrderById(payment.orderId);
      if (order) {
        let timeline = order.timeline || [];
        timeline = timeline.map((t: any) => {
          if (t.status === 'PAID') return { ...t, completed: true, timestamp: now.toISOString() };
          return t;
        });

        await cloudDb.updateOrderStatusAndTimeline({
          orderId: payment.orderId,
          orderStatus: 'PAID',
          paymentStatus: 'PAYMENT_APPROVED',
          timelineJson: JSON.stringify(timeline),
        });

        const pointsToEarn = order.points_earned || Math.floor(order.total);
        if (pointsToEarn > 0 && order.userId) {
          await cloudDb.addPointsEntry({
            userId: order.userId,
            amount: pointsToEarn,
            type: 'ganho',
            source: 'compra',
            reason: `Cashback MerMi Points pelo pedido #${payment.orderId} aprovado (Sandbox)`,
            idempotencyKey: `pts_earn_${payment.orderId}`,
          });
        }

        await cloudDb.addAuditLog({
          action: 'SANDBOX_PAYMENT_APPROVED',
          userId: req.user!.id,
          userName: req.user!.name,
          userRole: req.user!.role,
          targetType: 'ORDER',
          targetId: payment.orderId,
          detailsJson: JSON.stringify({ scenario, paymentId: payment.id }),
        });
      }
    } else {
      await cloudDb.updatePaymentStatus({
        paymentId: payment.id,
        status: targetStatus,
        statusDetail,
      });

      await cloudDb.updateOrderStatusAndTimeline({
        orderId: payment.orderId,
        orderStatus: targetStatus === 'PAYMENT_REJECTED' ? 'PENDING_PAYMENT' : 'CANCELLED',
        paymentStatus: targetStatus,
      });

      await cloudDb.addAuditLog({
        action: `SANDBOX_${targetStatus}`,
        userId: req.user!.id,
        userName: req.user!.name,
        targetType: 'ORDER',
        targetId: payment.orderId,
        detailsJson: JSON.stringify({ scenario, statusDetail }),
      });
    }

    await cloudDb.logPaymentWebhook({
      id: simEventId,
      gateway: 'mercadopago',
      eventId: simEventId,
      eventType: 'sandbox.simulation',
      paymentId: payment.id,
      orderId: payment.orderId,
      payloadJson: JSON.stringify(simulatedWebhookBody),
      status: 'PROCESSED',
    });

    res.json({
      success: true,
      message: `Cenário de teste '${scenario}' executado com sucesso no Sandbox!`,
      status: targetStatus,
      paymentId: payment.id,
      orderId: payment.orderId,
    });
  } catch (simErr: any) {
    res.status(500).json({ error: 'Erro ao executar teste de sandbox: ' + simErr.message });
  }
});
