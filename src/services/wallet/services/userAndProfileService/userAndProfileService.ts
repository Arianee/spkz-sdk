import { Lifecycle, scoped } from 'tsyringe';
import { RPCJSONService } from '../httpService/RPCJSONService';
import { StrategiesReturn } from '../../../../models/strategyReturn';
import { ProxyWalletService } from '../proxyWalletService/proxyWalletService';
import { JSONRPCMethods } from '../../../../models/JSONRPCMethods.enum';
import { requiredDefined } from '../../../../helpers/required/required';
import { FetchRoomService } from '../../../utils/services/fetchRoomService/fetchRoomService';
import { RightService } from '../../../utils/services/rightService/rightService';
import { UserProfile } from '../../../../models/userProfile';
import { WebsocketService } from '../websocketService/websocketService';
import { NFTROOM } from '../../../../models/NFTROOM';
import { InternalMessageEventEmitterService } from '../internalMessageEventEmitterService/internalMessageEventEmitterService';
import {
  isWSInitilized,
  nextTimestamp,
  $messagesFromSection,
  hasFetchInitialData, getMessages
} from '../../../../stateManagement/src/selectors/messages.selector';
import {
  addMessagesToSection, toggleInitialFetch,
  updateMessagesPagination
} from '../../../../stateManagement/src/reducers/messages/actions';
import { NewMessageCount, ReadMessageReturn } from '../../../../models/jsonrpc/writeMessageParameters';
import { FetchParameters } from '../../../../models/FetchParameters';
import { Observable } from 'redux';
import { $newMessagesFromSection } from '../../../../stateManagement/src/selectors/notifications.selector';
import { updateNewMessageCountForARoom } from '../../../../stateManagement/src/reducers/notifications/actions';

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
  public async updateLastViewed (parameters: { roomId: string, sectionId: string, dry?: boolean }) {
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

    return this.rpcJSONService.signedRPCCall(endpoint, JSONRPCMethods.room.section.updateLastViewed, params);
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
