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
import { $newMessagesFromSection } from '../../../../stateManagement/src/selectors/notifications.selector';
import { updateNewMessageCountForARoom } from '../../../../stateManagement/src/reducers/notifications/actions';

@scoped(Lifecycle.ContainerScoped)
export class RoomRPCClient {
  constructor (
    private fetchRoomService: FetchRoomService,
    private httpService: RPCJSONService
  ) {

  }

  /**
   * Return new messages count of each section of a room according to last view
   * @param parameters
   */
  public getNewMessageCount = async (parameters: { roomId: string }):Promise<NewMessageCount[]> => {
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

  /**
   * Send message to roomId + sectionId
   * @param {{roomId: string; sectionId: string; messageContent: any}} parameters
   * @returns {Promise<{jsonrpc: number; id: string; result?: any}>}
   */
  async sendMessage (parameters: { roomId: string, sectionId: string, messageContent: any }) {
    const {
      roomId,
      sectionId,
      messageContent
    } = parameters;
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
}
