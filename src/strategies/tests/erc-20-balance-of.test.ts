import { executeStrategiesWithCache } from '../executeStrategy';
jest.setTimeout(60000);

describe('clause', () => {
  describe('AND clause', () => {
    test('should return true if have aria on Mainnet AND POA', async () => {
      const strategyProvider = await executeStrategiesWithCache([[
        {
          name: 'erc-20-balance-of',
          addresses: ['0xb261d59bc5b2ced5c000ecb23783f3054e5fc5d0'],
          params: {
            minBalance: '11',
            tokens: [
              // have aria on mainnet
              {
                chainId: '1',
                networkId: '1',
                address: '0xedf6568618a00c6f0908bf7758a16f76b6e04af9'
              }

            ]
          }
        },
        {
          name: 'erc-20-balance-of',
          addresses: ['0xb261d59bc5b2ced5c000ecb23783f3054e5fc5d0'],
          params: {
            minBalance: '12',
            tokens: [

              // have aria on Polygon/matic
              {
                chainId: '137',
                networkId: '1',
                address: '0x46f48fbdedaa6f5500993bede9539ef85f4bee8e'
              }

            ]
          }
        },
        {
          name: 'erc-20-balance-of',
          addresses: ['0xb261d59bc5b2ced5c000ecb23783f3054e5fc5d0'],
          params: {
            minBalance: '13',
            tokens: [
              // have aria on POA
              {
                chainId: '99',
                networkId: '1',
                address: '0x55d536e4d6c1993d8ef2e2a4ef77f02088419420'
              }
            ]
          }
        }
      ]], { tokenId: '0', chainId: '80001' }
      );

      expect(strategyProvider.isAuthorized).toBeTruthy();
    });

    test('should return false if does not have aria on Mainnet AND Sokol POA', async () => {
      const strategyProvider = await executeStrategiesWithCache([
        [{
          name: 'erc-20-balance-of',
          addresses: ['0xb261d59bc5b2ced5c000ecb23783f3054e5fc5d0'],
          params: {
            minBalance: '13',
            tokens: [
              // have aria on POA
              {
                chainId: '99',
                networkId: '1',
                address: '0x55d536e4d6c1993d8ef2e2a4ef77f02088419420'
              }
            ]
          }
        },
        {
          name: 'erc-20-balance-of',
          addresses: ['0xb261d59bc5b2ced5c000ecb23783f3054e5fc5d0'],
          params: {
            minBalance: '13',
            tokens: [
              // have aria on POA
              {
                chainId: '77',
                networkId: '1',
                address: '0xB81AFe27c103bcd42f4026CF719AF6D802928765'
              }
            ]
          }
        }
        ]], { tokenId: '0', chainId: '80001' }
      );

      expect(strategyProvider.isAuthorized).toBeFalsy();
    });
  });
  describe('OR clause', () => {
    test('should return false if have not USDC on Mainnet OR POA', async () => {
      const strategyProvider = await executeStrategiesWithCache([[
        {
          name: 'erc-20-balance-of',
          addresses: ['0xb261d59bc5b2ced5c000ecb23783f3054e5fc5d0'],
          params: {
            minBalance: '11',
            tokens: [
              // have usdc on polygon
              {
                chainId: '137',
                networkId: '1',
                address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
              }

            ]
          }
        }
      ], [
        {
          name: 'erc-20-balance-of',
          addresses: ['0xb261d59bc5b2ced5c000ecb23783f3054e5fc5d0'],
          params: {
            minBalance: '11',
            tokens: [
              // have aria on mainnet
              {
                chainId: '1',
                networkId: '1',
                address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
              }

            ]
          }
        }
      ]], { tokenId: '0', chainId: '80001' }
      );

      expect(strategyProvider.isAuthorized).toBeFalsy();
    });

    test('should return false if does not have aria on Mainnet OR Sokol POA', async () => {
      const strategyProvider = await executeStrategiesWithCache([
        [{
          name: 'erc-20-balance-of',
          addresses: ['0xb261d59bc5b2ced5c000ecb23783f3054e5fc5d0'],
          params: {
            minBalance: '13',
            tokens: [
              // have aria on POA
              {
                chainId: '99',
                networkId: '1',
                address: '0x55d536e4d6c1993d8ef2e2a4ef77f02088419420'
              }
            ]
          }
        }
        ], [
          {
            name: 'erc-20-balance-of',
            addresses: ['0xb261d59bc5b2ced5c000ecb23783f3054e5fc5d0'],
            params: {
              minBalance: '13',
              tokens: [
                // have aria on sokol
                {
                  chainId: '77',
                  networkId: '1',
                  address: '0xB81AFe27c103bcd42f4026CF719AF6D802928765'
                }
              ]
            }
          }
        ]], { tokenId: '0', chainId: '80001' }
      );

      expect(strategyProvider.isAuthorized).toBeTruthy();
    });
  });
});
