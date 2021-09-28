import { JSONRPCMethods } from '../../../models/JSONRPCMethods.enum';
import { requiredDefined } from '../../../helpers/required/required';
import { utils } from '../../utils';
import { JSONRPCErrors } from '../../../models/JSONRPCError';
import { NetworkParameters } from '../../../models/jsonrpc/networkParameters';
import { BouncerParameters } from '../../../models/jsonrpc/JSONRPCParameters';

export const bouncerJSONRPCFactory = (networkParameters: NetworkParameters) => (configuration: BouncerParameters) => {
  const { chainId, network } = networkParameters;

  const getMyProfile = async (params, callback) => {
    requiredDefined(params, 'params should be defined');

    const { authorizations, roomId, sectionId } = params;
    requiredDefined(authorizations, 'authorizations should be defined');

    const { isAuthorized, blockchainWallets } = await utils.rightService.verifyPayloadSignatures(params);

    if (isAuthorized === false) {
      callback(new Error(JSONRPCErrors.wrongSignatureForPayload));
    }

    const firstBlockchainWallet = blockchainWallets[0];

    try {
      const myProfile = await configuration.getMyProfile({ blockchainWallet: firstBlockchainWallet });
      callback(null, myProfile);
    } catch (e) {
      callback(e);
    }
  };

  const getUserRooms = async (params, callback) => {
    requiredDefined(params, 'params should be defined');

    const { authorizations } = params;
    requiredDefined(authorizations, 'authorizations should be defined');

    const { isAuthorized, blockchainWallets } = await utils.rightService.verifyPayloadSignatures(params);

    if (isAuthorized === false) {
      callback(new Error(JSONRPCErrors.wrongSignatureForPayload));
    }

    const firstBlockchainWallet = blockchainWallets[0];

    try {
      const myRooms = await configuration.getUserRooms({ blockchainWallet: firstBlockchainWallet });
      callback(null, myRooms);
    } catch (e) {
      callback(e);
    }
  };

  const joinRoom = async (params, callback) => {
    requiredDefined(params, 'params should be defined');

    const { authorizations, roomId, sectionId } = params;
    requiredDefined(roomId, 'roomId should be defined');
    requiredDefined(authorizations, 'authorizations should be defined');

    const { isAuthorized, blockchainWallets } = await utils.rightService.verifyPayloadSignatures(params);

    if (isAuthorized === false) {
      callback(new Error(JSONRPCErrors.wrongSignatureForPayload));
    }

    const firstBlockchainWallet = blockchainWallets[0];

    try {
      await configuration.joinRoom({
        payload: params,
        blockchainWallet: firstBlockchainWallet,
        chainId,
        network,
        roomId
      });
      callback(null, params);
    } catch (e) {
      callback(e);
    }
  };

  const updateMyProfile = async (params, callback) => {
    requiredDefined(params, 'params should be defined');

    const { authorizations, roomId, sectionId, userProfile } = params;
    requiredDefined(authorizations, 'authorizations should be defined');

    const { isAuthorized, blockchainWallets } = await utils.rightService.verifyPayloadSignatures(params);

    if (isAuthorized === false) {
      callback(new Error(JSONRPCErrors.wrongSignatureForPayload));
    }

    const firstBlockchainWallet = blockchainWallets[0];

    try {
      await configuration.updateProfile({
        payload: params,
        blockchainWallet: firstBlockchainWallet
      });
      callback(null, params);
    } catch (e) {
      callback(e);
    }
  };

  return {
    [JSONRPCMethods.bouncer.rooms.getUserRooms]: getUserRooms,
    [JSONRPCMethods.bouncer.users.getMyProfile]: getMyProfile,
    [JSONRPCMethods.bouncer.users.updateMyProfile]: updateMyProfile,
    [JSONRPCMethods.bouncer.rooms.join]: joinRoom

  };
};
