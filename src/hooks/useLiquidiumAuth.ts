import { useEffect, useState } from 'react';

import { get, post } from '@/lib/fetchWrapper';
import { logFetchError } from '@/lib/logger';
import type { LiquidiumLoanOffer } from '@/types/liquidium';

interface Args {
  address: string | null;
  paymentAddress: string | null;
  signMessage: ((message: string, address: string) => Promise<string>) | undefined;
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name?: unknown }).name === 'AbortError'
  );
}

function getErrorStatus(error: unknown): number | null {
  if (typeof error !== 'object' || error === null || !('status' in error)) {
    return null;
  }

  const status = (error as { status?: unknown }).status;
  return typeof status === 'number' ? status : null;
}

/**
 * Hook to manage Liquidium authentication and loan fetching.
 * Handles the challenge-response authentication flow and JWT management.
 *
 * @param args - Arguments including wallet address and signing function.
 * @returns Authentication state, loans data, and auth functions.
 */
export function useLiquidiumAuth({ address, paymentAddress, signMessage }: Args) {
  const [liquidiumAuthenticated, setLiquidiumAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [loans, setLoans] = useState<LiquidiumLoanOffer[]>([]);
  const [isLoadingLiquidium, setIsLoadingLiquidium] = useState(false);
  const [liquidiumError, setLiquidiumError] = useState<string | null>(null);

  const fetchLiquidiumLoans = async () => {
    setIsLoadingLiquidium(true);
    setLiquidiumError(null);
    try {
      const { data } = await get<{
        success: boolean;
        data: { loans: LiquidiumLoanOffer[] };
      }>(`/api/liquidium/portfolio?address=${encodeURIComponent(address || '')}`);

      if (!data.success) {
        setLiquidiumError('Failed to fetch loans');
        setLoans([]);
        return;
      }

      const apiLoans = (data.data?.loans as LiquidiumLoanOffer[]) ?? [];
      setLoans(apiLoans);
    } catch (err: unknown) {
      logFetchError(`/api/liquidium/portfolio?address=${address}`, err);
      if (err instanceof Error) {
        setLiquidiumError(err.message || 'Unknown error');
        setLoans([]);
      } else {
        setLiquidiumError('Unknown error');
        setLoans([]);
      }
    } finally {
      setIsLoadingLiquidium(false);
    }
  };

  const handleLiquidiumAuth = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      if (!address || !paymentAddress) {
        setAuthError('Wallet connection required for authentication');
        setIsAuthenticating(false);
        return;
      }
      if (!signMessage) {
        setAuthError('Your wallet does not support message signing');
        setIsAuthenticating(false);
        return;
      }
      const { data: challengeData } = await get<{
        success: boolean;
        data: {
          ordinals: { message: string; nonce: string };
          payment?: { message: string; nonce: string };
        };
      }>(
        `/api/liquidium/challenge?ordinalsAddress=${encodeURIComponent(
          address,
        )}&paymentAddress=${encodeURIComponent(paymentAddress)}`,
      );

      if (!challengeData.success) {
        setAuthError('Failed to get challenge');
        setIsAuthenticating(false);
        return;
      }

      const { ordinals, payment } = challengeData.data;
      const ordinalsSignature = await signMessage(ordinals.message, address);
      let paymentSignature: string | undefined;
      if (payment) {
        paymentSignature = await signMessage(payment.message, paymentAddress);
      }
      const { data: authData } = await post<{ success: boolean }>('/api/liquidium/auth', {
        ordinalsAddress: address,
        paymentAddress,
        ordinalsSignature,
        paymentSignature,
        ordinalsNonce: ordinals.nonce,
        paymentNonce: payment?.nonce,
      });

      if (!authData.success) {
        setAuthError('Authentication failed');
        setIsAuthenticating(false);
        return;
      }
      setLiquidiumAuthenticated(true);
      fetchLiquidiumLoans();
    } catch (err: unknown) {
      logFetchError('/api/liquidium/auth', err);
      setAuthError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    if (!address) return;

    const controller = new AbortController();
    let ignoreResult = false;

    const checkAuth = async () => {
      setIsCheckingAuth(true);
      try {
        const { data, status } = await get<{
          success: boolean;
          data: { loans: LiquidiumLoanOffer[] };
        }>(`/api/liquidium/portfolio?address=${encodeURIComponent(address)}`, {
          signal: controller.signal,
        });

        if (ignoreResult) {
          return;
        }

        if (status === 200 && data.success) {
          setLiquidiumAuthenticated(true);
          const apiLoans = (data.data?.loans as LiquidiumLoanOffer[]) ?? [];
          setLoans(apiLoans);
        } else if (status === 401) {
          setLiquidiumAuthenticated(false);
          setLoans([]);
        } else {
          setLiquidiumAuthenticated(false);
          setLoans([]);
        }
      } catch (err: unknown) {
        if (isAbortError(err)) {
          return;
        }

        if (getErrorStatus(err) === 401) {
          setLiquidiumAuthenticated(false);
          setLoans([]);
        } else {
          logFetchError(`/api/liquidium/portfolio?address=${address}`, err);
          setLiquidiumAuthenticated(false);
          setLoans([]);
        }
      } finally {
        if (!ignoreResult) {
          setIsCheckingAuth(false);
        }
      }
    };

    checkAuth();

    return () => {
      ignoreResult = true;
      controller.abort();
    };
  }, [address]);

  return {
    loans,
    isCheckingAuth,
    liquidiumAuthenticated,
    isAuthenticating,
    authError,
    isLoadingLiquidium,
    liquidiumError,
    handleLiquidiumAuth,
    fetchLiquidiumLoans,
  };
}
