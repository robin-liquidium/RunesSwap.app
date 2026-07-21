// Shared test utilities for hook testing

import type { Asset, RuneData } from '@/types/common';
import type { BorrowRangeResponse, LiquidiumBorrowQuoteResponse } from '@/types/liquidium';

// Mock factory functions
export function createMockAsset(overrides: Partial<Asset> = {}): Asset {
  return {
    id: 'test-rune-id',
    name: 'TEST•RUNE',
    imageURI: 'test-image.png',
    isBTC: false,
    ...overrides,
  };
}

export function createMockRuneInfo(overrides: Partial<RuneData> = {}): RuneData {
  return {
    id: 'test-rune-id',
    name: 'TEST•RUNE',
    formatted_name: 'TEST•RUNE',
    spacers: null,
    number: null,
    inscription_id: null,
    decimals: 8,
    mint_count_cap: null,
    symbol: 'TEST',
    etching_txid: null,
    amount_per_mint: null,
    timestamp_unix: null,
    premined_supply: '1000000',
    mint_start_block: null,
    mint_end_block: null,
    current_supply: null,
    current_mint_count: null,
    ...overrides,
  };
}

export function createMockBorrowRange(
  overrides: Partial<BorrowRangeResponse['data']> = {},
): BorrowRangeResponse {
  return {
    success: true,
    data: {
      runeId: 'test-rune-id',
      minAmount: '1000000000',
      maxAmount: '10000000000',
      cached: false,
      updatedAt: new Date().toISOString(),
      ...overrides,
    },
  };
}

export function createMockBorrowQuote(
  overrides: Partial<LiquidiumBorrowQuoteResponse> = {},
): LiquidiumBorrowQuoteResponse {
  return {
    runeDetails: {
      offers: [{ offer_id: 'quote-1' }],
      valid_ranges: {
        rune_amount: {
          ranges: [{ min: '1000000000', max: '10000000000' }],
        },
        loan_term_days: [7, 14, 30],
      },
      rune_id: 'test-rune-id',
      slug: 'test-rune',
      floor_price_sats: 100,
      floor_price_last_updated_at: '2024-01-01T00:00:00Z',
      common_offer_data: {
        interest_rate: 0.05,
        rune_divisibility: 8,
      },
    },
    ...overrides,
  } as LiquidiumBorrowQuoteResponse;
}
