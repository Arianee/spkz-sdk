import { Lifecycle, scoped } from 'tsyringe';
import { RPCJSONService } from '../httpService/RPCJSONService';
import { ProxyWalletService } from '../proxyWalletService/proxyWalletService';
import { JSONRPCMethods } from '../../../../models/JSONRPCMethods.enum';
import { requiredDefined } from '../../../../helpers/required/required';
import { RightService } from '../../../utils/services/rightService/rightService';
import { NewMessageCount } from '../../../../models/jsonrpc/writeMessageParameters';
import { FetchParameters } from '../../../../models/FetchParameters';
import { FetchRoomWrapperService } from '../fetchRoomWalletService/fetchRoomWrapperService';

@scoped(Lifecycle.ContainerScoped)
export class MessageClientService {
  constructor (private messagingService: ProxyWalletService,
    private fetchRoomService: FetchRoomWrapperService,
    private rightService: RightService,
    private httpService: RPCJSONService) {
  }

  /**
   * Get messages from roomId and section via http call
   * @param {{roomId: string; sectionId: string}} parameters
   * @returns {Promise<{jsonrpc: number; id: string; result?: any}>}
   */
  fetchMessages = async (parameters: FetchParameters) => {
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
      ...defaultParameters,
      ...parameters
    };

    return this.httpService.signedRPCCall(endpoint, JSONRPCMethods.room.message.read, params);
  };

  /**
   * Send message to roomId + sectionId
   * @param {{roomId: string; sectionId: string; messageContent: any}} parameters
   * @returns {Promise<{jsonrpc: number; id: string; result?: any}>}
   */
  sendMessage = async (parameters: { roomId: string, sectionId: string, messageContent: any, nonce?: string }) => {
    const {
      roomId,
      sectionId,
      messageContent,
      nonce
    } = parameters;
    requiredDefined(roomId, 'roomId is required');
    requiredDefined(sectionId, 'sectionId is required');
    requiredDefined(messageContent, 'messageContent is required');

    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

    const { endpoint } = tokenContent;
    const params = {
      content: messageContent,
      sectionId,
      roomId,
      nonce
    };

    return this.httpService.signedRPCCall(endpoint, JSONRPCMethods.room.message.write, params);
  };

  /**
   * Return new messages count of each section of a room according to last view
   * @param parameters
   */
  public getNewMessageCount = async (parameters: { roomId: string }): Promise<NewMessageCount[]> => {
    const {
      roomId
    } = parameters;
    requiredDefined(roomId, 'roomId is required');

    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

    const { endpoint } = tokenContent;
    const params = {
      roomId
    };

    return this.httpService.signedRPCCall(endpoint, JSONRPCMethods.room.message.newMessage, params);
  };
}
