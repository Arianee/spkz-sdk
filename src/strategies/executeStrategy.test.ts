import { executeStrategies } from './executeStrategy';

describe('Execute strategy', () => {
  const walletAddressWithAria:string = '0x5b1135819aDf7F5a8753cA49a162e8853EE01775';
  const walletAddressWithoutAria:string = '0x248793a3e73195533A043Ff02bbCBabBf675d88E';

  describe('execute strategies of erc 20 balance of', () => {
    test('wallet without aria should be not authorized', async () => {
      const strategyProvider = await executeStrategies([
        [{
          chainId: '77',
          name: 'erc-20-balance-of',
          address: walletAddressWithoutAria,
          params: {
            minBalance: '12',
            address: '0xB81AFe27c103bcd42f4026CF719AF6D802928765'
          }
        }]
      ]);

      expect(strategyProvider.strategies[0][0].message).toBeDefined();
      expect(strategyProvider.strategies[0][0].code).toBe(1);

      expect(strategyProvider.isAuthorized).toBeFalsy();
    });

    test('wallet with aria should be authorized', async () => {
      const strategyProvider = await executeStrategies([
        [{
          chainId: '77',
          name: 'erc-20-balance-of',
          address: walletAddressWithAria,
          params: {
            minBalance: '12',
            address: '0xB81AFe27c103bcd42f4026CF719AF6D802928765'
          }
        }]
      ]);

      expect(strategyProvider.strategies[0][0].message).toBeDefined();
      expect(strategyProvider.strategies[0][0].code).toBe(0);
      expect(strategyProvider.isAuthorized).toBeTruthy();
    });

    test('and clause', async () => {
      const strategyProvider = await executeStrategies([
        [
          {
            chainId: '77',
            name: 'erc-20-balance-of',
            address: walletAddressWithAria,
            params: {
              minBalance: '1000000000000000000000',
              address: '0xB81AFe27c103bcd42f4026CF719AF6D802928765'
            }
          },
          {
            chainId: '77',
            name: 'erc-20-balance-of',
            address: walletAddressWithAria,
            params: {
              minBalance: '12',
              address: '0xB81AFe27c103bcd42f4026CF719AF6D802928765'
            }
          }

        ]
      ]);
      expect(strategyProvider.isAuthorized).toBeFalsy();
    });

    test('or clause', async () => {
      const strategyProvider = await executeStrategies([
        [
          {
            chainId: '77',
            name: 'erc-20-balance-of',
            address: walletAddressWithAria,
            params: {
              minBalance: '1000000000000000000000',
              address: '0xB81AFe27c103bcd42f4026CF719AF6D802928765'
            }
          }
        ],
        [

          {
            chainId: '77',
            name: 'erc-20-balance-of',
            address: walletAddressWithAria,
            params: {
              minBalance: '12',
              address: '0xB81AFe27c103bcd42f4026CF719AF6D802928765'
            }
          }

        ]

      ]);

      expect(strategyProvider.isAuthorized).toBeTruthy();
    });
  });

  describe('execute strategies of erc 721 balance of', () => {
    test('wallet without erc 721 should be not authorized', async () => {
      const strategyProvider = await executeStrategies([
        [{
          chainId: '77',
          name: 'erc-721-balance-of',
          address: '0x7B696108F5921F478A0C6F4E01280d272BaD318f',
          params: {
            minBalance: '12',
            address: '0x512C1FCF401133680f373a386F3f752b98070BC5'
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
          chainId: '77',
          name: 'erc-721-balance-of',
          address: '0x7B696108F5921F478A0C6F4E01280d272BaD318f',
          params: {
            minBalance: '1',
            address: '0x512C1FCF401133680f373a386F3f752b98070BC5'
          }
        }]
      ]);

      expect(strategyProvider.strategies[0][0].message).toBeDefined();
      expect(strategyProvider.strategies[0][0].code).toBe(0);
      expect(strategyProvider.isAuthorized).toBeTruthy();
    });
  });

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
