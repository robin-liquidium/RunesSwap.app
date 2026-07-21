import { fetchExternal } from '@/lib/fetchWrapper';
import { logFetchError } from '@/lib/logger';

export interface BitcoinFeeRates {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}

/**
 * Fetches recommended BTC fee rates from mempool.space with sane defaults.
 */
export const fetchRecommendedFeeRates = async (): Promise<BitcoinFeeRates> => {
  const defaultRates: BitcoinFeeRates = {
    fastestFee: 25,
    halfHourFee: 20,
    hourFee: 15,
    economyFee: 10,
    minimumFee: 5,
  };

  try {
    const { data } = await fetchExternal<BitcoinFeeRates>(
      'https://mempool.space/api/v1/fees/recommended',
      { timeout: 10000, retries: 2 },
    );
    return data;
  } catch (error) {
    logFetchError('https://mempool.space/api/v1/fees/recommended', error);
    return defaultRates;
  }
};
