import { JSONRPCMethods } from '../../../models/JSONRPCMethods.enum';

export const messagesJSONRPCFactory = (configuration:{read, write}) => {
  const fetchMessages = (data, callback) => {

  };

  const writeMessages = (data, callback) => {

  };
  return {
    [JSONRPCMethods.room.message.read]: fetchMessages,
    [JSONRPCMethods.room.message.write]: writeMessages
  };
};
