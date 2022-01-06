import { Lifecycle, scoped } from 'tsyringe';
import { $subscribeToRoom, getRoom } from '../../../../stateManagement/src/selectors/room.selector';
import { getFetchStatus } from '../../../../stateManagement/src/selectors/fetchStatus.selector';
import { FetchRoomService } from '../../../utils/services/fetchRoomService/fetchRoomService';
import { addOrUpdateRooms } from '../../../../stateManagement/src/reducers/rooms/actions';
import { lastValueFrom, Observable } from 'rxjs';
import { RoomDetails, RoomFromStore } from '../../../../models/room/recommendedAndFeaturedRoom';
import { map, take } from 'rxjs/operators';
import { updateFetchStatus } from '../../../../stateManagement/src/reducers/fetchStatus/actions';

@scoped(Lifecycle.ContainerScoped)
export class FetchRoomWrapperService {
  constructor (private fetchRoomService:FetchRoomService) {

  }

  public fetchRoom=(roomId: string):Promise<RoomDetails> => {
    return lastValueFrom(this.$room({ roomId })
      .pipe(
        take(1),
        map((d:RoomFromStore) => d.roomDetails)));
  }

  public $room = (parameters:{ roomId: string }): Observable<RoomFromStore> => {
    const { roomId } = parameters;
    const room = getRoom({ roomId });
    const name = `fetchRoom_${roomId}`;

    const { initialHttpCall } = getFetchStatus({ name });

    if (!initialHttpCall) {
      this.fetchRoomAndAddToStore(roomId)
        .then(d => updateFetchStatus({
          name,
          status: { initialHttpCall: true }
        }));
    }

    return $subscribeToRoom({ roomId });
  };

  private fetchRoomAndAddToStore = async (roomId:string) => {
    const room = await this.fetchRoomService.fetchRoom(roomId);

    addOrUpdateRooms([{
      roomId,
      roomDetails: room
    }]);
  };
}
