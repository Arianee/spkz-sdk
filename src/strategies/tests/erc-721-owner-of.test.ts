import { Strategy, ERC721OwnerOf } from '../../models/strategy';
import { executeStrategiesWithCache } from '../executeStrategy';
jest.setTimeout(60000);

describe('execute erc-721-owner-of strategies with cache', () => {
  it('should authorize if one of the user addresses owns all the required NFTs', async () => {
    const addressWhoOwnsTheNFTs = '0x5d1e2e92488b9911c08a559ad9e3a8bd0f31b2f4';
    const noiseAddress = '0xCEEaae8e851e7f7EBdCF73efcac85cEf892b0832';

    const strategy: Strategy<ERC721OwnerOf> = {
      name: 'erc-721-owner-of',
      addresses: [noiseAddress, addressWhoOwnsTheNFTs],
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

    expect(strategiesReturn.strategies[0][0].message).toBe('You are the owner of one or more of the NFTs : 92, 100');
    expect(strategiesReturn.strategies[0][0].isAuthorized).toBeTruthy();
  });

  it('should authorize if one of the user addresses owns one required NFT and another user address own another required NFT', async () => {
    const addressWhoOwnsTheFirstNFT = '0x5d1e2e92488b9911c08a559ad9e3a8bd0f31b2f4'; // Id 92
    const addressWhoOwnsTheSecondNFT = '0x2bc0b60c58ac96cff37e9a168d0963157bdb6efb'; // Id 61

    const strategy: Strategy<ERC721OwnerOf> = {
      name: 'erc-721-owner-of',
      addresses: [addressWhoOwnsTheFirstNFT, addressWhoOwnsTheSecondNFT],
      params: {
        contract: '0x56c35dF413b3cd753f85427e55A8dF66A79f1bd7',
        chainId: '80001',
        tokenIds: [
          '92',
          '61'
        ]
      }
    };

    const strategiesReturn = await executeStrategiesWithCache([[strategy]], {
      tokenId: '0',
      chainId: '80001'
    });

    expect(strategiesReturn.strategies[0][0].message).toBe('You are the owner of one or more of the NFTs : 92, 61');
    expect(strategiesReturn.strategies[0][0].isAuthorized).toBeTruthy();
  });

  it('should authorize if the user addresses own one or more of the required NFTs', async () => {
    const addressWhoOwnsTheFirstNFT = '0x5d1e2e92488b9911c08a559ad9e3a8bd0f31b2f4'; // Id 92
    const addressWhoOwnsTheSecondNFT = '0x2bc0b60c58ac96cff37e9a168d0963157bdb6efb'; // Id 61

    const strategy: Strategy<ERC721OwnerOf> = {
      name: 'erc-721-owner-of',
      addresses: [addressWhoOwnsTheFirstNFT, addressWhoOwnsTheSecondNFT],
      params: {
        contract: '0x56c35dF413b3cd753f85427e55A8dF66A79f1bd7',
        chainId: '80001',
        tokenIds: [
          '92',
          '61',
          '2', // Not owned
          '8' // Not owned
        ]
      }
    };

    const strategiesReturn = await executeStrategiesWithCache([[strategy]], {
      tokenId: '0',
      chainId: '80001'
    });

    expect(strategiesReturn.strategies[0][0].message).toBe('You are the owner of one or more of the NFTs : 92, 61, 2, 8');
    expect(strategiesReturn.strategies[0][0].isAuthorized).toBeTruthy();
  });

  it('should not authorize if the user addresses does not own any of the required NFTs', async () => {
    const addresOne = '0x5d1e2e92488b9911c08a559ad9e3a8bd0f31b2f4'; // Id 92
    const addressTwo = '0x2bc0b60c58ac96cff37e9a168d0963157bdb6efb'; // Id 61

    const strategy: Strategy<ERC721OwnerOf> = {
      name: 'erc-721-owner-of',
      addresses: [addresOne, addressTwo],
      params: {
        contract: '0x56c35dF413b3cd753f85427e55A8dF66A79f1bd7',
        chainId: '80001',
        tokenIds: [
          '2', // not owned
          '8' // not owned
        ]
      }
    };

    const strategiesReturn = await executeStrategiesWithCache([[strategy]], {
      tokenId: '0',
      chainId: '80001'
    });

    expect(strategiesReturn.strategies[0][0].message).toBe('You do not own at least one of those NFTs : 2, 8');
    expect(strategiesReturn.strategies[0][0].isAuthorized).toBeFalsy();
  });
});
