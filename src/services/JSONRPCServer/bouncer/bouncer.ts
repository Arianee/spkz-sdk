import { JSONRPCMethods } from '../../../models/JSONRPCMethods.enum';
import { requiredDefined } from '../../../helpers/required/required';
import { utils } from '../../utils';
import { JSONRPCErrors } from '../../../models/JSONRPCError';
import { NetworkParameters } from '../../../models/jsonrpc/networkParameters';
import { BouncerParameters } from '../../../models/jsonrpc/JSONRPCParameters';
import { ErrorPayload } from '../../../models/jsonrpc/errorPayload';

export const bouncerJSONRPCFactory = (networkParameters: NetworkParameters) =>
  (configuration: BouncerParameters) => {
    const { chainId, network } = networkParameters;

    const getMyProfile = async (params, callback) => {
      try {
        requiredDefined(params, 'params should be defined');

        const { authorizations, roomId, sectionId } = params;
        requiredDefined(authorizations, 'authorizations should be defined');

        const { isAuthorized, blockchainWallets, details } = await utils.rightService.verifyPayloadSignatures(params);

        if (isAuthorized === false) {
          const errorPayload:ErrorPayload[] = details;
          return callback(errorPayload);
        }

        const firstBlockchainWallet = blockchainWallets[0];

        const myProfile = await configuration.getMyProfile({
          blockchainWallet: firstBlockchainWallet,
          network: networkParameters.network,
          chainId: networkParameters.chainId
        });
        return callback(null, myProfile);
      } catch (e) {
        const errorPayload = JSONRPCErrors.unknownError;
        errorPayload.details = JSON.stringify(e);
        return callback(errorPayload);
      }
    };

    const getUserRooms = async (params, callback) => {
      try {
        requiredDefined(params, 'params should be defined');

        const { authorizations } = params;
        requiredDefined(authorizations, 'authorizations should be defined');

        const { isAuthorized, blockchainWallets, details } = await utils.rightService.verifyPayloadSignatures(params);

        if (isAuthorized === false) {
          const errorPayload:ErrorPayload[] = details;
          return callback(errorPayload);
        }

        const firstBlockchainWallet = blockchainWallets[0];

        const myRooms = await configuration.getUserRooms({
          blockchainWallet: firstBlockchainWallet,
          network: networkParameters.network,
          chainId: networkParameters.chainId
        });
        return callback(null, myRooms);
      } catch (e) {
        const errorPayload = JSONRPCErrors.unknownError;
        errorPayload.details = JSON.stringify(e);
        return callback(errorPayload);
      }
    };

    const joinRoom = async (params, callback) => {
      requiredDefined(params, 'params should be defined');

      const { authorizations, roomId, sectionId } = params;
      requiredDefined(roomId, 'roomId should be defined');
      requiredDefined(authorizations, 'authorizations should be defined');

      const { isAuthorized, blockchainWallets, details } = await utils.rightService.verifyPayloadSignatures(params);

      if (isAuthorized === false) {
        const errorPayload:ErrorPayload[] = details;
        return callback(errorPayload);
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
        const errorPayload = JSONRPCErrors.unknownError;
        errorPayload.details = JSON.stringify(e);
        return callback(errorPayload);
      }
    };

    const updateMyProfile = async (params, callback) => {
      try {
        requiredDefined(params, 'params should be defined');

        const { authorizations, roomId, sectionId, userProfile } = params;
        requiredDefined(authorizations, 'authorizations should be defined');

        const { isAuthorized, blockchainWallets, details } = await utils.rightService.verifyPayloadSignatures(params);

        if (isAuthorized === false) {
          const errorPayload:ErrorPayload[] = details;
          return callback(errorPayload);
        }

        const firstBlockchainWallet = blockchainWallets[0];

        await configuration.updateProfile({
          payload: params,
          blockchainWallet: firstBlockchainWallet.toString()
        });
        return callback(null, params);
      } catch (e) {
        const errorPayload = JSONRPCErrors.unknownError;
        errorPayload.details = JSON.stringify(e);
        return callback(errorPayload);
      }
    };

    const updateNotificationPreferences = async (params, callback) => {
      try {
        requiredDefined(params, 'params should be defined');

        const { authorizations, roomId, sectionId, preferences } = params;
        requiredDefined(authorizations, 'authorizations should be defined');
        requiredDefined(preferences, 'preferences should be defined');

        const { isAuthorized, blockchainWallets, details } = await utils.rightService.verifyPayloadSignatures(params);

        if (isAuthorized === false) {
          const errorPayload:ErrorPayload[] = details;
          return callback(errorPayload);
        }

        const firstBlockchainWallet = blockchainWallets[0];
        await configuration.updateNotificationPreferences({
          preferences,
          sectionId,
          roomId,
          blockchainWallet: firstBlockchainWallet.toString()
        });
        return callback(null, params);
      } catch (e) {
        const errorPayload = JSONRPCErrors.unknownError;
        errorPayload.details = JSON.stringify(e);
        return callback(errorPayload);
      }
    };

    return {
      [JSONRPCMethods.bouncer.rooms.getUserRooms]: getUserRooms,
      [JSONRPCMethods.bouncer.users.getMyProfile]: getMyProfile,
      [JSONRPCMethods.bouncer.users.updateMyProfile]: updateMyProfile,
      [JSONRPCMethods.bouncer.rooms.join]: joinRoom,
      [JSONRPCMethods.bouncer.users.updateNotificationPreferences]: updateNotificationPreferences
    };
  };
