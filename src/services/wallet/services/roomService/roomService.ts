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
import { FullRoomStrategies, NFTROOM } from '../../../../models/NFTROOM';
import { MessageService } from '../messageService/messageService';

@scoped(Lifecycle.ContainerScoped)
export class RoomService {
  constructor (
               private messagingService:ProxyWalletService,
               private fetchRoomService:FetchRoomService,
               private rightService:RightService,
               private httpService:RPCJSONService,
               private websocketService: WebsocketService,
              private messageService: MessageService
  ) {

  }

  public getNFTRoom:(roomId:string)=>Promise<NFTROOM> = this.fetchRoomService.fetchRoom;

  /**
   * Get all messages from roomId and section
   * @param {{roomId: string; sectionId: string}} parameters
   * @returns {Promise<{jsonrpc: number; id: string; result?: any}>}
   */
  async getMessages (parameters: { roomId: string, sectionId: string }) {
    const { roomId, sectionId } = parameters;
    requiredDefined(roomId, 'roomId is required');
    requiredDefined(sectionId, 'sectionId is required');
    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

    const { endpoint } = tokenContent;
    const params = {
      sectionId,
      roomId
    };
    return this.httpService.signedRPCCall(endpoint, JSONRPCMethods.room.message.read, params);
  }

  newMessageListener (cb) {
    this.messageService.messageEvent(cb);
  }

  /**
   * Send message to roomId + sectionId
   * @param {{roomId: string; sectionId: string; messageContent: any}} parameters
   * @returns {Promise<{jsonrpc: number; id: string; result?: any}>}
   */
  async sendMessage (parameters: { roomId: string, sectionId: string, messageContent: any }) {
    const { roomId, sectionId, messageContent } = parameters;
    requiredDefined(roomId, 'roomId is required');
    requiredDefined(sectionId, 'sectionId is required');
    requiredDefined(messageContent, 'messageContent is required');

    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

    const { endpoint } = tokenContent;
    const params = {
      content: messageContent,
      sectionId,
      roomId
    };

    return this.httpService.signedRPCCall(endpoint, JSONRPCMethods.room.message.write, params);
  }

  /**
   * Check if user can join room depending on main room strategies
   * @param {{roomId: string}} parameters
   * @returns {Promise<StrategiesReturn>}
   */
  async canJoin (parameters: { roomId: string }): Promise<StrategiesReturn> {
    return this.rightService.canJoinRoom({
      ...parameters,
      address: this.messagingService.authorizedAddresses[0]
    });
  }

  /**
   * Can user write message in this room AND section
   * @returns {Promise<StrategiesReturn>}
   * @param parameters
   */
  async canWriteSection (parameters: { roomId: string, sectionId: string }): Promise<StrategiesReturn> {
    return this.rightService.canWriteSection({ ...parameters, address: this.messagingService.authorizedAddresses[0] });
  }

  /**
   *  Can user read message in this room AND section
   * @returns {Promise<StrategiesReturn>}
   * @param parameters
   */
  async canReadSection (parameters: { roomId: string, sectionId: string }): Promise<StrategiesReturn> {
    return this.rightService.canReadSection({ ...parameters, address: this.messagingService.authorizedAddresses[0] });
  }

  /**
   * Join section on this room. It will perform a profile update
   * @param {{roomId: string; sectionId: string; profile: UserProfile}} parameters
   * @returns {Promise<{jsonrpc: number; id: string; result?: any}>}
   */
  public async joinSection (parameters: { roomId: string, sectionId: string, profile: UserProfile }) {
    const { roomId, sectionId, profile } = parameters;
    requiredDefined(roomId, 'roomId is required');
    requiredDefined(sectionId, 'sectionId is required');
    requiredDefined(profile, 'profile is required');

    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

    const { endpoint } = tokenContent;
    const params = {
      sectionId,
      profile,
      roomId
    };

    await this.updateProfile(parameters);

    return this.httpService.signedRPCCall(endpoint, JSONRPCMethods.room.section.join, params);
  }

  /**
   * Update profile of current user on this room
   * @param {{roomId: string; sectionId: string; profile: UserProfile}} parameters
   * @returns {Promise<{jsonrpc: number; id: string; result?: any}>}
   */
  public async updateProfile (parameters: { roomId: string, sectionId: string, profile: UserProfile }) {
    const { roomId, sectionId, profile } = parameters;
    requiredDefined(roomId, 'roomId is required');
    requiredDefined(sectionId, 'sectionId is required');
    requiredDefined(profile, 'profile is required');

    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

    const { endpoint } = tokenContent;
    const params = {
      sectionId,
      profile,
      roomId
    };

    return this.httpService.signedRPCCall(endpoint, JSONRPCMethods.room.section.updateProfile, params);
  }

  /**
   * Get list of section's users
   * @param {{roomId: string; sectionId: string}} parameters
   * @returns {Promise<{jsonrpc: number; id: string; result?: any}>}
   */
  public async getSectionUsers (parameters: { roomId: string, sectionId: string }): Promise<any> {
    const { roomId, sectionId } = parameters;
    requiredDefined(roomId, 'roomId is required');
    requiredDefined(sectionId, 'sectionId is required');

    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

    const { endpoint } = tokenContent;
    const params = {
      sectionId,
      roomId
    };

    return this.httpService.signedRPCCall(endpoint, JSONRPCMethods.room.section.users, params);
  }

  public async joinNotificationserver (parameters: { roomId: string, sectionId: string }) {
    const { roomId, sectionId } = parameters;
    requiredDefined(roomId, 'roomId is required');
    requiredDefined(sectionId, 'sectionId is required');
    this.websocketService.joinSection(parameters);
  }

  public fullRoomStrategies (parameters:{roomId:string}) {
    const { roomId } = parameters;
    const address = this.messagingService.authorizedAddresses[0];

    this.rightService.fullRoomStrategies({ roomId, address });
  }
}
