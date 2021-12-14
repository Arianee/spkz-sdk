import { Lifecycle, scoped } from 'tsyringe';
import { RPCJSONService } from '../httpService/RPCJSONService';
import { JSONRPCMethods } from '../../../../models/JSONRPCMethods.enum';
import { requiredDefined } from '../../../../helpers/required/required';
import { FetchRoomService } from '../../../utils/services/fetchRoomService/fetchRoomService';
import { ResultUserProfileRPC } from '../../../../models/userProfile/userProfileRPC';

@scoped(Lifecycle.ContainerScoped)
export class UsersClientService {
  constructor (private fetchRoomService:FetchRoomService, private rpcJSONService:RPCJSONService) {
  }

  /**
   * Get list of section's users
   * @param {{roomId: string; sectionId: string}} parameters
   * @returns {Promise<{jsonrpc: number; id: string; result?: any}>}
   */
  public async getSectionUsers (parameters: { roomId: string, sectionId: string }): Promise<ResultUserProfileRPC[]> {
    const {
      roomId,
      sectionId
    } = parameters;
    requiredDefined(roomId, 'roomId is required');
    requiredDefined(sectionId, 'sectionId is required');

    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

    const { endpoint } = tokenContent;
    const params = {
      sectionId,
      roomId
    };

    return this.rpcJSONService.signedRPCCall<ResultUserProfileRPC[]>(endpoint, JSONRPCMethods.room.section.users, params);
  }
}
