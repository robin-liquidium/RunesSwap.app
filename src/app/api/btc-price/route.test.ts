import { createTestRequest, expectErrorResponse, expectSuccessResponse } from '@/test-utils';

const mockFetchExternal = jest.fn();
const originalProKey = process.env.COINGECKO_PRO_API_KEY;
const originalDemoKey = process.env.COINGECKO_DEMO_API_KEY;

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
    delete process.env.COINGECKO_PRO_API_KEY;
    delete process.env.COINGECKO_DEMO_API_KEY;
  });

  afterAll(() => {
    if (originalProKey) process.env.COINGECKO_PRO_API_KEY = originalProKey;
    if (originalDemoKey) process.env.COINGECKO_DEMO_API_KEY = originalDemoKey;
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

  it('uses the Pro API host when a Pro key is configured', async () => {
    process.env.COINGECKO_PRO_API_KEY = 'test-pro-key';
    mockFetchExternal.mockResolvedValue({ data: { bitcoin: { usd: 77446 } } });

    const { GET } = await loadRoute();
    await GET(createTestRequest('http://localhost:3000/api/btc-price'));

    expect(mockFetchExternal).toHaveBeenCalledWith(
      expect.stringMatching(/^https:\/\/pro-api\.coingecko\.com\//),
      expect.objectContaining({ headers: { 'x-cg-pro-api-key': 'test-pro-key' } }),
    );
  });
});
