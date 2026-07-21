import type { ConfirmPSBTParams, Order } from '@satsterminal-sdk/swaps';

import type { SwapProcessAction } from '@/components/swap/SwapProcessManager';
import {
  isSwapConfirmationResult,
  type SwapConfirmationResult,
} from '@/hooks/swapExecution/psbtParsers';
import { confirmPsbtViaApi } from '@/lib/api/satsTerminal';
import { logger } from '@/lib/logger';

interface SignAndConfirmParams {
  mainPsbtBase64: string;
  rbfPsbtBase64: string | null;
  swapId: string;
  orders: Order[];
  address: string;
  publicKey: string;
  paymentAddress: string;
  paymentPublicKey: string;
  runeName: string;
  isBtcToRune: boolean;
  dispatchSwap: React.Dispatch<SwapProcessAction>;
  signPsbt: (
    tx: string,
    finalize?: boolean,
    broadcast?: boolean,
  ) => Promise<
    | {
        signedPsbtHex: string | undefined;
        signedPsbtBase64: string | undefined;
      }
    | undefined
  >;
  isRetry?: boolean;
}

/**
 * Signs and confirms swap PSBT(s), then dispatches success with tx id.
 */
export async function signAndConfirmPsbt({
  mainPsbtBase64,
  rbfPsbtBase64,
  swapId,
  orders,
  address,
  publicKey,
  paymentAddress,
  paymentPublicKey,
  runeName,
  isBtcToRune,
  dispatchSwap,
  signPsbt,
  isRetry = false,
}: SignAndConfirmParams): Promise<string> {
  dispatchSwap({ type: 'SWAP_STEP', step: 'signing' });
  const mainSigningResult = await signPsbt(mainPsbtBase64);
  const signedMainPsbt = mainSigningResult?.signedPsbtBase64;
  if (!signedMainPsbt) {
    throw new Error('Main PSBT signing cancelled or failed.');
  }

  let signedRbfPsbt: string | null = null;
  if (rbfPsbtBase64) {
    const rbfSigningResult = await signPsbt(rbfPsbtBase64);
    signedRbfPsbt = rbfSigningResult?.signedPsbtBase64 ?? null;
  }

  dispatchSwap({ type: 'SWAP_STEP', step: 'confirming' });
  const confirmParams: ConfirmPSBTParams = {
    orders,
    address,
    publicKey,
    paymentAddress,
    paymentPublicKey,
    signedPsbtBase64: signedMainPsbt,
    swapId,
    runeName,
    sell: !isBtcToRune,
    rbfProtection: !!signedRbfPsbt,
    ...(signedRbfPsbt && { signedRbfPsbtBase64: signedRbfPsbt }),
  };

  const confirmResult = await confirmPsbtViaApi(confirmParams);
  if (!isSwapConfirmationResult(confirmResult)) {
    throw new Error('Invalid confirmation response from API.');
  }

  const confirmation: SwapConfirmationResult = confirmResult;
  const finalTxId = confirmation.txid || confirmation.rbfProtection?.fundsPreparationTxId;

  if (!finalTxId) {
    logger.error(
      `Confirmation failed or transaction ID missing${isRetry ? ' (retry)' : ''}`,
      {
        hasTxid: !!confirmation.txid,
        hasRbfTxId: !!confirmation.rbfProtection?.fundsPreparationTxId,
        runeName,
        sell: !isBtcToRune,
        retryAttempt: isRetry,
      },
      'API',
    );
    throw new Error('Confirmation failed or transaction ID missing.');
  }

  dispatchSwap({ type: 'SWAP_SUCCESS', txId: finalTxId });
  return finalTxId;
}
