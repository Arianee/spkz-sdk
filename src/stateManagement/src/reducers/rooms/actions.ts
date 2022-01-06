import { getStore } from '../../store';
import { ActionTypes } from '../../actionTypes/actionTypes';
import { RecommendedOrFeaturedRoomFromExternalSource } from '../../../../models/room/recommendedAndFeaturedRoom';

export function addOrUpdateRooms (rooms:RecommendedOrFeaturedRoomFromExternalSource[]) {
  getStore().dispatch({
    type: ActionTypes.ROOM.addOrUpdateRooms,
    payload: {
      rooms
    }
  });
}
