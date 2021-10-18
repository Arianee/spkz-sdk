import { executeStrategies, executeStrategiesWithCache } from './executeStrategy';
import { createOrRetrieveWallet } from '../index';
import { getStrategyHelperFactory } from '../helpers/getStrategyHelper/getStrategyHelper.helper';

jest.setTimeout(60000);

describe('Execute strategy', () => {
  test.only('', async () => {
    const pkBlockchainWallet1 = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';
    const proxyWallet = createOrRetrieveWallet();
    await proxyWallet.wallets.addWalletFromPrivateKey(pkBlockchainWallet1);

    const strategyToTest = {
      endpoint: 'https://node0.spkz.io/spkz/rpc',
      notificationEndpoint: 'wss://node0-ws.spkz.io',
      name: 'Arianee',
      description: 'Arianee lounge for Aria20 holders',
      external_url: 'https://spkz.io/app/lounges/2',
      image: 'https://transparianee.herokuapp.com/aria.png',
      logo: 'https://transparianee.herokuapp.com/arianee-logo.png',
      strategies: [
        [
          {
            name: 'erc-20-balance-of',
            params: {
              minBalance: '100000000000000000000',
              tokens: [
                {
                  chainId: '1',
                  networkId: '1',
                  address: '0xedf6568618a00c6f0908bf7758a16f76b6e04af9'
                },
                {
                  chainId: '137',
                  networkId: '1',
                  address: '0x46f48fbdedaa6f5500993bede9539ef85f4bee8e'
                }
              ]
            }
          }
        ]
      ],
      sections: [
        {
          title: 'Announcement',
          id: 'announcement',
          writeStrategies: [
            [
              {
                name: 'room-owner',
                params: {
                  chainId: '137',
                  networkId: '1'
                }
              }
            ]
          ]
        },
        {
          title: 'General',
          id: 'general'
        },
        {
          title: 'Tech',
          id: 'tech'
        },
        {
          title: 'LP Providers',
          id: 'lpprovider',
          readStrategies: [
            [
              {
                name: 'erc-20-balance-of',
                params: {
                  minBalance: '3000000000000000000',
                  tokens: [
                    {
                      chainId: '1',
                      networkId: '1',
                      address: '0xc5202e3f5f60423d7106a68278c627fd091b5c7d'
                    },
                    {
                      chainId: '137',
                      networkId: '1',
                      address: '0xd88810f3fe698862669448dce29808b242b9a1bc'
                    }
                  ]
                }
              }
            ]
          ]
        },
        {
          title: 'Whales',
          id: 'whales',
          readStrategies: [
            [
              {
                name: 'erc-20-balance-of',
                params: {
                  minBalance: '10000000000000000000000',
                  tokens: [
                    {
                      chainId: '1',
                      networkId: '1',
                      address: '0xedf6568618a00c6f0908bf7758a16f76b6e04af9'
                    },
                    {
                      chainId: '137',
                      networkId: '1',
                      address: '0x46f48fbdedaa6f5500993bede9539ef85f4bee8e'
                    }
                  ]
                }
              }
            ],
            [
              {
                name: 'erc-20-balance-of',
                params: {
                  minBalance: '68000000000000000000',
                  tokens: [
                    {
                      chainId: '1',
                      networkId: '1',
                      address: '0xc5202e3f5f60423d7106a68278c627fd091b5c7d'
                    },
                    {
                      chainId: '137',
                      networkId: '1',
                      address: '0xd88810f3fe698862669448dce29808b242b9a1bc'
                    }
                  ]
                }
              }
            ]
          ]
        }
      ]
    };
    console.log(JSON.stringify(getStrategyHelperFactory(strategyToTest)
      .getRoomStrategies('lpprovider')));
  });
  const walletAddressWithAria:string = '0x5b1135819aDf7F5a8753cA49a162e8853EE01775';
  const walletAddressWithoutAria:string = '0x248793a3e73195533A043Ff02bbCBabBf675d88E';

  describe('execute strategies of erc 20 balance of', () => {
    test('DEV erc 20 balance of without addresses should return enriched informations', async () => {
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
          ]]
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
            ]]
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
          ]]
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
    ]);

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
    ]);

    expect(strategyProvider.strategies[0][0].message).toBeDefined();

    expect(strategyProvider.isAuthorized).toBeTruthy();
  });
});

describe('execute strategies of erc 721 balance of', () => {
  test('wallet without erc 721 should be not authorized', async () => {
    const strategyProvider = await executeStrategiesWithCache([
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
    const strategyProvider = await executeStrategiesWithCache([
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
    const strategyProvider = await executeStrategiesWithCache([
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
    const strategyProvider = await executeStrategiesWithCache([
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
    const strategyProvider = await executeStrategiesWithCache([
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
    const strategyProvider = await executeStrategiesWithCache([
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
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'room-owner',
        addresses: ['0x0d0F862890F5b7E9AaCC6c4310499fc1621d2E80'],
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

describe('execute strategies with cache', () => {
  test('strategy with cache should be faster than without', async () => {
    const strategies = [
      [
        {
          name: 'erc-20-balance-of',
          addresses: ['0xb261d59bc5b2ced5c000ecb23783f3054e5fc5d0'],
          params: {
            minBalance: '100000000',
            tokens: [
              {
                chainId: '77',
                networkId: '1',
                address: '0xB81AFe27c103bcd42f4026CF719AF6D802928765'
              }
            ]
          }
        }]];
    // call first time
    await executeStrategiesWithCache(strategies, '122');
    const now = Date.now();
    // Should get from cache
    const strategyProvider1 = await executeStrategiesWithCache(strategies, '122');
    const time1 = Date.now() - now;

    const now2 = Date.now();

    const strategyProvider2 = await executeStrategies(strategies, '122');
    const time2 = Date.now() - now2;

    expect(strategyProvider1.isAuthorized).toBeFalsy();
    expect(strategyProvider2.isAuthorized).toBeFalsy();
    expect(time1 < time2).toBeTruthy();
    expect(time1 < 10).toBeTruthy();
    expect(time2 > 10).toBeTruthy();

    expect(strategyProvider2).toEqual(strategyProvider1);
    expect(strategyProvider2.strategies[0][0].message).toBeDefined();
    expect(strategyProvider2.strategies[0][0].code).toBeDefined();
  });
  test('strategy if cached it should be should be very faster second times', async () => {
    const strategies = [
      [
        {
          name: 'erc-20-balance-of',
          addresses: ['0xb261d59bc5b2ced5c000ecb23783f3054e5fc5d0'],
          params: {
            minBalance: '0',
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
        },
        {
          name: 'is-exact-address',
          addresses: ['0xb261d59bc5b2ced5c000ecb23783f3054e5fc5d0'],
          params: {
            addresses: [
              '0xb261d59bc5b2ced5c000ecb23783f3054e5fc5d0'
            ]
          }
        }]];
    const now = Date.now();
    const strategyProvider1 = await executeStrategiesWithCache(strategies, '1220');
    const time1 = Date.now() - now;

    const now2 = Date.now();

    const strategyProvider2 = await executeStrategiesWithCache(strategies, '1220');
    const time2 = Date.now() - now2;

    expect(time2 < 10).toBeTruthy();
    expect(time2 < time1).toBeTruthy();
    expect(strategyProvider2).toEqual(strategyProvider1);
    expect(strategyProvider2.strategies[0][0].message).toBeDefined();
    expect(strategyProvider2.strategies[0][0].code).toBeDefined();
    expect(strategyProvider2.isAuthorized).toBeTruthy();
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
