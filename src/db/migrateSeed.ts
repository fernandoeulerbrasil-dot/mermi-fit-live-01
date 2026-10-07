import { db } from './index.ts';
import { products, assets, assetComponentMapping, assetVersions, appSettings } from './schema.ts';
import { sql } from 'drizzle-orm';

export async function runMigrationAndSeed() {
  try {
    // 1. Seed Products if empty
    const productCountResult = await db.select({ count: sql<number>`count(*)` }).from(products);
    const productCount = Number(productCountResult[0]?.count || 0);

    if (productCount === 0) {
      console.log('Seeding official products to Cloud SQL PostgreSQL...');
      const defaultProducts = [
        {
          id: 'prod_fit_frango_ervas',
          name: 'Frango Grelhado com Ervas & Batata Doce',
          category: 'fit',
          description: 'Filé de peito de frango marinado em ervas finas, cubos de batata doce assada e brócolis ao vapor.',
          price350g: '19.90',
          price500g: '24.90',
          image: '/assets/cardapios/linha-fit/file_00000000153c820e84cec3b483d223c3.png',
          calories: 385,
          protein: 40,
          carbs: 38,
          fat: 7,
          availability: true,
          active: true,
        },
        {
          id: 'prod_fit_patinho_moido',
          name: 'Patinho Moído com Purê de Mandioquinha',
          category: 'fit',
          description: 'Carne magra bovina refogada com cebola roxa, alho poró e cheiro verde, purê cremoso de mandioquinha.',
          price350g: '19.90',
          price500g: '24.90',
          image: '/assets/cardapios/linha-fit/file_000000000e80820e9baf530a9e86cdb7.png',
          calories: 410,
          protein: 38,
          carbs: 42,
          fat: 9,
          availability: true,
          active: true,
        },
        {
          id: 'prod_fit_tilapia_grelhada',
          name: 'Filé de Tilápia com Arroz 7 Grãos & Legumes',
          category: 'fit',
          description: 'Tilápia grelhada no azeite extravirgem com crosta suave de gergelim, arroz sete grãos e legumes salteados.',
          price350g: '19.90',
          price500g: '24.90',
          image: '/assets/cardapios/linha-fit/file_0000000089b0820eafea1c066487910c.png',
          calories: 360,
          protein: 36,
          carbs: 34,
          fat: 6,
          availability: true,
          active: true,
        },
        {
          id: 'prod_fit_frango_curry',
          name: 'Strogonoff de Frango Fit com Arroz Integral',
          category: 'fit',
          description: 'Tiras de frango ao molho leve de biomassa de banana verde, cogumelos frescos e arroz integral com cenoura.',
          price350g: '19.90',
          price500g: '24.90',
          image: '/assets/cardapios/linha-fit/file_000000002540820e80d860c5e650e669.png',
          calories: 425,
          protein: 42,
          carbs: 40,
          fat: 8,
          availability: true,
          active: true,
        },
        {
          id: 'prod_fit_salmao_crosta',
          name: 'Salmão Grelhado em Crosta de Castanhas & Quinoa',
          category: 'fit_premium',
          description: 'Lombo nobre de salmão chileno selado, crosta crocante de castanhas de caju e do pará com quinoa e aspargos.',
          price350g: '32.90',
          price500g: '39.90',
          image: '/assets/cardapios/linha-fit-premium/file_0000000073e4820e8f431e1d917e4d8b.png',
          calories: 480,
          protein: 44,
          carbs: 28,
          fat: 16,
          availability: true,
          active: true,
        },
        {
          id: 'prod_fit_mignon_aspargos',
          name: 'Medalhão de Filé Mignon ao Molho de Cogumelos Frescos',
          category: 'fit_premium',
          description: 'Medalhão suculento de filé mignon bovino, molho artesanal de shimeji e paris reduzido com risoto de couve-flor.',
          price350g: '32.90',
          price500g: '39.90',
          image: '/assets/cardapios/linha-fit-premium/file_00000000f3d8820eacf9d0b6ad05d64c.png',
          calories: 460,
          protein: 46,
          carbs: 18,
          fat: 14,
          availability: true,
          active: true,
        },
        {
          id: 'prod_fit_camarao_moranga',
          name: 'Camarões Selados com Arroz Negro & Tomilho',
          category: 'fit_premium',
          description: 'Camarões rosa selecionados salteados em azeite de ervas finas, acompanhados de arroz negro e tomatinhos confit.',
          price350g: '32.90',
          price500g: '39.90',
          image: '/assets/cardapios/file_00000000026c81f6839505921a9d72cb.png',
          calories: 390,
          protein: 38,
          carbs: 32,
          fat: 8,
          availability: true,
          active: true,
        },
        {
          id: 'prod_fit_bacalhau_natas',
          name: 'Bacalhau Nobre com Purê Rústico de Grão-de-Bico',
          category: 'fit_premium',
          description: 'Lascas de bacalhau Gadus Morhua desfiado, azeite português, azeitonas pretas e purê rústico de grão-de-bico.',
          price350g: '32.90',
          price500g: '39.90',
          image: '/assets/cardapios/file_000000003ac8820eb86af0c7ee5e23cc.png',
          calories: 440,
          protein: 41,
          carbs: 35,
          fat: 11,
          availability: true,
          active: true,
        },
      ];

      for (const p of defaultProducts) {
        await db.insert(products).values(p).onConflictDoNothing();
      }
      console.log('Official products seeded successfully.');
    }

    // 2. Seed Official Assets if empty
    const assetCountResult = await db.select({ count: sql<number>`count(*)` }).from(assets);
    const assetCount = Number(assetCountResult[0]?.count || 0);

    if (assetCount === 0) {
      console.log('Seeding official assets to Cloud SQL PostgreSQL...');
      const officialAssetsList = [
        {
          id: 'ASSET_04',
          name: 'Logo Oficial MerMi Fit Life (1024x1024)',
          description: 'Logo oficial primário em alta definição. Emblema circular master.',
          fileUrl: '/assets/brand/mermi-logo.png',
          storagePath: '/assets/brand/mermi-logo.png',
          category: 'BRAND',
          page: 'HOME',
          component: 'OfficialLogo',
          slot: 'HERO',
          isOfficial: true,
        },
        {
          id: 'ASSET_05',
          name: 'Logo Oficial MerMi Fit Life (512x512 Compacto)',
          description: 'Versão compacta para cabeçalhos, cards e menus.',
          fileUrl: '/assets/brand/mermi_fit_life_app_icon_512.png',
          storagePath: '/assets/brand/mermi_fit_life_app_icon_512.png',
          category: 'BRAND',
          page: 'GLOBAL',
          component: 'AppHeader',
          slot: 'NAV_ICON',
          isOfficial: true,
        },
        {
          id: 'mermi-ia-official',
          name: 'MerMi IA Oficial (Robô 3D)',
          description: 'Mascote 3D oficial da inteligência artificial do MerMi Fit Life.',
          fileUrl: '/assets/ia/mermi-ia-official.png',
          storagePath: '/assets/ia/mermi-ia-official.png',
          category: 'IA',
          page: 'MERMI_IA',
          component: 'MerMiIAView',
          slot: 'AVATAR_CHAT',
          isOfficial: true,
        },
        {
          id: 'ASSET_06',
          name: 'Selo MerMi Points Quadrado',
          description: 'Distintivo de gamificação com fundo transparente.',
          fileUrl: '/assets/mermi-points/mermi-points-square-trans.png',
          storagePath: '/assets/mermi-points/mermi-points-square-trans.png',
          category: 'POINTS',
          page: 'POINTS',
          component: 'PointsCompactBlock',
          slot: 'BADGE_SQUARE',
          isOfficial: true,
        },
        {
          id: 'ASSET_07',
          name: 'Banner Horizontal MerMi Points',
          description: 'Banner horizontal de pontuação e fidelidade.',
          fileUrl: '/assets/mermi-points/mermi-points-horizontal-trans.png',
          storagePath: '/assets/mermi-points/mermi-points-horizontal-trans.png',
          category: 'POINTS',
          page: 'POINTS',
          component: 'MerMiPointsView',
          slot: 'BANNER_HEADER',
          isOfficial: true,
        },
        {
          id: 'ASSET_08',
          name: 'Header Oficial MerMi Fit Life',
          description: 'Header gráfico panorâmico do ecossistema.',
          fileUrl: '/assets/brand/file_000000000b00820eabad455d8a975e25.png',
          storagePath: '/assets/brand/file_000000000b00820eabad455d8a975e25.png',
          category: 'BRAND',
          page: 'HOME',
          component: 'AppHeader',
          slot: 'CLIENT_HERO',
          isOfficial: true,
        },
        {
          id: 'ASSET_09',
          name: 'Poster Drop Surpresa Semanal',
          description: 'Arte oficial do Drop Surpresa de marmitas e brindes.',
          fileUrl: '/assets/posters/drop_surpresa_07.png',
          storagePath: '/assets/posters/drop_surpresa_07.png',
          category: 'CAMPANHAS',
          page: 'DROP_SURPRESA',
          component: 'DropSurpresaView',
          slot: 'BANNER_CARD',
          isOfficial: true,
        },
        {
          id: 'ASSET_10',
          name: 'Poster Catálogo de Recompensas',
          description: 'Arte do resgate da semana e clube de benefícios.',
          fileUrl: '/assets/posters/recompensas_08.png',
          storagePath: '/assets/posters/recompensas_08.png',
          category: 'CAMPANHAS',
          page: 'RESGATE',
          component: 'ResgateSemanaView',
          slot: 'MAIN_POSTER',
          isOfficial: true,
        },
        {
          id: 'ASSET_11',
          name: 'Poster MerMi Points Fidelidade',
          description: 'Infográfico do programa de pontos e níveis de fidelidade.',
          fileUrl: '/assets/posters/mermi_points_06.png',
          storagePath: '/assets/posters/mermi_points_06.png',
          category: 'CAMPANHAS',
          page: 'HOME',
          component: 'HomeLifestyleView',
          slot: 'FEED_POSTER',
          isOfficial: true,
        },
        {
          id: 'ASSET_12',
          name: 'Poster Cardápio Fit & Fit Premium',
          description: 'Apresentação visual das linhas oficiais de marmitas saudáveis.',
          fileUrl: '/assets/posters/cardapio_fit_05.png',
          storagePath: '/assets/posters/cardapio_fit_05.png',
          category: 'CARDAPIO',
          page: 'CARDAPIO',
          component: 'CardapioView',
          slot: 'TOP_BANNER',
          isOfficial: true,
        },
      ];

      for (const a of officialAssetsList) {
        await db.insert(assets).values({
          id: a.id,
          name: a.name,
          description: a.description,
          fileUrl: a.fileUrl,
          storagePath: a.storagePath,
          category: a.category,
          page: a.page,
          component: a.component,
          status: 'ACTIVE',
          version: 1,
          isOfficial: a.isOfficial,
          mimeType: 'image/png',
          fileSize: 0,
          createdBy: 'SYSTEM_INIT',
        }).onConflictDoNothing();

        await db.insert(assetVersions).values({
          id: `ver_${a.id}_1`,
          assetId: a.id,
          versionNum: 1,
          fileUrl: a.fileUrl,
          storagePath: a.storagePath,
          changeReason: 'Versão inicial do ecossistema',
          changedBy: 'SYSTEM_INIT',
          mimeType: 'image/png',
          fileSize: 0,
        }).onConflictDoNothing();

        await db.insert(assetComponentMapping).values({
          id: `map_${a.id}`,
          assetId: a.id,
          page: a.page,
          component: a.component,
          slot: a.slot,
          orderNum: 1,
          status: 'ACTIVE',
        }).onConflictDoNothing();
      }
      console.log('Official assets seeded successfully.');
    }

    // 3. Seed App Settings if empty
    const settingsCountResult = await db.select({ count: sql<number>`count(*)` }).from(appSettings);
    const settingsCount = Number(settingsCountResult[0]?.count || 0);

    if (settingsCount === 0) {
      await db.insert(appSettings).values({
        key: 'base_prices',
        valueJson: JSON.stringify({
          fit_350: 19.90,
          fit_500: 24.90,
          premium_350: 32.90,
          premium_500: 39.90,
        }),
      }).onConflictDoNothing();
    }
  } catch (error) {
    console.error('Error during migration and seeding to Cloud SQL:', error);
  }
}
