import { act, renderHook } from '@testing-library/react';

import usePopularRunes from '@/hooks/usePopularRunes';
import useSwapRunes from '@/hooks/useSwapRunes';
import { fetchRunesFromApi } from '@/lib/api/satsTerminal';
import type { Asset } from '@/types/common';

jest.mock('@/hooks/usePopularRunes', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/lib/api/satsTerminal', () => ({
  fetchRunesFromApi: jest.fn(),
}));

const mockUsePopularRunes = usePopularRunes as jest.Mock;
const mockFetchRunesFromApi = fetchRunesFromApi as jest.Mock;

const DOG_ASSET: Asset = {
  id: '840000:3',
  name: 'DOG•GO•TO•THE•MOON',
  imageURI: 'dog.png',
  isBTC: false,
};

const LIQUIDIUM_ASSET: Asset = {
  id: '840010:907',
  name: 'LIQUIDIUM•TOKEN',
  imageURI: 'liq.png',
  isBTC: false,
};

describe('useSwapRunes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePopularRunes.mockReturnValue({
      popularRunes: [DOG_ASSET, LIQUIDIUM_ASSET],
      isLoading: false,
      error: null,
    });
    mockFetchRunesFromApi.mockResolvedValue([]);
  });

  it('re-applies the preselected rune when the route param changes on the same mount', async () => {
    const setAssetIn = jest.fn();
    const setAssetOut = jest.fn();

    const { rerender } = renderHook(
      ({ preSelectedRune }) =>
        useSwapRunes({
          preSelectedRune,
          assetOut: null,
          setAssetIn,
          setAssetOut,
        }),
      {
        initialProps: {
          preSelectedRune: DOG_ASSET.name,
        },
      },
    );

    await act(async () => Promise.resolve());
    expect(setAssetOut).toHaveBeenLastCalledWith(
      expect.objectContaining({ name: DOG_ASSET.name, isBTC: false }),
    );

    setAssetOut.mockClear();

    rerender({
      preSelectedRune: LIQUIDIUM_ASSET.name,
    });

    await act(async () => Promise.resolve());
    expect(setAssetOut).toHaveBeenLastCalledWith(
      expect.objectContaining({ name: LIQUIDIUM_ASSET.name, isBTC: false }),
    );
  });
});
