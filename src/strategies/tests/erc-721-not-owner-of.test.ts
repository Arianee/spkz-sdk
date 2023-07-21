import { Strategy, ERC721OwnerOf } from '../../models/strategy';
import { executeStrategiesWithCache } from '../executeStrategy';
jest.setTimeout(60000);

xdescribe('execute erc-721-not-owner-of strategies with cache', () => {
  it('should not authorize if the user addresses owns all the NFTs', async () => {
    const addressWhoOwnsTheNFTs = '0x5d1e2e92488b9911c08a559ad9e3a8bd0f31b2f4';

    const strategy: Strategy<ERC721OwnerOf> = {
      name: 'erc-721-not-owner-of',
      addresses: [addressWhoOwnsTheNFTs],
      params: {
        contract: '0x56c35dF413b3cd753f85427e55A8dF66A79f1bd7',
        chainId: '80001',
        tokenIds: [
          '92',
          '100'
        ]
      }
    };

    const strategiesReturn = await executeStrategiesWithCache([[strategy]], {
      tokenId: '0',
      chainId: '80001'
    });

    expect(strategiesReturn.strategies[0][0].message).toBe('You own one or more of those NFTs : 92, 100');
    expect(strategiesReturn.strategies[0][0].isAuthorized).toBeFalsy();
  });

  it('should not authorize if the user addresses owns at least one of the NFTs', async () => {
    const addressWhoOwnsTheNFTs = '0x5d1e2e92488b9911c08a559ad9e3a8bd0f31b2f4';

    const strategy: Strategy<ERC721OwnerOf> = {
      name: 'erc-721-not-owner-of',
      addresses: [addressWhoOwnsTheNFTs],
      params: {
        contract: '0x56c35dF413b3cd753f85427e55A8dF66A79f1bd7',
        chainId: '80001',
        tokenIds: [
          '92',
          '2'
        ]
      }
    };

    const strategiesReturn = await executeStrategiesWithCache([[strategy]], {
      tokenId: '0',
      chainId: '80001'
    });

    expect(strategiesReturn.strategies[0][0].message).toBe('You own one or more of those NFTs : 92, 2');
    expect(strategiesReturn.strategies[0][0].isAuthorized).toBeFalsy();
  });

  it('should authorize if the tokenId does not exist', async () => {
    const strategy: Strategy<ERC721OwnerOf> = {
      name: 'erc-721-not-owner-of',
      addresses: ['0x5d1e2e92488b9911c08a559ad9e3a8bd0f31b2f4'],
      params: {
        contract: '0x56c35dF413b3cd753f85427e55A8dF66A79f1bd7',
        chainId: '80001',
        tokenIds: [
          '999999967543219999999999999'
        ]
      }
    };

    const strategiesReturn = await executeStrategiesWithCache([[strategy]], {
      tokenId: '0',
      chainId: '80001'
    });

    expect(strategiesReturn.strategies[0][0].message).toBe('You are not the owner of the NFTs : 999999967543219999999999999');
    expect(strategiesReturn.strategies[0][0].isAuthorized).toBeTruthy();
  });

  it('should authorize if the user addresses owns none of the NFTs', async () => {
    const addressWhoOwnsNoNFT = '0x5d1e2e92488b9911c08a559ad9e3a8bd0f31b2f4';

    const strategy: Strategy<ERC721OwnerOf> = {
      name: 'erc-721-not-owner-of',
      addresses: [addressWhoOwnsNoNFT],
      params: {
        contract: '0x56c35dF413b3cd753f85427e55A8dF66A79f1bd7',
        chainId: '80001',
        tokenIds: [
          '3',
          '5'
        ]
      }
    };

    const strategiesReturn = await executeStrategiesWithCache([[strategy]], {
      tokenId: '0',
      chainId: '80001'
    });

    expect(strategiesReturn.strategies[0][0].message).toBe('You are not the owner of the NFTs : 3, 5');
    expect(strategiesReturn.strategies[0][0].isAuthorized).toBeTruthy();
  });
});
