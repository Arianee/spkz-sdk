import { Lifecycle, scoped } from 'tsyringe';
import { RoomService } from '../roomService/roomService';
import { NFTROOM } from '../../../../models/NFTROOM';
import { StrategiesReturn } from '../../../../models/strategyReturn';

@scoped(Lifecycle.ContainerScoped)
export class RoomsService {
  constructor (private roomService:RoomService) {

  }

  getRooms () {

  }

  canJoin (rooms:string[]):Promise<StrategiesReturn[]> {
    return Promise.all(rooms.map(roomId => this.roomService.canJoin({ roomId })));
  }

  createRoom () {

  }

  leaveRoom (rooms:string[]) {}
}
