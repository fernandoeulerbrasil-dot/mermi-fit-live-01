import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, requireRole, AuthenticatedRequest } from '../auth';

export const auditRouter = Router();

/**
 * Listagem de Logs de Auditoria Invioláveis (Apenas ADMIN / OWNER)
 */
auditRouter.get('/logs', requireAuth, requireRole('OWNER', 'ADMIN', 'MANAGER'), (req: AuthenticatedRequest, res: Response) => {
  const limit = Math.min(200, parseInt(req.query.limit as string || '100', 10));
  const entity = req.query.entity as string;

  let query = 'SELECT * FROM audit_logs';
  const params: any[] = [];

  if (entity) {
    query += ' WHERE entity = ?';
    params.push(entity);
  }

  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(limit);

  const logs = db.prepare(query).all(...params);
  res.json({ logs });
});

/**
 * Registro de Ação de Auditoria
 */
auditRouter.post('/logs', requireAuth, requireRole('OWNER', 'ADMIN', 'MANAGER', 'FINANCE', 'CRM'), (req: AuthenticatedRequest, res: Response) => {
  const { action, entity, entity_id, previous_value, new_value, reason } = req.body;

  if (!action || !entity) {
    return res.status(400).json({ error: 'Ação e Entidade são obrigatórios.' });
  }

  const logId = `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO audit_logs (id, admin_name, admin_role, action, entity, entity_id, previous_value, new_value, reason, ip_address, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    logId,
    req.user!.name,
    req.user!.role,
    action,
    entity,
    entity_id || 'N/A',
    previous_value || null,
    new_value || null,
    reason || 'Registro administrativo',
    req.ip || '127.0.0.1',
    now
  );

  res.status(201).json({ success: true, logId });
});
