import { JSONRPCMethods } from '../../../models/JSONRPCMethods.enum';
import { requiredDefined } from '../../../helpers/required/required';
import { utils } from '../../utils';
import { JSONRPCErrors } from '../../../models/JSONRPCError';
import { NetworkParameters } from '../../../models/jsonrpc/networkParameters';
import { BouncerParameters } from '../../../models/jsonrpc/JSONRPCParameters';

export const bouncerJSONRPCFactory = (networkParameters: NetworkParameters) =>
  (configuration: BouncerParameters) => {
    const { chainId, network } = networkParameters;

    const getMyProfile = async (params, callback) => {
      try {
        requiredDefined(params, 'params should be defined');

        const { authorizations, roomId, sectionId } = params;
        requiredDefined(authorizations, 'authorizations should be defined');

        const { isAuthorized, blockchainWallets } = await utils.rightService.verifyPayloadSignatures(params);

        if (isAuthorized === false) {
          return callback(new Error(JSONRPCErrors.wrongSignatureForPayload));
        }

        const firstBlockchainWallet = blockchainWallets[0];

        const myProfile = await configuration.getMyProfile({
          blockchainWallet: firstBlockchainWallet,
          network: networkParameters.network,
          chainId: networkParameters.chainId
        });
        return callback(null, myProfile);
      } catch (e) {
        return callback(e);
      }
    };

    const getUserRooms = async (params, callback) => {
      try {
        requiredDefined(params, 'params should be defined');

        const { authorizations } = params;
        requiredDefined(authorizations, 'authorizations should be defined');

        const { isAuthorized, blockchainWallets } = await utils.rightService.verifyPayloadSignatures(params);

        if (isAuthorized === false) {
          return callback(new Error(JSONRPCErrors.wrongSignatureForPayload));
        }

        const firstBlockchainWallet = blockchainWallets[0];

        const myRooms = await configuration.getUserRooms({
          blockchainWallet: firstBlockchainWallet,
          network: networkParameters.network,
          chainId: networkParameters.chainId
        });
        return callback(null, myRooms);
      } catch (e) {
        return callback(e);
      }
    };

    const joinRoom = async (params, callback) => {
      requiredDefined(params, 'params should be defined');

      const { authorizations, roomId, sectionId } = params;
      requiredDefined(roomId, 'roomId should be defined');
      requiredDefined(authorizations, 'authorizations should be defined');

      const { isAuthorized, blockchainWallets } = await utils.rightService.verifyPayloadSignatures(params);

      if (isAuthorized === false) {
        return callback(new Error(JSONRPCErrors.wrongSignatureForPayload));
      }

      const firstBlockchainWallet = blockchainWallets[0];

      try {
        await configuration.joinRoom({
          payload: params,
          blockchainWallet: firstBlockchainWallet.toString(),
          chainId: chainId.toString(),
          network: network.toString(),
          roomId: roomId.toString()
        });
        return callback(null, params);
      } catch (e) {
        return callback(e);
      }
    };

    const updateMyProfile = async (params, callback) => {
      try {
        requiredDefined(params, 'params should be defined');

        const { authorizations, roomId, sectionId, userProfile } = params;
        requiredDefined(authorizations, 'authorizations should be defined');

        const { isAuthorized, blockchainWallets } = await utils.rightService.verifyPayloadSignatures(params);

        if (isAuthorized === false) {
          return callback(new Error(JSONRPCErrors.wrongSignatureForPayload));
        }

        const firstBlockchainWallet = blockchainWallets[0];

        await configuration.updateProfile({
          payload: params,
          blockchainWallet: firstBlockchainWallet.toString()
        });
        return callback(null, params);
      } catch (e) {
        return callback(e);
      }
    };

    return {
      [JSONRPCMethods.bouncer.rooms.getUserRooms]: getUserRooms,
      [JSONRPCMethods.bouncer.users.getMyProfile]: getMyProfile,
      [JSONRPCMethods.bouncer.users.updateMyProfile]: updateMyProfile,
      [JSONRPCMethods.bouncer.rooms.join]: joinRoom

    };
  };
