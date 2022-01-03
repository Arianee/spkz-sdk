import { ActionTypes } from '../../actionTypes/actionTypes';
import { NFTROOM } from '../../../../models/NFTROOM';
import { Scope } from '@arianee/required';
import { RecommendedOrFeaturedRoom, RoomFromStore } from '../../../../models/room/recommendedAndFeaturedRoom';
import { cloneDeep, isEqual } from 'lodash';

interface State{
  [roomId:string]:{
    roomId:string;
    roomDetails: NFTROOM;
    verified: boolean;
    special: boolean;
    membersCount:number;
    enrichedStrategies: any;
    requirements: any[];
  }
}
const defaultRoomState = (roomId:string):RoomFromStore => ({
  roomId,
  roomDetails: undefined,
  verified: false,
  special: false,
  recommended: false,
  featured: false,
  membersNb: 0,
  enrichedStrategies: undefined,
  requirements: []
});

const scope = Scope({ scopes: ['roomReducer'] });

const reducerMethods = {
  [ActionTypes.ROOM.addOrUpdateRooms]: (state:State, action: {
    type: string,
    payload: {
      rooms:RecommendedOrFeaturedRoom[]
    }
  }) => {
    const { requiredDefined } = scope.subScope(ActionTypes.ROOM.addOrUpdateRooms);
    const { rooms } = action.payload;

    const newState = {};
    rooms.forEach(({ roomId, roomDetails }, index) => {
      requiredDefined(roomId, 'roomId must be defined');

      const newRoomState = {
        ...defaultRoomState(roomId),
        ...cloneDeep(state[roomId]),
        ...action.payload.rooms[index]
      };
      const isRoomDifferent = !isEqual(state[roomId], newRoomState);
      if (isRoomDifferent) {
        newState[roomId] = newRoomState;
      }
    });

    const hasStateChanged = Object.keys(newState).length > 0;
    if (hasStateChanged) {
      return {
        ...state,
        ...newState
      };
    } else {
      return state;
    }
  }
};

export function RoomReducer (state: State = {}, action: { type: string, payload: any }) {
  if (Object.hasOwnProperty.call(reducerMethods, action.type)) {
    return reducerMethods[action.type](state, action);
  } else {
    return state;
  }
}
