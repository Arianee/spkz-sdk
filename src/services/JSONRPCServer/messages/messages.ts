import { JSONRPCMethods } from '../../../models/JSONRPCMethods.enum';
import { requiredDefined, requiredType } from '../../../helpers/required/required';
import { utils } from '../../utils';
import { JSONRPCErrors } from '../../../models/JSONRPCError';
import { NetworkParameters } from '../../../models/jsonrpc/networkParameters';
import { ErrorPayload } from '../../../models/jsonrpc/errorPayload';
import { MessageParameters } from '../../../models/jsonrpc/JSONRPCParameters';

export const messagesJSONRPCFactory = (networkParameters:NetworkParameters) => (configuration:MessageParameters) => {
  const { chainId, network } = networkParameters;
  const limit = 100;

  const fetchMessages = async (params, callback) => {
    try {
      requiredDefined(params, 'params should be defined');

      const { authorizations, roomId, sectionId, fromTimestamp, toTimestamp } = params;
      requiredDefined(roomId, 'roomId should be defined');
      requiredDefined(sectionId, 'sectionId should be defined');
      requiredDefined(authorizations, 'authorizations should be defined');

      const { isAuthorized, blockchainWallets } = await utils.rightService.verifyPayloadSignatures(params);

      if (isAuthorized === false) {
        const errorPayload:ErrorPayload = JSONRPCErrors.wrongSignatureForPayload;
        return callback(errorPayload);
      }

      const firstBlockchainWallet = blockchainWallets[0];
      const hasRightToRead = await utils.rightService.canReadSection({ roomId, sectionId, address: firstBlockchainWallet });

      if (hasRightToRead.isAuthorized === false) {
        const errorPayload = JSONRPCErrors.notHasReadRight;
        errorPayload.details = hasRightToRead.strategies;
        return callback(errorPayload);
      }

      const messages = await configuration.read({
        chainId: chainId.toString(),
        limit,
        network: network.toString(),
        roomId: roomId.toString(),
        sectionId: sectionId.toString(),
        fromTimestamp,
        toTimestamp
      });

      requiredType(messages.messages, 'array', 'messages should be an array');
      messages.messages.forEach(d => requiredType(d.payload, 'object', 'payload should be a json on return'));

      return callback(null, messages);
    } catch (e) {
      const errorPayload = JSONRPCErrors.unknownError;
      errorPayload.details = JSON.stringify(e);
      return callback(errorPayload);
    }
  };

  const writeMessages = async (params, callback) => {
    try {
      requiredDefined(params, 'params should be defined');

      const { authorizations, roomId, sectionId, content, signature } = params;
      requiredDefined(roomId, 'roomId should be defined');
      requiredDefined(sectionId, 'sectionId should be defined');
      requiredDefined(content, 'content should be defined');
      requiredDefined(authorizations, 'authorizations should be defined');

      const { isAuthorized, blockchainWallets, proxyWalletAddress } = await utils.rightService
        .verifyPayloadSignatures(params);

      if (isAuthorized === false) {
        const errorPayload:ErrorPayload = JSONRPCErrors.wrongSignatureForPayload;
        return callback(errorPayload);
      }
      const firstBlockchainWallet = blockchainWallets[0];
      const hasRightToRead = await utils.rightService.canWriteSection(
        { roomId, sectionId, address: firstBlockchainWallet });

      if (hasRightToRead.isAuthorized === false) {
        const errorPayload = JSONRPCErrors.notHasWriteRight;
        errorPayload.details = hasRightToRead.strategies;
        return callback(errorPayload);
      }

      await configuration.write(
        {
          roomId: roomId.toString(),
          sectionId: sectionId.toString(),
          payload: params,
          network: networkParameters.network.toString(),
          chainId: networkParameters.chainId.toString(),
          blockchainWallet: firstBlockchainWallet.toString(),
          signature
        }
      );
      return callback(null, params);
    } catch (e) {
      const errorPayload = JSONRPCErrors.unknownError;
      errorPayload.details = JSON.stringify(e);
      return callback(errorPayload);
    }
  };

  const fetchNewMessages = async (params, callback) => {
    try {
      requiredDefined(params, 'params should be defined');

      const { authorizations, roomId, sectionId, fromTimestamp, toTimestamp } = params;
      requiredDefined(roomId, 'roomId should be defined');
      requiredDefined(authorizations, 'authorizations should be defined');

      const { isAuthorized, blockchainWallets } = await utils.rightService.verifyPayloadSignatures(params);

      if (isAuthorized === false) {
        const errorPayload:ErrorPayload = JSONRPCErrors.wrongSignatureForPayload;
        return callback(errorPayload);
      }

      const firstBlockchainWallet = blockchainWallets[0];

      const newMessageCount = await configuration.newMessage({
        chainId: chainId.toString(),
        blockchainWallet: firstBlockchainWallet.toString(),
        network: network.toString(),
        roomId: roomId.toString()
      });

      requiredType(newMessageCount, 'array', 'newMessageCount should be an array');

      return callback(null, newMessageCount);
    } catch (e) {
      const errorPayload = JSONRPCErrors.unknownError;
      errorPayload.details = JSON.stringify(e);
      return callback(errorPayload);
    }
  };
  return {
    [JSONRPCMethods.room.message.read]: fetchMessages,
    [JSONRPCMethods.room.message.write]: writeMessages,
    [JSONRPCMethods.room.message.newMessage]: fetchNewMessages
  };
};
