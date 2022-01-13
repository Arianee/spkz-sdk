import { ActionTypes } from '../../actionTypes/actionTypes';
import { Scope } from '@arianee/required';
import { RoomUser } from '../../../../models/jsonrpc/writeMessageParameters';
import { unionBy } from 'lodash';

const scope = Scope({ scopes: ['usersRoomsReducers'] });

const getState = (state) => () => {
  if (state) {
    return state;
  }
  return {};
};

const reducerMethods = {
  [ActionTypes.USERROOMS.addOrUpdateUserRooms]: (state: RoomUser[], action: {
    type: string,
    payload: {
      userRooms: RoomUser[],
    }
  }) => {
    const { requiredDefined } = scope.subScope(ActionTypes.USERROOMS.addOrUpdateUserRooms);
    const { userRooms } = action.payload;
    requiredDefined(userRooms, 'userRooms should be defined');

    const oldRoomState = getState(state)();
    return unionBy(userRooms, oldRoomState, 'roomId');
  }

};

export function UserRoomReducer (state: RoomUser[] = [], action: { type: string, payload: any }) {
  if (Object.hasOwnProperty.call(reducerMethods, action.type)) {
    return reducerMethods[action.type](state, action);
  } else {
    return state;
  }
}
