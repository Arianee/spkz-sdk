import axios from 'axios';
import { createOrRetrieveWallet } from '../../../..';
import { FetchRoomService } from '../../../utils/services/fetchRoomService/fetchRoomService';
import { NFTROOM } from '../../../../models/NFTROOM';

describe('room', () => {
  beforeEach(async () => {
    await axios.get('http://localhost:3000/reset');
  });
  test('user should get users if user has right', async () => {
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
  });
});
