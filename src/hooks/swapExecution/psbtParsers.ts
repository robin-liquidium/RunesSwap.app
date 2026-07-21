/**
 * Response shape from PSBT creation API.
 */
interface PsbtApiResponse {
  psbtBase64?: string;
  psbt?: string;
  swapId?: string;
  rbfProtected?: { base64?: string };
}

/**
 * Response shape from PSBT confirmation API.
 */
export interface SwapConfirmationResult {
  txid?: string;
  rbfProtection?: {
    fundsPreparationTxId?: string;
  };
}

/**
 * Determines whether a value matches the PSBT API response shape.
 */
function isPsbtApiResponse(value: unknown): value is PsbtApiResponse {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  const hasPsbt = typeof v.psbtBase64 === 'string' || typeof v.psbt === 'string';
  const swapIdOk = v.swapId === undefined || typeof v.swapId === 'string';
  const rbfOk =
    v.rbfProtected === undefined ||
    (typeof v.rbfProtected === 'object' &&
      v.rbfProtected !== null &&
      (typeof (v.rbfProtected as Record<string, unknown>).base64 === 'string' ||
        (v.rbfProtected as Record<string, unknown>).base64 === undefined));
  return hasPsbt && swapIdOk && rbfOk;
}

export function isSwapConfirmationResult(value: unknown): value is SwapConfirmationResult {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  const hasTxid = typeof v.txid === 'string';
  const hasRbf =
    typeof v.rbfProtection === 'object' &&
    v.rbfProtection !== null &&
    typeof (v.rbfProtection as Record<string, unknown>).fundsPreparationTxId === 'string';
  return hasTxid || hasRbf;
}

/**
 * Extracts main PSBT base64, swap identifier, and optional RBF PSBT.
 */
export function parsePsbtResult(result: unknown): {
  mainPsbtBase64?: string;
  swapId?: string;
  rbfPsbtBase64?: string;
} {
  if (!isPsbtApiResponse(result)) return {};
  const out: {
    mainPsbtBase64?: string;
    swapId?: string;
    rbfPsbtBase64?: string;
  } = {};
  const main = result.psbtBase64 || result.psbt;
  if (typeof main === 'string') out.mainPsbtBase64 = main;
  if (typeof result.swapId === 'string') out.swapId = result.swapId;
  const rbf = result.rbfProtected?.base64;
  if (typeof rbf === 'string') out.rbfPsbtBase64 = rbf;
  return out;
}
