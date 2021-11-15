import { addMessagesToSection, toggleWS } from '../reducers/messages/actions';
import { getStore } from '../store';
import { $messagesFromSection } from '../selectors/messages.selector';

describe('ObservableFactory', () => {
  beforeEach(() => {
    getStore(true);
  });
  describe('messagesFromSection', () => {
    test('it should work', (done) => {
      let numberOfCall = 0;
      addMessagesToSection({
        roomId: '22',
        sectionId: '33',
        messages: [{
          id: 1,
          fr: 'my first message'
        }]
      });

      $messagesFromSection({ roomId: '22', sectionId: '33' })
        .subscribe(d => {
          numberOfCall++;

          if (numberOfCall === 2) {
            expect(d).toHaveLength(3);
            done();
          }
        });

      addMessagesToSection({
        roomId: '22',
        sectionId: '33',
        messages: [{
          id: 2,
          fr: 'my first message'
        }]
      });

      addMessagesToSection({
        roomId: '22',
        sectionId: '33',
        messages: [{
          id: 3,
          fr: 'my first message'
        }]
      });
    });
    test('it should be triggered only by new messages', (done) => {
      let numberOfCall = 0;
      const identicalMessage = {
        roomId: '22',
        sectionId: '33',
        messages: [{
          fr: 'my first message'
        }]
      };
      addMessagesToSection(identicalMessage);

      $messagesFromSection({ roomId: '22', sectionId: '33' })
        .subscribe(d => {
          numberOfCall++;

          if (d.length === 2) {
            expect(d).toHaveLength(2);
            done();
          }
        });

      toggleWS({
        roomId: '22',
        sectionId: '33',
        ws: true
      });

      toggleWS({
        roomId: '22',
        sectionId: '33',
        ws: true
      });

      addMessagesToSection(identicalMessage);

      addMessagesToSection({
        roomId: '22',
        sectionId: '33',
        messages: [{
          fr: 'my third message'
        }]
      });
    });
  });
});
