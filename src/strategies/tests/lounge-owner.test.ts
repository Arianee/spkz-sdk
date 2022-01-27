import { executeStrategiesWithCache } from '../executeStrategy';

jest.setTimeout(60000);

describe('execute strategies of lounge owner', () => {
  test('Should be wallet not owner of lounge XX should be not authorized', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'room-owner',
        addresses: ['0xeFeA1123d4Ed5d342f429049Aa014bF628d10108'],
        params: {
          chainId: '80001',
          networkId: '1'
        }
      }]
    ], { tokenId: '51', chainId: '80001' });
    expect(strategyProvider.isAuthorized).toBeFalsy();
    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(2);
    expect(strategyProvider.owner).toStrictEqual({ address: '0x4f6334f3061e199c600a8ab2a022de091004d99f' });
  });
});
