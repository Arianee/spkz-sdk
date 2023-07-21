import { executeStrategiesWithCache } from '../executeStrategy';
jest.setTimeout(60000);

xdescribe('execute strategies of room-owner', () => {
  test('wallet not-owner of room XX should be not authorized', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'room-owner',
        addresses: ['0xeFeA1123d4Ed5d342f429049Aa014bF628d10108'],
        params: {
          chainId: '80001',
          networkId: '1'
        }
      }]
    ], { tokenId: '0', chainId: '80001' });

    expect(strategyProvider.isAuthorized).toBeFalsy();
    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(2);
  });

  test('wallet without address', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'room-owner',
        params: {
          chainId: '80001',
          networkId: '1'
        }
      }]
    ], { tokenId: '0', chainId: '80001' });

    expect(strategyProvider.isAuthorized).toBeFalsy();
  });

  test('wallet owner of room XX should be authorized', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'room-owner',
        addresses: ['0x0d0F862890F5b7E9AaCC6c4310499fc1621d2E80'],
        params: {
          chainId: '80001',
          networkId: '1'
        }
      }]
    ], { tokenId: '0', chainId: '80001' });

    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(0);
    expect(strategyProvider.isAuthorized).toBeTruthy();
  });
});
