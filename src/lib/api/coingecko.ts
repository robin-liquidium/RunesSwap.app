import { apiGet } from '@/lib/api/createApiClient';
import { logFetchError } from '@/lib/logger';

export const getBtcPrice = async (): Promise<number> => {
  try {
    const data = await apiGet<{ usd: number }>('/api/btc-price');

    if (typeof data.usd !== 'number') {
      throw new Error('Invalid response format from BTC price API');
    }

    return data.usd;
  } catch (error) {
    logFetchError('/api/btc-price', error);
    throw new Error('Failed to fetch BTC price from CoinGecko');
  }
};
