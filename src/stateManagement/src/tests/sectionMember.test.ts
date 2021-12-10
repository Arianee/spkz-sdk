import { getStore } from '../store';
import { addMembersToSection } from '../reducers/sectionMembers/actions';
import {
  getSectionMember,
  subcribeSectionMembers,
  subscribeToSectionMemberWithProfle
} from '../selectors/sectionMembers.selector';
import { addUsersProfiles } from '../reducers/usersProfile/actions';

describe('Section Member', () => {
  beforeEach(() => {
    getStore(true);
  });

  describe('add member to a section profile', () => {
    describe('add user', () => {
      test('it should add a member to the right roomId/sectionId', () => {
        addMembersToSection({
          roomId: '22',
          sectionId: 'chat',
          users: [
            {
              address: '0xaaaa'

            },
            {
              address: '0xbbbb'

            }
          ]
        });
        addMembersToSection({
          roomId: '33',
          sectionId: 'chat2',
          users: [
            {
              address: '0xccc'

            },
            {
              address: '0xddd'

            }
          ]
        });

        addMembersToSection({
          roomId: '33',
          sectionId: 'chat',
          users: [
            {
              address: '0xeee'

            },
            {
              address: '0xfff'

            }
          ]
        });

        const sectionChatRoom33Members = getSectionMember({
          roomId: '33',
          sectionId: 'chat'
        });
        expect(sectionChatRoom33Members).toEqual(['0xeee', '0xfff']);
        const sectionChat2Room33Members = getSectionMember({
          roomId: '33',
          sectionId: 'chat2'
        });
        expect(sectionChat2Room33Members).toEqual(['0xccc', '0xddd']);
      });

      test('it should not re add a member to the right roomId/sectionId', () => {
        addMembersToSection({
          roomId: '22',
          sectionId: 'chat',
          users: [
            {
              address: '0xaaaa'

            },
            {
              address: '0xbbbb'

            }
          ]
        });

        const members1 = getSectionMember({
          roomId: '22',
          sectionId: 'chat'
        });
        expect(members1).toEqual(['0xaaaa', '0xbbbb']);

        addMembersToSection({
          roomId: '22',
          sectionId: 'chat',
          users: [
            {
              address: '0xaaaa'

            },
            {
              address: '0xbbbb'

            },
            {
              address: '0xcccc'

            }
          ]
        });

        const members2 = getSectionMember({
          roomId: '22',
          sectionId: 'chat'
        });
        expect(members2).toEqual(['0xaaaa', '0xbbbb', '0xcccc']);
      });
    });

    describe('observable', () => {
      it('should obs if members change', (done) => {
        let num = 0;
        addMembersToSection({
          roomId: '22',
          sectionId: 'chat',
          users: [
            {
              address: '0xaaaa'

            },
            {
              address: '0xbbbb'

            }
          ]
        });

        subcribeSectionMembers({
          roomId: '22',
          sectionId: 'chat'
        }).subscribe(d => {
          if (num === 0) {
            expect(d).toHaveLength(2);
          }
          if (num === 1) {
            expect(d).toHaveLength(3);
          }
          if (num === 2) {
            expect(d).toHaveLength(4);
            done();
          }
          num++;
        });
        addMembersToSection({
          roomId: '22',
          sectionId: 'chat',
          users: [
            {
              address: '0xaaaa'

            },
            {
              address: '0xbbbb'

            },
            {
              address: '0xcccc'

            }
          ]
        });

        // re add already existing user
        addMembersToSection({
          roomId: '22',
          sectionId: 'chat',
          users: [
            {
              address: '0xaaaa'
            }
          ]
        });

        addMembersToSection({
          roomId: '22',
          sectionId: 'chat',
          users: [
            {
              address: '0xdddd'
            }
          ]
        });
      });
    });

    describe('section members with profiles', () => {
      it.only('should return user with profile', (done) => {
        let num = 0;
        subscribeToSectionMemberWithProfle({ roomId: '22', sectionId: 'chat' })
          .subscribe(d => {
            if (num === 0) {
              expect(d).toHaveLength(2);
              expect(d[0].address).toBe('0xaaaa');
              expect(d[0].avatar.name).toBe('name1');

              expect(d[1].address).toBe('0xbbbb');
            }
            if (num === 1) {
              expect(d).toHaveLength(2);
              expect(d[0].address).toBe('0xaaaa');
              expect(d[0].avatar.name).toBe('name2');
              done();
            }

            num++;
          });

        addMembersToSection({
          roomId: '22',
          sectionId: 'chat',
          users: [
            {
              address: '0xaaaa'

            },
            {
              address: '0xbbbb'

            }
          ]
        });

        addUsersProfiles({
          roomId: '22',
          users: [
            {
              address: '0xbbbb',
              avatar: {
                name: 'name1'
              }
            },
            {
              address: '0xaaaa',
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
              address: '0xaaaa',
              avatar: {
                name: 'name2'
              }
            } as any
          ]
        });

        setTimeout(() => done(), 3000);
      });
    });
  });
});
