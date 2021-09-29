import axios from 'axios';
import { createOrRetrieveWallet } from '../../../..';

jest.setTimeout(60000);

describe('room', () => {
  beforeEach(async () => {
    await axios.get('http://localhost:3000/reset');
  });

  test('user should get users if user has right', async (done) => {
    const pkBlockchainWallet1 = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';
    const proxyWallet = createOrRetrieveWallet();

    await proxyWallet.wallets.addWalletFromPrivateKey(pkBlockchainWallet1);

    const users0 = await proxyWallet.room.getSectionUsers({ roomId: '0', sectionId: 'chat' });

    expect(users0).toHaveLength(0);
    await proxyWallet.room.joinSection({
      roomId: '0',
      sectionId: 'chat',
      profile: { avatar: 'myavatar.com' }
    });

    const users1 = await proxyWallet.room.getSectionUsers({ roomId: '0', sectionId: 'chat' });
    expect(users1).toHaveLength(1);
    await proxyWallet.room.joinSection(
      { roomId: '0', sectionId: 'chat', profile: { avatar: 'myavatar.com' } });
    const users2 = await proxyWallet.room.getSectionUsers({ roomId: '0', sectionId: 'chat' });
    expect(users2).toHaveLength(1);
    done();
  });

  test('user can join section and it performs a profile update and user can update ',
    async (done) => {
      const pkBlockchainWallet1 = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';
      const proxyWallet = createOrRetrieveWallet();

      await proxyWallet.wallets.addWalletFromPrivateKey(pkBlockchainWallet1);

      const expectedPayload = {
        roomId: '0',
        sectionId: 'chat',
        profile: { avatar: 'myavatar.com' }
      };
      await proxyWallet.room.joinSection(expectedPayload);

      const users = await proxyWallet.room.getSectionUsers({ roomId: '0', sectionId: 'chat' });
      const { payload } = users[0];
      expect(payload.roomId).toBe(expectedPayload.roomId);
      expect(payload.sectionId).toBe(expectedPayload.sectionId);
      expect(payload.profile).toEqual(expectedPayload.profile);

      const expectedPayload2 = {
        roomId: '0',
        sectionId: 'chat',
        profile: { avatar: 'myavatar.com' }
      };
      await proxyWallet.room.updateProfile(expectedPayload2);
      const users2 = await proxyWallet.room.getSectionUsers({ roomId: '0', sectionId: 'chat' });
      const { payload: payload2 } = users2[0];

      expect(payload2.roomId).toBe(expectedPayload2.roomId);
      expect(payload2.sectionId).toBe(expectedPayload2.sectionId);
      expect(payload2.profile).toEqual(expectedPayload2.profile);
      done();
    });
  describe('send message', () => {
    test('send message', async () => {
      const pkBlockchainWallet1 = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';
      const proxyWallet = createOrRetrieveWallet();

      const expectedMessage = 'an expected message';
      await proxyWallet.wallets.addWalletFromPrivateKey(pkBlockchainWallet1);
      await proxyWallet.room.sendMessage({ roomId: '0', messageContent: expectedMessage, sectionId: 'chat' });

      const messages = await proxyWallet.room.getMessages({ roomId: '0', sectionId: 'chat' });

      expect(messages).toHaveLength(1);
      expect(messages[0].payload.content).toBe(expectedMessage);
    });
  });
});
