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

  private websockets:{[key:string]:{
      socket:Socket,
      connected:boolean,
      joinedRooms:{roomId:string, sectionId:string, joined:boolean}[]
  }} = {};

  public joinSection = async (parameters:{ roomId: string, sectionId: string }) => {
    const { roomId, sectionId } = parameters;

    await this.connectToWebSocket(roomId);
    await this.subscribeToRoom(roomId, sectionId);
  }

  private subscribeToRoom = async (roomId:string, sectionId:string) => {
    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);
    const notificationEndpointHash = this.hashString(tokenContent.notificationEndpoint);
    const joinRoomsLength = this.websockets[notificationEndpointHash].joinedRooms.push({ roomId, sectionId, joined: false });
    this.joinRoom(notificationEndpointHash, joinRoomsLength - 1);
  }

  private joinRoom = async (notificationEndpointHash, joinedRoomIndex) => {
    const room = this.websockets[notificationEndpointHash].joinedRooms[joinedRoomIndex];
    if (!room.joined) {
      const { sectionId, roomId } = room;
      const payload = await this.payloadSerivce.hydratePayloadParameters({ sectionId, roomId });
      this.websockets[notificationEndpointHash].socket.emit('joinRoom', payload);
      room.joined = true;
    }
  }

  private rejoinRooms = (notificationEndpointHash) => {
    const rooms = this.websockets[notificationEndpointHash].joinedRooms;

    rooms.forEach((value, index) => {
      this.joinRoom(notificationEndpointHash, index);
    });
  }

  private connectToWebSocket = async (roomId:string) => {
    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

    const { notificationEndpoint } = tokenContent;
    if (!notificationEndpoint) {
      throw new Error('there is no notification endpoint');
    }
    const notificationEndpointHash = this.hashString(notificationEndpoint);
    if (!this.websockets[notificationEndpointHash]) {
      this.websockets[notificationEndpointHash] = {
        socket: io(notificationEndpoint),
        connected: false,
        joinedRooms: []
      };
      this.setWsListeners(notificationEndpointHash);
    }
  }

  private setWsListeners = (notificationEndpointHash:string) => {
    this.websockets[notificationEndpointHash].socket.on('connect', () => {
      this.websockets[notificationEndpointHash].connected = true;
      this.rejoinRooms(notificationEndpointHash);
      console.info('ws is connected');
    });

    this.websockets[notificationEndpointHash].socket.on('message', (data) => {
      this.messageService.emitMessage(data);
    });

    this.websockets[notificationEndpointHash].socket.on('userJoinSection', (data) => {
      this.messageService.emitUserJoinSection(data);
    });

    this.websockets[notificationEndpointHash].socket.on('disconnect', () => {
      this.websockets[notificationEndpointHash].connected = false;
      this.websockets[notificationEndpointHash].joinedRooms
        .forEach(room => {
          room.joined = false;
        });
    });
  }

  private hashString = (data:string) => {
    const hash = createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  }
}
