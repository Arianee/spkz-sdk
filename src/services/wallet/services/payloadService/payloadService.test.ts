import { PayloadService } from './payloadService';
import { ProxyWalletService } from '../proxyWalletService/proxyWalletService';

describe('payload service', function () {
  const pk = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';

  const authorizations = [
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJFVEgifQ==.eyJpc3MiOiIweDE0NjJCMzk3YmY4ODQ1ZjY0NDhhNkMwZTZGNTIxZWQyNDU4RjY4RDAiLCJleHAiOjg2NTYzMjEyOTI2NTY3Nywic3ViIjoiMHg4RjJBM0U0QkQxYzIxNTgwYjRhMjJlNkE5MWVkNjUwQTUwNTAzQzQ1In0=.0xc1a4b44cec4a37df21b82642b829c64c68ab44c234191959882a186e844aa9d714b230b2ac6ddfc5b7d94861dd3a6052ab80c3560a92d59148c689c177e3b9091c'
  ];

  let payloadService:PayloadService;
  beforeEach(() => {
    const messagingWallet = new ProxyWalletService();
    messagingWallet.privateKey = pk;
    payloadService = new PayloadService(messagingWallet);
  });

  describe('test', () => {
    test('test', () => {
      expect(true).toBe(true);
    });
  });
});
