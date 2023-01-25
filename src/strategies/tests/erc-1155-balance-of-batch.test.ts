import { ErrorCode } from '../../models/errorCode';
import { executeStrategiesWithCache } from '../executeStrategy';

jest.setTimeout(60000);

// deployed erc1155 on rinkeby 0x4e0951fa4f0c299380ad8c81ae1a32f120907f64
// owner of tokens (SPKZ (id 0, supply 500) ARIANEE (id1, supply 1)) 0x5D1e2E92488b9911C08a559ad9E3A8bD0F31B2F4

describe('execute strategies of erc 1155 balance of', () => {
  test('wallet with erc 1155 and sufficient balances SHOULD be authorized', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'erc-1155-balance-of-batch',
        addresses: ['0x5d1e2e92488b9911c08a559ad9e3a8bd0f31b2f4'],
        params: {
          chainId: '4',
          address: '0x4e0951fa4f0c299380ad8c81ae1a32f120907f64',
          logo: '',
          name: '',
          symbol: '',
          minBalances: [{ id: '0', amount: '500' }, { id: '1', amount: '1' }]
        }
      }]
    ], { tokenId: '0', chainId: '80001' });

    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(ErrorCode.SUCCESS);

    expect(strategyProvider.isAuthorized).toBeTruthy();
  });

  test('wallet with erc 1155 and insufficient balances SHOULD NOT be authorized', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'erc-1155-balance-of-batch',
        addresses: ['0x5d1e2e92488b9911c08a559ad9e3a8bd0f31b2f4'],
        params: {
          chainId: '4',
          address: '0x4e0951fa4f0c299380ad8c81ae1a32f120907f64',
          logo: '',
          name: '',
          symbol: '',
          minBalances: [{ id: '0', amount: '100000' }, { id: '1', amount: '1000000' }]
        }
      }]
    ], { tokenId: '0', chainId: '80001' });

    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(ErrorCode.NOTENOUGH);

    expect(strategyProvider.isAuthorized).toBeFalsy();
  });

  test('it should return names and images of tokens', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'erc-1155-balance-of-batch',
        addresses: ['0x5d1e2e92488b9911c08a559ad9e3a8bd0f31b2f4'],
        params: {
          chainId: '4',
          address: '0x4e0951fa4f0c299380ad8c81ae1a32f120907f64',
          logo: '',
          name: '',
          symbol: '',
          minBalances: [{ id: '0', amount: '100000' }, { id: '1', amount: '1000000' }]
        }
      }]
    ], { tokenId: '0', chainId: '80001' });

    expect(strategyProvider.strategies[0][0].details?.namesAndImages).toBeDefined();
  });

  test('it should not authorize if the contract address in invalid', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'erc-1155-balance-of-batch',
        addresses: ['0x5d1e2e92488b9911c08a559ad9e3a8bd0f31b2f4'],
        params: {
          chainId: '4',
          address: '0xa2336fa232f3',
          logo: '',
          name: '',
          symbol: '',
          minBalances: [{ id: '0', amount: '100000' }, { id: '1', amount: '1000000' }]
        }
      }]
    ], { tokenId: '0', chainId: '80001' });

    expect(strategyProvider.strategies[0][0].message).toBe('Invalid contract address');
    expect(strategyProvider.strategies[0][0].code).toBe(ErrorCode.ERRORINSTRATEGY);

    expect(strategyProvider.isAuthorized).toBeFalsy();
  });
});
