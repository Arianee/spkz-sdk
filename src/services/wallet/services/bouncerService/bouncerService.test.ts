import axios from 'axios';
import { createOrRetrieveWallet } from '../../../..';

describe('bouncer service', () => {
  beforeEach(async () => {
    await axios.get('http://localhost:3000/reset');
  });
  describe('favorite room', () => {
    test('get favorite room from bouncer', async () => {
      const pkBlockchainWallet1 = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';
      const proxyWallet = createOrRetrieveWallet();
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
      const proxyWallet = createOrRetrieveWallet();
      await proxyWallet.wallets.addWalletFromPrivateKey(pkBlockchainWallet1);
      const myProfile0 = await proxyWallet.bouncer.getMyProfile();
      expect(myProfile0).toBeNull();
      await proxyWallet.bouncer.updateMyProfile({ avatar: 'myavatar.com' });
      const myProfile1 = await proxyWallet.bouncer.getMyProfile();
      expect(myProfile1).toBeDefined();
    });
  });
});
