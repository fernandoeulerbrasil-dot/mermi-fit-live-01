import { Router, Response } from 'express';
import { cloudDb } from '../cloudDb';
import { requireAuth, requireRole, AuthenticatedRequest } from '../auth';

export const pointsRouter = Router();

/**
 * Consulta de Saldo Real e Extrato do Usuário Logado a partir do Cloud SQL PostgreSQL
 */
pointsRouter.get('/my-ledger', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = (req.user!.role === 'OWNER' || req.user!.id === 'adm_owner') ? 'usr_owner_dev' : req.user!.id;
    const ledger = await cloudDb.getUserLedger(userId);
    res.json(ledger);
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao consultar extrato de pontos.' });
  }
});

/**
 * Consulta de Ledger de qualquer cliente (Admin / Owner)
 */
pointsRouter.get('/user/:userId', requireAuth, requireRole('OWNER', 'ADMIN', 'CRM', 'FINANCE'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const targetUserId = req.params.userId;
    const ledger = await cloudDb.getUserLedger(targetUserId);
    res.json({
      userId: targetUserId,
      ...ledger,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao consultar pontos do cliente.' });
  }
});

/**
 * Ajuste Administrativo de Pontos (Apenas OWNER ou ADMIN)
 */
pointsRouter.post('/adjust', requireAuth, requireRole('OWNER', 'ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  const { userId, amount, reason } = req.body;

  if (!userId || amount === undefined || amount === 0 || !reason) {
    return res.status(400).json({ error: 'ID do cliente, quantidade diferente de zero e motivo são obrigatórios.' });
  }

  const numAmount = parseInt(amount, 10);
  if (isNaN(numAmount)) {
    return res.status(400).json({ error: 'Quantidade de pontos inválida.' });
  }

  try {
    const type = numAmount > 0 ? 'ganho' : 'utilizado';
    const updatedLedger = await cloudDb.addPointsEntry({
      userId,
      amount: numAmount,
      type,
      source: 'ajuste_manual_admin',
      reason,
      idempotencyKey: `adj_${Date.now()}_${userId}`,
    });

    await cloudDb.addAuditLog({
      action: 'ADJUST_POINTS',
      userName: req.user!.name,
      userRole: req.user!.role,
      targetType: 'points_ledger',
      targetId: userId,
      detailsJson: JSON.stringify({ amount: numAmount, reason, newBalance: updatedLedger.balance }),
    });

    res.json({
      success: true,
      message: `Ajuste de ${numAmount > 0 ? '+' : ''}${numAmount} MerMi Points registrado com sucesso.`,
      newBalance: updatedLedger.balance,
      entries: updatedLedger.entries,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao processar ajuste de pontos: ' + err.message });
  }
});

/**
 * Resgate de Recompensa / Benefício por Pontos (Cliente / Autenticado)
 * Regra: Verifica saldo real no Cloud SQL PostgreSQL, debita com idempotência e gera lançamento contábil.
 */
pointsRouter.post('/redeem', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = (req.user!.role === 'OWNER' || req.user!.id === 'adm_owner') ? 'usr_owner_dev' : req.user!.id;
  const { rewardId, rewardTitle, pointsCost, idempotencyKey } = req.body;

  if (!rewardId || !pointsCost || Number(pointsCost) <= 0) {
    return res.status(400).json({ error: 'ID da recompensa e custo em pontos positivo são obrigatórios.' });
  }

  const cost = Math.abs(parseInt(pointsCost, 10));

  try {
    const currentLedger = await cloudDb.getUserLedger(userId);
    if (currentLedger.balance < cost) {
      return res.status(400).json({
        error: `Saldo insuficiente de MerMi Points. Você possui ${currentLedger.balance} pts, mas o resgate custa ${cost} pts.`,
        currentBalance: currentLedger.balance,
        pointsCost: cost,
      });
    }

    const idemp = idempotencyKey || `red_${userId}_${rewardId}_${Date.now()}`;
    const updatedLedger = await cloudDb.addPointsEntry({
      userId,
      amount: -cost,
      type: 'utilizado',
      source: 'resgate_recompensa',
      reason: `Resgate da recompensa '${rewardTitle || rewardId}'`,
      idempotencyKey: idemp,
    });

    await cloudDb.addAuditLog({
      action: 'REDEEM_REWARD',
      userName: req.user!.name,
      userRole: req.user!.role,
      targetType: 'points_ledger',
      targetId: userId,
      detailsJson: JSON.stringify({ rewardId, rewardTitle, pointsCost: cost, newBalance: updatedLedger.balance }),
    });

    res.json({
      success: true,
      message: `Recompensa '${rewardTitle || rewardId}' resgatada com sucesso! ${cost} pts debitados.`,
      newBalance: updatedLedger.balance,
      entries: updatedLedger.entries,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao processar resgate de pontos: ' + err.message });
  }
});
