// Liquidium API Types

export interface LiquidiumLoanOffer {
  id: string;
  loan_details: LiquidiumLoanDetails;
  collateral_details: LiquidiumCollateralDetails;
}

type LoanState =
  | 'OFFERED'
  | 'ACCEPTED'
  | 'ACTIVATING'
  | 'ACTIVE'
  | 'REPAYING'
  | 'REPAID'
  | 'DEFAULTED'
  | 'CLAIMING'
  | 'CLAIMED'
  | 'LIQUIDATING'
  | 'LIQUIDATED'
  | 'CANCELLED'
  | 'FAILED';

interface LiquidiumLoanDetails {
  state: LoanState;
  principal_amount_sats: number;
  loan_term_days: number;
  loan_term_end_date: string;
  start_date: string;
  escrow_address: string;
  discount: {
    discount_rate: number;
    discount_sats: number;
  };
  total_repayment_sats?: number;
}

interface LiquidiumCollateralDetails {
  rune_id: string;
  collateral_type: 'Rune' | 'Brc20' | 'Inscription';
  rune_divisibility: number;
  rune_amount: number;
}

// --- Client/Route Response Types (moved from api/liquidium.ts) ---

export interface RepayLiquidiumLoanResponse {
  success: boolean;
  data?: {
    psbt: string;
    repaymentAmountSats: number;
    loanId: string;
  };
  error?: string;
}

export interface SubmitRepayResponse {
  success: boolean;
  data?: {
    repayment_transaction_id: string;
  };
  error?: string;
}

export interface LiquidiumBorrowQuoteOffer {
  offer_id: string;
  fungible_amount: number;
  loan_term_days: number | null;
  ltv_rate: number;
  loan_breakdown: {
    total_repayment_sats: number;
    principal_sats: number;
    interest_sats: number;
    loan_due_by_date: string;
    activation_fee_sats: number;
    discount: {
      discount_rate: number;
      discount_sats: number;
    };
  };
}

export interface LiquidiumBorrowQuoteResponse {
  success: boolean;
  runeDetails?: {
    rune_id: string;
    slug: string;
    floor_price_sats: number;
    floor_price_last_updated_at: string;
    common_offer_data: {
      interest_rate: number;
      rune_divisibility: number;
    };
    valid_ranges: {
      rune_amount: { ranges: { min: string; max: string }[] };
      loan_term_days: number[];
    };
    offers: LiquidiumBorrowQuoteOffer[];
  };
  data?: {
    runeDetails: {
      rune_id: string;
      slug: string;
      floor_price_sats: number;
      floor_price_last_updated_at: string;
      common_offer_data: {
        interest_rate: number;
        rune_divisibility: number;
      };
      valid_ranges: {
        rune_amount: { ranges: { min: string; max: string }[] };
        loan_term_days: number[];
      };
      offers: LiquidiumBorrowQuoteOffer[];
    };
  };
  error?: { message: string; details?: string };
}

export interface LiquidiumPrepareBorrowResponse {
  success: boolean;
  data?: {
    prepare_offer_id: string;
    base64_psbt: string;
    sides: {
      index: number;
      address: string | null;
      sighash: number | null;
      disable_tweak_signer: boolean;
    }[];
  };
  error?: string;
}

export interface LiquidiumSubmitBorrowResponse {
  success: boolean;
  data?: {
    loan_transaction_id: string;
  };
  error?: string;
}

export interface BorrowRangeResponse {
  success: boolean;
  data?: {
    runeId: string;
    minAmount: string;
    maxAmount: string;
    loanTermDays?: number[];
    cached: boolean;
    updatedAt: string;
    noOffersAvailable?: boolean;
  };
  error?: string;
}
