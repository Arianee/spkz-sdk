import { Lifecycle, scoped } from 'tsyringe';
import { FetchRoomService } from '../../../utils/services/fetchRoomService/fetchRoomService';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client/build/socket';
import { PayloadService } from '../payloadService/payloadService';
import { InternalMessageEventEmitterService } from '../internalMessageEventEmitterService/internalMessageEventEmitterService';
import { createHash } from 'crypto';

@scoped(Lifecycle.ContainerScoped)
export class WebsocketService {
  constructor (
    private fetchRoomService: FetchRoomService,
    private payloadSerivce: PayloadService,
    private messageService: InternalMessageEventEmitterService
  ) {
  }

  private websockets:{[key:string]:Socket} = {};

  public joinSection = async (parameters:{ roomId: string, sectionId: string }) => {
    const { roomId, sectionId } = parameters;

    await this.connectToWebSocket(roomId);
    await this.subscribeToRoom(roomId, sectionId);
  }

  private subscribeToRoom = async (roomId:string, sectionId:string) => {
    const params = {
      sectionId,
      roomId
    };
    const payload = await this.payloadSerivce.hydratePayloadParameters(params);

    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);
    const notificationEndpointHash = this.hashString(tokenContent.notificationEndpoint);
    this.websockets[notificationEndpointHash].emit('joinRoom', payload);
  }

  private connectToWebSocket = async (roomId:string) => {
    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

    const { notificationEndpoint } = tokenContent;
    if (!notificationEndpoint) {
      throw new Error('there is no notification endpoint');
    }
    const notificationEndpointHash = this.hashString(notificationEndpoint);
    if (!this.websockets[notificationEndpointHash]) {
      this.websockets[notificationEndpointHash] = io(notificationEndpoint);
      this.setWsListeners(notificationEndpointHash);
    }
  }

  private setWsListeners = (notificationEndpointHash:string) => {
    this.websockets[notificationEndpointHash].on('connect', () => {
      console.info('ws is connected');
    });

    this.websockets[notificationEndpointHash].on('message', (data) => {
      this.messageService.emitMessage(data);
    });
  }

  private hashString = (data:string) => {
    const hash = createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  }
}
