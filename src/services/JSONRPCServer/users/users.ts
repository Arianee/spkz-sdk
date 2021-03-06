import { JSONRPCMethods } from '../../../models/JSONRPCMethods.enum';
import { requiredDefined, requiredType } from '../../../helpers/required/required';
import { utils } from '../../utils';
import { JSONRPCErrors } from '../../../models/JSONRPCError';
import { NetworkParameters } from '../../../models/jsonrpc/networkParameters';
import { SectionUserParameters } from '../../../models/jsonrpc/JSONRPCParameters';
import { ErrorPayload } from '../../../models/jsonrpc/errorPayload';

export const userJSONRPCFactory = (networkParameters: NetworkParameters) => (
  configuration: SectionUserParameters) => {
  const {
    chainId,
    network
  } = networkParameters;

  const userUpdate = async (params, callback) => {
    try {
      requiredDefined(params, 'params should be defined');
      const {
        authorizations,
        roomId,
        sectionId,
        userProfile,
        dry
      } = params;
      requiredDefined(roomId, 'roomId should be defined');
      requiredDefined(sectionId, 'sectionId should be defined');
      requiredDefined(authorizations, 'authorizations should be defined');

      const {
        isAuthorized,
        blockchainWallets,
        details
      } = await utils.rightService.verifyPayloadSignatures(params);

      if (isAuthorized === false) {
        const errorPayload: ErrorPayload[] = details;
        return callback(errorPayload);
      }

      const firstBlockchainWallet = blockchainWallets[0];
      const hasRightToJoin = await utils.rightService.canJoinRoom({
        roomId,
        address: firstBlockchainWallet
      });

      if (hasRightToJoin.isAuthorized === false) {
        const errorPayload = JSONRPCErrors.notHasJoinRoomRight;
        errorPayload.details = hasRightToJoin;
        return callback(errorPayload);
      }

      if (dry !== true) {
        await configuration.createOrUpdateProfile({
          roomId,
          sectionId,
          blockchainWallet: firstBlockchainWallet,
          chainId,
          network,
          payload: params
        });
      }

      return callback(null, { details: hasRightToJoin, params });
    } catch (e) {
      const errorPayload = JSONRPCErrors.unknownError;
      errorPayload.details = JSON.stringify(e);
      return callback(errorPayload);
    }
  };

  const getUsers = async (params, callback) => {
    try {
      requiredDefined(params, 'params should be defined');

      const {
        authorizations,
        roomId,
        sectionId
      } = params;
      requiredDefined(roomId, 'roomId should be defined');
      requiredDefined(sectionId, 'sectionId should be defined');
      requiredDefined(authorizations, 'authorizations should be defined');

      const {
        isAuthorized,
        blockchainWallets,
        proxyWalletAddress,
        details
      } = await utils.rightService
        .verifyPayloadSignatures(params);

      if (isAuthorized === false) {
        const errorPayload: ErrorPayload[] = details;
        return callback(errorPayload);
      }

      const firstBlockchainWallet = blockchainWallets[0];
      const hasRightToRead = await utils.rightService.canReadSection(
        {
          roomId,
          sectionId,
          address: firstBlockchainWallet
        });

      if (hasRightToRead.isAuthorized === false) {
        const errorPayload = JSONRPCErrors.notHasReadRight;
        errorPayload.details = hasRightToRead.strategies;
        return callback(errorPayload);
      }

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
      const errorPayload = JSONRPCErrors.unknownError;
      errorPayload.details = JSON.stringify(e);
      return callback(errorPayload);
    }
  };

  const joinSection = async (params, callback) => {
    try {
      requiredDefined(params, 'params should be defined');
      const {
        authorizations,
        roomId,
        sectionId,
        userProfile
      } = params;
      requiredDefined(roomId, 'roomId should be defined');
      requiredDefined(sectionId, 'sectionId should be defined');
      requiredDefined(authorizations, 'authorizations should be defined');

      const {
        isAuthorized,
        blockchainWallets,
        details
      } = await utils.rightService.verifyPayloadSignatures(params);

      if (isAuthorized === false) {
        const errorPayload: ErrorPayload[] = details;
        return callback(errorPayload);
      }
      const firstBlockchainWallet = blockchainWallets[0];

      const hasRights = await utils.rightService.canJoinSection({
        roomId,
        sectionId,
        address: firstBlockchainWallet
      });

      if (hasRights.isAuthorized === false) {
        const errorPayload = JSONRPCErrors.notHasReadRight;
        errorPayload.details = hasRights;
        return callback(errorPayload);
      }

      if (params.dry !== true) {
        await configuration.joinSection({
          roomId,
          sectionId,
          blockchainWallet: firstBlockchainWallet,
          chainId,
          network,
          payload: params
        });
      }

      return callback(null, { details: hasRights });
    } catch (e) {
      const errorPayload = JSONRPCErrors.unknownError;
      errorPayload.details = JSON.stringify(e);
      return callback(errorPayload);
    }
  };

  const updateLastViewed = async (params, callback) => {
    try {
      requiredDefined(params, 'params should be defined');
      const {
        authorizations,
        roomId,
        sectionId,
        userProfile
      } = params;

      requiredDefined(roomId, 'roomId should be defined');
      requiredDefined(sectionId, 'sectionId should be defined');
      requiredDefined(authorizations, 'authorizations should be defined');

      const {
        isAuthorized,
        blockchainWallets,
        details
      } = await utils.rightService.verifyPayloadSignatures(params);

      if (isAuthorized === false) {
        const errorPayload: ErrorPayload[] = details;
        return callback(errorPayload);
      }

      const firstBlockchainWallet = blockchainWallets[0];

      if (params.dry !== true) {
        await configuration.updateLastViewed({
          roomId,
          sectionId,
          blockchainWallet: firstBlockchainWallet,
          chainId,
          network,
          payload: params
        });
      }

      return callback(null, { details: {} });
    } catch (e) {
      const errorPayload = JSONRPCErrors.unknownError;
      errorPayload.details = JSON.stringify(e);
      return callback(errorPayload);
    }
  };

  return {
    [JSONRPCMethods.room.section.updateProfile]: userUpdate,
    [JSONRPCMethods.room.section.users]: getUsers,
    [JSONRPCMethods.room.section.join]: joinSection,
    [JSONRPCMethods.room.section.updateLastViewed]: updateLastViewed

  };
};
