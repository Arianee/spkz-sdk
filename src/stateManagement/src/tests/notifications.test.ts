import { getStore } from '../store';
import {
  resetNewMessageCountForASection,
  updateFetchStatus,
  updateNewMessageCountForARoom
} from '../reducers/notifications/actions';
import {
  $newMessagesFromRoom,
  $newMessagesFromSection,
  hasSectionNewMessages, isFetched
} from '../selectors/notifications.selector';

describe('Notifications', () => {
  beforeEach(() => {
    getStore(true);
  });

  describe('new message count', () => {
    test('it should update a new message count', () => {
      const roomObject = {
        roomId: '22',
        sectionId: '33',
        network: '1',
        chainId: '1',
        lastViewed: Date.now()
      };
      expect(hasSectionNewMessages(roomObject)).toBeFalsy();

      updateNewMessageCountForARoom({
        ...roomObject,
        newMessagesCounts: [{
          newMessagesCount: 22,
          ...roomObject
        }]
      });

      expect(hasSectionNewMessages(roomObject)).toBeTruthy();
    });

    test('it should reset a new message count', () => {
      const roomObject = {
        roomId: '22',
        sectionId: '33',
        network: '1',
        chainId: '1',
        lastViewed: Date.now()
      };
      expect(hasSectionNewMessages(roomObject)).toBeFalsy();

      updateNewMessageCountForARoom({
        ...roomObject,
        newMessagesCounts: [{
          newMessagesCount: 22,
          ...roomObject
        }]
      });

      expect(hasSectionNewMessages(roomObject)).toBeTruthy();

      resetNewMessageCountForASection({
        roomId: '22',
        sectionId: '33'
      });

      expect(hasSectionNewMessages(roomObject)).toBeFalsy();
    });

    test('set has fetched', () => {
      expect(isFetched({ roomId: '22' })).toBeFalsy();
      updateNewMessageCountForARoom({
        roomId: '22',
        newMessagesCounts: [{
          newMessagesCount: 22,
          roomId: '22',
          sectionId: '33'
        }]as any
      });
      expect(isFetched({ roomId: '22' })).toBeFalsy();

      updateFetchStatus({ roomId: '22' });
      expect(isFetched({ roomId: '22' })).toBeTruthy();
    });

    describe('observable', () => {
      describe('$newMessagesFromSection', () => {
        test('it should work for observable if there is data in redux before subscribe', (done) => {
          const roomObject = {
            roomId: '22',
            sectionId: 'chat'
          };

          updateNewMessageCountForARoom({
            ...roomObject,
            newMessagesCounts: [{
              newMessagesCount: 55,
              roomId: '22',
              sectionId: 'general'
            },
            {
              newMessagesCount: 3,
              roomId: '22',
              sectionId: 'chat'
            }
            ] as any
          });
          let numberOfCall = 0;
          $newMessagesFromSection(roomObject)
            .subscribe(d => {
              numberOfCall++;
              if (numberOfCall === 1) {
                expect(d).toBe(3);
              }
              if (numberOfCall === 2) {
                expect(d).toBe(33);
              }
              if (numberOfCall === 3) {
                expect(d).toBe(0);
                done();
              }
            });

          updateNewMessageCountForARoom({
            ...roomObject,
            newMessagesCounts: [{
              newMessagesCount: 57,
              roomId: '22',
              sectionId: 'general'
            },
            {
              newMessagesCount: 33,
              roomId: '22',
              sectionId: 'chat'
            }
            ] as any
          });

          resetNewMessageCountForASection({
            roomId: '22',
            sectionId: 'chat'
          });
        });

        test('it should work for observable', (done) => {
          const roomObject = {
            roomId: '22',
            sectionId: 'chat'
          };

          let numberOfCall = 0;
          $newMessagesFromSection(roomObject)
            .subscribe(d => {
              numberOfCall++;
              if (numberOfCall === 1) {
                expect(d).toBe(33);
              }
              if (numberOfCall === 2) {
                expect(d).toBe(0);
                done();
              }
            });

          updateNewMessageCountForARoom({
            ...roomObject,
            newMessagesCounts: [{
              newMessagesCount: 57,
              roomId: '22',
              sectionId: 'general'
            },
            {
              newMessagesCount: 33,
              roomId: '22',
              sectionId: 'chat'
            }
            ] as any
          });

          resetNewMessageCountForASection({
            roomId: '22',
            sectionId: 'chat'
          });
        });
      });
      describe('$newMessagesFromRoom', () => {
        test('it should work for observable with reset before', (done) => {
          let numberOfCall = 0;

          resetNewMessageCountForASection({
            roomId: '22',
            sectionId: 'chat'
          });
          $newMessagesFromRoom({ roomId: '22' })
            .subscribe(d => {
              numberOfCall++;
              if (numberOfCall === 1) {
                expect(d).toEqual({
                  chat: {
                    newMessagesCount: 0,
                    roomId: '22',
                    sectionId: 'chat'
                  }
                });
              }
              if (numberOfCall === 2) {
                expect(d).toEqual({
                  chat: {
                    newMessagesCount: 33,
                    roomId: '22',
                    sectionId: 'chat'
                  },
                  general: {
                    newMessagesCount: 57,
                    roomId: '22',
                    sectionId: 'general'
                  }
                });
              }
              if (numberOfCall === 3) {
                expect(d).toEqual({
                  chat: {
                    newMessagesCount: 0,
                    roomId: '22',
                    sectionId: 'chat'
                  },
                  general: {
                    newMessagesCount: 57,
                    roomId: '22',
                    sectionId: 'general'
                  }
                });
                done();
              }
            });

          updateNewMessageCountForARoom({
            roomId: '22',
            newMessagesCounts: [{
              newMessagesCount: 57,
              roomId: '22',
              sectionId: 'general'
            },
            {
              newMessagesCount: 33,
              roomId: '22',
              sectionId: 'chat'
            }
            ] as any
          });
          resetNewMessageCountForASection({
            roomId: '22',
            sectionId: 'chat'
          });
        });

        test('it should work for observable', (done) => {
          let numberOfCall = 0;
          $newMessagesFromRoom({ roomId: '22' })
            .subscribe(d => {
              numberOfCall++;
              if (numberOfCall === 1) {
                expect(d).toEqual({
                  chat: {
                    newMessagesCount: 33,
                    roomId: '22',
                    sectionId: 'chat'
                  },
                  general: {
                    newMessagesCount: 57,
                    roomId: '22',
                    sectionId: 'general'
                  }
                });
              }
              if (numberOfCall === 2) {
                expect(d).toEqual({
                  chat: {
                    newMessagesCount: 0,
                    roomId: '22',
                    sectionId: 'chat'
                  },
                  general: {
                    newMessagesCount: 57,
                    roomId: '22',
                    sectionId: 'general'
                  }
                });
                done();
              }
            });

          updateNewMessageCountForARoom({
            roomId: '22',
            newMessagesCounts: [{
              newMessagesCount: 57,
              roomId: '22',
              sectionId: 'general'
            },
            {
              newMessagesCount: 33,
              roomId: '22',
              sectionId: 'chat'
            }
            ] as any
          });

          resetNewMessageCountForASection({
            roomId: '22',
            sectionId: 'chat'
          });
        });
      });
    });
  });
});
