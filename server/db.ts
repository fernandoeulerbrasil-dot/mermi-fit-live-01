import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const uploadsDir = path.resolve(process.cwd(), 'public', 'assets', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'mermifit.db');
export const db = new DatabaseSync(dbPath);

// Ativar foreign keys e performance no SQLite
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

/**
 * Criação dos Schemas Oficiais do Banco de Dados
 */
export function initDatabaseSchema() {
  db.exec(`
    -- 1. Usuários e Autenticação
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'CUSTOMER',
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      avatar TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- 2. Perfis e Biometria dos Usuários
    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id TEXT PRIMARY KEY,
      handle TEXT,
      points INTEGER NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 1,
      streak_days INTEGER NOT NULL DEFAULT 0,
      water_intake_ml INTEGER NOT NULL DEFAULT 0,
      water_goal_ml INTEGER NOT NULL DEFAULT 3000,
      sleep_hours TEXT DEFAULT '7h 30m',
      steps_today INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 3. Configurações Globais do Sistema & Preços Oficiais
    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      updated_by TEXT
    );

    -- 4. Catálogo de Produtos e Marmitas
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      price_350g REAL NOT NULL,
      price_500g REAL NOT NULL,
      image TEXT,
      calories INTEGER DEFAULT 450,
      protein REAL DEFAULT 35,
      carbs REAL DEFAULT 45,
      fat REAL DEFAULT 12,
      availability INTEGER NOT NULL DEFAULT 1,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- 5. Ledger Imutável de MerMi Points (NUNCA permite saldo negativo)
    CREATE TABLE IF NOT EXISTS points_ledger (
      entry_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      type TEXT NOT NULL,
      balance_before INTEGER NOT NULL,
      balance_after INTEGER NOT NULL,
      reference_id TEXT,
      source TEXT NOT NULL,
      description TEXT NOT NULL,
      created_by TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 6. Pedidos
    CREATE TABLE IF NOT EXISTS orders (
      order_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      items_json TEXT NOT NULL,
      subtotal REAL NOT NULL,
      discount REAL NOT NULL DEFAULT 0,
      delivery_fee REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL,
      points_earned INTEGER NOT NULL DEFAULT 0,
      points_used INTEGER NOT NULL DEFAULT 0,
      coupon_code TEXT,
      order_status TEXT NOT NULL DEFAULT 'pedido_recebido',
      payment_method TEXT NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'PENDING',
      payment_id TEXT,
      address_json TEXT NOT NULL,
      notes TEXT,
      timeline_json TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- 7. Transações Financeiras e Pagamentos
    CREATE TABLE IF NOT EXISTS payments (
      payment_id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      amount REAL NOT NULL,
      method TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING',
      idempotency_key TEXT UNIQUE NOT NULL,
      provider TEXT DEFAULT 'MERMI_PAY_CORE',
      provider_tx_id TEXT,
      details_json TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(order_id)
    );

    -- 8. Log de Webhooks
    CREATE TABLE IF NOT EXISTS webhooks_log (
      event_id TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      event_type TEXT NOT NULL,
      order_id TEXT,
      payload_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PROCESSED',
      processed_at TEXT NOT NULL
    );

    -- 9. Asset Registry (Owner Asset Manager)
    CREATE TABLE IF NOT EXISTS assets (
      asset_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      file_url TEXT NOT NULL,
      storage_path TEXT NOT NULL,
      category TEXT NOT NULL,
      page TEXT NOT NULL,
      component TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      version INTEGER NOT NULL DEFAULT 1,
      is_official INTEGER NOT NULL DEFAULT 0,
      mime_type TEXT,
      file_size INTEGER,
      created_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- 10. Mapeamentos de Assets em Telas/Slots
    CREATE TABLE IF NOT EXISTS asset_mappings (
      mapping_id TEXT PRIMARY KEY,
      asset_id TEXT NOT NULL,
      page TEXT NOT NULL,
      component TEXT NOT NULL,
      slot TEXT DEFAULT 'DEFAULT',
      order_num INTEGER DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE CASCADE
    );

    -- 11. Histórico de Versões de Assets para Rollback
    CREATE TABLE IF NOT EXISTS asset_history (
      id TEXT PRIMARY KEY,
      asset_id TEXT NOT NULL,
      version INTEGER NOT NULL,
      file_url TEXT NOT NULL,
      storage_path TEXT NOT NULL,
      changed_by TEXT,
      reason TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE CASCADE
    );

    -- 12. Trilha Inviolável de Auditoria
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      admin_name TEXT NOT NULL,
      admin_role TEXT NOT NULL,
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      previous_value TEXT,
      new_value TEXT,
      reason TEXT,
      ip_address TEXT,
      created_at TEXT NOT NULL
    );

    -- 13. Sessões Ativas e Tokens Revogados
    CREATE TABLE IF NOT EXISTS auth_sessions (
      session_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      expires_at TEXT NOT NULL,
      revoked INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  seedDefaultSettings();
  seedDefaultProducts();
  seedOfficialAssets();
}

/**
 * Inicialização do Catálogo Oficial de Produtos se a tabela estiver vazia
 */
function seedDefaultProducts() {
  const countRow = db.prepare("SELECT COUNT(*) as count FROM products").get() as any;
  if (countRow && countRow.count > 0) return;

  const insertProduct = db.prepare(`
    INSERT INTO products (id, name, category, description, price_350g, price_500g, image, calories, protein, carbs, fat, availability, active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?)
  `);

  const now = new Date().toISOString();
  const defaultItems = [
    {
      id: 'prod_fit_frango_ervas',
      name: 'Frango Grelhado com Ervas & Batata Doce',
      category: 'fit',
      description: 'Filé de peito de frango marinado em ervas finas, cubos de batata doce assada e brócolis ao vapor.',
      price_350g: 19.90,
      price_500g: 24.90,
      image: '/assets/cardapios/linha-fit/file_00000000153c820e84cec3b483d223c3.png',
      calories: 385,
      protein: 40,
      carbs: 38,
      fat: 7
    },
    {
      id: 'prod_fit_patinho_moido',
      name: 'Patinho Moído com Purê de Mandioquinha',
      category: 'fit',
      description: 'Carne magra bovina refogada com cebola roxa, alho poró e cheiro verde, purê cremoso de mandioquinha.',
      price_350g: 19.90,
      price_500g: 24.90,
      image: '/assets/cardapios/linha-fit/file_000000000e80820e9baf530a9e86cdb7.png',
      calories: 410,
      protein: 38,
      carbs: 42,
      fat: 9
    },
    {
      id: 'prod_fit_tilapia_grelhada',
      name: 'Filé de Tilápia com Arroz 7 Grãos & Legumes',
      category: 'fit',
      description: 'Tilápia grelhada no azeite extravirgem com crosta suave de gergelim, arroz sete grãos e legumes salteados.',
      price_350g: 19.90,
      price_500g: 24.90,
      image: '/assets/cardapios/linha-fit/file_0000000089b0820eafea1c066487910c.png',
      calories: 360,
      protein: 36,
      carbs: 34,
      fat: 6
    },
    {
      id: 'prod_fit_frango_curry',
      name: 'Strogonoff de Frango Fit com Arroz Integral',
      category: 'fit',
      description: 'Tiras de frango ao molho leve de biomassa de banana verde, cogumelos frescos e arroz integral com cenoura.',
      price_350g: 19.90,
      price_500g: 24.90,
      image: '/assets/cardapios/linha-fit/file_000000002540820e80d860c5e650e669.png',
      calories: 425,
      protein: 42,
      carbs: 40,
      fat: 8
    },
    {
      id: 'prod_fit_salmao_crosta',
      name: 'Salmão Grelhado em Crosta de Castanhas & Quinoa',
      category: 'fit_premium',
      description: 'Lombo nobre de salmão chileno selado, crosta crocante de castanhas de caju e do pará com quinoa e aspargos.',
      price_350g: 32.90,
      price_500g: 39.90,
      image: '/assets/cardapios/linha-fit-premium/file_0000000073e4820e8f431e1d917e4d8b.png',
      calories: 480,
      protein: 44,
      carbs: 28,
      fat: 16
    },
    {
      id: 'prod_fit_mignon_aspargos',
      name: 'Medalhão de Filé Mignon ao Molho de Cogumelos Frescos',
      category: 'fit_premium',
      description: 'Medalhão suculento de filé mignon bovino, molho artesanal de shimeji e paris reduzido com risoto de couve-flor.',
      price_350g: 32.90,
      price_500g: 39.90,
      image: '/assets/cardapios/linha-fit-premium/file_00000000f3d8820eacf9d0b6ad05d64c.png',
      calories: 460,
      protein: 46,
      carbs: 18,
      fat: 14
    },
    {
      id: 'prod_fit_camarao_moranga',
      name: 'Camarões Selados com Arroz Negro & Tomilho',
      category: 'fit_premium',
      description: 'Camarões rosa selecionados salteados em azeite de ervas finas, acompanhados de arroz negro e tomatinhos confit.',
      price_350g: 32.90,
      price_500g: 39.90,
      image: '/assets/cardapios/file_00000000026c81f6839505921a9d72cb.png',
      calories: 390,
      protein: 38,
      carbs: 32,
      fat: 8
    },
    {
      id: 'prod_fit_bacalhau_natas',
      name: 'Bacalhau Nobre com Purê Rústico de Grão-de-Bico',
      category: 'fit_premium',
      description: 'Lascas de bacalhau Gadus Morhua desfiado, azeite português, azeitonas pretas e purê rústico de grão-de-bico.',
      price_350g: 32.90,
      price_500g: 39.90,
      image: '/assets/cardapios/file_000000003ac8820eb86af0c7ee5e23cc.png',
      calories: 440,
      protein: 41,
      carbs: 35,
      fat: 11
    }
  ];

  const updateProductImage = db.prepare(`UPDATE products SET image = ? WHERE id = ?`);

  for (const item of defaultItems) {
    insertProduct.run(
      item.id,
      item.name,
      item.category,
      item.description,
      item.price_350g,
      item.price_500g,
      item.image,
      item.calories,
      item.protein,
      item.carbs,
      item.fat,
      now,
      now
    );
    // Atualizar imagem caso o produto já exista
    updateProductImage.run(item.image, item.id);
  }
}

/**
 * Inicialização dos Assets Oficiais Imutáveis no Banco Central
 */
function seedOfficialAssets() {
  const countRow = db.prepare("SELECT COUNT(*) as count FROM assets").get() as any;
  if (countRow && countRow.count > 0) return;

  const insertAsset = db.prepare(`
    INSERT INTO assets (asset_id, name, description, file_url, storage_path, category, page, component, status, version, is_official, mime_type, file_size, created_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 1, 1, 'image/png', 0, 'SYSTEM_INIT', ?, ?)
  `);

  const insertMapping = db.prepare(`
    INSERT INTO asset_mappings (mapping_id, asset_id, page, component, slot, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?, ?)
  `);

  const now = new Date().toISOString();
  const officialList = [
    {
      id: 'ASSET_04',
      name: 'Logo Oficial MerMi Fit Life (1024x1024)',
      desc: 'Logo oficial primário em alta definição. Emblema circular master.',
      url: '/assets/brand/mermi-logo.png',
      category: 'BRAND',
      page: 'HOME',
      comp: 'OfficialLogo',
      slot: 'HERO'
    },
    {
      id: 'ASSET_05',
      name: 'Logo Oficial MerMi Fit Life (512x512 Compacto)',
      desc: 'Versão compacta para cabeçalhos, cards e menus.',
      url: '/assets/brand/mermi_fit_life_app_icon_512.png',
      category: 'BRAND',
      page: 'GLOBAL',
      comp: 'AppHeader',
      slot: 'NAV_ICON'
    },
    {
      id: 'mermi-ia-official',
      name: 'MerMi IA Oficial (Robô 3D)',
      desc: 'Mascote 3D oficial da inteligência artificial do MerMi Fit Life.',
      url: '/assets/ia/mermi-ia-official.png',
      category: 'IA',
      page: 'MERMI_IA',
      comp: 'MerMiIAView',
      slot: 'AVATAR_CHAT'
    },
    {
      id: 'ASSET_06',
      name: 'Selo MerMi Points Quadrado',
      desc: 'Distintivo de gamificação com fundo transparente.',
      url: '/assets/mermi-points/mermi-points-square-trans.png',
      category: 'POINTS',
      page: 'POINTS',
      comp: 'PointsCompactBlock',
      slot: 'BADGE_SQUARE'
    },
    {
      id: 'ASSET_07',
      name: 'Banner Horizontal MerMi Points',
      desc: 'Banner horizontal de pontuação e fidelidade.',
      url: '/assets/mermi-points/mermi-points-horizontal-trans.png',
      category: 'POINTS',
      page: 'POINTS',
      comp: 'MerMiPointsView',
      slot: 'BANNER_HEADER'
    },
    {
      id: 'ASSET_08',
      name: 'Header Oficial MerMi Fit Life',
      desc: 'Header gráfico panorâmico do ecossistema.',
      url: '/assets/brand/file_000000000b00820eabad455d8a975e25.png',
      category: 'BRAND',
      page: 'HOME',
      comp: 'AppHeader',
      slot: 'CLIENT_HERO'
    },
    {
      id: 'ASSET_09',
      name: 'Poster Drop Surpresa Semanal',
      desc: 'Arte oficial do Drop Surpresa de marmitas e brindes.',
      url: '/assets/posters/drop_surpresa_07.png',
      category: 'CAMPANHAS',
      page: 'DROP_SURPRESA',
      comp: 'DropSurpresaView',
      slot: 'BANNER_CARD'
    },
    {
      id: 'ASSET_10',
      name: 'Poster Catálogo de Recompensas',
      desc: 'Arte do resgate da semana e clube de benefícios.',
      url: '/assets/posters/recompensas_08.png',
      category: 'CAMPANHAS',
      page: 'RESGATE',
      comp: 'ResgateSemanaView',
      slot: 'MAIN_POSTER'
    },
    {
      id: 'ASSET_11',
      name: 'Poster MerMi Points Fidelidade',
      desc: 'Infográfico do programa de pontos e níveis de fidelidade.',
      url: '/assets/posters/mermi_points_06.png',
      category: 'CAMPANHAS',
      page: 'HOME',
      comp: 'HomeLifestyleView',
      slot: 'FEED_POSTER'
    },
    {
      id: 'ASSET_12',
      name: 'Poster Cardápio Fit & Fit Premium',
      desc: 'Apresentação visual das linhas oficiais de marmitas saudáveis.',
      url: '/assets/posters/cardapio_fit_05.png',
      category: 'CARDAPIO',
      page: 'CARDAPIO',
      comp: 'CardapioView',
      slot: 'TOP_BANNER'
    }
  ];

  for (const item of officialList) {
    insertAsset.run(
      item.id,
      item.name,
      item.desc,
      item.url,
      item.url,
      item.category,
      item.page,
      item.comp,
      now,
      now
    );

    insertMapping.run(
      `map_${item.id}`,
      item.id,
      item.page,
      item.comp,
      item.slot,
      now,
      now
    );

    // Salvar no histórico como v1
    db.prepare(`
      INSERT INTO asset_history (id, asset_id, version, file_url, storage_path, changed_by, reason, created_at)
      VALUES (?, ?, 1, ?, ?, 'SYSTEM_INIT', 'Versão Oficial Inicial', ?)
    `).run(`hist_${item.id}_v1`, item.id, item.url, item.url, now);
  }
}

/**
 * Inicialização de parâmetros e preços oficiais no banco central
 */
function seedDefaultSettings() {
  const insertSetting = db.prepare(`
    INSERT OR IGNORE INTO system_settings (key, value, updated_at, updated_by)
    VALUES (?, ?, ?, 'SYSTEM_INIT')
  `);

  const now = new Date().toISOString();
  
  // Tabela oficial de preços fixos do Cardápio Fit e Fit Premium
  insertSetting.run('base_prices', JSON.stringify({
    fit_350: 19.90,
    fit_500: 24.90,
    premium_350: 32.90,
    premium_500: 39.90
  }), now);

  insertSetting.run('delivery_settings', JSON.stringify({
    fee: 9.90,
    free_threshold: 99.00
  }), now);

  insertSetting.run('points_settings', JSON.stringify({
    rate_real_to_points: 1.0,
    redemption_ratio: 0.10
  }), now);
}
