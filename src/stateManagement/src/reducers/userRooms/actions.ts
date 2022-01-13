import { getStore } from '../../store';
import { ActionTypes } from '../../actionTypes/actionTypes';
import { Scope } from '@arianee/required';
import { RoomUser } from '../../../../models/jsonrpc/writeMessageParameters';

const scope = Scope({ scopes: ['usersProfile', 'actions'] });

export function addUserRooms (parameters:{userRooms: RoomUser[]}) {
  const { requiredDefined } = scope.subScope('usersRoomsReducers');
  const { userRooms } = parameters;
  requiredDefined(userRooms, 'userRooms should be defined');

  getStore().dispatch({
    type: ActionTypes.USERROOMS.addOrUpdateUserRooms,
    payload: {
      userRooms
    }
  });
}
