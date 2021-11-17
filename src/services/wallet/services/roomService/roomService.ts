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
import { MessageService } from '../messageService/messageService';
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
import {
  $newMessagesFromRoom,
  $newMessagesFromSection
} from '../../../../stateManagement/src/selectors/notifications.selector';
import { updateNewMessageCountForARoom } from '../../../../stateManagement/src/reducers/notifications/actions';
import { RoomRPCClient } from './roomRPCClient';

@scoped(Lifecycle.ContainerScoped)
export class RoomService {
  constructor (
    private messagingService: ProxyWalletService,
    private fetchRoomService: FetchRoomService,
    private rightService: RightService,
    private httpService: RPCJSONService,
    private websocketService: WebsocketService,
    private messageService: MessageService,
    private roomRPCClient:RoomRPCClient
  ) {

  }

  public getNFTRoom: (roomId: string) => Promise<NFTROOM> = this.fetchRoomService.fetchRoom;

  /**
   * Get messages from roomId and section via http call
   * @param {{roomId: string; sectionId: string}} parameters
   * @returns {Promise<{jsonrpc: number; id: string; result?: any}>}
   */
  async fetchMessages (parameters: FetchParameters) {
    const {
      roomId,
      sectionId

    } = parameters;

    const defaultParameters = {
      limit: 100
    };

    requiredDefined(roomId, 'roomId is required');
    requiredDefined(sectionId, 'sectionId is required');

    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

    const { endpoint } = tokenContent;

    const params = {
      ...parameters,
      ...defaultParameters
    };

    if (hasFetchInitialData({ roomId, sectionId })) {
      return getMessages({ roomId, sectionId });
    }

    toggleInitialFetch({
      ...parameters,
      initialFetch: true
    });

    const result:ReadMessageReturn = await this.httpService.signedRPCCall(endpoint, JSONRPCMethods.room.message.read, params);

    addMessagesToSection({
      ...parameters,
      messages: result.messages
    });

    if (result.nextTimestamp) {
      updateMessagesPagination({
        roomId,
        sectionId,
        nextTimestamp: result.nextTimestamp
      });
    }

    return result;
  }

  public sendMessage =this.roomRPCClient.sendMessage;

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
    return this.rightService.canWriteSection({
      ...parameters,
      address: this.messagingService.authorizedAddresses[0]
    });
  }

  /**
   *  Can user read message in this room AND section
   * @returns {Promise<StrategiesReturn>}
   * @param parameters
   */
  async canReadSection (parameters: { roomId: string, sectionId: string }): Promise<StrategiesReturn> {
    return this.rightService.canReadSection({
      ...parameters,
      address: this.messagingService.authorizedAddresses[0]
    });
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

    return this.httpService.signedRPCCall(endpoint, JSONRPCMethods.room.section.updateLastViewed, params);
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

    return this.httpService.signedRPCCall(endpoint, JSONRPCMethods.room.section.join, params);
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

    return this.httpService.signedRPCCall(endpoint, JSONRPCMethods.room.section.updateProfile, params);
  }

  /**
   * Get list of section's users
   * @param {{roomId: string; sectionId: string}} parameters
   * @returns {Promise<{jsonrpc: number; id: string; result?: any}>}
   */
  public async getSectionUsers (parameters: { roomId: string, sectionId: string }): Promise<any> {
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

    return this.httpService.signedRPCCall(endpoint, JSONRPCMethods.room.section.users, params);
  }

  private subscribeToNodeNotificationWSEndpoint (parameters: { roomId: string, sectionId: string }) {
    const {
      roomId,
      sectionId
    } = parameters;
    requiredDefined(roomId, 'roomId is required');
    requiredDefined(sectionId, 'sectionId is required');

    if (!!isWSInitilized(parameters) === false) {
      this.websocketService.joinSection(parameters);

      this.messageService.messageEvent((data:string) => {
        const message = JSON.parse(data);
        addMessagesToSection({
          roomId: message.roomId,
          sectionId: message.sectionId,
          messages: [message]
        });
        return message;
      });
    }
  }

  /**
   * Fetch next messages and update store. It will emit new event to "subscribeToMessages"
   * @param parameters
   */
  public fetchNextMessages=(parameters: { roomId: string, sectionId: string, limit?:number }):void => {
    const { roomId, sectionId, limit } = parameters;
    requiredDefined(roomId, 'roomId is required');
    requiredDefined(sectionId, 'sectionId is required');

    const nextTimeStamp = nextTimestamp(parameters);

    if (nextTimeStamp) {
      const fetchParameters:FetchParameters = {
        roomId,
        sectionId,
        limit,
        fromTimestamp: nextTimeStamp
      };
      this.fetchMessages(fetchParameters);
    }
  }

  /**
   * Subscribe to messages. It will automatically fetch older messages (limit) and subscribe to web socket.
   * Call "fetchNextMessages" if needed next messages
   * @param parameters
   */
  public subscribeToMessages = (parameters: { roomId: string, sectionId: string }) => {
    this.fetchMessages(parameters);
    this.subscribeToNodeNotificationWSEndpoint(parameters);

    return $messagesFromSection(parameters);
  };

  public fullRoomStrategies (parameters: { roomId: string }) {
    const { roomId } = parameters;
    const address = this.messagingService.authorizedAddresses[0];

    this.rightService.fullRoomStrategies({
      roomId,
      address
    });
  }

  /**
   * Return new messages count of each section of a room according to last view
   * @param parameters
   */
  public getNewMessageCount = (parameters: { roomId: string, sectionId?:string }) => {
    const {
      roomId,
      sectionId
    } = parameters;
    requiredDefined(roomId, 'roomId is required');

    this.roomRPCClient.getNewMessageCount(parameters)
      .then(d => {
        updateNewMessageCountForARoom({
          roomId,
          newMessagesCounts: d
        });
      });

    if (sectionId) {
      return $newMessagesFromSection({
        roomId,
        sectionId
      });
    } else {
      return $newMessagesFromRoom(parameters);
    }
  };
}
