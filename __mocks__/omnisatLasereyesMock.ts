import React from 'react';

export const UNISAT = 'unisat' as const;
export const XVERSE = 'xverse' as const;
export const LEATHER = 'leather' as const;
export const OYL = 'oyl' as const;
export const MAGIC_EDEN = 'magic_eden' as const;
export const OKX = 'okx' as const;
export const ORANGE = 'orange' as const;
export const PHANTOM = 'phantom' as const;
export const WIZZ = 'wizz' as const;
export const MAINNET = 'mainnet' as const;

export type ProviderType =
  | typeof UNISAT
  | typeof XVERSE
  | typeof LEATHER
  | typeof OYL
  | typeof MAGIC_EDEN
  | typeof OKX
  | typeof ORANGE
  | typeof PHANTOM
  | typeof WIZZ;

type SignPsbtResult = {
  signedPsbtHex: string | undefined;
  signedPsbtBase64: string | undefined;
  txId?: string | undefined;
};

type LaserEyesContextType = {
  connected: boolean;
  isConnecting: boolean;
  address: string | null;
  paymentAddress: string | null;
  publicKey: string | null;
  paymentPublicKey: string | null;
  provider?: string | undefined;
  hasUnisat?: boolean;
  connect: (_providerName: ProviderType) => Promise<void>;
  disconnect: () => void;
  signPsbt: (
    _tx: string,
    _finalize?: boolean,
    _broadcast?: boolean,
  ) => Promise<SignPsbtResult | undefined>;
  signMessage?: (_message: string, _address?: string) => Promise<string>;
};

const defaultLaserEyesState: LaserEyesContextType = {
  connected: false,
  isConnecting: false,
  address: null,
  paymentAddress: null,
  publicKey: null,
  paymentPublicKey: null,
  provider: undefined,
  hasUnisat: false,
  connect: async () => undefined,
  disconnect: () => undefined,
  signPsbt: async () => undefined,
  signMessage: async () => '',
};

export function useLaserEyes(): LaserEyesContextType {
  return defaultLaserEyesState;
}

export function LaserEyesProvider({
  children,
}: {
  children: React.ReactNode;
  config?: { network?: string };
}) {
  return React.createElement(React.Fragment, null, children);
}
