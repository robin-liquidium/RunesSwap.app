import { apiGet } from '@/lib/api/createApiClient';

/**
 * Fetches the static popular-runes list from API.
 */
export const fetchPopularFromApi = async (): Promise<Record<string, unknown>[]> =>
  apiGet<Record<string, unknown>[]>('/api/popular-runes');
