import { JSONRPCMethods } from '../../../models/JSONRPCMethods.enum';
import { requiredDefined } from '../../../helpers/required/required';
import { utils } from '../../utils';
import { JSONRPCErrors } from '../../../models/JSONRPCError';
import { AsyncFunc } from '../../../models/AsyncFunc';
import {
  ReadMessageParameters, RoomUser,
  SectionUser, SectionUserGet,
  WriteMessageParameters
} from '../../../models/jsonrpc/writeMessageParameters';
import { NetworkParameters } from '../../../models/jsonrpc/networkParameters';

export const userJSONRPCFactory = (networkParameters: NetworkParameters) => (configuration: {
    createOrUpdateSectionUser: AsyncFunc<SectionUser, any>,
    createOrUpdateRoomUser: AsyncFunc<RoomUser, any>,
  getUsers:AsyncFunc<SectionUserGet, SectionUser[]>
}) => {
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
      await Promise.all([
        configuration.createOrUpdateSectionUser({
          roomId,
          sectionId,
          blockchainWallet: firstBlockchainWallet,
          chainId,
          network,
          payload: params
        }),
        configuration.createOrUpdateRoomUser({
          roomId,
          blockchainWallet: firstBlockchainWallet,
          chainId,
          network,
          payload: params
        })
      ]);

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
      return callback(null, sectionUsers);
    } catch (e) {
      return callback(e);
    }
  };
  return {
    [JSONRPCMethods.room.section.userUpdate]: userUpdate,
    [JSONRPCMethods.room.section.users]: getUsers
  };
};
