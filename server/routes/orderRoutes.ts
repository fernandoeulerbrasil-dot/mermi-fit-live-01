import { Router, Response, Request } from 'express';
import { cloudDb } from '../cloudDb';
import { requireAuth, requireRole, AuthenticatedRequest } from '../auth';

export const orderRouter = Router();

/**
 * Criação Real de Pedido no Cloud SQL PostgreSQL
 * Regra #6: O pedido nasce inicialmente como PENDING_PAYMENT e payment_status = PAYMENT_PENDING.
 * Regra #19: NÃO credita pontos na abertura do pedido; pontos só são creditados após pagamento confirmado!
 */
orderRouter.post('/', async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const user = authReq.user;
  const userId = user?.id || `guest_${Date.now()}`;
  const customerName = user?.name || req.body.customerName || 'Cliente MerMi';
  const customerEmail = user?.email || req.body.customerEmail || 'cliente@mermifitlife.com.br';

  const { items, address, paymentMethod, couponCode, notes, pointsToUse, deliveryType } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'O carrinho está vazio.' });
  }

  if (!address || !address.street || !address.number) {
    return res.status(400).json({ error: 'Endereço de entrega completo é obrigatório.' });
  }

  try {
    const basePrices = await cloudDb.getBasePrices();
    const deliveryFee = deliveryType === 'retirada' ? 0 : 7.90;

    // Recálculo autoritativo no backend (Regra #5: Preço)
    let subtotal = 0;
    const formattedItems: Array<{
      productId?: string;
      name: string;
      size: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      customizationJson?: string;
    }> = [];

    for (const item of items) {
      const isPremium = item.line === 'fit_premium' || item.category === 'fit_premium' || (item.name && item.name.toLowerCase().includes('premium'));
      const is500g = item.size === '500g';
      let unitPrice = isPremium
        ? (is500g ? basePrices.premium_500 : basePrices.premium_350)
        : (is500g ? basePrices.fit_500 : basePrices.fit_350);

      // Adicionais pagos
      if (item.customMarmita && item.customMarmita.addonsPrice) {
        unitPrice += Number(item.customMarmita.addonsPrice);
      }

      const qty = Math.max(1, parseInt(item.quantity || 1, 10));
      const itemTotal = Number((unitPrice * qty).toFixed(2));
      subtotal += itemTotal;

      formattedItems.push({
        productId: item.productId || item.id,
        name: item.name,
        size: item.size || '350g',
        quantity: qty,
        unitPrice,
        totalPrice: itemTotal,
        customizationJson: item.customization || item.customMarmita ? JSON.stringify(item.customization || item.customMarmita) : undefined,
      });
    }

    subtotal = Number(subtotal.toFixed(2));

    // Desconto de cupom
    let discount = 0;
    if (couponCode) {
      const validCoupons = [
        { code: 'BEMVINDO10', type: 'percentage', value: 10, min: 50 },
        { code: 'MERMI15', type: 'percentage', value: 15, min: 80 },
        { code: 'PRIMEIRACOMPRA', type: 'fixed', value: 15, min: 60 },
      ];
      const found = validCoupons.find((c) => c.code === couponCode.toUpperCase());
      if (found && subtotal >= found.min) {
        discount = found.type === 'percentage' ? (subtotal * found.value) / 100 : found.value;
      }
    }
    discount = Number(discount.toFixed(2));

    const total = Number(Math.max(0, subtotal + deliveryFee - discount).toFixed(2));
    const orderId = `PED-${Math.floor(100000 + Math.random() * 900000)}`;
    const pointsEarned = Math.floor(total);

    // Criar pedido no Cloud SQL inicialmente como PENDING_PAYMENT
    await cloudDb.createOrder({
      orderId,
      userId,
      customerName,
      customerEmail,
      total,
      subtotal,
      deliveryFee,
      pointsDiscount: discount,
      couponCode,
      paymentMethod: paymentMethod || 'pix',
      addressJson: JSON.stringify(address),
      notes,
      pointsEarned,
      items: formattedItems,
    });

    // Se usou pontos para abater o pedido, debita no ledger
    if (pointsToUse && pointsToUse > 0 && user?.id) {
      await cloudDb.addPointsEntry({
        userId: user.id,
        amount: -Math.abs(pointsToUse),
        type: 'utilizado',
        source: 'pedido_desconto',
        reason: `Desconto aplicado no pedido #${orderId}`,
        idempotencyKey: `pts_used_${orderId}`,
      });
    }

    // REGRA #19: NÃO credita pontos ganhos aqui! Apenas quando o pagamento for APROVADO via webhook.

    res.status(201).json({
      success: true,
      message: 'Pedido registrado com sucesso. Aguardando confirmação do pagamento.',
      orderId,
      total,
      subtotal,
      delivery_fee: deliveryFee,
      discount,
      points_earned: pointsEarned,
      order_status: 'PENDING_PAYMENT',
      payment_status: 'PAYMENT_PENDING',
    });
  } catch (err: any) {
    console.error('Error creating order in Cloud SQL:', err);
    res.status(500).json({ error: 'Erro ao gravar pedido no banco de dados.' });
  }
});

/**
 * Consulta de Pedido por ID (Regra #15: Retorno do Checkout)
 * O frontend consulta o backend para saber o estado real e nunca assume aprovação por URL.
 */
orderRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const order = await cloudDb.getOrderById(id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    // Obter dados do pagamento associado
    let payment = null;
    if (order.paymentId) {
      payment = await cloudDb.getPaymentById(order.paymentId);
    } else {
      payment = await cloudDb.getPaymentByOrderId(order.id);
    }

    res.json({
      success: true,
      order,
      payment,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao consultar pedido: ' + err.message });
  }
});

/**
 * Listagem de Pedidos com Filtro de Segurança
 */
orderRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  try {
    const isCustomer = user.role === 'CLIENTE' || user.role === 'CUSTOMER';
    const orders = await cloudDb.getOrders(isCustomer ? user.id : undefined);
    res.json({ orders });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao listar pedidos.' });
  }
});

/**
 * Máquina de Estados Autoritativa do Pedido (PATCH /api/orders/:id/status)
 * Transições permitidas:
 * PENDING_PAYMENT -> PAID | CANCELLED
 * PAID -> PREPARING | CANCELLED | REFUNDED
 * PREPARING -> READY | CANCELLED
 * READY -> OUT_FOR_DELIVERY | CANCELLED
 * OUT_FOR_DELIVERY -> DELIVERED | CANCELLED
 * DELIVERED -> REFUNDED
 */
const ALLOWED_ORDER_TRANSITIONS: Record<string, string[]> = {
  PENDING_PAYMENT: ['PAID', 'CANCELLED'],
  PAID: ['PREPARING', 'CANCELLED', 'REFUNDED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['OUT_FOR_DELIVERY', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELLED'],
  DELIVERED: ['REFUNDED'],
  CANCELLED: [],
  REFUNDED: [],
};

orderRouter.patch('/:id/status', requireAuth, requireRole('OWNER', 'ADMIN', 'MANAGER', 'KITCHEN', 'DELIVERY'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status: targetStatus, reason } = req.body;

  if (!targetStatus) {
    return res.status(400).json({ error: 'Novo status do pedido é obrigatório.' });
  }

  const normalizedStatus = String(targetStatus).toUpperCase().trim();

  try {
    const order = await cloudDb.getOrderById(id);
    if (!order) {
      return res.status(404).json({ error: `Pedido #${id} não encontrado.` });
    }

    const currentStatus = (order.orderStatus || (order as any).order_status || 'PENDING_PAYMENT').toUpperCase();
    const allowedNext = ALLOWED_ORDER_TRANSITIONS[currentStatus] || [];

    if (!allowedNext.includes(normalizedStatus) && currentStatus !== normalizedStatus) {
      return res.status(400).json({
        error: `Transição inválida de estado: de '${currentStatus}' para '${normalizedStatus}'. Permitidos a partir de '${currentStatus}': ${allowedNext.join(', ') || 'Nenhum (estado terminal)'}`,
        currentStatus,
        attemptedStatus: normalizedStatus,
        allowedTransitions: allowedNext,
      });
    }

    // Atualizar timeline do pedido
    const now = new Date().toISOString();
    const currentTimeline = order.timeline || [];
    const updatedTimeline = [
      ...currentTimeline,
      {
        status: normalizedStatus,
        title: `Pedido alterado para ${normalizedStatus.replace(/_/g, ' ')}`,
        description: reason || `Status atualizado por ${req.user!.name} (${req.user!.role})`,
        timestamp: now,
      },
    ];

    let paymentStatus = order.paymentStatus || (order as any).payment_status;
    if (normalizedStatus === 'PAID') {
      paymentStatus = 'PAYMENT_APPROVED';
    } else if (normalizedStatus === 'REFUNDED') {
      paymentStatus = 'PAYMENT_REFUNDED';
    } else if (normalizedStatus === 'CANCELLED') {
      if (paymentStatus === 'PAYMENT_PENDING') {
        paymentStatus = 'PAYMENT_CANCELLED';
      }
    }

    const updatedOrder = await cloudDb.updateOrderStatusAndTimeline({
      orderId: id,
      orderStatus: normalizedStatus,
      paymentStatus,
      timelineJson: JSON.stringify(updatedTimeline),
    });

    // Se passou para PAID e não foram creditados pontos, creditar de forma idempotente
    if (normalizedStatus === 'PAID' && order.userId && order.points_earned && order.points_earned > 0) {
      await cloudDb.addPointsEntry({
        userId: order.userId,
        amount: order.points_earned,
        type: 'ganho',
        source: 'compra',
        reason: `Cashback MerMi Points pelo pedido #${id} pago`,
        idempotencyKey: `pts_earn_${id}`,
      });
    }

    // Se passou para REFUNDED e pontos haviam sido creditados, estornar no ledger
    if (normalizedStatus === 'REFUNDED' && order.userId && order.points_earned && order.points_earned > 0) {
      await cloudDb.addPointsEntry({
        userId: order.userId,
        amount: -order.points_earned,
        type: 'estornado',
        source: 'reembolso',
        reason: `Estorno de pontos concedidos pelo pedido #${id} reembolsado`,
        idempotencyKey: `pts_rev_${id}_${Date.now()}`,
      });
    }

    // Auditoria oficial
    await cloudDb.addAuditLog({
      action: 'ORDER_STATUS_TRANSITION',
      userName: req.user!.name,
      userRole: req.user!.role,
      targetType: 'ORDER',
      targetId: id,
      detailsJson: JSON.stringify({
        from: currentStatus,
        to: normalizedStatus,
        reason,
        paymentStatus,
      }),
    });

    res.json({
      success: true,
      message: `Status do pedido #${id} atualizado com sucesso para ${normalizedStatus}.`,
      order: updatedOrder,
    });
  } catch (err: any) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Erro ao atualizar status do pedido: ' + err.message });
  }
});
