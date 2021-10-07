import { RightService } from './rightService';
import { FetchRoomService } from '../fetchRoomService/fetchRoomService';
import { NFTROOM } from '../../../../models/NFTROOM';
import { container } from 'tsyringe';
import { utils } from '../../index';

describe('rightService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    container.clearInstances();
    container.reset();
  });

  describe('canReadSection', () => {
    test('', async () => {
      const fetchRoomMock = jest.fn();

      const setFetchRoomMock = (room) => {
        fetchRoomMock.mockImplementation(() => Promise.resolve(room));
      };
      const mockFetchRoom = {
        async fetchRoom (roomId: string): Promise<NFTROOM> {
          return fetchRoomMock();
        }
      } as FetchRoomService;
      const b = new RightService(mockFetchRoom);

      setFetchRoomMock('zefzef');
    });
  });

  describe('verifyPayloadSignatures', function () {
    const pk = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';

    const authorizations = [
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJFVEgifQ==.eyJpc3MiOiIweDE0NjJCMzk3YmY4ODQ1ZjY0NDhhNkMwZTZGNTIxZWQyNDU4RjY4RDAiLCJleHAiOjg2NTYzMjEyOTI2NTY3Nywic3ViIjoiMHg4RjJBM0U0QkQxYzIxNTgwYjRhMjJlNkE5MWVkNjUwQTUwNTAzQzQ1In0=.0xc1a4b44cec4a37df21b82642b829c64c68ab44c234191959882a186e844aa9d714b230b2ac6ddfc5b7d94861dd3a6052ab80c3560a92d59148c689c177e3b9091c'
    ];

    describe('global signature of payload', () => {
      test('should return true if authorizations pub key correponds to global signing pub key', async () => {
        // keep for test => const privateKeyProxyWallet = '0x800202974a03b5ae2c3676566c475bce1a88ff6b5d6338594347e6d7622bf057';
        const addressProxyWallet = '0xb4c96BB2b56f392A897182dd2970599BE10200A3';

        const blockchainWalletAuthorizingAddress = [
          '0x2da33e874962b8a499089a0eccfc66a703a576aa', // pk: 0x871331b035f3b5bf8bccd9c223754f3f14999117014d7d0ff7b094b42eaf5d84
          '0x81aee1da2f6a8593d9df6f5dd43a3fa0fb73fb23' // pk: 0x960a6657d50a9bceff1ff2e6eafca709b98c97627bee6818ca6c00969ac4afc7
        ];

        const blockchainWalletsAuthorizations = [
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJFVEgifQ==.eyJpc3MiOiIweDJkYTMzZTg3NDk2MmI4YTQ5OTA4OWEwZWNjZmM2NmE3MDNhNTc2YWEiLCJleHAiOjMzMTY4ODQzNjIzNzM1LCJzdWIiOiIweGI0Yzk2YmIyYjU2ZjM5MmE4OTcxODJkZDI5NzA1OTliZTEwMjAwYTMifQ==.0x1b6f89c29f9a00bc88ac1be8aff774de0e6b131f4d4653e31a79b79cdd2c24207fd2fd67cd7d76c741ab1642e6a0783d578130898a1ea90599e82d99db3be28c1c',
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJFVEgifQ==.eyJpc3MiOiIweDgxYWVlMWRhMmY2YTg1OTNkOWRmNmY1ZGQ0M2EzZmEwZmI3M2ZiMjMiLCJleHAiOjMzMTY4ODQzNjIzNzY4LCJzdWIiOiIweGI0Yzk2YmIyYjU2ZjM5MmE4OTcxODJkZDI5NzA1OTliZTEwMjAwYTMifQ==.0x4b6552a886d5a495e055bb59eabeae034b912ea1c47bc7bed130e067ca6fa83849e523df37c90664c954ebe296c64e720db22a1664f8619d8e7ca1a9d168463a1c'
        ];

        const { isAuthorized, blockchainWallets, proxyWalletAddress } = RightService.extractBlockchainWalletAddressWhoAuthorizedProxyWallet(blockchainWalletsAuthorizations,
          addressProxyWallet);

        expect(isAuthorized).toBeTruthy();

        expect(blockchainWallets).toEqual(blockchainWalletAuthorizingAddress);
        expect(proxyWalletAddress).toBe(addressProxyWallet);
      });
      test('should return blockchainWallets empty array if authorizations pub key does not correpond to global signing pub key', async () => {
        // signature of c14d9819e7fbb7009a7dac292f15c564cca846fe1e5983065425ea9338ca4326
        const params = {
          authorizations: [
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJFVEgifQ==.eyJpc3MiOiIweDE0NjJCMzk3YmY4ODQ1ZjY0NDhhNkMwZTZGNTIxZWQyNDU4RjY4RDAiLCJleHAiOjg2NTYzMjEyOTI2NTY3Nywic3ViIjoiMHg4RjJBM0U0QkQxYzIxNTgwYjRhMjJlNkE5MWVkNjUwQTUwNTAzQzQ1In0=.0xc1a4b44cec4a37df21b82642b829c64c68ab44c234191959882a186e844aa9d714b230b2ac6ddfc5b7d94861dd3a6052ab80c3560a92d59148c689c177e3b9091c'
          ],
          room: { title: 'my title', description: 'my description' },
          signature: '0x56bb793abad42d72134b88778e6b82dad98f1b6a0dd94aae045a60321eecb22a4ef971bbb134da69ae45684eb9bc964fc845c64e0a2f2cc262f4d01563ff9a011b'
        };

        const e = await RightService.verifyPayloadSignatures(params);

        expect(e).toEqual(
          {
            blockchainWallets: [],
            isAuthorized: false,
            proxyWalletAddress: '0x931e35f78f7948dff3ea7d3bf45cb294f53c93cd'
          });
      });
    });
  });
  describe('can join section', () => {
    const room0 = {
      $schema: 'https://cert.arianee.org/version1/ArianeeAsset.json',
      endpoint: 'http://localhost:3000/spkz/rpc',
      notificationEndpoint: 'ws://localhost:3001',
      name: 'ARIA20 Backroom',
      description: 'Welcome to the ARIA20 Backroom, a space exclusively reserved for holders of the ARIA20 token.',
      external_url: 'https://beta.spkz.io/room/8200974',
      image: 'https://firebasestorage.googleapis.com/v0/b/speakez-front.appspot.com/o/8d26efad-9721-46c5-a4b3-04ba735cac29?alt=media&token=4263d07b-68eb-48e9-b581-23025d470a68',
      logo: 'https://firebasestorage.googleapis.com/v0/b/speakez-front.appspot.com/o/42925e27-8003-4892-bec8-42f001b6475d?alt=media&token=3cc2d782-4dc1-430a-883a-048cc99ea7dc',
      strategies: [
        []
      ],
      sections: [
        {
          title: 'Chat',
          id: 'chat'
        },
        {
          title: 'VIP Room',
          id: 'viproom',
          strategiesRead: []
        },
        {
          title: 'Announcement',
          id: 'annoucement',
          strategiesWrite: [],
          writeStrategies: [
            [
              {
                name: 'erc-721-balance-of',
                logo: 'https://lh3.googleusercontent.com/6FualWHu5EplmvGViY2U0qhQqZDqKe1fun8NOxgIpthLmD2dJ_y0EpS1IGg-lxMZbqdeozsH80rAD0uRrC3kjgkDCZcfZyu_kyaWnA=s130',
                params: {
                  minBalance: '2',
                  tokens: [
                    {
                      chainId: '137',
                      networkId: '1',
                      address: '0x76c52b2c4b2d2666663ce3318a5f35f912bd25c3'
                    }
                  ]
                }
              }
            ]
          ]
        },
        {
          title: 'VIP Room! (min 2 MaticPunks)',
          id: 'veryviproom',
          readStrategies: [
            [
              {
                name: 'erc-721-balance-of',
                params: {
                  minBalance: '2',
                  logo: 'https://lh3.googleusercontent.com/6FualWHu5EplmvGViY2U0qhQqZDqKe1fun8NOxgIpthLmD2dJ_y0EpS1IGg-lxMZbqdeozsH80rAD0uRrC3kjgkDCZcfZyu_kyaWnA=s130',
                  tokens: [
                    {
                      chainId: '137',
                      networkId: '1',
                      address: '0x76c52b2c4b2d2666663ce3318a5f35f912bd25c3'
                    }
                  ]
                }
              }
            ]
          ],
          writeStrategies: [
            [
              {
                name: 'erc-721-balance-of',
                logo: 'https://lh3.googleusercontent.com/6FualWHu5EplmvGViY2U0qhQqZDqKe1fun8NOxgIpthLmD2dJ_y0EpS1IGg-lxMZbqdeozsH80rAD0uRrC3kjgkDCZcfZyu_kyaWnA=s130',
                params: {
                  minBalance: '2',
                  tokens: [
                    {
                      chainId: '137',
                      networkId: '1',
                      address: '0x76c52b2c4b2d2666663ce3318a5f35f912bd25c3'
                    }
                  ]
                }
              }
            ]
          ]
        }
      ]
    };

    const room2 = {
      endpoint: 'https://dev.node0.spkz.io/spkz/rpc',
      notificationEndpoint: 'wss://dev.node0-ws.spkz.io',
      name: 'MaticPunks',
      description: 'Welcome to the MaticPunks, a space exclusively reserved for holders of MaticPunks NFTs.',
      external_url: 'https://dev.spkz.io/app/lounges/5',
      image: 'https://lh3.googleusercontent.com/6FualWHu5EplmvGViY2U0qhQqZDqKe1fun8NOxgIpthLmD2dJ_y0EpS1IGg-lxMZbqdeozsH80rAD0uRrC3kjgkDCZcfZyu_kyaWnA=s130',
      logo: 'https://lh3.googleusercontent.com/6FualWHu5EplmvGViY2U0qhQqZDqKe1fun8NOxgIpthLmD2dJ_y0EpS1IGg-lxMZbqdeozsH80rAD0uRrC3kjgkDCZcfZyu_kyaWnA=s130',
      strategies: [[{
        name: 'erc-721-balance-of',
        params: {
          minBalance: '1',
          logo: 'https://lh3.googleusercontent.com/6FualWHu5EplmvGViY2U0qhQqZDqKe1fun8NOxgIpthLmD2dJ_y0EpS1IGg-lxMZbqdeozsH80rAD0uRrC3kjgkDCZcfZyu_kyaWnA=s130',
          tokens: [{ chainId: '137', networkId: '1', address: '0x76c52b2c4b2d2666663ce3318a5f35f912bd25c3' }]
        }
      }]],
      sections: [{
        title: 'Announcement',
        id: 'announcement',
        writeStrategies: [[{ name: 'room-owner', params: { chainId: '80001', networkId: '1' } }]]
      }, { title: 'Chat', id: 'chat' }, {
        title: 'VIP Room (min 2 MaticPunks)',
        id: 'viproom',
        readStrategies: [[{
          name: 'erc-721-balance-of',
          params: {
            minBalance: '2',
            logo: 'https://lh3.googleusercontent.com/6FualWHu5EplmvGViY2U0qhQqZDqKe1fun8NOxgIpthLmD2dJ_y0EpS1IGg-lxMZbqdeozsH80rAD0uRrC3kjgkDCZcfZyu_kyaWnA=s130',
            tokens: [{ chainId: '137', networkId: '1', address: '0x76c52b2c4b2d2666663ce3318a5f35f912bd25c3' }]
          }
        }]],
        writeStrategies: [[{
          name: 'erc-721-balance-of',
          logo: 'https://lh3.googleusercontent.com/6FualWHu5EplmvGViY2U0qhQqZDqKe1fun8NOxgIpthLmD2dJ_y0EpS1IGg-lxMZbqdeozsH80rAD0uRrC3kjgkDCZcfZyu_kyaWnA=s130',
          params: {
            minBalance: '2',
            tokens: [{ chainId: '137', networkId: '1', address: '0x76c52b2c4b2d2666663ce3318a5f35f912bd25c3' }]
          }
        }]]
      }]
    };

    beforeEach(() => {
      jest.resetAllMocks();
      container.clearInstances();
      container.reset();
      utils.fetchRoomService.addToCache('0', room0);
      utils.fetchRoomService.addToCache('2', room2);
    });

    test('should return global (false) read (false) and write (false) if address has no rights', async () => {
      utils.fetchRoomService.addToCache('0', room0);
      const r = await utils.rightService.canJoinSection({
        address: '0x2bc0b60C58AC96CfF37E9A168d0963157bdb6efB',
        roomId: '0',
        sectionId: 'veryviproom'
      });

      expect(r.isAuthorized).toBeFalsy();
      expect(r.read.isAuthorized).toBeFalsy();
      expect(r.write.isAuthorized).toBeFalsy();
    });
    test('should return global (true) read (true) and write (false) if address has only read rights', async () => {
      const r3 = await utils.rightService.canJoinSection({
        address: '0x2bc0b60C58AC96CfF37E9A168d0963157bdb6efB',
        roomId: '0',
        sectionId: 'annoucement'
      });

      expect(r3.isAuthorized).toBeTruthy();
      expect(r3.read.isAuthorized).toBeTruthy();
      expect(r3.write.isAuthorized).toBeFalsy();
    });
    test('should return global (true) read (true) and write (true) if address has all rights', async () => {
      const r2 = await utils.rightService.canJoinSection({
        address: '0x2bc0b60C58AC96CfF37E9A168d0963157bdb6efB',
        roomId: '0',
        sectionId: 'chat'
      });

      expect(r2.isAuthorized).toBeTruthy();
      expect(r2.read.isAuthorized).toBeTruthy();
      expect(r2.write.isAuthorized).toBeTruthy();
    });
  });
  describe('fullRoomStrategies', () => {
    ['2', '3', '4', '5', '6'].map(roomId => {
      test(`it should work without address for room Id ${roomId}`, async (done) => {
        await await utils.rightService.fullRoomStrategies({ roomId });
        expect(true).toBeTruthy();
        done();
      });
      test(`it should work with address for room Id ${roomId}`, async (done) => {
        await await utils.rightService.fullRoomStrategies({
          roomId,
          address: '0x7ab5Dd29BEe82041C998Fc5091a6711a8eDAc0D6'
        });
        done();
      });
    });
  });
});
