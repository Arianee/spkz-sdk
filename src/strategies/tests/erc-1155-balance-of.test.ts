import { executeStrategiesWithCache } from '../executeStrategy';

jest.setTimeout(60000);

describe('execute strategies of erc 1155 balance of', () => {
  test('wallet without erc 1155 should be not authorized', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'erc-1155-balance-of',
        addresses: ['0xF0245F6251Bef9447A08766b9DA2B07b28aD80B0'],
        params: {
          minBalance: '1',
          tokens: [{
            address: '0x2953399124F0cBB46d2CbACD8A89cF0599974963',
            id: '47362148279758346156251078189118650378777992861161971000224689077151491686401',
            chainId: '137',
            networkId: '1'
          }]
        }
      }]
    ]);

    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(1);

    expect(strategyProvider.isAuthorized).toBeFalsy();
  });

  test('name and logo and symbol override', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'erc-1155-balance-of',
        addresses: ['0xF0245F6251Bef9447A08766b9DA2B07b28aD80B0'],
        params: {
          minBalance: '1',
          logo: 'mylogo',
          name: 'myname',
          symbol: 'mysymbol',
          tokens: [{
            address: '0x2953399124F0cBB46d2CbACD8A89cF0599974963',
            id: '47362148279758346156251078189118650378777992861161971000224689077151491686401',
            chainId: '137',
            networkId: '1'
          }]
        }
      }]
    ]);

    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(1);
    expect(strategyProvider.strategies[0][0].enrichedInformations.name)
      .toBeDefined();
    expect(strategyProvider.strategies[0][0].enrichedInformations.symbol)
      .toBeDefined();
    expect(strategyProvider.strategies[0][0].enrichedInformations.logo)
      .toBeDefined();

    expect(strategyProvider.isAuthorized).toBeFalsy();
  });
});
