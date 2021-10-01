import { getStrategyHelperFactory } from './getStrategyHelper.helper';
import { NFTROOM } from '../../models/NFTROOM';

describe('startegies finder helper', () => {
  const mockNFTROOM:NFTROOM = {
    $schema: 'https://cert.arianee.org/version1/ArianeeAsset.json',
    endpoint: 'https://node1.speakez.arianee.org/rpc',
    name: 'ARIA20 Backroom',
    description: 'Welcome to the ARIA20 Backroom, a space exclusively reserved for holders of the ARIA20 token.',
    external_url: 'https://beta.spkz.io/room/8200974',
    image: 'https://firebasestorage.googleapis.com/v0/b/speakez-front.appspot.com/o/8d26efad-9721-46c5-a4b3-04ba735cac29?alt=media&token=4263d07b-68eb-48e9-b581-23025d470a68',
    logo: 'https://firebasestorage.googleapis.com/v0/b/speakez-front.appspot.com/o/42925e27-8003-4892-bec8-42f001b6475d?alt=media&token=3cc2d782-4dc1-430a-883a-048cc99ea7dc',
    strategies: [
      [
        {
          chainId: '137',
          name: 'erc-20-balance-of',
          params: {
            minBalance: '1000000000000000000',
            address: '0x46F48FbdedAa6F5500993BEDE9539ef85F4BeE8e'
          }
        }
      ],
      [
        {
          chainId: '1',
          name: 'erc-20-balance-of',
          params: {
            minBalance: '1000000000000000000',
            address: '0xedf6568618a00c6f0908bf7758a16f76b6e04af9'
          }
        }
      ],
      [
        {
          chainId: '99',
          name: 'erc-20-balance-of',
          params: {
            minBalance: '1000000000000000000',
            address: '0x55d536e4d6c1993d8ef2e2a4ef77f02088419420'
          }
        }
      ]
    ],
    sections: [
      {
        title: 'Chat',
        id: 'chat'
      },
      {
        title: 'VIP Room',
        id: 'viproom',
        writeStrategies: [[
          {
            chainId: '137',
            name: 'erc-20-balance-of',
            params: {
              minBalance: '1000000000000000000',
              address: '0x46F48FbdedAa6F5500993BEDE9539ef85F4BeE8e'
            }
          }
        ]
        ],
        readStrategies: [[
          {
            chainId: '99',
            name: 'erc-20-balance-of',
            params: {
              minBalance: '1000000000000000000',
              address: '0x55d536e4d6c1993d8ef2e2a4ef77f02088419420'
            }
          }
        ]]
      },
      {
        title: 'Announcement',
        id: 'annoucement'

      }
    ]
  };

  describe('getRoomStrategy', () => {
    test(' it should return main strategies if there is', () => {
      const strategyHelper = getStrategyHelperFactory(mockNFTROOM);
      expect(strategyHelper.getRoomStrategies()).toEqual(mockNFTROOM.strategies);
    });
    test(' it should return empty strategies if there is not', () => {
      const strategyHelper = getStrategyHelperFactory({} as any);
      expect(strategyHelper.getRoomStrategies()).toEqual([[]]);
    });
  });

  describe(' read write strategies', () => {
    const strategyHelper = getStrategyHelperFactory(mockNFTROOM);

    test('it should return read strategies if there is', () => {
      const expectedReadStrategy = [[
        {
          chainId: '99',
          name: 'erc-20-balance-of',
          params: {
            minBalance: '1000000000000000000',
            address: '0x55d536e4d6c1993d8ef2e2a4ef77f02088419420'
          }
        }
      ]];

      expect(strategyHelper.getSectionReadStrategies('viproom')).toEqual(expectedReadStrategy);
    });

    test('it should return write strategies if there is', () => {
      const expectedWriteStrategy = [[
        {
          chainId: '137',
          name: 'erc-20-balance-of',
          params: {
            minBalance: '1000000000000000000',
            address: '0x46F48FbdedAa6F5500993BEDE9539ef85F4BeE8e'
          }
        }
      ]];
      expect(strategyHelper.getSectionWriteStrategies('viproom')).toEqual(expectedWriteStrategy);
    });

    test('it should return main strategies if there is not', () => {
      expect(strategyHelper.getSectionReadStrategies('annoucement')).toEqual(mockNFTROOM.strategies);
      expect(strategyHelper.getSectionWriteStrategies('annoucement')).toEqual(mockNFTROOM.strategies);
    });
  });

  describe('replace address with address of caller', () => {
    test('it should return write strategies if there is with addres', () => {
      const strategyHelper = getStrategyHelperFactory(mockNFTROOM,
        ['0x3f6F937912AeCb1E966514AAeE0D26F09E163976']);

      const expectedWriteStrategy = [[
        {
          chainId: '137',
          name: 'erc-20-balance-of',
          addresses: ['0x3f6F937912AeCb1E966514AAeE0D26F09E163976'],
          params: {
            minBalance: '1000000000000000000',
            address: '0x46F48FbdedAa6F5500993BEDE9539ef85F4BeE8e'
          }
        }
      ]];
      expect(strategyHelper.getSectionWriteStrategies('viproom')).toEqual(expectedWriteStrategy);
    });
  });
});
