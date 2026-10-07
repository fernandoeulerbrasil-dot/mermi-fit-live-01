import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { initDatabaseSchema } from './server/db';
import { runMigrationAndSeed } from './src/db/migrateSeed';
import { db } from './src/db/index';
import { sql } from 'drizzle-orm';
import { adminStorage } from './src/lib/firebase-admin';
import { authenticateToken } from './server/auth';
import { authRouter } from './server/routes/authRoutes';
import { productRouter } from './server/routes/productRoutes';
import { orderRouter } from './server/routes/orderRoutes';
import { paymentRouter } from './server/routes/paymentRoutes';
import { pointsRouter } from './server/routes/pointsRoutes';
import { assetRouter } from './server/routes/assetRoutes';
import { aiRouter } from './server/routes/aiRoutes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Inicializar Schemas e Dados Oficiais no SQLite Central (Dev/Backup)
  initDatabaseSchema();

  // Executar Migração e Seed no Cloud SQL PostgreSQL
  try {
    await runMigrationAndSeed();
  } catch (seedErr) {
    console.warn('Cloud SQL seed error (will retry lazily):', seedErr);
  }

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // CORS universal para webhooks e integrações externas (Mercado Pago, Gateway, etc)
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-signature, x-request-id');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Middlewares para JSON e Upload de Assets (limite 20mb)
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Autenticação Bearer global
  app.use(authenticateToken);

  // Servir uploads de assets estáticos
  const uploadsDir = path.resolve(__dirname, 'public', 'assets', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/assets/uploads', express.static(uploadsDir));

  // Rotas da API REST Central
  app.use('/api/auth', authRouter);
  app.use('/api/products', productRouter);
  app.use('/api/orders', orderRouter);
  app.use('/api/payments', paymentRouter);
  app.use('/api/points', pointsRouter);
  app.use('/api/assets', assetRouter);
  app.use('/api/ai', aiRouter);

  // Health check global oficial (Requisito 20)
  app.get('/health', async (_req, res) => {
    let dbStatus = 'ok';
    let storageStatus = 'ok';

    try {
      await db.execute(sql`SELECT 1`);
    } catch {
      dbStatus = 'degraded';
    }

    try {
      const bucket = adminStorage.bucket();
      const [exists] = await bucket.exists();
      storageStatus = (exists || fs.existsSync(uploadsDir)) ? 'ok' : 'degraded';
    } catch {
      const uploadsOk = fs.existsSync(uploadsDir);
      storageStatus = uploadsOk ? 'ok' : 'degraded';
    }

    const overallStatus = dbStatus === 'ok' && storageStatus === 'ok' ? 'ok' : 'degraded';
    const httpStatus = overallStatus === 'ok' ? 200 : 503;

    res.status(httpStatus).json({
      status: overallStatus,
      database: dbStatus,
      storage: storageStatus,
    });
  });

  // Health check legado de compatibilidade
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ONLINE',
      system: 'MERMI FIT LIFE API',
      timestamp: new Date().toISOString()
    });
  });

  // Integração com Vite SPA
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MERMI FIT LIFE] Servidor ativo em http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[MERMI FIT LIFE] Falha ao iniciar servidor:', err);
  process.exit(1);
});
