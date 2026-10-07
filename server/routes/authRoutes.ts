import { Router, Response } from 'express';
import { db } from '../db';
import { cloudDb } from '../cloudDb';
import {
  hashPassword,
  verifyPassword,
  generateToken,
  requireAuth,
  requireRole,
  requireOwner,
  hasOwnerRegistered,
  AuthenticatedRequest
} from '../auth';

export const authRouter = Router();

/**
 * Consulta se o sistema já possui o primeiro OWNER configurado
 */
authRouter.get('/owner-status', (_req, res) => {
  res.json({ hasOwner: hasOwnerRegistered() });
});

/**
 * Provisionamento seguro do Primeiro OWNER
 */
authRouter.post('/setup-first-owner', (req: AuthenticatedRequest, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'A senha do OWNER deve ter no mínimo 8 caracteres.' });
  }

  const alreadyHasOwner = hasOwnerRegistered();
  // Se já existir OWNER, somente o próprio OWNER pode criar outro OWNER
  if (alreadyHasOwner && (!req.user || req.user.role !== 'OWNER')) {
    return res.status(403).json({
      error: 'O sistema já possui um OWNER configurado. Somente o OWNER logado pode criar novos administradores.'
    });
  }

  // Verificar se e-mail já existe
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (existing) {
    return res.status(400).json({ error: 'Este e-mail já está em uso.' });
  }

  const { hash, salt } = hashPassword(password);
  const now = new Date().toISOString();
  const userId = `usr_owner_${Date.now()}`;

  db.exec('BEGIN TRANSACTION;');
  try {
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, salt, role, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'OWNER', 'ACTIVE', ?, ?)
    `).run(userId, name.trim(), email.toLowerCase().trim(), hash, salt, now, now);

    db.prepare(`
      INSERT INTO user_profiles (user_id, handle, points, level, updated_at)
      VALUES (?, ?, 0, 5, ?)
    `).run(userId, `@${name.toLowerCase().replace(/\s+/g, '.')}`, now);

    // Trilha de auditoria
    db.prepare(`
      INSERT INTO audit_logs (id, admin_name, admin_role, action, entity, entity_id, previous_value, new_value, reason, ip_address, created_at)
      VALUES (?, ?, 'OWNER', 'SETUP_FIRST_OWNER', 'user', ?, NULL, ?, 'Provisionamento do Primeiro Owner', ?, ?)
    `).run(
      `aud_${Date.now()}`,
      name,
      userId,
      email,
      req.ip || '127.0.0.1',
      now
    );

    db.exec('COMMIT;');

    const token = generateToken({
      id: userId,
      name,
      email: email.toLowerCase().trim(),
      role: 'OWNER',
      status: 'ACTIVE'
    });

    res.status(201).json({
      success: true,
      message: 'Conta de OWNER criada com sucesso!',
      user: { id: userId, name, email, role: 'OWNER' },
      token
    });
  } catch (err: any) {
    db.exec('ROLLBACK;');
    res.status(500).json({ error: 'Erro ao provisionar OWNER: ' + (err.message || 'Falha no banco de dados.') });
  }
});

/**
 * Cadastro de Novo Cliente (CUSTOMER)
 */
authRouter.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Preencha nome, e-mail e senha.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
  if (existing) {
    return res.status(400).json({ error: 'Já existe uma conta com este e-mail.' });
  }

  const { hash, salt } = hashPassword(password);
  const now = new Date().toISOString();
  const userId = `usr_${Date.now()}`;

  db.exec('BEGIN TRANSACTION;');
  try {
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, salt, role, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'CUSTOMER', 'ACTIVE', ?, ?)
    `).run(userId, name.trim(), cleanEmail, hash, salt, now, now);

    db.prepare(`
      INSERT INTO user_profiles (user_id, handle, points, level, streak_days, updated_at)
      VALUES (?, ?, 0, 1, 0, ?)
    `).run(userId, `@${name.toLowerCase().replace(/\s+/g, '.')}`, now);

    db.exec('COMMIT;');

    const token = generateToken({
      id: userId,
      name,
      email: cleanEmail,
      role: 'CUSTOMER',
      status: 'ACTIVE'
    });

    res.status(201).json({
      success: true,
      user: { id: userId, name, email: cleanEmail, role: 'CUSTOMER' },
      token
    });
  } catch (err: any) {
    db.exec('ROLLBACK;');
    res.status(500).json({ error: 'Erro ao cadastrar cliente: ' + (err.message || 'Falha no servidor.') });
  }
});

/**
 * Login Real (Cliente e Administradores)
 */
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const user = db.prepare(`
    SELECT id, name, email, password_hash, salt, role, status, avatar
    FROM users
    WHERE email = ?
  `).get(cleanEmail) as any;

  if (!user || !verifyPassword(password, user.password_hash, user.salt)) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }

  if (user.status !== 'ACTIVE') {
    return res.status(403).json({ error: 'Esta conta está suspensa ou inativa. Contate o suporte.' });
  }

  // Obter pontos calculados estritamente do Ledger
  const ledgerSum = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total FROM points_ledger WHERE user_id = ?
  `).get(user.id) as any;

  const profile = db.prepare(`
    SELECT handle, level, streak_days, water_intake_ml, water_goal_ml, sleep_hours, steps_today
    FROM user_profiles WHERE user_id = ?
  `).get(user.id) as any;

  const token = generateToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  });

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      points: ledgerSum ? Number(ledgerSum.total) : 0,
      level: profile ? profile.level : 1,
      handle: profile ? profile.handle : `@${user.name.toLowerCase().replace(/\s+/g, '.')}`,
      streak_days: profile ? profile.streak_days : 0,
      steps_today: profile ? profile.steps_today : 0,
      water_intake_ml: profile ? profile.water_intake_ml : 0,
      water_goal_ml: profile ? profile.water_goal_ml : 3000,
      sleep_hours: profile ? profile.sleep_hours : '7h 30m'
    }
  });
});

/**
 * Consulta de perfil do usuário atual logado a partir do Cloud SQL PostgreSQL
 */
authRouter.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  try {
    const ledger = await cloudDb.getUserLedger(userId);
    res.json({
      id: userId,
      name: req.user!.name,
      email: req.user!.email,
      role: req.user!.role,
      status: req.user!.status,
      points: ledger.balance,
      level: ledger.balance >= 1000 ? 5 : ledger.balance >= 500 ? 3 : ledger.balance >= 250 ? 2 : 1,
      handle: `@${req.user!.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}`,
      streak_days: 0,
      steps_today: 0,
      water_intake_ml: 0,
      water_goal_ml: 3000,
      sleep_hours: '--'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao carregar perfil do usuário.' });
  }
});

/**
 * Criação de usuários administrativos (Apenas OWNER)
 */
authRouter.post('/create-staff', requireOwner, (req: AuthenticatedRequest, res: Response) => {
  const { name, email, password, role } = req.body;
  const allowedRoles = ['ADMIN', 'MANAGER', 'FINANCE', 'CRM', 'KITCHEN', 'STOCK', 'DELIVERY', 'CONTENT', 'MODERATOR', 'SUPPORT'];

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: `Papel inválido. Papéis permitidos: ${allowedRoles.join(', ')}` });
  }

  const cleanEmail = email.toLowerCase().trim();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
  if (existing) {
    return res.status(400).json({ error: 'E-mail já cadastrado.' });
  }

  const { hash, salt } = hashPassword(password || 'MermiAdmin#2026');
  const now = new Date().toISOString();
  const userId = `adm_${role.toLowerCase()}_${Date.now()}`;

  db.prepare(`
    INSERT INTO users (id, name, email, password_hash, salt, role, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?)
  `).run(userId, name, cleanEmail, hash, salt, role, now, now);

  // Registrar auditoria
  db.prepare(`
    INSERT INTO audit_logs (id, admin_name, admin_role, action, entity, entity_id, previous_value, new_value, reason, ip_address, created_at)
    VALUES (?, ?, ?, 'CREATE_STAFF_USER', 'user', ?, NULL, ?, ?, ?, ?)
  `).run(
    `aud_${Date.now()}`,
    req.user!.name,
    req.user!.role,
    userId,
    `${cleanEmail} (${role})`,
    'Criação de operador pelo OWNER',
    req.ip || '127.0.0.1',
    now
  );

  res.status(201).json({
    success: true,
    message: `Usuário ${name} criado como ${role}.`,
    user: { id: userId, name, email: cleanEmail, role }
  });
});

/**
 * Listagem de Usuários (Apenas Admin/Owner)
 */
authRouter.get('/users', requireRole('ADMIN', 'OWNER', 'MANAGER', 'CRM'), (_req, res) => {
  const users = db.prepare(`
    SELECT u.id, u.name, u.email, u.role, u.status, u.created_at,
           p.points, p.level, p.streak_days
    FROM users u
    LEFT JOIN user_profiles p ON u.id = p.user_id
    ORDER BY u.created_at DESC
  `).all();
  res.json({ users });
});
