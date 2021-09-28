import { Lifecycle, scoped } from 'tsyringe';
import { FetchRoomService } from '../../../utils/services/fetchRoomService/fetchRoomService';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client/build/socket';
import { PayloadService } from '../payloadService/payloadService';

@scoped(Lifecycle.ContainerScoped)
export class WebsocketService {
  constructor (
    private fetchRoomService: FetchRoomService,
    private payloadSerivce: PayloadService
  ) {
  }

  private websocket:Socket;

  public joinSection = async (parameters:{ roomId: string, sectionId: string }) => {
    const { roomId, sectionId } = parameters;

    await this.connectToWebSocket(roomId);
    this.setWsListeners();
    await this.subscribeToRoom(roomId, sectionId);
  }

  private subscribeToRoom = (roomId:string, sectionId:string) => {
    const params = {
      sectionId,
      roomId
    };
    const payload = this.payloadSerivce.hydratePayloadParameters(params);
    this.websocket.emit('joinRoom', payload);
  }

  private connectToWebSocket = async (roomId:string) => {
    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

    const { notificationEndpoint } = tokenContent;
    if (!notificationEndpoint) {
      throw new Error('there is no notification endpoint');
    }

    this.websocket = io(notificationEndpoint);
  }

  private setWsListeners = () => {
    this.websocket.on('data', (data) => {
      // TODO Send message to front
    });
  }
}
