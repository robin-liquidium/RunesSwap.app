const DEFAULT_READONLY_ADDRESS = '34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo';

/**
 * Resolves address used for quote calls when wallet is not connected.
 */
export function getEffectiveQuoteAddress(address: string | null): string {
  const mockAddress = process.env.NEXT_PUBLIC_QUOTE_MOCK_ADDRESS;
  return address || (mockAddress ? String(mockAddress) : undefined) || DEFAULT_READONLY_ADDRESS;
}

/**
 * Builds a deterministic key for quote request deduplication.
 */
export function buildQuoteRequestKey(
  debouncedInputAmount: number,
  assetInId: string,
  assetOutId: string,
  address: string | null,
): string {
  const mockAddress = process.env.NEXT_PUBLIC_QUOTE_MOCK_ADDRESS;
  const addressKey = address || (mockAddress ? 'mock' : 'default');
  return `${debouncedInputAmount}-${assetInId}-${assetOutId}-${addressKey}`;
}

/**
 * Maps raw quote errors to user-facing messages.
 */
export function normalizeQuoteErrorMessage(error: unknown): string {
  const errorMessage = error instanceof Error ? error.message : 'Failed to fetch quote';

  if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
    return 'Server error: The quote service is temporarily unavailable. Please try again later.';
  }

  if (errorMessage.includes('No valid orders')) {
    return 'No orders available for this trade. Try a different amount or rune.';
  }

  if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
    return 'Network error: Please check your connection and try again.';
  }

  return errorMessage;
}
