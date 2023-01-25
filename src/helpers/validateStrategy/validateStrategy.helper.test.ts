import { ERC20BalancesOf, ERC20BalanceOf, Strategy, ERC721BalancesOf, UnlockHasOwnership, ERC1155BalanceOfBatch, ERC1155BalanceOf, PoapHolderOf, isExactAddresses, ArianeeERC721BalancesOfIssuedBy, ERC721OwnerOf, ERC721NotOwnerOf } from '../../models/strategy';
import { validateStrategy, validateSubstrategy } from './validateStrategy.helper';

describe('strategies schemas', () => {
  describe('ERC20BalancesOfSchema', () => {
    it('should be valid if the strategy is correct', () => {
      const strategy : Strategy<ERC20BalancesOf> = {
        name: 'erc-20-balance-of',
        params: {
          minBalance: '1',
          tokens: [{
            chainId: '1',
            networkId: '1',
            address: '0xdac17f958d2ee523a2206206994597c13d831ec7'
          }]
        }
      };

      const res = validateStrategy(strategy);
      expect(res.valid).toBeTruthy();
    });

    it('should not be valid if the strategy is incorrect', () => {
      const strategy : Strategy<ERC20BalancesOf> = {
        name: 'erc-20-balance-of',
        params: {
          minBalance: 5454 as any,
          tokens: [{
            chainId: 12234565 as any,
            networkId: 1414523 as any,
            address: 'invalid address'
          }]
        }
      };

      const res = validateStrategy(strategy);
      // 2 errors: in tokens and in minBalance
      expect(res.details).toHaveLength(2);
      expect(res.valid).toBeFalsy();
    });
  });

  describe('ERC20BalanceOfSchema', () => {
    it('should be valid if the strategy is correct', () => {
      const strategy : Strategy<ERC20BalanceOf> = {
        name: 'erc-20-balance-of-substrategy',
        params: {
          chainId: '1',
          networkId: '1',
          address: '0xdac17f958d2ee523a2206206994597c13d831ec7'
        }
      };

      const res = validateStrategy(strategy);
      expect(res.valid).toBeTruthy();
    });

    it('should not be valid if the strategy is incorrect', () => {
      const strategy : Strategy<ERC20BalanceOf> = {
        name: 'erc-20-balance-of-substrategy',
        params: {
          chainId: 9 as any,
          networkId: 555 as any,
          address: 'aaaaaaaa' as any
        }
      };

      const res = validateStrategy(strategy);
      // 3 errors: in chainId, in networkid and in address
      expect(res.details).toHaveLength(3);
      expect(res.valid).toBeFalsy();
    });
  });

  describe('ERC721BalancesOfSchema', () => {
    it('should be valid if the strategy is correct', () => {
      const strategy : Strategy<ERC721BalancesOf> = {
        name: 'erc-721-balance-of',
        params: {
          minBalance: '1',
          tokens: [{
            chainId: '1',
            networkId: '1',
            address: '0xdac17f958d2ee523a2206206994597c13d831ec7'
          }],
          logo: 'https://arianee.net/idk.png',
          name: 'test',
          symbol: 'TEST'
        }
      };

      const res = validateStrategy(strategy);
      expect(res.valid).toBeTruthy();
    });

    it('should not be valid if the strategy is incorrect', () => {
      const strategy : Strategy<ERC721BalancesOf> = {
        name: 'erc-721-balance-of',
        params: {
          minBalance: 1 as any,
          tokens: [{
            chainId: 1 as any,
            networkId: 1 as any,
            address: 'aaaaaaaa'
          }],
          logo: '.kkkkk4l5',
          name: 'test',
          symbol: 'TEST'
        }
      };

      const res = validateStrategy(strategy);
      // 3 errors: in minBalance, tokens, logo
      expect(res.details).toHaveLength(3);
      expect(res.valid).toBeFalsy();
    });
  });

  describe('ERC721BalancesOfIssuedBySchema', () => {
    it('should be valid if the strategy is correct', () => {
      const strategy : Strategy<ArianeeERC721BalancesOfIssuedBy> = {
        name: 'arianee-erc-721-balance-of-issued-by',
        params: {
          minBalance: '1',
          issuer: '0x135935c83aCF4E0C1Aa0BD948DC710eC76b478b0',
          tokens: [{
            chainId: '1',
            networkId: '1',
            address: '0xdac17f958d2ee523a2206206994597c13d831ec7'
          }],
          logo: 'https://arianee.net/idk.png',
          name: 'test',
          symbol: 'TEST'
        }
      };

      const res = validateStrategy(strategy);
      expect(res.valid).toBeTruthy();
    });

    it('should not be valid if the strategy is incorrect', () => {
      const strategy : Strategy<ArianeeERC721BalancesOfIssuedBy> = {
        name: 'arianee-erc-721-balance-of-issued-by',
        params: {
          issuer: 'INVALID ETH ADDRESS',
          minBalance: 1 as any,
          tokens: [{
            chainId: 1 as any,
            networkId: 1 as any,
            address: 'aaaaaaaa'
          }],
          logo: '.kkkkk4l5',
          name: 'test',
          symbol: 'TEST'
        }
      };

      const res = validateStrategy(strategy);
      // 4 errors: in issuer, minBalance, tokens, logo
      expect(res.details).toHaveLength(4);
      expect(res.valid).toBeFalsy();
    });
  });

  describe('ERC721OwnerOfSchema', () => {
    it('should be valid if the strategy is correct', () => {
      const strategy : Strategy<ERC721OwnerOf> = {
        name: 'erc-721-owner-of',
        params: {
          contract: '0x135935c83aCF4E0C1Aa0BD948DC710eC76b478b0',
          chainId: '1',
          tokenIds: ['1'],
          logo: 'https://arianee.net/idk.png',
          name: 'test',
          symbol: 'TEST'
        }
      };

      const res = validateStrategy(strategy);
      expect(res.valid).toBeTruthy();
    });

    it('should not be valid if the strategy is incorrect', () => {
      const strategy : Strategy<ERC721OwnerOf> = {
        name: 'erc-721-owner-of',
        params: {
          contract: 'INVALID ETH ADDRESS',
          chainId: 1 as any,
          tokenIds: [1 as any],
          logo: 'https://arianee.net/idk.png',
          name: 'test',
          symbol: 'TEST'
        }
      };

      const res = validateStrategy(strategy);
      // 3 errors: in contract, chainId, tokenIds
      expect(res.details).toHaveLength(3);
      expect(res.valid).toBeFalsy();
    });
  });

  describe('ERC721NotOwnerOfSchema', () => {
    it('should be valid if the strategy is correct', () => {
      const strategy : Strategy<ERC721NotOwnerOf> = {
        name: 'erc-721-not-owner-of',
        params: {
          contract: '0x135935c83aCF4E0C1Aa0BD948DC710eC76b478b0',
          chainId: '1',
          tokenIds: ['1'],
          logo: 'https://arianee.net/idk.png',
          name: 'test',
          symbol: 'TEST'
        }
      };

      const res = validateStrategy(strategy);
      expect(res.valid).toBeTruthy();
    });

    it('should not be valid if the strategy is incorrect', () => {
      const strategy : Strategy<ERC721NotOwnerOf> = {
        name: 'erc-721-not-owner-of',
        params: {
          contract: 'INVALID ETH ADDRESS',
          chainId: 1 as any,
          tokenIds: [1 as any],
          logo: 'https://arianee.net/idk.png',
          name: 'test',
          symbol: 'TEST'
        }
      };

      const res = validateStrategy(strategy);
      // 3 errors: in contract, chainId, tokenIds
      expect(res.details).toHaveLength(3);
      expect(res.valid).toBeFalsy();
    });
  });

  describe('ERC1155BalanceOfBatchSchema', () => {
    it('should be valid if the strategy is correct', () => {
      const strategy : Strategy<ERC1155BalanceOfBatch> = {
        name: 'erc-1155-balance-of-batch',
        params: {
          chainId: '1',
          address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          logo: 'https://arianee.net/aria20.png',
          name: 'Arianee',
          symbol: 'ARIA20',
          minBalances: [
            {
              id: '1',
              amount: '100'
            }
          ]
        }
      };

      const res = validateStrategy(strategy);
      expect(res.valid).toBeTruthy();
    });

    it('should not be valid if the strategy is incorrect', () => {
      const strategy : Strategy<ERC1155BalanceOfBatch> = {
        name: 'erc-1155-balance-of-batch',
        params: {
          chainId: 7 as any,
          address: 'ggggggg',
          logo: 'ht..png',
          name: 'Arianee',
          symbol: 'ARIA20',
          minBalances: [
            {
              id: 1 as any,
              amount: '100'
            }
          ]
        }
      };

      const res = validateStrategy(strategy);
      // 4 errors: in chainId, address, logo and minBalances
      expect(res.details).toHaveLength(4);
      expect(res.valid).toBeFalsy();
    });
  });

  describe('ERC1155BalanceOfSchema', () => {
    it('should be valid if the strategy is correct', () => {
      const strategy : Strategy<ERC1155BalanceOf> = {
        name: 'erc-1155-balance-of-substrategy',
        params: {
          id: '1',
          amount: '2'
        }
      };

      const res = validateStrategy(strategy);
      expect(res.valid).toBeTruthy();
    });

    it('should not be valid if the strategy is incorrect', () => {
      const strategy : Strategy<ERC1155BalanceOf> = {
        name: 'erc-1155-balance-of-substrategy',
        params: {
          id: 1 as any,
          amount: 2 as any
        }
      };

      const res = validateStrategy(strategy);
      // 2 errors: in id and amount
      expect(res.details).toHaveLength(2);
      expect(res.valid).toBeFalsy();
    });
  });

  describe('PoapHolderOfSchema', () => {
    it('should be valid if the strategy is correct', () => {
      const strategy : Strategy<PoapHolderOf> = {
        name: 'poap-holder-of',
        params: {
          eventId: '1',
          logo: 'https://arianee.net/test.png',
          name: 'poap',
          symbol: 'ARIAPOAP'
        }
      };

      const res = validateStrategy(strategy);
      expect(res.valid).toBeTruthy();
    });

    it('should not be valid if the strategy is incorrect', () => {
      const strategy : Strategy<PoapHolderOf> = {
        name: 'poap-holder-of',
        params: {
          eventId: 1 as any,
          logo: 'htgte/st.png',
          name: 'poap',
          symbol: 'ARIAPOAP'
        }
      };

      const res = validateStrategy(strategy);
      // 2 errors: in eventId and logo
      expect(res.details).toHaveLength(2);
      expect(res.valid).toBeFalsy();
    });
  });

  describe('UnlockHasOwnership', () => {
    it('should be valid if the strategy is correct', () => {
      const strategy : Strategy<UnlockHasOwnership> = {
        name: 'unlock-has-membership',
        params: {
          chainId: '1',
          address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          logo: 'https://arianee.net/test.png',
          name: 'lock',
          symbol: 'KEY'
        }
      };

      const res = validateStrategy(strategy);
      expect(res.valid).toBeTruthy();
    });

    it('should not be valid if the strategy is incorrect', () => {
      const strategy : Strategy<UnlockHasOwnership> = {
        name: 'unlock-has-membership',
        params: {
          chainId: 1 as any,
          address: 'tagagaf',
          logo: 'htteentest.png',
          name: 'lock',
          symbol: 'KEY'
        }
      };

      const res = validateStrategy(strategy);
      // 3 errors: in chainId, address and logo
      expect(res.details).toHaveLength(3);
      expect(res.valid).toBeFalsy();
    });
  });

  describe('IsExactAddressesSchema', () => {
    it('should be valid if the strategy is correct', () => {
      const strategy : Strategy<isExactAddresses> = {
        name: 'is-exact-address',
        params: {
          addresses: ['0xdac17f958d2ee523a2206206994597c13d831ec7',
            '0xdac17f958d2ee523a2206206994597c13d831ec7']
        }
      };

      const res = validateStrategy(strategy);
      expect(res.valid).toBeTruthy();
    });

    it('should not be valid if the strategy is incorrect', () => {
      const strategy : Strategy<isExactAddresses> = {
        name: 'is-exact-address',
        params: {
          addresses: ['avabeabh', 'gzgzgz']
        }
      };

      const res = validateStrategy(strategy);
      // 1 error: in addresses
      expect(res.details).toHaveLength(1);
      expect(res.valid).toBeFalsy();
    });
  });
});

describe('validateSubstrategy', () => {
  it('should be valid if the substrategy is valid', () => {
    const substrategy : ERC20BalanceOf = {
      chainId: '1',
      networkId: '1',
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7'
    };
    const res = validateSubstrategy('erc-20-balance-of-substrategy', substrategy);

    expect(res.valid).toBeTruthy();
  });

  it('should not be valid if the substrategy is not valid', () => {
    const substrategy : ERC20BalanceOf = {
      chainId: 1 as any,
      networkId: [4] as any,
      address: 'aaaaaa'
    };
    const res = validateSubstrategy('erc-20-balance-of-substrategy', substrategy);

    expect(res.valid).toBeFalsy();
    expect(res.details).toHaveLength(3);
  });
});
