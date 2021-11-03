import { executeStrategiesWithCache } from '../executeStrategy';
jest.setTimeout(60000);

describe('erc-20-balance-of', () => {
  const walletAddressWithAria:string = '0x5b1135819aDf7F5a8753cA49a162e8853EE01775';
  const walletAddressWithoutAria:string = '0x248793a3e73195533A043Ff02bbCBabBf675d88E';

  test('erc 20 balance of without addresses should return enriched informations', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'erc-20-balance-of',
        acquireURLs: [{
          title: 'a title',
          url: 'https://lemonde.fr'
        }],
        params: {
          minBalance: '12',
          tokens: [
            {
              chainId: '77',
              networkId: '1',
              address: '0xB81AFe27c103bcd42f4026CF719AF6D802928765'
            },
            {
              chainId: '1',
              networkId: '1',
              address: '0xedf6568618a00c6f0908bf7758a16f76b6e04af9'
            }
          ]
        }
      }]
    ]);

    const { enrichedInformations, message, code } = strategyProvider.strategies[0][0];

    expect(enrichedInformations).toBeDefined();
    expect(enrichedInformations.acquireURLs).toHaveLength(1);
    expect(enrichedInformations.logo).toBeDefined();
    expect(message).toBeDefined();
    expect(code).toBe(1);

    expect(strategyProvider.isAuthorized).toBeFalsy();
  });
  test('wallet without aria should be not authorized', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'erc-20-balance-of',
        addresses: [walletAddressWithoutAria],
        acquireURLs: [{
          title: 'a title',
          url: 'https://lemonde.fr'
        }],
        params: {
          minBalance: '12',
          tokens: [
            {
              chainId: '77',
              networkId: '1',
              address: '0xB81AFe27c103bcd42f4026CF719AF6D802928765'
            },
            {
              chainId: '1',
              networkId: '1',
              address: '0xedf6568618a00c6f0908bf7758a16f76b6e04af9'
            }
          ]
        }
      }]
    ]);

    const { enrichedInformations, message, code } = strategyProvider.strategies[0][0];
    expect(enrichedInformations).toBeDefined();
    expect(enrichedInformations.acquireURLs).toHaveLength(1);
    expect(enrichedInformations.logo).toBeDefined();
    expect(message).toBeDefined();
    expect(code).toBe(1);

    expect(strategyProvider.isAuthorized).toBeFalsy();
  });
  test('wallet with aria should be authorized', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'erc-20-balance-of',
        addresses: [walletAddressWithAria],
        params: {
          minBalance: '12',
          tokens: [
            {
              chainId: '77',
              networkId: '1',
              address: '0xB81AFe27c103bcd42f4026CF719AF6D802928765'
            },
            {
              chainId: '1',
              networkId: '1',
              address: '0xedf6568618a00c6f0908bf7758a16f76b6e04af9'
            }
          ]
        }
      }]
    ]);

    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(0);
    expect(strategyProvider.isAuthorized).toBeTruthy();
  });
});
