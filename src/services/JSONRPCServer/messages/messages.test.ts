
import { messagesJSONRPCFactory } from './messages';
import {
  ReadMessageParameters,
  ReadMessageReturn, WriteMessageParameters
} from '../../../models/jsonrpc/writeMessageParameters';
import { JSONRPCMethods } from '../../../models/JSONRPCMethods.enum';

const mockReadMessage = jest.fn((params:ReadMessageParameters):Promise<ReadMessageReturn> => {
  return Promise.resolve({
    messages: [],
    messageCount: 0,
    isMoreMessages: false

  });
});

jest.mock('../../utils', () => {
  return {
    utils: {
      rightService: {
        verifyPayloadSignatures: async (params) => { return { isAuthorized: true, blockchainWallets: ['0x0000000000000000000000000000000000000000'] }; },
        canReadSection: ({ roomId, sectionId, address: firstBlockchainWallet }) => { return { isAuthorized: true }; }
      }
    }
  };
});

function writeMessage (params:WriteMessageParameters):Promise<any> {
  return Promise.resolve();
}
describe('read message', () => {
  test('read message should pass parameters to messageReadFunction', async () => {
    const factory = messagesJSONRPCFactory({ chainId: '0', network: '0' });
    const dateNow = Date.now();
    await new Promise((resolve, reject) => {
      factory({
        read: mockReadMessage,
        write: writeMessage
      })[JSONRPCMethods.room.message.read](
        {
          authorizations: [],
          roomId: 0,
          sectionId: 0,
          toTimestamp: dateNow,
          fromTimestamp: dateNow
        }, (code, message) => {
          expect(message).toMatchObject({ messages: [], messageCount: 0, isMoreMessages: false });
          resolve();
        });
    });

    expect(mockReadMessage.mock.calls[0][0].roomId).toBe('0');
    expect(mockReadMessage.mock.calls[0][0].sectionId).toBe('0');
    expect(mockReadMessage.mock.calls[0][0].network).toBe('0');
    expect(mockReadMessage.mock.calls[0][0].chainId).toBe('0');
    expect(mockReadMessage.mock.calls[0][0].toTimestamp).toBe(dateNow);
    expect(mockReadMessage.mock.calls[0][0].fromTimestamp).toBe(dateNow);
    expect(mockReadMessage.mock.calls).toHaveLength(1);
  });
});
