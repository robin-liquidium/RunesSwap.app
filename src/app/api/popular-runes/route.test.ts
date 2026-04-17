import { GET } from '@/app/api/popular-runes/route';
import * as popularRunes from '@/lib/popularRunes';
import {
  createTestRequest,
  expectErrorResponse,
  expectSuccessResponse,
  testData,
} from '@/test-utils';

jest.mock('@/lib/popularRunes');
const mockGetPopularRunes = jest.mocked(popularRunes.getPopularRunes);

describe('/api/popular-runes', () => {
  beforeEach(() => jest.clearAllMocks());

  const mockData = [
    testData.popularRune({
      token_id: '840010:907',
      token: 'LIQUIDIUM•TOKEN',
      symbol: '🫠',
    }),
    testData.popularRune({
      token_id: '840000:45',
      token: 'MAGIC•INTERNET•MONEY',
      symbol: '🧙',
    }),
  ];

  const testCases = [
    {
      name: 'successful popular runes fetch',
      setup: () => mockGetPopularRunes.mockReturnValue(mockData),
      expectSuccess: true,
      expectedData: mockData,
    },
    {
      name: 'error handling',
      setup: () =>
        mockGetPopularRunes.mockImplementation(() => {
          throw new Error('Failed to get popular runes');
        }),
      expectError: { status: 500, message: 'Failed to get popular runes' },
    },
  ];

  testCases.forEach(({ name, setup, expectSuccess, expectedData, expectError }) => {
    it(`should handle ${name}`, async () => {
      setup();
      const response = await GET(createTestRequest('http://localhost:3000/api/popular-runes'));

      if (expectSuccess) {
        await expectSuccessResponse(response, expectedData);
        expect(mockGetPopularRunes).toHaveBeenCalledTimes(1);
      } else if (expectError) {
        await expectErrorResponse(response, expectError.status, expectError.message);
      }
    });
  });
});
