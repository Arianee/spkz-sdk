import { NFTROOM, SPKZ } from '../../../..';
import { JSONRPCMethods } from '../../../../models/JSONRPCMethods.enum';
import { FetchRoomService } from '../../../utils/services/fetchRoomService/fetchRoomService';
import { RPCJSONService } from '../httpService/RPCJSONService';
import {
  InternalMessageEventEmitterService
} from '../internalMessageEventEmitterService/internalMessageEventEmitterService';
import axios from 'axios';
import { skip, take } from 'rxjs/operators';
import { getStore } from '../../../../stateManagement/src/store';

jest.setTimeout(60000);

describe('room', () => {
  let proxyWallet: SPKZ;
  let proxiesWallet:SPKZ[];

  const addressBlockchainWallet1 = ['0xa226D0C579CD0ffb3Dc85cfA9A07D534d9301fD8',
    '0xbA00450C103d06Ee2dF8F4F0617a933e32CCF23C'];
  const pk = [
    '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161',
    'f4421be872eda2c42ba5106c7087c1231e009a94c6d286edfd97ba97ded6d2a3'
  ];
  beforeEach(async () => {
    await axios.get('http://localhost:3000/reset');

    // reset store
    getStore(true);
    proxiesWallet = await Promise.all(pk.map(async d => {
      const newSpkz = new SPKZ();
      await newSpkz.wallets
        .generateRandomPrivateKeyForProxyWallet()
        .addWalletFromPrivateKey(d);
      return newSpkz;
    }));
    proxyWallet = proxiesWallet[0];
  });

  test('user should get users if user has right', async (done) => {
    const [proxyWallet1, proxyWallet2] = proxiesWallet;

    const users0 = await proxyWallet1.room.users.subscribeToSectionUsers({
      roomId: '0',
      sectionId: 'chat'
    }).pipe(take(1)).toPromise();

    expect(users0).toHaveLength(0);
    await proxyWallet1.room.userAndProfile.joinSection({
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

    const users1 = await proxyWallet1.room.users.subscribeToSectionUsers({
      roomId: '0',
      sectionId: 'chat',
      forceRefresh: true
    }).pipe(
      skip(1), // to avoid previously fetch data
      take(1)
    ).toPromise();

    expect(users1).toHaveLength(1);
    await proxyWallet2.room.userAndProfile.joinSection(
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
    const users2 = await proxyWallet1.room.users.subscribeToSectionUsers({
      roomId: '0',
      sectionId: 'chat',
      forceRefresh: true

    }).pipe(
      skip(1), // to avoid previously fetch data
      take(1)).toPromise();
    expect(users2).toHaveLength(2);
    done();
  });

  test('user can join section and it performs a profile update and user can update ',
    async (done) => {
      setTimeout(() => {
        done();
      }, 10000);
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
      await proxyWallet.room.userAndProfile.joinSection(expectedPayload);

      const users = await proxyWallet.room.users.subscribeToSectionUsers({
        roomId: '0',
        sectionId: 'chat'
      }).pipe(take(1)).toPromise();

      const payload = users[0];
      expect(payload.roomId).toBe(expectedPayload.roomId);
      expect(payload.payload.profile.ens.name).toBe('lename');

      const expectedPayload2 = {
        roomId: '0',
        sectionId: 'chat',
        profile: {
          biography: 'labiography',
          ens: {
            name: 'NOM DIFFERENT',
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

      await proxyWallet.room.userAndProfile.updateProfile(expectedPayload2);

      const users2 = await proxyWallet.room.users.subscribeToSectionUsers({
        roomId: '0',
        sectionId: 'chat',
        forceRefresh: true
      }).pipe(
        skip(1),
        take(1)).toPromise();

      const payload2 = users2[0];

      expect(payload2.payload.profile.ens.name).toBe('NOM DIFFERENT');

      done();
    });

  test('user can update last viewed', async (done) => {
    const payload = {
      roomId: '0',
      sectionId: 'chat'
    };
    await proxyWallet.room.userAndProfile.updateLastViewed(payload);
    done();
  });

  describe('send message', () => {
    test('send message', async () => {
      const expectedMessage = 'an expected message';
      await proxyWallet.room.message.sendMessage({
        roomId: '0',
        messageContent: expectedMessage,
        sectionId: 'chat'
      });

      const messages = await proxyWallet.room.message.fetchMessages({
        roomId: '0',
        sectionId: 'chat'
      });

      expect(messages.messages).toHaveLength(1);
      expect(messages.messages[0].payload.content).toBe(expectedMessage);
    });
  });

  describe('dry', () => {
    test('dry join section', async (done) => {
      setTimeout(() => {
        done();
      }, 3000);
      const users1 = await proxyWallet.room.users.subscribeToSectionUsers({
        roomId: '0',
        sectionId: 'chat'
      }).pipe(take(1)).toPromise();

      expect(users1).toHaveLength(0);

      await proxyWallet.room.userAndProfile.joinSection({
        roomId: '0',
        sectionId: 'chat',
        profile: {},
        dry: true
      });
      const users2 = await proxyWallet.room.users.subscribeToSectionUsers({
        roomId: '0',
        sectionId: 'chat',
        forceRefresh: true
      }).pipe(skip(1), take(1)).toPromise();

      expect(users2).toHaveLength(0);

      await proxyWallet.room.userAndProfile.joinSection({
        roomId: '0',
        sectionId: 'chat',
        profile: {},
        dry: false
      });

      const users3 = await proxyWallet.room.users.subscribeToSectionUsers({
        roomId: '0',
        sectionId: 'chat',
        forceRefresh: true
      }).pipe(skip(1), take(1)).toPromise();
      expect(users3).toHaveLength(1);
    });
  });
  describe('error', () => {
    test('get message error should return value of error', async () => {
      const expectedMessage = 'an expected message';
      let inError = false;
      try {
        const messages = await proxyWallet
          .room
          .message
          .fetchMessages({
            roomId: '0',
            sectionId: 'viproom'
          });
      } catch (e) {
        inError = true;
        expect(e.code).toBe(2);
      }

      expect(inError).toBeTruthy();
    });
  });

  describe('message with redux store', () => {
    const fetchRoom = async ():Promise<NFTROOM> => {
      return {
        strategies: [[]],
        endpoint: 'http://monendpoint.com',
        notificationEndpoint: 'http://monendpoint.com',
        sections: [
          {
            title: 'Chat',
            id: 'chat'
          }
        ]
      };
    };

    const signedRPCCall = (endpoint, methodName):any => {
      if (methodName === JSONRPCMethods.room.message.read) {
        return {
          messages: [{
            id: 1,
            roomId: '1',
            sectionId: 'chat',
            content: 'my content'
          },
          {
            id: 2,
            roomId: '1',
            sectionId: 'chat',
            content: 'my content'
          }]
        };
      } else {
        return {};
      }
    };

    test('fetch messages and subscribe', async (done) => {
      const pkBlockchainWallet1 = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';
      await proxyWallet.wallets.addWalletFromPrivateKey(pkBlockchainWallet1);

      jest.spyOn(proxyWallet.container.resolve(FetchRoomService), 'fetchRoom')
        .mockImplementation(fetchRoom);
      jest.spyOn(proxyWallet.container.resolve(RPCJSONService), 'signedRPCCall')
        .mockImplementation(signedRPCCall);

      let number = 0;

      proxyWallet.room.message.subscribeToMessages({ roomId: '1', sectionId: 'chat' })
        .subscribe(messages => {
          number++;
          if (number === 1) {
            expect(messages).toHaveLength(0);
          }
          if (number === 2) {
            expect(messages).toHaveLength(2);
          }
          if (number === 3) {
            expect(messages).toHaveLength(3);
            done();
          }
        });

      setTimeout(() => {
        proxyWallet.container.resolve(InternalMessageEventEmitterService).emitMessage(JSON.stringify({
          roomId: '1',
          sectionId: 'chat',
          content: 'my second content'
        }));
      });
    });
  });
});
