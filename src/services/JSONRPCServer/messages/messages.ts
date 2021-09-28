import { JSONRPCMethods } from '../../../models/JSONRPCMethods.enum';
import { requiredDefined, requiredType } from '../../../helpers/required/required';
import { utils } from '../../utils';
import { JSONRPCErrors } from '../../../models/JSONRPCError';
import { AsyncFunc } from '../../../models/AsyncFunc';
import { ReadMessageParameters, WriteMessageParameters } from '../../../models/jsonrpc/writeMessageParameters';
import { NetworkParameters } from '../../../models/jsonrpc/networkParameters';

export const messagesJSONRPCFactory = (networkParameters:NetworkParameters) => (configuration: {
  read: AsyncFunc<ReadMessageParameters, any>,
  write: AsyncFunc<WriteMessageParameters, any>
}) => {
  const { chainId, network } = networkParameters;
  const limit = 100;

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
      const messages = await configuration.read({
        chainId: chainId.toString(),
        limit,
        network: network.toString(),
        roomId: roomId.toString(),
        sectionId: sectionId.toString()
      });

      messages.forEach(d => requiredType(d.payload, 'object', 'payload should be a json on return'));

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

    const { isAuthorized, blockchainWallets, proxyWalletAddress } = await utils.rightService
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
