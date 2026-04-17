import { createTestRequest, expectErrorResponse, expectSuccessResponse } from '@/test-utils';

const mockFetchExternal = jest.fn();

jest.mock('@/lib/fetchWrapper', () => ({
  fetchExternal: (...args: unknown[]) => mockFetchExternal(...args),
}));

async function loadRoute() {
  return import('@/app/api/btc-price/route');
}

describe('/api/btc-price', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('returns the BTC price in USD', async () => {
    mockFetchExternal.mockResolvedValue({
      data: {
        bitcoin: {
          usd: 77446,
        },
      },
    });

    const { GET } = await loadRoute();
    const response = await GET(createTestRequest('http://localhost:3000/api/btc-price'));
    await expectSuccessResponse(response, { usd: 77446 });
  });

  it('returns an error when CoinGecko responds with an invalid payload', async () => {
    mockFetchExternal.mockResolvedValue({
      data: {
        bitcoin: {},
      },
    });

    const { GET } = await loadRoute();
    const response = await GET(createTestRequest('http://localhost:3000/api/btc-price'));
    await expectErrorResponse(response, 500, 'Invalid response format from CoinGecko');
  });
});
