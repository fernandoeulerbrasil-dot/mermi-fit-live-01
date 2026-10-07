import { relations } from 'drizzle-orm';
import { boolean, integer, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  uid: text('uid').unique(),
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').notNull().default('CLIENTE'),
  active: boolean('active').notNull().default(true),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(), // 'fit' | 'fit_premium'
  description: text('description'),
  price350g: numeric('price_350g', { precision: 10, scale: 2 }).notNull(),
  price500g: numeric('price_500g', { precision: 10, scale: 2 }).notNull(),
  image: text('image').notNull(),
  primaryImageAssetId: text('primary_image_asset_id'),
  calories: integer('calories').default(0),
  protein: integer('protein').default(0),
  carbs: integer('carbs').default(0),
  fat: integer('fat').default(0),
  availability: boolean('availability').default(true),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  customerName: text('customer_name'),
  customerEmail: text('customer_email'),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }),
  deliveryFee: numeric('delivery_fee', { precision: 10, scale: 2 }),
  pointsDiscount: numeric('points_discount', { precision: 10, scale: 2 }),
  couponCode: text('coupon_code'),
  paymentMethod: text('payment_method').notNull(),
  paymentStatus: text('payment_status').notNull().default('PAYMENT_PENDING'),
  orderStatus: text('order_status').notNull().default('PENDING_PAYMENT'),
  paymentId: text('payment_id'),
  timelineJson: text('timeline_json'),
  pointsEarned: integer('points_earned').default(0),
  addressJson: text('address_json'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const payments = pgTable('payments', {
  id: text('id').primaryKey(),
  orderId: text('order_id')
    .references(() => orders.id)
    .notNull(),
  userId: text('user_id'),
  externalReference: text('external_reference').notNull(),
  gateway: text('gateway').notNull().default('mercadopago'),
  gatewayPaymentId: text('gateway_payment_id'),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('BRL'),
  method: text('method').notNull(), // 'pix' | 'credit_card' | 'debit_card'
  status: text('status').notNull().default('PAYMENT_PENDING'), // PAYMENT_PENDING | PAYMENT_APPROVED | PAYMENT_REJECTED | PAYMENT_CANCELLED | PAYMENT_EXPIRED | PAYMENT_REFUNDED
  statusDetail: text('status_detail'),
  environment: text('environment').notNull().default('sandbox'), // 'sandbox' | 'production'
  idempotencyKey: text('idempotency_key').unique(),
  pixQrCode: text('pix_qr_code'),
  pixQrCodeBase64: text('pix_qr_code_base64'),
  pixCopyPaste: text('pix_copy_paste'),
  pixExpiresAt: timestamp('pix_expires_at'),
  cardLastFour: text('card_last_four'),
  cardBrand: text('card_brand'),
  installments: integer('installments').default(1),
  payerEmail: text('payer_email'),
  payerName: text('payer_name'),
  metadataJson: text('metadata_json'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const paymentWebhooks = pgTable('payment_webhooks', {
  id: text('id').primaryKey(),
  gateway: text('gateway').notNull(),
  eventId: text('event_id').notNull(),
  eventType: text('event_type').notNull(),
  paymentId: text('payment_id'),
  orderId: text('order_id'),
  payloadJson: text('payload_json').notNull(),
  signatureHeader: text('signature_header'),
  status: text('status').notNull().default('PROCESSED'), // 'RECEIVED' | 'PROCESSED' | 'IGNORED' | 'FAILED'
  processedAt: timestamp('processed_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const paymentRefunds = pgTable('payment_refunds', {
  id: text('id').primaryKey(),
  paymentId: text('payment_id')
    .references(() => payments.id)
    .notNull(),
  orderId: text('order_id').notNull(),
  gateway: text('gateway').notNull().default('mercadopago'),
  gatewayRefundId: text('gateway_refund_id'),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  reason: text('reason'),
  requestedByUserId: text('requested_by_user_id'),
  requestedByUserName: text('requested_by_user_name'),
  status: text('status').notNull().default('APPROVED'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id')
    .references(() => orders.id)
    .notNull(),
  productId: text('product_id'),
  productName: text('product_name').notNull(),
  size: text('size').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric('total_price', { precision: 10, scale: 2 }).notNull(),
  customizationJson: text('customization_json'),
});

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

export const pointsLedger = pgTable('points_ledger', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  amount: integer('amount').notNull(),
  type: text('type').notNull(), // 'ganho' | 'utilizado' | 'expirado'
  source: text('source'),
  reason: text('reason'),
  idempotencyKey: text('idempotency_key').unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const assets = pgTable('assets', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  fileUrl: text('file_url').notNull(),
  storagePath: text('storage_path').notNull(),
  category: text('category').notNull(),
  page: text('page').notNull(),
  component: text('component').notNull(),
  status: text('status').notNull().default('ACTIVE'),
  version: integer('version').notNull().default(1),
  isOfficial: boolean('is_official').notNull().default(false),
  mimeType: text('mime_type'),
  fileSize: integer('file_size').default(0),
  createdBy: text('created_by'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const assetVersions = pgTable('asset_versions', {
  id: text('id').primaryKey(),
  assetId: text('asset_id')
    .references(() => assets.id)
    .notNull(),
  versionNum: integer('version_num').notNull(),
  fileUrl: text('file_url').notNull(),
  storagePath: text('storage_path').notNull(),
  changeReason: text('change_reason'),
  changedBy: text('changed_by'),
  mimeType: text('mime_type'),
  fileSize: integer('file_size').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const assetsRelations = relations(assets, ({ many }) => ({
  versions: many(assetVersions),
  mappings: many(assetComponentMapping),
}));

export const assetVersionsRelations = relations(assetVersions, ({ one }) => ({
  asset: one(assets, {
    fields: [assetVersions.assetId],
    references: [assets.id],
  }),
}));

export const assetComponentMapping = pgTable('asset_component_mapping', {
  id: text('id').primaryKey(),
  assetId: text('asset_id')
    .references(() => assets.id)
    .notNull(),
  page: text('page').notNull(),
  component: text('component').notNull(),
  slot: text('slot').notNull(),
  orderNum: integer('order_num').default(1),
  status: text('status').notNull().default('ACTIVE'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const assetComponentMappingRelations = relations(assetComponentMapping, ({ one }) => ({
  asset: one(assets, {
    fields: [assetComponentMapping.assetId],
    references: [assets.id],
  }),
}));

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  userName: text('user_name'),
  userRole: text('user_role'),
  action: text('action').notNull(),
  targetType: text('target_type'),
  targetId: text('target_id'),
  detailsJson: text('details_json'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const appSettings = pgTable('app_settings', {
  key: text('key').primaryKey(),
  valueJson: text('value_json').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
