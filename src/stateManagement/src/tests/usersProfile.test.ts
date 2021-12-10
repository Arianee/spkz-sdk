import { getStore } from '../store';
import { addUsersProfiles } from '../reducers/usersProfile/actions';
import {
  getUserProfileFromRoom,
  subcribeToAllProfileOfRoom,
  subcribeToOneProfileOfRoom
} from '../selectors/usersProfile.selector';

describe('UsersProfile', () => {
  beforeEach(() => {
    getStore(true);
  });

  describe('add user profile', () => {
    describe('add user', () => {
      test('it should add a message to the right roomId/sectionId', () => {
        addUsersProfiles({
          roomId: '22',
          users: [
          {
            address: '0xaf0e204c1bac9856ddb0617d32202135b4c0c117',
            avatar: {
              name: 'my name 22'
            }
          } as any
          ]
        });

        addUsersProfiles({
          roomId: '33',
          users: [
          {
            address: '0xaf0e204c1bac9856ddb0617d32202135b4c0c117',
            avatar: {
              name: 'my name 33'
            }
          } as any
          ]
        });

        const state = getStore().getState();

        const userInRoom22 = getUserProfileFromRoom({
          roomId: '22',
          address: '0xaf0e204c1bac9856ddb0617d32202135b4c0c117'
        });

        expect(userInRoom22).toBeDefined();
        expect(userInRoom22.address).toBe('0xaf0e204c1bac9856ddb0617d32202135b4c0c117');
        expect(userInRoom22.avatar.name).toBe('my name 22');

        const userInRoom33 = getUserProfileFromRoom({
          roomId: '33',
          address: '0xaf0e204c1bac9856ddb0617d32202135b4c0c117'
        });

        expect(userInRoom33.address).toBe('0xaf0e204c1bac9856ddb0617d32202135b4c0c117');
        expect(userInRoom33.avatar.name).toBe('my name 33');
      });

      test('it should not be case sensitive on address', () => {
        addUsersProfiles({
          roomId: '22',
          users: [
          {
            address: '0xAAAAAA',
            avatar: {
              name: 'my name 22'
            }
          } as any
          ]
        });

        const userInRoom22 = getUserProfileFromRoom({
          roomId: '22',
          address: '0xaaaaaa'
        });

        expect(userInRoom22).toBeDefined();
        expect(userInRoom22.address).toBe('0xAAAAAA');
        expect(userInRoom22.avatar.name).toBe('my name 22');
      });
    });

    describe('listen to user change', () => {
      test('should able to listen to profile change of room + user', (done) => {
        let num = 0;

        addUsersProfiles({
          roomId: '22',
          users: [
            {
              address: '0xAAAAAA',
              avatar: {
                name: 'name0'
              }
            } as any
          ]
        });
        subcribeToOneProfileOfRoom({
          roomId: '22',
          address: '0xAAAAAA'
        }).subscribe(d => {
          if (num === 0) {
            expect(d.avatar.name).toBe('name0');
          }
          if (num === 1) {
            expect(d.avatar.name).toBe('name1');
          }
          if (num === 2) {
            expect(d.avatar.name).toBe('name2');
            done();
          }

          num++;
        });

        addUsersProfiles({
          roomId: '22',
          users: [
            {
              address: '0xAAAAAA',
              avatar: {
                name: 'name1'
              }
            } as any
          ]
        });
        addUsersProfiles({
          roomId: '22',
          users: [
            {
              address: '0xAAAAAA',
              avatar: {
                name: 'name2'

              }
            } as any
          ]
        });
      });
      test('should able to listen to profile change of room all users', (done) => {
        let num = 0;

        addUsersProfiles({
          roomId: '22',
          users: [
            {
              address: '0xAAAAAA',
              avatar: {
                name: 'name0'
              }
            } as any
          ]
        });
        subcribeToAllProfileOfRoom({
          roomId: '22'
        }).subscribe(d => {
          if (num === 0) {
            expect(d['0xAAAAAA'.toLowerCase()].avatar.name).toBe('name0');
          }
          if (num === 1) {
            expect(d['0xAAAAAA'.toLowerCase()].avatar.name).toBe('name1');
          }
          if (num === 2) {
            expect(d['0xAAAAAA'.toLowerCase()].avatar.name).toBe('name1');
            expect(d['0xBBB'.toLowerCase()].avatar.name).toBe('name2');
            done();
          }
          num++;
        });

        addUsersProfiles({
          roomId: '22',
          users: [
            {
              address: '0xAAAAAA',
              avatar: {
                name: 'name1'
              }
            } as any
          ]
        });

        addUsersProfiles({
          roomId: '22',
          users: [
            {
              address: '0xBBB',
              avatar: {
                name: 'name2'
              }
            } as any
          ]
        });
      });
    });
  });
});
