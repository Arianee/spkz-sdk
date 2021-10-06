import { executeStrategies } from './executeStrategy';

jest.setTimeout(60000);

describe('Execute strategy', () => {
  const walletAddressWithAria:string = '0x5b1135819aDf7F5a8753cA49a162e8853EE01775';
  const walletAddressWithoutAria:string = '0x248793a3e73195533A043Ff02bbCBabBf675d88E';

  describe('execute strategies of erc 20 balance of', () => {
    test('erc 20 balance of without addresses should return enriched informations', async () => {
      const strategyProvider = await executeStrategies([
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
      const strategyProvider = await executeStrategies([
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
      const strategyProvider = await executeStrategies([
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

    describe('clause', () => {
      describe('AND clause', () => {
        test('should return true if have aria on Mainnet AND POA', async () => {
          const strategyProvider = await executeStrategies([[
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
          ]]
          );

          expect(strategyProvider.isAuthorized).toBeTruthy();
        });

        test('should return false if does not have aria on Mainnet AND Sokol POA', async () => {
          const strategyProvider = await executeStrategies([
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
            ]]
          );

          expect(strategyProvider.isAuthorized).toBeFalsy();
        });
      });
      describe('OR clause', () => {
        test('should return false if have not USDC on Mainnet OR POA', async () => {
          const strategyProvider = await executeStrategies([[
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
          ]]
          );

          expect(strategyProvider.isAuthorized).toBeFalsy();
        });

        test('should return false if does not have aria on Mainnet OR Sokol POA', async () => {
          const strategyProvider = await executeStrategies([
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
            ]]
          );

          expect(strategyProvider.isAuthorized).toBeTruthy();
        });
      });
    });
  });
});

describe('execute strategies of is exact address of', () => {
  test('wallet address is not in list', async () => {
    const strategyProvider = await executeStrategies([
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
    ]);

    expect(strategyProvider.strategies[0][0].message).toBeDefined();

    expect(strategyProvider.isAuthorized).toBeFalsy();
  });
  test('wallet address is in list', async () => {
    const strategyProvider = await executeStrategies([
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
    ]);

    expect(strategyProvider.strategies[0][0].message).toBeDefined();

    expect(strategyProvider.isAuthorized).toBeTruthy();
  });
});

describe('execute strategies of erc 721 balance of', () => {
  test('wallet without erc 721 should be not authorized', async () => {
    const strategyProvider = await executeStrategies([
      [{
        name: 'erc-721-balance-of',
        addresses: ['0xF0245F6251Bef9447A08766b9DA2B07b28aD80B0'],
        params: {
          // Have 1 visitor
          minBalance: '1',
          tokens: [{
            address: '0x0a0bf65248805efa926c39bf51b6dd94e3d1a7af',
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

  test('wallet with erc 721 should be authorized', async () => {
    const strategyProvider = await executeStrategies([
      [{
        name: 'erc-721-balance-of',
        addresses: ['0xeFeA1123d4Ed5d342f429049Aa014bF628d10108'],
        params: {
          // Have 1 visitor
          minBalance: '1',
          tokens: [{
            address: '0x0a0bf65248805efa926c39bf51b6dd94e3d1a7af',
            chainId: '137',
            networkId: '1'
          }]
        }
      }]
    ]);

    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(0);
    expect(strategyProvider.isAuthorized).toBeTruthy();
  });

  test('wallet with balanceOf 2 different erc721 >= 2 should be authorized', async () => {
    const strategyProvider = await executeStrategies([
      [{
        name: 'erc-721-balance-of',
        addresses: ['0xeFeA1123d4Ed5d342f429049Aa014bF628d10108', '0x5BC8da7dE68c1af47D329B14ADdBf1d7547A1747'],
        params: {
          // Have 1 visitor and/or 1 PolyDoge X QuickSwap (PDQuick) (sum >= 2)
          minBalance: '2',
          tokens: [{
            address: '0x0a0bf65248805efa926c39bf51b6dd94e3d1a7af',
            chainId: '137',
            networkId: '1'
          },
          {
            address: '0xe59fd80c8cb160ca490414c6069de003328148df',
            chainId: '137',
            networkId: '1'
          }]
        }
      }]
    ]);

    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(0);
    expect(strategyProvider.isAuthorized).toBeTruthy();
  });

  test('wallet with 2 different erc 721 should be authorized', async () => {
    const strategyProvider = await executeStrategies([
      [{
        // Have 1 visitor and 1 PolyDoge X QuickSwap (PDQuick)

        name: 'erc-721-balance-of',
        addresses: ['0xeFeA1123d4Ed5d342f429049Aa014bF628d10108', '0x5BC8da7dE68c1af47D329B14ADdBf1d7547A1747'],
        params: {
          minBalance: '1',
          tokens: [
            {
              address: '0xe59fd80c8cb160ca490414c6069de003328148df',
              chainId: '137',
              networkId: '1'
            }]
        }
      },
      {
        name: 'erc-721-balance-of',
        addresses: ['0xeFeA1123d4Ed5d342f429049Aa014bF628d10108', '0x5BC8da7dE68c1af47D329B14ADdBf1d7547A1747'],
        params: {
          minBalance: '1',
          tokens: [{
            address: '0x0a0bf65248805efa926c39bf51b6dd94e3d1a7af',
            chainId: '137',
            networkId: '1'
          }]
        }
      }]
    ]);

    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(0);
    expect(strategyProvider.isAuthorized).toBeTruthy();
  });
});

describe('execute strategies of room-owner', () => {
  test('wallet not-owner of room XX should be not authorized', async () => {
    const strategyProvider = await executeStrategies([
      [{
        name: 'room-owner',
        addresses: ['0xeFeA1123d4Ed5d342f429049Aa014bF628d10108'],
        params: {
          chainId: '80001',
          networkId: '1'
        }
      }]
    ], '0');

    expect(strategyProvider.isAuthorized).toBeFalsy();
    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(2);
  });

  test('wallet without address', async () => {
    const strategyProvider = await executeStrategies([
      [{
        name: 'room-owner',
        params: {
          chainId: '80001',
          networkId: '1'
        }
      }]
    ], '0');

    expect(strategyProvider.isAuthorized).toBeFalsy();
  });

  test('wallet owner of room XX should be authorized', async () => {
    const strategyProvider = await executeStrategies([
      [{
        name: 'room-owner',
        addresses: ['0x8827B07B45067a347305E4DE51c4627859Af744c'],
        params: {
          chainId: '80001',
          networkId: '1'
        }
      }]
    ], '0');

    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(0);
    expect(strategyProvider.isAuthorized).toBeTruthy();
  });
});

/*
  describe('execute strategies of erc 721 owner of', () => {
    test('wallet of erc 721 is not owner of', async () => {
      const strategyProvider = await executeStrategies([
        [{
          chainId: '77',
          name: 'erc-721-owner-of',
          address: '0x135935c83aCF4E0C1Aa0BD948DC710eC76b478b0',
          params: {
            tokenId: '4707187',
            address: '0x512C1FCF401133680f373a386F3f752b98070BC5'
          }
        }]
      ]);

      expect(strategyProvider.strategies[0][0].message).toBeDefined();
      expect(strategyProvider.strategies[0][0].code).toBe(2);

      expect(strategyProvider.isAuthorized).toBeFalsy();
    });

    test('wallet of erc 721 is owner of', async () => {
      const strategyProvider = await executeStrategies([
        [{
          chainId: '77',
          name: 'erc-721-owner-of',
          address: '0x7B696108F5921F478A0C6F4E01280d272BaD318f',
          params: {
            tokenId: '4707187',
            address: '0x512C1FCF401133680f373a386F3f752b98070BC5'
          }
        }]
      ]);

      expect(strategyProvider.strategies[0][0].message).toBeDefined();
      expect(strategyProvider.strategies[0][0].code).toBe(0);
      expect(strategyProvider.isAuthorized).toBeTruthy();
    });
  });

  describe('execute strategies of erc 721 issuer of', () => {
    test('wallet of erc 721 is not issuer of', async () => {
      const strategyProvider = await executeStrategies([
        [{
          chainId: '77',
          name: 'erc-721-issuer-of',
          address: '0x7B696108F5921F478A0C6F4E01280d272BaD318f',
          params: {
            tokenId: '4707187',
            address: '0x512C1FCF401133680f373a386F3f752b98070BC5'
          }
        }]
      ]);

      expect(strategyProvider.strategies[0][0].message).toBeDefined();
      expect(strategyProvider.strategies[0][0].code).toBe(3);

      expect(strategyProvider.isAuthorized).toBeFalsy();
    });

    test('wallet of erc 721 is issuer of', async () => {
      const strategyProvider = await executeStrategies([
        [{
          chainId: '77',
          name: 'erc-721-issuer-of',
          address: '0x135935c83aCF4E0C1Aa0BD948DC710eC76b478b0',
          params: {
            tokenId: '4707187',
            address: '0x512C1FCF401133680f373a386F3f752b98070BC5'
          }
        }]
      ]);

      expect(strategyProvider.strategies[0][0].message).toBeDefined();
      expect(strategyProvider.strategies[0][0].code).toBe(0);

      expect(strategyProvider.isAuthorized).toBeTruthy();
    });
  });

});
  */
