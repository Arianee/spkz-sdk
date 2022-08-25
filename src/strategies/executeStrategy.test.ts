import { Strategy } from '../models/strategy';
import { executeStrategies } from './executeStrategy';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('executeStrategies', () => {
  it('executes the strategies without token id', async () => {
    const strategies: Strategy[][] = [
      [
        {
          name: 'api-balance-of',
          params: {
            url: 'https://anarray.com/array',
            minBalance: 1,
            headers: {}
          }

        }
      ]
    ];

    mockedAxios.get.mockResolvedValue({
      data: ['a', 'b']
    });

    const result = await executeStrategies(strategies, null, false);

    expect(result.isAuthorized).toBeTruthy();
  });

  it('executes the strategies with token id', async () => {
    const params = { chainId: '80001', tokenId: '1' };
    const strategies: Strategy[][] = [
      [
        {
          name: 'erc-721-owner-of',
          addresses: ['0x0d0F862890F5b7E9AaCC6c4310499fc1621d2E80'],
          params: {
            contract: '0x56c35df413b3cd753f85427e55a8df66a79f1bd7',
            chainId: '80001',
            tokenIds: ['1']
          }
        }
      ]
    ];

    const result = await executeStrategies(strategies, params, false);
    expect(result.isAuthorized).toBeTruthy();
  });
});
