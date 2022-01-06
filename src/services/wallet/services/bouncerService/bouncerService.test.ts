import axios from 'axios';
import { createOrRetrieveWallet, SPKZ } from '../../../..';

describe('bouncer service', () => {
  let proxyWallet:SPKZ;
  beforeEach(() => {
    proxyWallet = createOrRetrieveWallet();
  });
  describe('[dev env] featured and recommended room', () => {
    test('fetch featured rooms', async () => {
      proxyWallet.environmentService.swithEnv('dev');
      const d = await proxyWallet.bouncer.getFeaturedRooms();

      expect(d).toBeDefined();
      expect(d.length > 0).toBeTruthy();
    });

    test('fetch recommended rooms', async () => {
      proxyWallet.environmentService.swithEnv('dev');

      const d = await proxyWallet.bouncer.getRecommendedRooms();

      expect(d).toBeDefined();
      expect(d.length > 0).toBeTruthy();
    });
  });
  describe('RPC calls', () => {
    beforeEach(async () => {
      await axios.get('http://localhost:3000/reset');
    });
    describe('favorite room', () => {
      test('get favorite room from bouncer', async () => {
        const pkBlockchainWallet1 = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';
        await proxyWallet.wallets.addWalletFromPrivateKey(pkBlockchainWallet1);
        const room0 = await proxyWallet.bouncer.getUserRooms();
        expect(room0).toHaveLength(0);
        await proxyWallet.bouncer.joinRoom({ roomId: 0 });
        const room1 = await proxyWallet.bouncer.getUserRooms();
        expect(room1).toHaveLength(1);
      });
    });

    describe('user profile', () => {
      test('get profile and update', async () => {
        const pkBlockchainWallet1 = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';
        await proxyWallet.wallets.addWalletFromPrivateKey(pkBlockchainWallet1);

        const expectedProfile1 = {
          biography: 'labiography',
          ens: {
            name: 'lename',
            tokenId: '3'
          },
          avatar: {
            tokenId: '2',
            name: 'lename',
            contract: {
              address: '0xfaff15c6cdaca61a4f87d329689293e07c98f578',
              chainId: '1',
              networkId: '1',
              schemaName: 'ERC721'
            },
            picture: {
              originalUrl: 'ipfs://mchin/truc/2',
              previewUrl: 'https://machin.org/token/2'
            },
            metadataUri: 'https://medatauri'
          }
        };
        const myProfile0 = await proxyWallet.bouncer.getMyProfile();
        expect(myProfile0).toMatchObject({});
        await proxyWallet.bouncer.updateMyProfile({
          biography: 'labiography',
          ens: {
            name: 'lename',
            tokenId: '3'
          },
          avatar: {
            tokenId: '2',
            name: 'lename',
            contract: {
              address: '0xfaff15c6cdaca61a4f87d329689293e07c98f578',
              chainId: '1',
              networkId: '1',
              schemaName: 'ERC721'
            },
            picture: {
              originalUrl: 'ipfs://mchin/truc/2',
              previewUrl: 'https://machin.org/token/2'
            },
            metadataUri: 'https://medatauri'
          }
        });
        const myProfile1 = await proxyWallet.bouncer.getMyProfile();
        expect(myProfile1).toBeDefined();
      });
    });
  });
});
