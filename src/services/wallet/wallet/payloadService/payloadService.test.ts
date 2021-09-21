import { PayloadService } from './payloadService';
import { MessagingWallet } from '../messagingWallet/messagingWallet';

describe('payload service', function () {
  const pk = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';

  const authorizations = [
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJFVEgifQ==.eyJpc3MiOiIweDE0NjJCMzk3YmY4ODQ1ZjY0NDhhNkMwZTZGNTIxZWQyNDU4RjY4RDAiLCJleHAiOjg2NTYzMjEyOTI2NTY3Nywic3ViIjoiMHg4RjJBM0U0QkQxYzIxNTgwYjRhMjJlNkE5MWVkNjUwQTUwNTAzQzQ1In0=.0xc1a4b44cec4a37df21b82642b829c64c68ab44c234191959882a186e844aa9d714b230b2ac6ddfc5b7d94861dd3a6052ab80c3560a92d59148c689c177e3b9091c'
  ];

  let payloadService:PayloadService;
  beforeEach(() => {
    const messagingWallet = new MessagingWallet();
    messagingWallet.privateKey = pk;
    payloadService = new PayloadService(messagingWallet);
  });
  describe('global signature of payload', () => {
    describe('missing parameters', () => {
      test('missing params', async () => {
        let inError = false;
        try {
          const d = await payloadService.globalSignPayload({
            jsonrpc: '2.0',
            authorizations,
            method: 'group.readAllMessages'
          });
        } catch (e) {
          inError = true;
        }
        expect(inError).toBeTruthy();
      });
    });
    test('should return true if authorizations pub key correponds to global signing pub key', async () => {
      const content = {
        jsonrpc: '2.0',
        method: 'group.readAllMessages',
        params: {
          authorizations,
          room: {
            title: 'my title',
            description: 'my description'
          }
        }
      };

      const messagingWallet = new MessagingWallet();
      messagingWallet.privateKey = pk;
      const payloadService = new PayloadService(messagingWallet);

      const payloadWithSignature = await payloadService.globalSignPayload(content);
      const e = await payloadService.verifyPayloadSignatures(payloadWithSignature);

      expect(e).toBeTruthy();
    });
    test('should return false if authorizations pub key does not correpond to global signing pub key', async () => {
      // signature of c14d9819e7fbb7009a7dac292f15c564cca846fe1e5983065425ea9338ca4326
      const payloadWithSignature = {
        jsonrpc: '2.0',
        method: 'group.readAllMessages',
        params: {
          authorizations: [
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJFVEgifQ==.eyJpc3MiOiIweDE0NjJCMzk3YmY4ODQ1ZjY0NDhhNkMwZTZGNTIxZWQyNDU4RjY4RDAiLCJleHAiOjg2NTYzMjEyOTI2NTY3Nywic3ViIjoiMHg4RjJBM0U0QkQxYzIxNTgwYjRhMjJlNkE5MWVkNjUwQTUwNTAzQzQ1In0=.0xc1a4b44cec4a37df21b82642b829c64c68ab44c234191959882a186e844aa9d714b230b2ac6ddfc5b7d94861dd3a6052ab80c3560a92d59148c689c177e3b9091c'
          ],
          room: { title: 'my title', description: 'my description' },
          signature: '0x56bb793abad42d72134b88778e6b82dad98f1b6a0dd94aae045a60321eecb22a4ef971bbb134da69ae45684eb9bc964fc845c64e0a2f2cc262f4d01563ff9a011b'
        }
      };

      const e = await payloadService.verifyPayloadSignatures(payloadWithSignature);

      expect(e).toBeFalsy();
    });
  });
});
