import { Lifecycle, scoped } from 'tsyringe';
import { RPCJSONService } from '../httpService/RPCJSONService';
import { JSONRPCMethods } from '../../../../models/JSONRPCMethods.enum';
import { requiredDefined } from '../../../../helpers/required/required';
import { FetchRoomService } from '../../../utils/services/fetchRoomService/fetchRoomService';
import { UserProfile } from '../../../../models/userProfile';
import { getSectionLastViewInfos } from '../../../../stateManagement/src/selectors/notifications.selector';
import { resetNewMessageCountForASection } from '../../../../stateManagement/src/reducers/notifications/actions';
import { SectionState } from '../../../../stateManagement/src/reducers/notifications/reducer';

@scoped(Lifecycle.ContainerScoped)
export class UserAndProfileService {
  constructor (private rpcJSONService:RPCJSONService, private fetchRoomService:FetchRoomService) {
  }

  /**
   * Update profile of current user on this room
   * @param {{roomId: string; sectionId: string; profile: UserProfile}} parameters
   * @returns {Promise<{jsonrpc: number; id: string; result?: any}>}
   */
  public async updateProfile (parameters: { roomId: string, sectionId: string, profile: UserProfile, dry?: boolean }) {
    const {
      roomId,
      sectionId,
      profile,
      dry
    } = parameters;
    requiredDefined(roomId, 'roomId is required');
    requiredDefined(sectionId, 'sectionId is required');
    requiredDefined(profile, 'profile is required');

    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

    const { endpoint } = tokenContent;
    const params = {
      sectionId,
      profile,
      roomId,
      dry
    };

    return this.rpcJSONService.signedRPCCall(endpoint, JSONRPCMethods.room.section.updateProfile, params);
  }

  /**
   * Join section on this room. It will perform a profile update
   * @param {{roomId: string; sectionId: string; profile: UserProfile}} parameters
   * @returns {Promise<{jsonrpc: number; id: string; result?: any}>}
   */
  public async updateLastViewed (parameters: { roomId: string, sectionId: string, dry?: boolean }):Promise<{
    previous:SectionState,
    current:SectionState
  }> {
    const {
      roomId,
      sectionId,
      dry
    } = parameters;
    requiredDefined(roomId, 'roomId is required');
    requiredDefined(sectionId, 'sectionId is required');

    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

    const { endpoint } = tokenContent;
    const params = {
      sectionId,
      roomId,
      dry
    };

    const previous = getSectionLastViewInfos(parameters);

    resetNewMessageCountForASection(parameters);

    const current = getSectionLastViewInfos(parameters);

    this.rpcJSONService.signedRPCCall(endpoint, JSONRPCMethods.room.section.updateLastViewed, params);

    return {
      previous,
      current
    };
  }

  /**
   * Join section on this room. It will perform a profile update
   * @param {{roomId: string; sectionId: string; profile: UserProfile}} parameters
   * @returns {Promise<{jsonrpc: number; id: string; result?: any}>}
   */
  public async joinSection (parameters: { roomId: string, sectionId: string, profile: UserProfile, dry?: boolean }) {
    const {
      roomId,
      sectionId,
      profile,
      dry
    } = parameters;
    requiredDefined(roomId, 'roomId is required');
    requiredDefined(sectionId, 'sectionId is required');
    requiredDefined(profile, 'profile is required');

    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

    const { endpoint } = tokenContent;
    const params = {
      sectionId,
      profile,
      roomId,
      dry
    };

    await this.updateProfile(parameters);

    return this.rpcJSONService.signedRPCCall(endpoint, JSONRPCMethods.room.section.join, params);
  }
}
