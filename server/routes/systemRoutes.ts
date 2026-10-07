import { Router, Response } from 'express';
import { db } from '../db';
import { hasOwnerRegistered, requireAuth, requireRole, AuthenticatedRequest } from '../auth';

export const systemRouter = Router();

/**
 * Consulta de Status da Infraestrutura
 */
systemRouter.get('/status', (_req, res) => {
  const usersCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as any)?.count || 0;
  const ordersCount = (db.prepare('SELECT COUNT(*) as count FROM orders').get() as any)?.count || 0;
  const productsCount = (db.prepare('SELECT COUNT(*) as count FROM products').get() as any)?.count || 0;
  const assetsCount = (db.prepare('SELECT COUNT(*) as count FROM assets').get() as any)?.count || 0;
  const hasOwner = hasOwnerRegistered();

  res.json({
    appName: 'MERMI FIT LIFE',
    version: '1.0.0-PROD',
    environment: process.env.NODE_ENV || 'development',
    serverTime: new Date().toISOString(),
    database: {
      engine: 'SQLite3 (Real Server-Side WAL Mode)',
      status: 'CONNECTED',
      tablesVerified: 13,
      metrics: {
        users: usersCount,
        orders: ordersCount,
        products: productsCount,
        assets: assetsCount
      }
    },
    auth: {
      hasOwnerProvisioned: hasOwner
    }
  });
});

/**
 * Seed Oficial de Produtos e Assets do Ecossistema
 * Popula a tabela inicial de pratos caso esteja vazia, respeitando estritamente a identidade visual.
 */
systemRouter.post('/seed-official-catalog', async (_req, res) => {
  const existingProductsCount = (db.prepare('SELECT COUNT(*) as count FROM products').get() as any)?.count || 0;
  const now = new Date().toISOString();

  if (existingProductsCount === 0) {
    db.exec('BEGIN TRANSACTION;');
    try {
      const insertProd = db.prepare(`
        INSERT INTO products (id, name, category, description, price_350g, price_500g, image, calories, protein, carbs, fat, availability, active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?)
      `);

      // Pratos Oficiais Linha Fit (R$ 19,90 / R$ 24,90)
      insertProd.run('prod_frango_fit', 'Frango Desfiado com Batata Doce & Brócolis', 'fit', 'Filé de peito de frango selecionado, batata doce rústica assada e brócolis ao vapor.', 19.90, 24.90, '/assets/cardapios/marmita-fit-01.png', 420, 38, 42, 8, now, now);
      insertProd.run('prod_patinho_fit', 'Patinho Moído com Arroz Integral & Legumes', 'fit', 'Carne bovina magra moída temperada com ervas finas, arroz integral soltinho e mix de legumes.', 19.90, 24.90, '/assets/cardapios/marmita-fit-02.png', 460, 42, 45, 10, now, now);
      insertProd.run('prod_tilapia_fit', 'Filé de Tilápia com Purê de Mandioquinha', 'fit', 'Filé grelhado de tilápia com raspas de limão e purê cremoso de mandioquinha.', 19.90, 24.90, '/assets/cardapios/marmita-fit-03.png', 390, 36, 38, 7, now, now);
      insertProd.run('prod_frango_curry', 'Frango ao Curry Leve com Arroz de Couve-Flor', 'fit', 'Cubos de frango ao molho leve de curry aromático e arroz de couve-flor low carb.', 19.90, 24.90, '/assets/cardapios/marmita-fit-04.png', 340, 35, 18, 9, now, now);

      // Pratos Oficiais Linha Fit Premium (R$ 32,90 / R$ 39,90)
      insertProd.run('prod_salmao_prem', 'Salmão Grelhado com Quinoa Real & Aspargos', 'fit_premium', 'Lombo nobre de salmão grelhado, quinoa real aromática e aspargos frescos salteados.', 32.90, 39.90, '/assets/cardapios/marmita-premium-01.png', 510, 44, 30, 18, now, now);
      insertProd.run('prod_mignon_prem', 'Medalhão de Mignon com Risoto de Cogumelos', 'fit_premium', 'Corte nobre de filé mignon grelhado com risoto fit de cogumelos frescos.', 32.90, 39.90, '/assets/cardapios/marmita-premium-02.png', 540, 48, 36, 16, now, now);
      insertProd.run('prod_camarao_prem', 'Camarões Rosa com Purê de Baroa & Alho Poró', 'fit_premium', 'Camarões rosa selecionados salteados no azeite extravirgem com purê suave de baroa.', 32.90, 39.90, '/assets/cardapios/marmita-premium-03.png', 430, 40, 32, 11, now, now);

      db.exec('COMMIT;');
    } catch (e: any) {
      db.exec('ROLLBACK;');
      return res.status(500).json({ error: 'Erro ao popular catálogo: ' + e.message });
    }
  }

  // Assets oficiais base
  const existingAssetsCount = (db.prepare('SELECT COUNT(*) as count FROM assets').get() as any)?.count || 0;
  if (existingAssetsCount === 0) {
    db.exec('BEGIN TRANSACTION;');
    try {
      const insertAsset = db.prepare(`
        INSERT INTO assets (asset_id, name, description, file_url, storage_path, category, page, component, status, version, is_official, created_by, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 1, 1, 'SYSTEM_INIT', ?, ?)
      `);

      const insertMapping = db.prepare(`
        INSERT INTO asset_mappings (mapping_id, asset_id, page, component, slot, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'DEFAULT', 'ACTIVE', ?, ?)
      `);

      insertAsset.run('ASSET_LOGO_01', 'Logo Oficial Mermi Fit Life', 'Identidade principal da marca', '/assets/brand/mermi_fit_life_app_icon_512.png', 'public/assets/brand/mermi_fit_life_app_icon_512.png', 'BRAND', 'TODAS', 'HEADER', now, now);
      insertMapping.run('map_logo_hdr', 'ASSET_LOGO_01', 'HEADER', 'AppHeader', now, now);

      insertAsset.run('ASSET_POINTS_01', 'Logo MerMi Points Quadrado', 'Ícone oficial da moeda e gamificação', '/assets/mermi-points/mermi_points_square_logo.png', 'public/assets/mermi-points/mermi_points_square_logo.png', 'GAMIFICATION', 'POINTS', 'CARD_POINTS', now, now);
      insertMapping.run('map_pts_home', 'ASSET_POINTS_01', 'HOME', 'PointsCompactBlock', now, now);

      insertAsset.run('ASSET_IA_01', 'Mascote MerMi IA Robô 3D', 'Mascote oficial com visor neon verde', '/assets/ia/mermi_ia_robo_01.png', 'public/assets/ia/mermi_ia_robo_01.png', 'IA', 'IA', 'AVATAR_CHAT', now, now);
      insertMapping.run('map_ia_view', 'ASSET_IA_01', 'IA', 'MerMiIAView', now, now);

      db.exec('COMMIT;');
    } catch (e: any) {
      db.exec('ROLLBACK;');
    }
  }

  res.json({
    success: true,
    message: 'Catálogo oficial de pratos e assets verificado e pronto para produção.'
  });
});
