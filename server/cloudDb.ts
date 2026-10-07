import { db } from '../src/db/index.ts';
import {
  products,
  assets,
  assetVersions,
  assetComponentMapping,
  orders,
  orderItems,
  pointsLedger,
  users,
  auditLogs,
  appSettings,
  payments,
  paymentWebhooks,
  paymentRefunds,
} from '../src/db/schema.ts';
import { eq, desc, sql, and, inArray } from 'drizzle-orm';

export const cloudDb = {
  // --- PRODUTOS ---
  async getProducts() {
    const rawProducts = await db
      .select()
      .from(products)
      .where(eq(products.active, true))
      .orderBy(products.category, products.name);

    // Mapear ativos para resolver dinamicamente a versão ativa de cada imagem de produto
    const allAssets = await db.select().from(assets);
    const assetMap = new Map(allAssets.map((a) => [a.id, a]));

    return rawProducts.map((p) => {
      let resolvedImageUrl = '';
      let assetName: string | undefined = undefined;

      if (p.primaryImageAssetId) {
        if (assetMap.has(p.primaryImageAssetId)) {
          const linkedAsset = assetMap.get(p.primaryImageAssetId)!;
          resolvedImageUrl = linkedAsset.fileUrl;
          assetName = linkedAsset.name;
        } else {
          resolvedImageUrl = '';
        }
      } else {
        resolvedImageUrl = p.image || '';
      }

      return {
        ...p,
        imageUrl: resolvedImageUrl,
        image: resolvedImageUrl,
        primaryImageAssetId: p.primaryImageAssetId || null,
        assetName,
      };
    });
  },

  async updateProductImageAsset(params: {
    productId: string;
    assetId: string | null;
    adminName: string;
    adminRole: string;
  }) {
    const existing = await db
      .select()
      .from(products)
      .where(eq(products.id, params.productId));

    if (existing.length === 0) {
      throw new Error(`Produto ${params.productId} não encontrado no banco.`);
    }

    let newImageUrl = '';
    let assetName = '';
    const now = new Date();

    if (params.assetId) {
      const assetRow = await db
        .select()
        .from(assets)
        .where(eq(assets.id, params.assetId));

      if (assetRow.length === 0) {
        throw new Error(`Asset ${params.assetId} não encontrado.`);
      }

      newImageUrl = assetRow[0].fileUrl;
      assetName = assetRow[0].name;

      // Inserir ou atualizar vínculo em asset_component_mapping
      const mappingId = `map_prod_${params.productId}`;
      await db
        .insert(assetComponentMapping)
        .values({
          id: mappingId,
          assetId: params.assetId,
          page: 'Cardápio',
          component: 'ProductCard',
          slot: params.productId,
          orderNum: 1,
          status: 'ACTIVE',
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: assetComponentMapping.id,
          set: {
            assetId: params.assetId,
            status: 'ACTIVE',
            updatedAt: now,
          }
        });
    } else {
      // Se estiver desvinculando, remove ou desativa mapping anterior
      await db
        .delete(assetComponentMapping)
        .where(eq(assetComponentMapping.id, `map_prod_${params.productId}`));
    }

    // Atualizar produto no PostgreSQL
    await db
      .update(products)
      .set({
        primaryImageAssetId: params.assetId,
        image: newImageUrl,
        updatedAt: now,
      })
      .where(eq(products.id, params.productId));

    await this.addAuditLog({
      action: params.assetId ? 'LINK_PRODUCT_ASSET' : 'UNLINK_PRODUCT_ASSET',
      userName: params.adminName,
      userRole: params.adminRole,
      targetType: 'product',
      targetId: params.productId,
      detailsJson: JSON.stringify({
        productId: params.productId,
        productName: existing[0].name,
        assetId: params.assetId,
        assetName,
        imageUrl: newImageUrl,
      }),
    });

    return {
      success: true,
      productId: params.productId,
      primaryImageAssetId: params.assetId,
      imageUrl: newImageUrl,
      image: newImageUrl,
      assetName,
    };
  },

  async getBasePrices() {
    const row = await db
      .select()
      .from(appSettings)
      .where(eq(appSettings.key, 'base_prices'));

    if (row.length > 0 && row[0].valueJson) {
      try {
        return JSON.parse(row[0].valueJson);
      } catch {
        // fallback
      }
    }
    return {
      fit_350: 19.90,
      fit_500: 24.90,
      premium_350: 32.90,
      premium_500: 39.90,
    };
  },

  async updateBasePrices(newPrices: any, adminName: string) {
    const valueJson = JSON.stringify(newPrices);
    await db
      .insert(appSettings)
      .values({
        key: 'base_prices',
        valueJson,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: appSettings.key,
        set: {
          valueJson,
          updatedAt: new Date(),
        },
      });

    await this.addAuditLog({
      action: 'UPDATE_PRICING',
      userName: adminName,
      userRole: 'ADMIN',
      targetType: 'app_settings',
      targetId: 'base_prices',
      detailsJson: valueJson,
    });
  },

  // --- ASSETS ---
  async getAssets() {
    const allAssets = await db
      .select()
      .from(assets)
      .orderBy(assets.category, assets.name);

    const allMappings = await db
      .select({
        mappingId: assetComponentMapping.id,
        assetId: assetComponentMapping.assetId,
        page: assetComponentMapping.page,
        component: assetComponentMapping.component,
        slot: assetComponentMapping.slot,
        orderNum: assetComponentMapping.orderNum,
        status: assetComponentMapping.status,
      })
      .from(assetComponentMapping)
      .where(eq(assetComponentMapping.status, 'ACTIVE'));

    const mappingsByAssetId: Record<string, any[]> = {};
    for (const m of allMappings) {
      if (!mappingsByAssetId[m.assetId]) {
        mappingsByAssetId[m.assetId] = [];
      }
      mappingsByAssetId[m.assetId].push({
        mapping_id: m.mappingId,
        page: m.page,
        component: m.component,
        slot: m.slot,
      });
    }

    const formattedAssets = allAssets.map((a) => ({
      asset_id: a.id,
      name: a.name,
      description: a.description,
      file_url: a.fileUrl,
      storage_path: a.storagePath,
      category: a.category,
      page: a.page,
      component: a.component,
      status: a.status,
      version: a.version,
      is_official: a.isOfficial,
      mime_type: a.mimeType,
      file_size: a.fileSize,
      created_by: a.createdBy,
      created_at: a.createdAt?.toISOString(),
      updated_at: a.updatedAt?.toISOString(),
      usage_locations: mappingsByAssetId[a.id] || [],
    }));

    const formattedMappings = allMappings.map((m) => {
      const asset = allAssets.find((a) => a.id === m.assetId);
      return {
        mapping_id: m.mappingId,
        asset_id: m.assetId,
        page: m.page,
        component: m.component,
        slot: m.slot,
        order_num: m.orderNum,
        status: m.status,
        asset_name: asset?.name || m.assetId,
        file_url: asset?.fileUrl || '',
        category: asset?.category || '',
        version: asset?.version || 1,
      };
    });

    return {
      assets: formattedAssets,
      mappings: formattedMappings,
    };
  },

  async getAssetHistory(assetId: string) {
    const list = await db
      .select()
      .from(assetVersions)
      .where(eq(assetVersions.assetId, assetId))
      .orderBy(desc(assetVersions.versionNum));

    return list.map((v) => ({
      id: v.id,
      asset_id: v.assetId,
      version: v.versionNum,
      file_url: v.fileUrl,
      storage_path: v.storagePath,
      reason: v.changeReason,
      changed_by: v.changedBy,
      created_at: v.createdAt?.toISOString(),
    }));
  },

  async replaceAsset(params: {
    assetId: string;
    newFileUrl: string;
    newStoragePath?: string;
    reason?: string;
    adminName: string;
    adminRole: string;
  }) {
    const existing = await db
      .select()
      .from(assets)
      .where(eq(assets.id, params.assetId));

    if (existing.length === 0) {
      throw new Error('Asset não encontrado');
    }

    const current = existing[0];
    const newVersion = current.version + 1;
    const now = new Date();

    // 1. Salvar versão atual no histórico
    await db.insert(assetVersions).values({
      id: `ver_${params.assetId}_${current.version}_${Date.now()}`,
      assetId: params.assetId,
      versionNum: current.version,
      fileUrl: current.fileUrl,
      storagePath: current.storagePath,
      changeReason: params.reason || `Substituição para v${newVersion}`,
      changedBy: params.adminName,
      mimeType: current.mimeType,
      fileSize: current.fileSize,
      createdAt: now,
    });

    // 2. Atualizar o asset para nova versão
    await db
      .update(assets)
      .set({
        fileUrl: params.newFileUrl,
        storagePath: params.newStoragePath || params.newFileUrl,
        version: newVersion,
        updatedAt: now,
      })
      .where(eq(assets.id, params.assetId));

    // Atualizar produtos vinculados com a nova imagem ativa
    await db
      .update(products)
      .set({
        image: params.newFileUrl,
        updatedAt: now,
      })
      .where(eq(products.primaryImageAssetId, params.assetId));

    // 3. Auditoria
    await this.addAuditLog({
      action: 'REPLACE_ASSET',
      userName: params.adminName,
      userRole: params.adminRole,
      targetType: 'asset',
      targetId: params.assetId,
      detailsJson: JSON.stringify({
        previousUrl: current.fileUrl,
        newUrl: params.newFileUrl,
        version: newVersion,
        reason: params.reason,
      }),
    });

    return {
      assetId: params.assetId,
      version: newVersion,
      fileUrl: params.newFileUrl,
    };
  },

  async rollbackAsset(params: {
    assetId: string;
    targetVersion: number;
    adminName: string;
    adminRole: string;
  }) {
    const existing = await db
      .select()
      .from(assets)
      .where(eq(assets.id, params.assetId));

    if (existing.length === 0) {
      throw new Error('Asset não encontrado');
    }

    const current = existing[0];
    const historyItem = await db
      .select()
      .from(assetVersions)
      .where(
        eq(assetVersions.assetId, params.assetId)
      );

    const targetVer = historyItem.find((h) => h.versionNum === params.targetVersion);
    if (!targetVer) {
      throw new Error(`Versão ${params.targetVersion} não encontrada no histórico.`);
    }

    const nextVersion = current.version + 1;
    const now = new Date();

    // Salvar estado atual antes do rollback
    await db.insert(assetVersions).values({
      id: `ver_${params.assetId}_${current.version}_${Date.now()}`,
      assetId: params.assetId,
      versionNum: current.version,
      fileUrl: current.fileUrl,
      storagePath: current.storagePath,
      changeReason: `Rollback acionado para restaurar v${params.targetVersion}`,
      changedBy: params.adminName,
      mimeType: current.mimeType,
      fileSize: current.fileSize,
      createdAt: now,
    });

    // Restaurar imagem da versão anterior
    await db
      .update(assets)
      .set({
        fileUrl: targetVer.fileUrl,
        storagePath: targetVer.storagePath,
        version: nextVersion,
        updatedAt: now,
      })
      .where(eq(assets.id, params.assetId));

    // Atualizar produtos vinculados com a imagem revertida
    await db
      .update(products)
      .set({
        image: targetVer.fileUrl,
        updatedAt: now,
      })
      .where(eq(products.primaryImageAssetId, params.assetId));

    // Auditoria
    await this.addAuditLog({
      action: 'ROLLBACK_ASSET',
      userName: params.adminName,
      userRole: params.adminRole,
      targetType: 'asset',
      targetId: params.assetId,
      detailsJson: JSON.stringify({
        restoredFromVersion: params.targetVersion,
        restoredUrl: targetVer.fileUrl,
        newVersion: nextVersion,
      }),
    });

    return {
      assetId: params.assetId,
      version: nextVersion,
      fileUrl: targetVer.fileUrl,
    };
  },

  async createAsset(params: {
    name: string;
    description?: string;
    fileUrl: string;
    storagePath?: string;
    category: string;
    page: string;
    component: string;
    slot?: string;
    orderNum?: number;
    status?: string;
    isOfficial?: boolean;
    mimeType?: string;
    fileSize?: number;
    adminName: string;
    adminRole: string;
  }) {
    const assetId = `asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();

    // 1. Inserir na tabela principal de assets no PostgreSQL
    await db.insert(assets).values({
      id: assetId,
      name: params.name,
      description: params.description || '',
      fileUrl: params.fileUrl,
      storagePath: params.storagePath || params.fileUrl,
      category: params.category.toUpperCase(),
      page: params.page,
      component: params.component,
      status: params.status || 'ACTIVE',
      version: 1,
      isOfficial: params.isOfficial || false,
      mimeType: params.mimeType || 'image/png',
      fileSize: params.fileSize || 0,
      createdBy: params.adminName,
      createdAt: now,
      updatedAt: now,
    });

    // 2. Inserir versão inicial v1 em asset_versions
    await db.insert(assetVersions).values({
      id: `ver_${assetId}_1_${Date.now()}`,
      assetId: assetId,
      versionNum: 1,
      fileUrl: params.fileUrl,
      storagePath: params.storagePath || params.fileUrl,
      changeReason: 'Criação inicial do asset',
      changedBy: params.adminName,
      mimeType: params.mimeType || 'image/png',
      fileSize: params.fileSize || 0,
      createdAt: now,
    });

    // 3. Inserir mapeamento em asset_component_mapping
    const mappingId = `map_${assetId}_${Date.now()}`;
    await db.insert(assetComponentMapping).values({
      id: mappingId,
      assetId: assetId,
      page: params.page,
      component: params.component,
      slot: params.slot || 'DEFAULT',
      orderNum: params.orderNum || 1,
      status: params.status || 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    });

    // 4. Inserir auditoria em audit_logs
    await this.addAuditLog({
      action: 'CREATE_ASSET',
      userName: params.adminName,
      userRole: params.adminRole,
      targetType: 'asset',
      targetId: assetId,
      detailsJson: JSON.stringify({
        name: params.name,
        category: params.category,
        page: params.page,
        component: params.component,
        fileUrl: params.fileUrl,
        version: 1,
      }),
    });

    return {
      assetId,
      name: params.name,
      fileUrl: params.fileUrl,
      version: 1,
      mappingId,
    };
  },

  async updateAsset(params: {
    assetId: string;
    name?: string;
    description?: string;
    category?: string;
    page?: string;
    component?: string;
    status?: string;
    isOfficial?: boolean;
    adminName: string;
    adminRole: string;
  }) {
    const existing = await db
      .select()
      .from(assets)
      .where(eq(assets.id, params.assetId));

    if (existing.length === 0) {
      throw new Error('Asset não encontrado');
    }

    const current = existing[0];
    const updateData: any = {
      updatedAt: new Date(),
    };
    if (params.name !== undefined) updateData.name = params.name;
    if (params.description !== undefined) updateData.description = params.description;
    if (params.category !== undefined) updateData.category = params.category.toUpperCase();
    if (params.page !== undefined) updateData.page = params.page;
    if (params.component !== undefined) updateData.component = params.component;
    if (params.status !== undefined) updateData.status = params.status;
    if (params.isOfficial !== undefined) updateData.isOfficial = params.isOfficial;

    await db.update(assets).set(updateData).where(eq(assets.id, params.assetId));

    // Se a página ou componente mudaram, atualizar mapeamento padrão
    if (params.page || params.component) {
      await db
        .update(assetComponentMapping)
        .set({
          ...(params.page ? { page: params.page } : {}),
          ...(params.component ? { component: params.component } : {}),
          updatedAt: new Date(),
        })
        .where(eq(assetComponentMapping.assetId, params.assetId));
    }

    await this.addAuditLog({
      action: 'UPDATE_ASSET',
      userName: params.adminName,
      userRole: params.adminRole,
      targetType: 'asset',
      targetId: params.assetId,
      detailsJson: JSON.stringify(updateData),
    });

    return { success: true, assetId: params.assetId };
  },

  async toggleAssetStatus(params: {
    assetId: string;
    status: string;
    adminName: string;
    adminRole: string;
  }) {
    await db
      .update(assets)
      .set({ status: params.status, updatedAt: new Date() })
      .where(eq(assets.id, params.assetId));

    await db
      .update(assetComponentMapping)
      .set({ status: params.status, updatedAt: new Date() })
      .where(eq(assetComponentMapping.assetId, params.assetId));

    await this.addAuditLog({
      action: 'TOGGLE_ASSET_STATUS',
      userName: params.adminName,
      userRole: params.adminRole,
      targetType: 'asset',
      targetId: params.assetId,
      detailsJson: JSON.stringify({ newStatus: params.status }),
    });

    return { success: true, status: params.status };
  },

  async deleteAsset(params: {
    assetId: string;
    adminName: string;
    adminRole: string;
  }) {
    const existing = await db
      .select()
      .from(assets)
      .where(eq(assets.id, params.assetId));

    if (existing.length === 0) {
      throw new Error('Asset não encontrado');
    }

    if (existing[0].isOfficial) {
      throw new Error('Assets oficiais da marca possuem proteção de imutabilidade e não podem ser excluídos.');
    }

    // Remover mappings e versões associadas primeiro
    await db.delete(assetComponentMapping).where(eq(assetComponentMapping.assetId, params.assetId));
    await db.delete(assetVersions).where(eq(assetVersions.assetId, params.assetId));
    await db.delete(assets).where(eq(assets.id, params.assetId));

    await this.addAuditLog({
      action: 'DELETE_ASSET',
      userName: params.adminName,
      userRole: params.adminRole,
      targetType: 'asset',
      targetId: params.assetId,
      detailsJson: JSON.stringify({ name: existing[0].name, url: existing[0].fileUrl }),
    });

    return { success: true, assetId: params.assetId };
  },

  async addAssetMapping(params: {
    assetId: string;
    page: string;
    component: string;
    slot?: string;
    orderNum?: number;
    status?: string;
    adminName: string;
    adminRole: string;
  }) {
    const mappingId = `map_${params.assetId}_${Date.now()}`;
    const now = new Date();

    await db.insert(assetComponentMapping).values({
      id: mappingId,
      assetId: params.assetId,
      page: params.page,
      component: params.component,
      slot: params.slot || 'DEFAULT',
      orderNum: params.orderNum || 1,
      status: params.status || 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    });

    await this.addAuditLog({
      action: 'ADD_ASSET_MAPPING',
      userName: params.adminName,
      userRole: params.adminRole,
      targetType: 'asset_mapping',
      targetId: mappingId,
      detailsJson: JSON.stringify({
        assetId: params.assetId,
        page: params.page,
        component: params.component,
        slot: params.slot,
      }),
    });

    return { success: true, mappingId };
  },

  async deleteAssetMapping(params: {
    mappingId: string;
    adminName: string;
    adminRole: string;
  }) {
    await db.delete(assetComponentMapping).where(eq(assetComponentMapping.id, params.mappingId));

    await this.addAuditLog({
      action: 'DELETE_ASSET_MAPPING',
      userName: params.adminName,
      userRole: params.adminRole,
      targetType: 'asset_mapping',
      targetId: params.mappingId,
    });

    return { success: true, mappingId: params.mappingId };
  },

  // --- MERMI POINTS LEDGER ---
  async getUserLedger(userId: string) {
    const entries = await db
      .select()
      .from(pointsLedger)
      .where(eq(pointsLedger.userId, userId))
      .orderBy(desc(pointsLedger.createdAt));

    const sumResult = await db
      .select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
      .from(pointsLedger)
      .where(eq(pointsLedger.userId, userId));

    const balance = Number(sumResult[0]?.total || 0);

    return {
      balance,
      entries: entries.map((e) => ({
        id: e.id,
        user_id: e.userId,
        amount: e.amount,
        type: e.type,
        source: e.source,
        reason: e.reason,
        created_at: e.createdAt?.toISOString(),
      })),
    };
  },

  async addPointsEntry(params: {
    userId: string;
    amount: number;
    type: 'ganho' | 'utilizado' | 'expirado' | 'estornado';
    source?: string;
    reason?: string;
    idempotencyKey?: string;
  }) {
    const id = `pt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await db
      .insert(pointsLedger)
      .values({
        id,
        userId: params.userId,
        amount: params.amount,
        type: params.type,
        source: params.source || 'sistema',
        reason: params.reason || '',
        idempotencyKey: params.idempotencyKey || id,
        createdAt: new Date(),
      })
      .onConflictDoNothing();

    return await this.getUserLedger(params.userId);
  },

  // --- PEDIDOS ---
  async createOrder(params: {
    orderId: string;
    userId: string;
    customerName: string;
    customerEmail: string;
    total: number;
    subtotal: number;
    deliveryFee: number;
    pointsDiscount: number;
    couponCode?: string;
    paymentMethod: string;
    addressJson: string;
    notes?: string;
    pointsEarned?: number;
    items: Array<{
      productId?: string;
      name: string;
      size: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      customizationJson?: string;
    }>;
  }) {
    const now = new Date();
    const initialTimeline = [
      {
        status: 'PENDING_PAYMENT',
        label: 'Aguardando Pagamento',
        description: 'Pedido registrado. Aguardando confirmação do gateway.',
        completed: true,
        timestamp: now.toISOString(),
      },
      {
        status: 'PAID',
        label: 'Pagamento Confirmado',
        description: 'Transação confirmada pelo gateway de pagamento.',
        completed: false,
      },
      {
        status: 'PREPARING',
        label: 'Em Preparação',
        description: 'Cozinha separando ingredientes e iniciando o preparo.',
        completed: false,
      },
      {
        status: 'READY',
        label: 'Pronto / Embalado',
        description: 'Marmitas seladas a vácuo com lacre oficial MerMi.',
        completed: false,
      },
      {
        status: 'OUT_FOR_DELIVERY',
        label: 'Saiu para Entrega',
        description: 'Entregador parceiro a caminho do destino.',
        completed: false,
      },
      {
        status: 'DELIVERED',
        label: 'Entregue',
        description: 'Pedido entregue com sucesso.',
        completed: false,
      },
    ];

    await db.insert(orders).values({
      id: params.orderId,
      userId: params.userId,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      total: params.total.toFixed(2),
      subtotal: params.subtotal.toFixed(2),
      deliveryFee: params.deliveryFee.toFixed(2),
      pointsDiscount: params.pointsDiscount.toFixed(2),
      couponCode: params.couponCode || null,
      paymentMethod: params.paymentMethod,
      paymentStatus: 'PAYMENT_PENDING',
      orderStatus: 'PENDING_PAYMENT',
      pointsEarned: params.pointsEarned || Math.floor(params.total),
      timelineJson: JSON.stringify(initialTimeline),
      addressJson: params.addressJson,
      notes: params.notes || null,
      createdAt: now,
      updatedAt: now,
    });

    for (let i = 0; i < params.items.length; i++) {
      const item = params.items[i];
      await db.insert(orderItems).values({
        id: `item_${params.orderId}_${i + 1}`,
        orderId: params.orderId,
        productId: item.productId || null,
        productName: item.name,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toFixed(2),
        totalPrice: item.totalPrice.toFixed(2),
        customizationJson: item.customizationJson || null,
      });
    }

    return params.orderId;
  },

  async getOrders(userId?: string) {
    let orderList;
    if (userId) {
      orderList = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.createdAt));
    } else {
      orderList = await db
        .select()
        .from(orders)
        .orderBy(desc(orders.createdAt));
    }

    const result = [];
    for (const o of orderList) {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, o.id));

      result.push({
        ...o,
        total: Number(o.total),
        subtotal: Number(o.subtotal || 0),
        delivery_fee: Number(o.deliveryFee || 0),
        points_discount: Number(o.pointsDiscount || 0),
        items: items.map((it) => ({
          ...it,
          unitPrice: Number(it.unitPrice),
          totalPrice: Number(it.totalPrice),
        })),
      });
    }

    return result;
  },

  // --- AUDITORIA ---
  async addAuditLog(params: {
    action: string;
    userId?: string;
    userName?: string;
    userRole?: string;
    targetType?: string;
    targetId?: string;
    detailsJson?: string;
  }) {
    await db.insert(auditLogs).values({
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: params.userId || null,
      userName: params.userName || 'Sistema',
      userRole: params.userRole || 'SISTEMA',
      action: params.action,
      targetType: params.targetType || null,
      targetId: params.targetId || null,
      detailsJson: params.detailsJson || null,
      createdAt: new Date(),
    });
  },

  // --- USUÁRIOS ---
  async syncUser(params: {
    id: string;
    uid?: string;
    email: string;
    name?: string;
    role?: string;
    avatar?: string;
  }) {
    await db
      .insert(users)
      .values({
        id: params.id,
        uid: params.uid || params.id,
        email: params.email,
        name: params.name || '',
        role: params.role || 'CLIENTE',
        active: true,
        avatar: params.avatar || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: params.email,
          name: params.name || '',
          avatar: params.avatar || null,
          updatedAt: new Date(),
        },
      });
  },

  async hasOwner() {
    const ownerList = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, 'OWNER'));

    return Number(ownerList[0]?.count || 0) > 0;
  },

  // --- SISTEMA REAL DE PAGAMENTOS ---

  async createPaymentRecord(params: {
    id: string;
    orderId: string;
    userId?: string;
    externalReference: string;
    gateway: string;
    gatewayPaymentId?: string;
    amount: number;
    currency?: string;
    method: string;
    status: string;
    statusDetail?: string;
    environment: string;
    idempotencyKey?: string;
    pixQrCode?: string;
    pixQrCodeBase64?: string;
    pixCopyPaste?: string;
    pixExpiresAt?: Date;
    cardLastFour?: string;
    cardBrand?: string;
    installments?: number;
    payerEmail?: string;
    payerName?: string;
    metadataJson?: string;
  }) {
    const now = new Date();
    await db.insert(payments).values({
      id: params.id,
      orderId: params.orderId,
      userId: params.userId || null,
      externalReference: params.externalReference,
      gateway: params.gateway,
      gatewayPaymentId: params.gatewayPaymentId || null,
      amount: params.amount.toFixed(2),
      currency: params.currency || 'BRL',
      method: params.method,
      status: params.status,
      statusDetail: params.statusDetail || null,
      environment: params.environment,
      idempotencyKey: params.idempotencyKey || null,
      pixQrCode: params.pixQrCode || null,
      pixQrCodeBase64: params.pixQrCodeBase64 || null,
      pixCopyPaste: params.pixCopyPaste || null,
      pixExpiresAt: params.pixExpiresAt || null,
      cardLastFour: params.cardLastFour || null,
      cardBrand: params.cardBrand || null,
      installments: params.installments || 1,
      payerEmail: params.payerEmail || null,
      payerName: params.payerName || null,
      metadataJson: params.metadataJson || null,
      createdAt: now,
      updatedAt: now,
    });

    // Vincular payment_id ao pedido
    await db
      .update(orders)
      .set({
        paymentId: params.id,
        updatedAt: now,
      })
      .where(eq(orders.id, params.orderId));

    return await this.getPaymentById(params.id);
  },

  async getPaymentById(paymentId: string) {
    const rows = await db
      .select()
      .from(payments)
      .where(eq(payments.id, paymentId))
      .limit(1);
    if (!rows || rows.length === 0) return null;
    const p = rows[0];
    return {
      ...p,
      amount: Number(p.amount),
    };
  },

  async getPaymentByOrderId(orderId: string) {
    const rows = await db
      .select()
      .from(payments)
      .where(eq(payments.orderId, orderId))
      .orderBy(desc(payments.createdAt))
      .limit(1);
    if (!rows || rows.length === 0) return null;
    const p = rows[0];
    return {
      ...p,
      amount: Number(p.amount),
    };
  },

  async getPaymentByIdempotencyKey(key: string) {
    const rows = await db
      .select()
      .from(payments)
      .where(eq(payments.idempotencyKey, key))
      .limit(1);
    if (!rows || rows.length === 0) return null;
    const p = rows[0];
    return {
      ...p,
      amount: Number(p.amount),
    };
  },

  async getPaymentByGatewayPaymentId(gatewayPaymentId: string) {
    const rows = await db
      .select()
      .from(payments)
      .where(eq(payments.gatewayPaymentId, gatewayPaymentId))
      .limit(1);
    if (!rows || rows.length === 0) return null;
    const p = rows[0];
    return {
      ...p,
      amount: Number(p.amount),
    };
  },

  async updatePaymentStatus(params: {
    paymentId: string;
    status: string;
    statusDetail?: string;
    gatewayPaymentId?: string;
    metadataJson?: string;
  }) {
    const now = new Date();
    const updateData: any = {
      status: params.status,
      updatedAt: now,
    };
    if (params.statusDetail !== undefined) updateData.statusDetail = params.statusDetail;
    if (params.gatewayPaymentId) updateData.gatewayPaymentId = params.gatewayPaymentId;
    if (params.metadataJson) updateData.metadataJson = params.metadataJson;

    await db
      .update(payments)
      .set(updateData)
      .where(eq(payments.id, params.paymentId));

    return await this.getPaymentById(params.paymentId);
  },

  async getOrderById(orderId: string) {
    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);
    if (!rows || rows.length === 0) return null;
    const o = rows[0];
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, o.id));

    return {
      ...o,
      total: Number(o.total),
      subtotal: Number(o.subtotal || 0),
      delivery_fee: Number(o.deliveryFee || 0),
      points_discount: Number(o.pointsDiscount || 0),
      points_earned: o.pointsEarned || 0,
      timeline: o.timelineJson ? JSON.parse(o.timelineJson) : [],
      items: items.map((it) => ({
        ...it,
        unitPrice: Number(it.unitPrice),
        totalPrice: Number(it.totalPrice),
      })),
    };
  },

  async updateOrderStatusAndTimeline(params: {
    orderId: string;
    orderStatus: string;
    paymentStatus?: string;
    paymentId?: string;
    timelineJson?: string;
  }) {
    const now = new Date();
    const updateData: any = {
      orderStatus: params.orderStatus,
      updatedAt: now,
    };
    if (params.paymentStatus) updateData.paymentStatus = params.paymentStatus;
    if (params.paymentId) updateData.paymentId = params.paymentId;
    if (params.timelineJson) updateData.timelineJson = params.timelineJson;

    await db.update(orders).set(updateData).where(eq(orders.id, params.orderId));
    return await this.getOrderById(params.orderId);
  },

  // --- WEBHOOKS & IDEMPOTÊNCIA ---

  async isWebhookProcessed(gateway: string, eventId: string): Promise<boolean> {
    const rows = await db
      .select({ id: paymentWebhooks.id })
      .from(paymentWebhooks)
      .where(
        and(
          eq(paymentWebhooks.gateway, gateway),
          eq(paymentWebhooks.eventId, eventId),
          inArray(paymentWebhooks.status, ['PROCESSED', 'IGNORED'])
        )
      )
      .limit(1);

    return Boolean(rows && rows.length > 0);
  },

  async logPaymentWebhook(params: {
    id: string;
    gateway: string;
    eventId: string;
    eventType: string;
    paymentId?: string;
    orderId?: string;
    payloadJson: string;
    signatureHeader?: string;
    status: string;
  }) {
    await db.insert(paymentWebhooks).values({
      id: params.id,
      gateway: params.gateway,
      eventId: params.eventId,
      eventType: params.eventType,
      paymentId: params.paymentId || null,
      orderId: params.orderId || null,
      payloadJson: params.payloadJson,
      signatureHeader: params.signatureHeader || null,
      status: params.status,
      processedAt: new Date(),
      createdAt: new Date(),
    });
  },

  // --- REEMBOLSOS ---

  async createPaymentRefundRecord(params: {
    id: string;
    paymentId: string;
    orderId: string;
    gateway: string;
    gatewayRefundId?: string;
    amount: number;
    reason?: string;
    requestedByUserId?: string;
    requestedByUserName?: string;
    status?: string;
  }) {
    await db.insert(paymentRefunds).values({
      id: params.id,
      paymentId: params.paymentId,
      orderId: params.orderId,
      gateway: params.gateway,
      gatewayRefundId: params.gatewayRefundId || null,
      amount: params.amount.toFixed(2),
      reason: params.reason || null,
      requestedByUserId: params.requestedByUserId || null,
      requestedByUserName: params.requestedByUserName || null,
      status: params.status || 'APPROVED',
      createdAt: new Date(),
    });
  },

  // --- RELATÓRIOS DO MERMI CONTROL ---

  async getPaymentTransactions() {
    const rows = await db
      .select()
      .from(payments)
      .orderBy(desc(payments.createdAt))
      .limit(100);

    return rows.map((r) => ({
      ...r,
      amount: Number(r.amount),
    }));
  },

  async getPaymentLogs() {
    const rows = await db
      .select()
      .from(paymentWebhooks)
      .orderBy(desc(paymentWebhooks.createdAt))
      .limit(100);

    return rows;
  },

  async getPaymentRefunds() {
    const rows = await db
      .select()
      .from(paymentRefunds)
      .orderBy(desc(paymentRefunds.createdAt))
      .limit(100);

    return rows.map((r) => ({
      ...r,
      amount: Number(r.amount),
    }));
  },
};
