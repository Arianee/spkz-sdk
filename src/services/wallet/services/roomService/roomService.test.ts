import { createOrRetrieveWallet, SPKZ } from '../../../..';
import axios from 'axios';

jest.setTimeout(60000);

describe('room', () => {
  let proxyWallet: SPKZ;

  beforeEach(async () => {
    await axios.get('http://localhost:3000/reset');
    proxyWallet = createOrRetrieveWallet();
  });

  test('user should get users if user has right', async (done) => {
    const pkBlockchainWallet1 = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';

    await proxyWallet.wallets.addWalletFromPrivateKey(pkBlockchainWallet1);

    const users0 = await proxyWallet.room.getSectionUsers({
      roomId: '0',
      sectionId: 'chat'
    });

    expect(users0).toHaveLength(0);
    await proxyWallet.room.joinSection({
      roomId: '0',
      sectionId: 'chat',
      profile: {
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
      }
    });

    const users1 = await proxyWallet.room.getSectionUsers({
      roomId: '0',
      sectionId: 'chat'
    });
    expect(users1).toHaveLength(1);
    await proxyWallet.room.joinSection(
      {
        roomId: '0',
        sectionId: 'chat',
        profile: {
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
        }
      });
    const users2 = await proxyWallet.room.getSectionUsers({
      roomId: '0',
      sectionId: 'chat'
    });
    expect(users2).toHaveLength(1);
    done();
  });

  test('user can join section and it performs a profile update and user can update ',
    async (done) => {
      const pkBlockchainWallet1 = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';

      await proxyWallet.wallets.addWalletFromPrivateKey(pkBlockchainWallet1);

      const expectedPayload = {
        roomId: '0',
        sectionId: 'chat',
        profile: {
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
        }
      };
      await proxyWallet.room.joinSection(expectedPayload);

      const users = await proxyWallet.room.getSectionUsers({
        roomId: '0',
        sectionId: 'chat'
      });
      const { payload } = users[0];
      expect(payload.roomId).toBe(expectedPayload.roomId);
      expect(payload.sectionId).toBe(expectedPayload.sectionId);
      expect(payload.profile).toEqual(expectedPayload.profile);

      const expectedPayload2 = {
        roomId: '0',
        sectionId: 'chat',
        profile: {
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
        }
      };
      await proxyWallet.room.updateProfile(expectedPayload2);
      const users2 = await proxyWallet.room.getSectionUsers({
        roomId: '0',
        sectionId: 'chat'
      });
      const { payload: payload2 } = users2[0];

      expect(payload2.roomId).toBe(expectedPayload2.roomId);
      expect(payload2.sectionId).toBe(expectedPayload2.sectionId);
      expect(payload2.profile).toEqual(expectedPayload2.profile);
      done();
    });

  test('user can update last viewed', async (done) => {
    const pkBlockchainWallet1 = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';

    await proxyWallet.wallets.addWalletFromPrivateKey(pkBlockchainWallet1);
    const payload = {
      roomId: '0',
      sectionId: 'chat'
    };
    await proxyWallet.room.updateLastViewed(payload);
    done();
  });
  describe('send message', () => {
    test('send message', async () => {
      const pkBlockchainWallet1 = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';

      const expectedMessage = 'an expected message';
      await proxyWallet.wallets.addWalletFromPrivateKey(pkBlockchainWallet1);
      await proxyWallet.room.sendMessage({
        roomId: '0',
        messageContent: expectedMessage,
        sectionId: 'chat'
      });

      const messages = await proxyWallet.room.getMessages({
        roomId: '0',
        sectionId: 'chat'
      });

      expect(messages.messages).toHaveLength(1);
      expect(messages.messages[0].payload.content).toBe(expectedMessage);
    });
  });

  describe('dry', () => {
    test('dry join section', async () => {
      const pkBlockchainWallet1 = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';
      await proxyWallet.wallets.addWalletFromPrivateKey(pkBlockchainWallet1);
      const users1 = await proxyWallet.room.getSectionUsers({
        roomId: '0',
        sectionId: 'chat'
      });

      expect(users1).toHaveLength(0);

      await proxyWallet.room.joinSection({
        roomId: '0',
        sectionId: 'chat',
        profile: {},
        dry: true
      });

      const users2 = await proxyWallet.room.getSectionUsers({
        roomId: '0',
        sectionId: 'chat'
      });

      expect(users2).toHaveLength(0);
      await proxyWallet.room.joinSection({
        roomId: '0',
        sectionId: 'chat',
        profile: {},
        dry: false
      });

      const users3 = await proxyWallet.room.getSectionUsers({
        roomId: '0',
        sectionId: 'chat'
      });

      expect(users3).toHaveLength(1);
    });
  });
  describe('error', () => {
    test('get message error should return value of error', async () => {
      const pkBlockchainWallet1 = '0x68b2e8504d8f65010750e3c1af10743d9f42a4da4fa3819fdaa0b4ffb29842ad';
      const addressBlockchainWallet1 = '0xa226D0C579CD0ffb3Dc85cfA9A07D534d9301fD8';

      const expectedMessage = 'an expected message';
      await proxyWallet.wallets.addWalletFromPrivateKey(pkBlockchainWallet1);
      let inError = false;
      try {
        const messages = await proxyWallet
          .room
          .getMessages({
            roomId: '2',
            sectionId: 'chat'
          });
      } catch (e) {
        inError = true;
        expect(e.code).toBe(2);
      }
      ;

      expect(inError).toBeTruthy();
    });
  });
});
