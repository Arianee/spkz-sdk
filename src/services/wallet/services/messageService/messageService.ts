import { Lifecycle, scoped } from 'tsyringe';
import { ProxyWalletService } from '../proxyWalletService/proxyWalletService';
import { requiredDefined } from '../../../../helpers/required/required';
import { FetchRoomService } from '../../../utils/services/fetchRoomService/fetchRoomService';
import { RightService } from '../../../utils/services/rightService/rightService';
import { WebsocketService } from '../websocketService/websocketService';
import { InternalMessageEventEmitterService } from '../internalMessageEventEmitterService/internalMessageEventEmitterService';
import {
  $messagesFromSection,
  getMessages,
  hasFetchInitialData,
  isWSInitilized,
  nextTimestamp
} from '../../../../stateManagement/src/selectors/messages.selector';
import {
  addMessagesToSection,
  toggleInitialFetch,
  updateMessagesPagination
} from '../../../../stateManagement/src/reducers/messages/actions';
import { ReadMessageReturn } from '../../../../models/jsonrpc/writeMessageParameters';
import { FetchParameters } from '../../../../models/FetchParameters';
import {
  $newMessagesFromRoom,
  $newMessagesFromSection, isFetched
} from '../../../../stateManagement/src/selectors/notifications.selector';
import {
  updateFetchStatus,
  updateNewMessageCountForARoom
} from '../../../../stateManagement/src/reducers/notifications/actions';
import { MessageClientService } from './messageClientService';
import { Observable } from 'rxjs';

@scoped(Lifecycle.ContainerScoped)
export class MessageService {
  constructor (private messagingService: ProxyWalletService,
    private fetchRoomService: FetchRoomService,
    private rightService: RightService,
    private websocketService: WebsocketService,
    private messageService: InternalMessageEventEmitterService,
    private messageClientService:MessageClientService
  ) {
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
   * Get messages from roomId and section via http call
   * @param {{roomId: string; sectionId: string}} parameters
   * @returns {Promise<{jsonrpc: number; id: string; result?: any}>}
   */
  fetchMessages = async (parameters: FetchParameters) => {
    const {
      roomId,
      sectionId

    } = parameters;

    requiredDefined(roomId, 'roomId is required');
    requiredDefined(sectionId, 'sectionId is required');

    if (hasFetchInitialData({ roomId, sectionId })) {
      return getMessages({ roomId, sectionId });
    }

    toggleInitialFetch({
      ...parameters,
      initialFetch: true
    });

    const result:ReadMessageReturn = await this.messageClientService.fetchMessages(parameters);

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
  };

  /**
   * subscribeToNodeNotificationWSEndpoint
   * @param parameters
   * @private
   */
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

  public wasFetched=false;

  public sendMessage=this.messageClientService.sendMessage;
  /**
   * Return new messages count of each section of a room according to last view
   * @param parameters
   */
  public getNewMessageCount = (parameters: { roomId: string, sectionId?:string, forceRefresh?:boolean }):Observable<any> => {
    const {
      roomId,
      sectionId,
      forceRefresh
    } = parameters;

    if (isFetched({ roomId }) === false || forceRefresh) {
      updateFetchStatus({ roomId });
      this.messageClientService.getNewMessageCount(parameters)
        .then(d => {
          updateNewMessageCountForARoom({
            roomId,
            newMessagesCounts: d
          });
        });
    }

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
