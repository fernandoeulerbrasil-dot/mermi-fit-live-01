/**
 * MERMI FIT LIFE — BLOCO 13
 * SEED DATA & INITIAL REGISTRY FOR CORE ENGINE, PRICE HISTORY, LEDGER & RBAC
 */

import {
  PriceHistoryRecord,
  PointsLedgerEntry
} from '../types/mermiCoreEngine';

export const INITIAL_PRICE_HISTORY: PriceHistoryRecord[] = [
  {
    price_id: 'prc-fit-350-01',
    product_id: 'prd-fit-350',
    size: '350g',
    price: 19.90,
    valid_from: '2025-01-01T00:00:00Z',
    valid_until: null,
    status: 'vigente',
    created_by: 'adm-01 (Fernando Euler - OWNER)',
    created_at: '2025-01-01T00:00:00Z',
    notes: 'Preço base de tabela oficial da linha FIT 350g'
  },
  {
    price_id: 'prc-fit-500-01',
    product_id: 'prd-fit-500',
    size: '500g',
    price: 24.90,
    valid_from: '2025-01-01T00:00:00Z',
    valid_until: null,
    status: 'vigente',
    created_by: 'adm-01 (Fernando Euler - OWNER)',
    created_at: '2025-01-01T00:00:00Z',
    notes: 'Preço base de tabela oficial da linha FIT 500g'
  },
  {
    price_id: 'prc-prem-350-01',
    product_id: 'prd-premium-350',
    size: '350g',
    price: 32.90,
    valid_from: '2025-01-01T00:00:00Z',
    valid_until: null,
    status: 'vigente',
    created_by: 'adm-01 (Fernando Euler - OWNER)',
    created_at: '2025-01-01T00:00:00Z',
    notes: 'Preço base de tabela oficial da linha FIT PREMIUM 350g'
  },
  {
    price_id: 'prc-prem-500-01',
    product_id: 'prd-premium-500',
    size: '500g',
    price: 39.90,
    valid_from: '2025-01-01T00:00:00Z',
    valid_until: null,
    status: 'vigente',
    created_by: 'adm-01 (Fernando Euler - OWNER)',
    created_at: '2025-01-01T00:00:00Z',
    notes: 'Preço base de tabela oficial da linha FIT PREMIUM 500g'
  }
];

export const INITIAL_POINTS_LEDGER_ENTRIES: PointsLedgerEntry[] = [];
