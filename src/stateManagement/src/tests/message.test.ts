import { getStore } from '../store';
import {
  addMessagesToSection,
  toggleInitialFetch,
  toggleWS,
  updateMessagesPagination
} from '../reducers/messages/actions';
import { REDUCERNAME } from '../reducerName';
import {
  getMessages,
  hasFetchInitialData,
  isWSInitilized,
  nextTimestamp,
  previousTimeStamp
} from '../selectors/messages.selector';

describe('Messages', () => {
  beforeEach(() => {
    getStore(true);
  });

  describe('add message', () => {
    test('it should add a message to the right roomId/sectionId', () => {
      addMessagesToSection({
        roomId: '22',
        sectionId: '33',
        messages: [{
          fr: 'my message2'
        }]
      });

      addMessagesToSection({
        roomId: '22',
        sectionId: '33',
        messages: [{
          fr: 'my message1'
        }]
      });

      const state = getStore().getState();
      expect(getMessages({ roomId: '22', sectionId: '33' })).toHaveLength(2);
    });

    test('it should add identical message only once', () => {
      const identicalMessage = {
        roomId: '22',
        sectionId: '33',
        messages: [{
          fr: 'my message1'
        }]
      };

      addMessagesToSection(identicalMessage);

      addMessagesToSection(identicalMessage);

      const state = getStore().getState();
      expect(getMessages({ roomId: '22', sectionId: '33' })).toHaveLength(1);
    });

    test('it should add a message to the right roomId/sectionId of there is multiple', () => {
      addMessagesToSection({
        roomId: '22',
        sectionId: '13',
        messages: [{
          fr: 'my message2'
        }]
      });

      addMessagesToSection({
        roomId: '22',
        sectionId: '33',
        messages: [{
          fr: 'my message3'
        }]
      });

      const state = getStore().getState();
      expect(state[REDUCERNAME.MESSAGES]['22/33'].messages).toHaveLength(1);
      expect(getMessages({ roomId: '22', sectionId: '33' })).toHaveLength(1);
    });
  });

  describe('toggle ws and initial fetch', () => {
    test('toggle ws', () => {
      toggleWS({
        roomId: '22',
        sectionId: '33',
        ws: true
      });

      const state = getStore().getState();
      expect(isWSInitilized({
        roomId: '22',
        sectionId: '33'
      })).toBeTruthy();

      toggleWS({
        roomId: '22',
        sectionId: '33',
        ws: false
      });

      const state2 = getStore().getState();
      expect(isWSInitilized({
        roomId: '22',
        sectionId: '33'
      })).toBeFalsy();
    });
    test('toggle initial fetch', () => {
      toggleInitialFetch({
        roomId: '22',
        sectionId: '33',
        initialFetch: true
      });

      const state = getStore().getState();
      expect(hasFetchInitialData({
        roomId: '22',
        sectionId: '33'
      })).toBeTruthy();

      toggleInitialFetch({
        roomId: '22',
        sectionId: '33',
        initialFetch: false
      });

      const state2 = getStore().getState();
      expect(hasFetchInitialData({
        roomId: '22',
        sectionId: '33'
      })).toBeFalsy();
    });
  });

  describe('update pagination status', () => {
    test('it should update PREVIOUS messages timestamp', () => {
      const timestamp = Date.now();

      const roomParam = { roomId: '22', sectionId: '33' };
      updateMessagesPagination({
        roomId: '22',
        sectionId: '33',
        previousTimestamp: timestamp
      });

      const state = getStore().getState();
      expect(previousTimeStamp(roomParam)).toBe(timestamp);

      const timestamp2 = Date.now();

      updateMessagesPagination({
        roomId: '22',
        sectionId: '33',
        previousTimestamp: timestamp2
      });

      const state2 = getStore().getState();
      expect(previousTimeStamp(roomParam)).toBe(timestamp2);
    });
    test('it should update NEXT messages timestamp', () => {
      const timestamp = Date.now();
      const roomParam = { roomId: '22', sectionId: '33' };

      updateMessagesPagination({
        ...roomParam,
        nextTimestamp: timestamp
      });

      const state = getStore().getState();
      expect(nextTimestamp(roomParam)).toBe(timestamp);

      const timestamp2 = Date.now();

      updateMessagesPagination({
        ...roomParam,
        nextTimestamp: timestamp2
      });

      const state2 = getStore().getState();
      expect(nextTimestamp(roomParam)).toBe(timestamp2);
    });
  });
});
