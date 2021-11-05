import { executeStrategiesWithCache } from '../executeStrategy';
jest.setTimeout(60000);

describe('execute strategies of opensea collection balance of', () => {
  test('wallet without opensea collection assets should be not authorized', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        addresses: ['0x68b606a5172a91ec16e97620856ff732455157bc'],
        name: 'opensea-collection-balance-of',
        params: {
          minBalance: '1',
          logo: 'mylogo',
          name: 'myname',
          symbol: 'mysymbol',
          collection: 'metaverse-avatars'
        }
      }]
    ]);

    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(1);

    expect(strategyProvider.isAuthorized).toBeFalsy();
  });

  test('wallet with opensea collection asset should be authorized', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        addresses: ['0xbd5fb60cd7ef9f2203e79a9401b3605c151b993e'],
        name: 'opensea-collection-balance-of',
        params: {
          minBalance: '1',
          logo: 'mylogo',
          name: 'myname',
          symbol: 'mysymbol',
          collection: 'metaverse-avatars'
        }
      }]
    ]);

    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(0);
    expect(strategyProvider.isAuthorized).toBeTruthy();
  });
});
