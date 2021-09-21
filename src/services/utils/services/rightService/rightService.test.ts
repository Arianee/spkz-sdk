import { RightService } from './rightService';
import { FetchRoomService } from '../fetchRoomService/fetchRoomService';
import { NFTROOM } from '../../../../models/NFTROOM';
import { ProxyWalletService } from '../../../wallet/services/proxyWalletService/proxyWalletService';
import { createOrRetrieveWallet } from '../../../walletBrowserCreator/walletCreator';
import { JWTDecoder } from '../../../../helpers/JWTGeneric/signerAndDecoderFromPrivateKey';

describe('rightService', () => {
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
          '0x1462B397bf8845f6448a6C0e6F521ed2458F68D0',
          '0xe5551fad2300Cc16F5A7558487d39284011D53f0'
        ];

        const blockchainWalletsAuthorizations = [
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJFVEgifQ==.eyJpc3MiOiIweDE0NjJCMzk3YmY4ODQ1ZjY0NDhhNkMwZTZGNTIxZWQyNDU4RjY4RDAiLCJleHAiOjE2MzI4MzU1NTIyOTIsInN1YiI6IjB4YjRjOTZCQjJiNTZmMzkyQTg5NzE4MmRkMjk3MDU5OUJFMTAyMDBBMyJ9.0xfecfee448831d5371392fb180ae025cde21c6793ece6587231bcde8f190dfd2476cd7f33fc8ec3556f7e9591e47654d7b2a92a2cc5eadf57f1bcace87f503d381c',
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJFVEgifQ==.eyJpc3MiOiIweGU1NTUxZmFkMjMwMENjMTZGNUE3NTU4NDg3ZDM5Mjg0MDExRDUzZjAiLCJleHAiOjE2MzI4MzU1NTM3OTgsInN1YiI6IjB4YjRjOTZCQjJiNTZmMzkyQTg5NzE4MmRkMjk3MDU5OUJFMTAyMDBBMyJ9.0xc38fffda46de7e123d051b46f3db6a6593781a969faca14dc7531a4449f6463a337c70c8cf022f7ca4619c857bdac49afb7f05adfcb286f37f96e74744e46a1b1b'
        ];

        const { isAuthorized, blockchainWallets, proxyWalletAddress } = await RightService.extractBlockchainWalletAddressWhoAuthorizedProxyWallet(blockchainWalletsAuthorizations,
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
            proxyWalletAddress: '0x931E35f78f7948Dff3Ea7d3bf45CB294F53c93Cd'
          });
      });
    });
  });
});
