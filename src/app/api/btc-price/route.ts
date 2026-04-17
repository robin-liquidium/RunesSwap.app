import { ok } from '@/lib/apiResponse';
import { fetchExternal } from '@/lib/fetchWrapper';
import { withApiHandler } from '@/lib/withApiHandler';

const COINGECKO_BTC_PRICE_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

interface CoinGeckoResponse {
  bitcoin?: {
    usd?: number;
  };
}

const BTC_PRICE_CACHE_TTL_MS = 60_000;

let cachedBtcPriceUsd: number | null = null;
let cachedBtcPriceFetchedAt = 0;
let inFlightBtcPriceRequest: Promise<number> | null = null;

function getCoinGeckoHeaders(): HeadersInit | undefined {
  if (process.env.COINGECKO_PRO_API_KEY) {
    return { 'x-cg-pro-api-key': process.env.COINGECKO_PRO_API_KEY };
  }

  if (process.env.COINGECKO_DEMO_API_KEY) {
    return { 'x-cg-demo-api-key': process.env.COINGECKO_DEMO_API_KEY };
  }

  return undefined;
}

function getFreshCachedBtcPrice(): number | null {
  if (cachedBtcPriceUsd !== null && Date.now() - cachedBtcPriceFetchedAt < BTC_PRICE_CACHE_TTL_MS) {
    return cachedBtcPriceUsd;
  }

  return null;
}

async function fetchBtcPriceUsd(): Promise<number> {
  const cachedPrice = getFreshCachedBtcPrice();
  if (cachedPrice !== null) {
    return cachedPrice;
  }

  if (inFlightBtcPriceRequest) {
    return inFlightBtcPriceRequest;
  }

  const headers = getCoinGeckoHeaders();
  inFlightBtcPriceRequest = (async () => {
    const { data } = headers
      ? await fetchExternal<CoinGeckoResponse>(COINGECKO_BTC_PRICE_URL, {
          timeout: 10000,
          retries: 3,
          headers,
        })
      : await fetchExternal<CoinGeckoResponse>(COINGECKO_BTC_PRICE_URL, {
          timeout: 10000,
          retries: 3,
        });

    const usd = data.bitcoin?.usd;
    if (typeof usd !== 'number') {
      throw new Error('Invalid response format from CoinGecko');
    }

    cachedBtcPriceUsd = usd;
    cachedBtcPriceFetchedAt = Date.now();
    return usd;
  })();

  try {
    return await inFlightBtcPriceRequest;
  } finally {
    inFlightBtcPriceRequest = null;
  }
}

/**
 * Proxies the BTC/USD price through the server to avoid browser-side fetch instability
 * and to support authenticated CoinGecko usage when keys are available.
 */
export const GET = withApiHandler(
  async () => {
    try {
      const usd = await fetchBtcPriceUsd();
      return ok({ usd });
    } catch (error) {
      if (cachedBtcPriceUsd !== null) {
        return ok({ usd: cachedBtcPriceUsd });
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Failed to fetch BTC price from CoinGecko');
    }
  },
  {
    defaultErrorMessage: 'Failed to fetch BTC price',
  },
);
