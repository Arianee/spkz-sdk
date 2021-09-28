import { JSONRPCMethods } from '../../../models/JSONRPCMethods.enum';
import { requiredDefined, requiredType } from '../../../helpers/required/required';
import { utils } from '../../utils';
import { JSONRPCErrors } from '../../../models/JSONRPCError';
import { NetworkParameters } from '../../../models/jsonrpc/networkParameters';
import { SectionUserParameters } from '../../../models/jsonrpc/JSONRPCParameters';

export const userJSONRPCFactory = (networkParameters: NetworkParameters) => (configuration: SectionUserParameters) => {
  const { chainId, network } = networkParameters;

  const userUpdate = async (params, callback) => {
    requiredDefined(params, 'params should be defined');

    const { authorizations, roomId, sectionId, userProfile } = params;
    requiredDefined(roomId, 'roomId should be defined');
    requiredDefined(sectionId, 'sectionId should be defined');
    requiredDefined(authorizations, 'authorizations should be defined');

    const { isAuthorized, blockchainWallets } = await utils.rightService.verifyPayloadSignatures(params);

    if (isAuthorized === false) {
      callback(new Error(JSONRPCErrors.wrongSignatureForPayload));
    }

    const firstBlockchainWallet = blockchainWallets[0];
    const hasRightToRead = await utils.rightService.canReadSection({
      roomId,
      sectionId,
      address: firstBlockchainWallet
    });

    if (hasRightToRead.isAuthorized === false) {
      callback(new Error(JSONRPCErrors.notHasReadRight));
    }

    try {
      await configuration.createOrUpdateProfile({
        roomId,
        sectionId,
        blockchainWallet: firstBlockchainWallet,
        chainId,
        network,
        payload: params
      });

      callback(null, params);
    } catch (e) {
      callback(e);
    }
  };

  const getUsers = async (params, callback) => {
    requiredDefined(params, 'params should be defined');

    const { authorizations, roomId, sectionId } = params;
    requiredDefined(roomId, 'roomId should be defined');
    requiredDefined(sectionId, 'sectionId should be defined');
    requiredDefined(authorizations, 'authorizations should be defined');

    const { isAuthorized, blockchainWallets, proxyWalletAddress } = await utils.rightService
      .verifyPayloadSignatures(params);

    if (isAuthorized === false) {
      return callback(new Error(JSONRPCErrors.wrongSignatureForPayload));
    }

    const firstBlockchainWallet = blockchainWallets[0];
    const hasRightToRead = await utils.rightService.canReadSection(
      { roomId, sectionId, address: firstBlockchainWallet });

    if (hasRightToRead.isAuthorized === false) {
      return callback(new Error(JSONRPCErrors.notHasWriteRight));
    }

    try {
      const sectionUsers = await configuration.getUsers(
        {
          roomId,
          sectionId,
          network: networkParameters.network,
          chainId: networkParameters.chainId
        }
      );

      sectionUsers.forEach(d => requiredType(d.payload, 'object', 'payload should be a json on return'));

      return callback(null, sectionUsers);
    } catch (e) {
      return callback(e);
    }
  };

  const joinSection = async (params, callback) => {
    requiredDefined(params, 'params should be defined');

    const { authorizations, roomId, sectionId, userProfile } = params;
    requiredDefined(roomId, 'roomId should be defined');
    requiredDefined(sectionId, 'sectionId should be defined');
    requiredDefined(authorizations, 'authorizations should be defined');

    const { isAuthorized, blockchainWallets } = await utils.rightService.verifyPayloadSignatures(params);

    if (isAuthorized === false) {
      callback(new Error(JSONRPCErrors.wrongSignatureForPayload));
    }

    const firstBlockchainWallet = blockchainWallets[0];
    const hasRightToRead = await utils.rightService.canReadSection({
      roomId,
      sectionId,
      address: firstBlockchainWallet
    });

    if (hasRightToRead.isAuthorized === false) {
      callback(new Error(JSONRPCErrors.notHasReadRight));
    }

    try {
      await configuration.joinSection({
        roomId,
        sectionId,
        blockchainWallet: firstBlockchainWallet,
        chainId,
        network,
        payload: params
      });

      callback(null, params);
    } catch (e) {
      callback(e);
    }
  };

  return {
    [JSONRPCMethods.room.section.updateProfile]: userUpdate,
    [JSONRPCMethods.room.section.users]: getUsers,
    [JSONRPCMethods.room.section.join]: joinSection

  };
};
