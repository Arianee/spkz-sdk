import { executeStrategiesWithCache } from '../executeStrategy';
jest.setTimeout(60000);

describe('clause', () => {
  describe('Simple clause', () => {
    test('should return true if 1 ETH on mainnet', async () => {
      const strategyProvider = await executeStrategiesWithCache([[
        {
          name: 'native-balance-of',
          // weth smartcontract
          addresses: ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
          params: {
            minBalance: '1000000000000000000',
            chainId: '1',
            networkId: '1'
          }
        }
      ]], { tokenId: '0', chainId: '80001' }
      );

      expect(strategyProvider.isAuthorized).toBeTruthy();
    });

    test('should return false if does not have ETH on Mainnet', async () => {
      const strategyProvider = await executeStrategiesWithCache([
        [{
          name: 'native-balance-of',
          addresses: ['0x776BB566dc299c9e722773d2A04b401E831a6dc7'],
          params: {
            minBalance: '13',
            chainId: '1',
            networkId: '1'
          }
        }
        ]], { tokenId: '0', chainId: '80001' }
      );

      expect(strategyProvider.isAuthorized).toBeFalsy();
    });
  });
  describe('AND clause', () => {
    test('should return true if have  native crypto on polygon AND POA', async () => {
      const strategyProvider = await executeStrategiesWithCache([[
        {
          name: 'native-balance-of',
          addresses: ['0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'],
          params: {
            minBalance: '10000000000000000000',
            chainId: '137',
            networkId: '1'
          }
        },
        {
          name: 'native-balance-of',
          addresses: ['0x68c817bfef37b5cbb691a2d02517fb8b76e7cd47'],
          params: {
            minBalance: '10000000000000000000',
            chainId: '99',
            networkId: '1'
          }
        }
      ]], { tokenId: '0', chainId: '80001' }
      );

      expect(strategyProvider.isAuthorized).toBeTruthy();
    });
  });
  describe('OR clause', () => {
    test('should return true if have  native crypto on polygon OR ETH', async () => {
      const strategyProvider = await executeStrategiesWithCache([[
        {
          name: 'native-balance-of',
          addresses: ['0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'],

          params: {
            minBalance: '10000000000000000000',
            chainId: '137',
            networkId: '1'
          }
        }
      ], [
        {
          name: 'native-balance-of',
          addresses: ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
          params: {
            minBalance: '1000000000000000000',
            chainId: '1',
            networkId: '1'
          }
        }
      ]], { tokenId: '0', chainId: '80001' }
      );

      expect(strategyProvider.isAuthorized).toBeTruthy();
    });
  });
});
