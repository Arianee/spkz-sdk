import { executeStrategiesWithCache } from '../executeStrategy';
jest.setTimeout(60000);

xdescribe('execute strategies of is exact address of', () => {
  test('wallet address is not in list', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'is-exact-address',
        addresses: ['0xF0245F6251Bef9447A08766b9DA2B07b28aD80B0'],
        params: {
          addresses: [
            '0x0a0bf65248805efa926c39bf51b6dd94e3d1a7af',
            '0xeFeA1123d4Ed5d342f429049Aa014bF628d10108'
          ]
        }
      }]
    ], { tokenId: '0', chainId: '80001' });

    expect(strategyProvider.strategies[0][0].message).toBeDefined();

    expect(strategyProvider.isAuthorized).toBeFalsy();
  });
  test('wallet address is in list', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'is-exact-address',
        addresses: ['0xF0245F6251Bef9447A08766b9DA2B07b28aD80B0', '0xeFeA1123d4Ed5d342f429049Aa014bF628d10108'],
        params: {
          addresses: [
            '0x0a0bf65248805efa926c39bf51b6dd94e3d1a7af',
            '0xF0245F6251Bef9447A08766b9DA2B07b28aD80B0'
          ]
        }
      }]
    ], { tokenId: '0', chainId: '80001' });

    expect(strategyProvider.strategies[0][0].message).toBeDefined();

    expect(strategyProvider.isAuthorized).toBeTruthy();
  });
});
