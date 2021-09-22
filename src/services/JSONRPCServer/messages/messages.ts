import { JSONRPCMethods } from '../../../models/JSONRPCMethods.enum';
import { requiredDefined } from '../../../helpers/required/required';
import { utils } from '../../utils';
import { JSONRPCErrors } from '../../../models/JSONRPCError';

export const messagesJSONRPCFactory = (configuration:{read, write}) => {
  const fetchMessages = async (params, callback) => {
    requiredDefined(params, 'params should be defined');

    const { authorizations, roomId, sectionId } = params;
    requiredDefined(roomId, 'roomId should be defined');
    requiredDefined(sectionId, 'sectionId should be defined');
    requiredDefined(authorizations, 'authorizations should be defined');

    const { isAuthorized, blockchainWallets } = await utils.rightService.verifyPayloadSignatures(params);

    if (isAuthorized === false) {
      callback(new Error(JSONRPCErrors.wrongSignatureForPayload));
    }

    const firstBlockchainWallet = blockchainWallets[0];
    const hasRightToRead = await utils.rightService.canReadSection({ roomId, sectionId, address: firstBlockchainWallet });

    if (hasRightToRead.isAuthorized === false) {
      callback(new Error(JSONRPCErrors.notHasReadRight));
    }

    try {
      const messages = await configuration.read({ roomId, sectionId });
      callback(null, messages);
    } catch (e) {
      callback(e);
    }
  };

  const writeMessages = async (params, callback) => {
    requiredDefined(params, 'params should be defined');

    const { authorizations, roomId, sectionId, content, signature } = params;
    requiredDefined(roomId, 'roomId should be defined');
    requiredDefined(sectionId, 'sectionId should be defined');
    requiredDefined(content, 'content should be defined');
    requiredDefined(authorizations, 'authorizations should be defined');

    const { isAuthorized, blockchainWallets } = await utils.rightService
      .verifyPayloadSignatures(params);

    if (isAuthorized === false) {
      return callback(new Error(JSONRPCErrors.wrongSignatureForPayload));
    }

    const firstBlockchainWallet = blockchainWallets[0];
    const hasRightToRead = await utils.rightService.canWriteSection(
      { roomId, sectionId, address: firstBlockchainWallet });

    if (hasRightToRead.isAuthorized === false) {
      return callback(new Error(JSONRPCErrors.notHasWriteRight));
    }

    try {
      await configuration.write({ roomId, sectionId, content, authorizations, signature });
      return callback(null, content);
    } catch (e) {
      return callback(e);
    }
  };
  return {
    [JSONRPCMethods.room.message.read]: fetchMessages,
    [JSONRPCMethods.room.message.write]: writeMessages
  };
};
