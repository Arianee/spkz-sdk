import { executeStrategiesWithCache } from '../executeStrategy';
jest.setTimeout(60000);

describe('execute strategies of erc 721 balance of issued by', () => {
  test('wallet without erc 721 of specific should be authorized', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'arianee-erc-721-balance-of-issued-by',
        addresses: ['0x2361aBD3937d4f0D7ed72860aE39167B110B727e'],
        params: {
          minBalance: '1',
          issuer: '0x135935c83aCF4E0C1Aa0BD948DC710eC76b478b0',
          name: 'Ethereum Name Service',
          symbol: 'ENS',
          logo: 'MYLOGO',
          tokens: [{
            address: '0x512C1FCF401133680f373a386F3f752b98070BC5',
            chainId: '77',
            networkId: '1'
          }]
        }
      }]
    ], { tokenId: '0', chainId: '80001' });

    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(0);
    expect(strategyProvider.strategies[0][0].enrichedInformations.name).toBe('Ethereum Name Service');
    expect(strategyProvider.strategies[0][0].enrichedInformations.symbol).toBe('ENS');
    expect(strategyProvider.strategies[0][0].enrichedInformations.logo).toBe('MYLOGO');
    expect(strategyProvider.isAuthorized).toBeTruthy();
  });
  test('wallet without erc 721 of specific issuer should be not authorized', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'arianee-erc-721-balance-of-issued-by',
        addresses: ['0x2361aBD3937d4f0D7ed72860aE39167B110B727e'],
        params: {
          minBalance: '14',
          issuer: '0x135935c83aCF4E0C1Aa0BD948DC710eC76b478b0',
          tokens: [{
            address: '0x512C1FCF401133680f373a386F3f752b98070BC5',
            chainId: '77',
            networkId: '1'
          }]
        }
      }]
    ], { tokenId: '0', chainId: '80001' });

    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(1);
    expect(strategyProvider.strategies[0][0].enrichedInformations.name.includes('Arianee')).toBeTruthy();
    expect(strategyProvider.isAuthorized).toBeFalsy();
  });
  test('wallet force logo and name', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'arianee-erc-721-balance-of-issued-by',
        addresses: ['0x2361aBD3937d4f0D7ed72860aE39167B110B727e'],
        params: {
          symbol: 'My Symbol',
          name: 'My Name',
          minBalance: '14',
          issuer: '0x135935c83aCF4E0C1Aa0BD948DC710eC76b478b0',
          tokens: [{
            address: '0x512C1FCF401133680f373a386F3f752b98070BC5',
            chainId: '77',
            networkId: '1'
          }]
        }
      }]
    ], { tokenId: '0', chainId: '80001' });

    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(1);
    expect(strategyProvider.strategies[0][0].enrichedInformations.name.includes('Name')).toBeTruthy();
    expect(strategyProvider.isAuthorized).toBeFalsy();
  });
});
