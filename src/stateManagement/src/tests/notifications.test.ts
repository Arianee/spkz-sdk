import { getStore } from '../store';
import { updateNewMessageCountForARoom } from '../reducers/notifications/actions';
import { $newMessagesFromSection, hasNewMessages } from '../selectors/notifications.selector';

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
      expect(hasNewMessages(roomObject)).toBeFalsy();

      updateNewMessageCountForARoom({
        ...roomObject,
        newMessagesCounts: [{
          newMessagesCount: 22,
          ...roomObject
        }]
      });

      expect(hasNewMessages(roomObject)).toBeTruthy();
    });
    /*
    test('it should work for observable', (done) => {
      const roomObject = {
        roomId: '22',
        sectionId: '33'
      };

      let numberOfCall = 0;
      $newMessagesFromSection(roomObject)
        .subscribe(d => {
          numberOfCall++;
          if (numberOfCall === 1) {
            expect(d).toBe(22);
          }
          if (numberOfCall === 2) {
            expect(d).toBe(3);
            done();
          }
        });

      updateNewMessageCountForARoom({
        ...roomObject,
        newMessagesCount: 22
      });

      updateNewMessageCountForARoom({
        ...roomObject,
        newMessagesCount: 3
      });
    });

     */
  });
});
