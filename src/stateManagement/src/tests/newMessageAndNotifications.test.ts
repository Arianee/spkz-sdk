import { getStore } from '../store';
import { updateNewMessageCountForARoom, updateNewMessageCountForASection } from '../reducers/notifications/actions';
import { getSectionNewMessagesCount, hasSectionNewMessages } from '../selectors/notifications.selector';
import { addMessagesToSection } from '../reducers/messages/actions';
import { MESSAGES } from './mocks/messagesMock';

describe('Notifications', () => {
  beforeEach(() => {
    getStore(true);
  });

  describe('new message count', () => {
    test('it should update a new message count', () => {
      const roomObject = {
        roomId: '22',
        sectionId: '33'
      };
      expect(hasSectionNewMessages(roomObject)).toBeFalsy();

      addMessagesToSection({
        ...roomObject,
        messages: MESSAGES
      });

      updateNewMessageCountForARoom({
        ...roomObject,
        newMessagesCounts: [{
          newMessagesCount: 22,
          roomId: '22',
          sectionId: '33'
        }]as any
      });

      expect(getSectionNewMessagesCount(roomObject)).toBe(22);

      updateNewMessageCountForASection({
        ...roomObject,
        increment: 28
      });

      expect(getSectionNewMessagesCount(roomObject)).toBe(22 + MESSAGES.length);
    });
    test('it should update a new message count and parse to number', () => {
      const roomObject = {
        roomId: '22',
        sectionId: '33'
      };
      expect(hasSectionNewMessages(roomObject)).toBeFalsy();

      addMessagesToSection({
        ...roomObject,
        messages: MESSAGES
      });

      updateNewMessageCountForARoom({
        ...roomObject,
        newMessagesCounts: [{
          newMessagesCount: '22',
          roomId: '22',
          sectionId: '33'
        }]as any
      });

      expect(getSectionNewMessagesCount(roomObject)).toBe(22);

      updateNewMessageCountForASection({
        ...roomObject,
        increment: 28
      });

      expect(getSectionNewMessagesCount(roomObject)).toBe(22 + MESSAGES.length);
    });
  });
});
