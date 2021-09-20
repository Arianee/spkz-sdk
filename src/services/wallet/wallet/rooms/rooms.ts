import { Lifecycle, scoped } from 'tsyringe';
import { Room } from '../room/room';
import { NFTROOM } from '../../../../models/NFTROOM';
import { StrategiesReturn } from '../../../../models/strategyReturn';

@scoped(Lifecycle.ContainerScoped)
export class Rooms {
  constructor (private roomService:Room) {

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
