import { getStore } from '../store';
import { addUsersProfiles } from '../reducers/usersProfile/actions';
import {
  getUserProfileFromRoom,
  subcribeToAllProfileOfRoom,
  subcribeToOneProfileOfRoom
} from '../selectors/usersProfile.selector';
import { cloneDeep } from 'lodash';

describe('UsersProfile', () => {
  beforeEach(() => {
    getStore(true);
  });

  describe('add user profile', () => {
    const user1 = () => cloneDeep({
      userprofile: {
        sectionId: 'chat',
        profile: {
          address: '0x2bc0b60c58ac96cff37e9a168d0963157bdb6efb',
          ens: {
            name: 'sulot.eth',
            tokenId: '69957581793191299092131833848793684946567577516693425843091911244051193718385'
          },
          avatar: {},
          biography: 'My bio',
          authorizations: ['WW91IG5lZWQgdG8gc2lnbiBhbiBhdXRob3JpemF0aW9uIGZvciBhIGJ1cm5lciB3YWxsZXQuIFRoaXMgYXV0aG9yaXphdGlvbiBhbGxvd3MgeW91IHRvIHNlbmQgbWVzc2FnZXMgd2l0aG91dCBoYXZpbmcgdG8gc2lnbiBlYWNoIG1lc3NhZ2UuIEl0J3MgYW4gb2ZmY2hhaW4gc2lnbmF0dXJlLCBpdCdzIGdhcyBmcmVlICEKeyJ0eXAiOiJKV1QiLCJhbGciOiJFVEgifQ==.eyJpc3MiOiIweDJiYzBiNjBjNThhYzk2Y2ZmMzdlOWExNjhkMDk2MzE1N2JkYjZlZmIiLCJleHAiOjE2Mzg1MzA4NTI2NDQsInN1YiI6IjB4OGMzMjNhYmM4ZTM1MDUwMTNiOWFjNTFkZjU5NzVjN2U5NWYxZWY0MCIsImlhdCI6MTYzNzkyNjA1MjY0NH0=.0x1ae916b09fa68b214184297cc7ad163406f7413c63f253b320280bd03c050df05b0b83724160c63d9935ffa531034b971988bd97f46b24db6aeac73af75e1c421c'],
          nonce: '1637926223355',
          signature: '0xe91c67b413c74bc020e60860d815f3ed2067690de090df19e04fae951910736d2433105e538570afa6d31c0776af09ade250beb8d35711c093715743a4788e211c'
        },
        roomId: '3',
        authorizations: ['WW91IG5lZWQgdG8gc2lnbiBhbiBhdXRob3JpemF0aW9uIGZvciBhIGJ1cm5lciB3YWxsZXQuIFRoaXMgYXV0aG9yaXphdGlvbiBhbGxvd3MgeW91IHRvIHNlbmQgbWVzc2FnZXMgd2l0aG91dCBoYXZpbmcgdG8gc2lnbiBlYWNoIG1lc3NhZ2UuIEl0J3MgYW4gb2ZmY2hhaW4gc2lnbmF0dXJlLCBpdCdzIGdhcyBmcmVlICEKeyJ0eXAiOiJKV1QiLCJhbGciOiJFVEgifQ==.eyJpc3MiOiIweDJiYzBiNjBjNThhYzk2Y2ZmMzdlOWExNjhkMDk2MzE1N2JkYjZlZmIiLCJleHAiOjE2Mzk2NDQ2NzYwNTksInN1YiI6IjB4OGQ0MGE5MjJiZDhkM2QwNzliOTA3OTY1MGRmMmIzZTAxZTZkMTJhZiIsImlhdCI6MTYzOTAzOTg3NjA1OX0=.0x7fda3ef8766444e2e33d1d3702be79222cd89c824439ba9fcd3601364aa8ebcc7916fbb0e78fef2dfabe4426cc4e9bd4ccc18b2184bf8f74215516581c157ad01b'],
        nonce: '1639469368797',
        signature: '0x41b9b888ea84ab5e5d5f62579d79285f493ee191634ed29b82e3ac98eac068857451ec15f65f512b15df9ce2984920ed94a2470af2f7757e67f146478b9c028c1b'
      },
      id: '213',
      payload: {
        sectionId: 'chat',
        profile: {
          address: '0x2bc0b60c58ac96cff37e9a168d0963157bdb6efb',
          ens: {
            name: 'sulot.eth',
            tokenId: '69957581793191299092131833848793684946567577516693425843091911244051193718385'
          },
          avatar: {},
          biography: 'My bio',
          authorizations: ['WW91IG5lZWQgdG8gc2lnbiBhbiBhdXRob3JpemF0aW9uIGZvciBhIGJ1cm5lciB3YWxsZXQuIFRoaXMgYXV0aG9yaXphdGlvbiBhbGxvd3MgeW91IHRvIHNlbmQgbWVzc2FnZXMgd2l0aG91dCBoYXZpbmcgdG8gc2lnbiBlYWNoIG1lc3NhZ2UuIEl0J3MgYW4gb2ZmY2hhaW4gc2lnbmF0dXJlLCBpdCdzIGdhcyBmcmVlICEKeyJ0eXAiOiJKV1QiLCJhbGciOiJFVEgifQ==.eyJpc3MiOiIweDJiYzBiNjBjNThhYzk2Y2ZmMzdlOWExNjhkMDk2MzE1N2JkYjZlZmIiLCJleHAiOjE2Mzg1MzA4NTI2NDQsInN1YiI6IjB4OGMzMjNhYmM4ZTM1MDUwMTNiOWFjNTFkZjU5NzVjN2U5NWYxZWY0MCIsImlhdCI6MTYzNzkyNjA1MjY0NH0=.0x1ae916b09fa68b214184297cc7ad163406f7413c63f253b320280bd03c050df05b0b83724160c63d9935ffa531034b971988bd97f46b24db6aeac73af75e1c421c'],
          nonce: '1637926223355',
          signature: '0xe91c67b413c74bc020e60860d815f3ed2067690de090df19e04fae951910736d2433105e538570afa6d31c0776af09ade250beb8d35711c093715743a4788e211c'
        },
        roomId: '3',
        authorizations: ['WW91IG5lZWQgdG8gc2lnbiBhbiBhdXRob3JpemF0aW9uIGZvciBhIGJ1cm5lciB3YWxsZXQuIFRoaXMgYXV0aG9yaXphdGlvbiBhbGxvd3MgeW91IHRvIHNlbmQgbWVzc2FnZXMgd2l0aG91dCBoYXZpbmcgdG8gc2lnbiBlYWNoIG1lc3NhZ2UuIEl0J3MgYW4gb2ZmY2hhaW4gc2lnbmF0dXJlLCBpdCdzIGdhcyBmcmVlICEKeyJ0eXAiOiJKV1QiLCJhbGciOiJFVEgifQ==.eyJpc3MiOiIweDJiYzBiNjBjNThhYzk2Y2ZmMzdlOWExNjhkMDk2MzE1N2JkYjZlZmIiLCJleHAiOjE2Mzk2NDQ2NzYwNTksInN1YiI6IjB4OGQ0MGE5MjJiZDhkM2QwNzliOTA3OTY1MGRmMmIzZTAxZTZkMTJhZiIsImlhdCI6MTYzOTAzOTg3NjA1OX0=.0x7fda3ef8766444e2e33d1d3702be79222cd89c824439ba9fcd3601364aa8ebcc7916fbb0e78fef2dfabe4426cc4e9bd4ccc18b2184bf8f74215516581c157ad01b'],
        nonce: '1639469368797',
        signature: '0x41b9b888ea84ab5e5d5f62579d79285f493ee191634ed29b82e3ac98eac068857451ec15f65f512b15df9ce2984920ed94a2470af2f7757e67f146478b9c028c1b'
      },
      network: '80001',
      roomId: '3',
      blockchainWallet: '0x2bc0b60c58ac96cff37e9a168d0963157bdb6efb',
      chainId: '80001',
      updatedAt: '2021-12-14T08:09:30.804Z',
      createdAt: '2021-11-24T15:31:43.686Z'
    });
    const user2 = () => cloneDeep({
      userprofile: {
        sectionId: 'chat',
        profile: {},
        roomId: '3',
        authorizations: ['eyJ0eXAiOiJKV1QiLCJhbGciOiJFVEgifQ==.eyJpc3MiOiIweGY5MWQ0Y2YzM2EwOGFiYzEyMjdjZmQ2OWZjOTJjMmIxZGY5ZmQyM2MiLCJleHAiOjE2MzQ4NDY4NDEyMjAsInN1YiI6IjB4YWFmZGRmYWE4YzllOWFkMzY0ZDY4MWM4YWFiYTAxNDNlMWFlZjkyZCJ9.0x04bd0e82e15a7dd640a45e581b8c32e68393599f6555fbd36511f47d09e77c2d334ea40510599fa3a46cd97fd578bb0a97efd4fea878676dd6e87a76337a8e321c'],
        nonce: '1634242047019',
        signature: '0x18173d3672bcecd26cde12ce284ebbba30e8836db6e9f527df35f72eaf7f878e71834135a2055060d8148e82e726681e4813893a786e581c749624107765e7511c'
      },
      id: '155',
      payload: {
        sectionId: 'chat',
        profile: {},
        roomId: '3',
        authorizations: ['eyJ0eXAiOiJKV1QiLCJhbGciOiJFVEgifQ==.eyJpc3MiOiIweGY5MWQ0Y2YzM2EwOGFiYzEyMjdjZmQ2OWZjOTJjMmIxZGY5ZmQyM2MiLCJleHAiOjE2MzQ4NDY4NDEyMjAsInN1YiI6IjB4YWFmZGRmYWE4YzllOWFkMzY0ZDY4MWM4YWFiYTAxNDNlMWFlZjkyZCJ9.0x04bd0e82e15a7dd640a45e581b8c32e68393599f6555fbd36511f47d09e77c2d334ea40510599fa3a46cd97fd578bb0a97efd4fea878676dd6e87a76337a8e321c'],
        nonce: '1634242047019',
        signature: '0x18173d3672bcecd26cde12ce284ebbba30e8836db6e9f527df35f72eaf7f878e71834135a2055060d8148e82e726681e4813893a786e581c749624107765e7511c'
      },
      network: '80001',
      roomId: '3',
      blockchainWallet: '0xf91d4cf33a08abc1227cfd69fc92c2b1df9fd23c',
      chainId: '80001',
      updatedAt: '2021-10-14T20:07:28.272Z',
      createdAt: '2021-10-14T20:07:28.272Z'
    });
    describe('add user', () => {
      test('it should add a message to the right roomId/sectionId', () => {
        addUsersProfiles({
          roomId: '22',
          users: [
            user2() as any
          ]
        });

        addUsersProfiles({
          roomId: '33',
          users: [
            user1() as any
          ]
        });

        const userInRoom22 = getUserProfileFromRoom({
          roomId: '22',
          address: '0xf91d4cf33a08abc1227cfd69fc92c2b1df9fd23c'
        });

        expect(userInRoom22).toBeDefined();
        expect(userInRoom22.blockchainWallet).toBe('0xf91d4cf33a08abc1227cfd69fc92c2b1df9fd23c');

        const userInRoom33 = getUserProfileFromRoom({
          roomId: '33',
          address: '0x2bc0b60c58ac96cff37e9a168d0963157bdb6efb'
        });

        expect(userInRoom33.blockchainWallet).toBe('0x2bc0b60c58ac96cff37e9a168d0963157bdb6efb');
        expect(userInRoom33.userprofile.profile.ens.name).toBe('sulot.eth');
      });

      test('it should not be case sensitive on address', () => {
        addUsersProfiles({
          roomId: '22',
          users: [
            user1() as any
          ]
        });

        const userInRoom22 = getUserProfileFromRoom({
          roomId: '22',
          address: '0x2BC0b60c58ac96cff37e9a168d0963157bdb6efb'
        });

        expect(userInRoom22).toBeDefined();
        expect(userInRoom22.blockchainWallet).toBe('0x2bc0b60c58ac96cff37e9a168d0963157bdb6efb');
        expect(userInRoom22.userprofile.profile.ens.name).toBe('sulot.eth');
      });
    });

    describe('listen to user change', () => {
      test('should able to listen to profile change of room + user', (done) => {
        let num = 0;

        addUsersProfiles({
          roomId: '22',
          users: [
            user1() as any
          ]
        });
        subcribeToOneProfileOfRoom({
          roomId: '22',
          address: '0x2bc0b60c58ac96cff37e9a168d0963157bdb6efb'
        }).subscribe(d => {
          if (num === 0) {
            expect(d.userprofile.profile.ens.name).toBe('sulot.eth');
          }
          if (num === 1) {
            expect(d.userprofile.profile.ens.name).toBe('name2.eth');
            done();
          }
          num++;
        });

        const user1SecondTime = user1();
        user1SecondTime.userprofile.profile.ens.name = 'name2.eth';

        addUsersProfiles({
          roomId: '22',
          users: [
            user1SecondTime as any
          ]
        });
      });
      test('should able to listen to profile change of room all users', (done) => {
        let num = 0;

        addUsersProfiles({
          roomId: '22',
          users: [
            user1() as any
          ]
        });
        subcribeToAllProfileOfRoom({
          roomId: '22'
        }).subscribe(d => {
          if (num === 0) {
            expect(d[user1().blockchainWallet.toLowerCase()].userprofile.profile.ens.name).toBe('sulot.eth');
          }
          if (num === 1) {
            expect(d[user2().blockchainWallet.toLowerCase()].blockchainWallet).toBe(user2().blockchainWallet);
          }
          if (num === 2) {
            expect(d[user1().blockchainWallet.toLowerCase()].userprofile.profile.ens.name).toBe('newname.eth');
            expect(d[user2().blockchainWallet.toLowerCase()].blockchainWallet).toBe(user2().blockchainWallet);
            done();
          }
          num++;
        });

        addUsersProfiles({
          roomId: '22',
          users: [
            user2() as any
          ]
        });

        // re add same use does not emit obs
        addUsersProfiles({
          roomId: '22',
          users: [
            user2() as any
          ]
        });
        const user2Modified = user1();
        user2Modified.userprofile.profile.ens.name = 'newname.eth';
        addUsersProfiles({
          roomId: '22',
          users: [
            user2Modified as any
          ]
        });
      });
    });
  });
});
