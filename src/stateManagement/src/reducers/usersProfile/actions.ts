import { getStore } from '../../store';
import { ActionTypes } from '../../actionTypes/actionTypes';
import { Scope } from '@arianee/required';
import { ResultUserProfileRPC } from '../../../../models/userProfile/userProfileRPC';

const scope = Scope({ scopes: ['usersProfile', 'actions'] });

export function addUsersProfiles (parameters:{users:ResultUserProfileRPC[], roomId:string}) {
  const { requiredDefined } = scope.subScope('addUsersProfiles');
  const { users, roomId } = parameters;
  requiredDefined(users, 'users should be defined');
  requiredDefined(roomId, 'roomId should be defined');

  getStore().dispatch({
    type: ActionTypes.USERS.addOrUpdateUser,
    payload: {
      users,
      roomId
    }
  });
}
