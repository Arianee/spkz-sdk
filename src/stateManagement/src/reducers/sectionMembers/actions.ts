import { getStore } from '../../store';
import { ActionTypes } from '../../actionTypes/actionTypes';
import { Scope } from '@arianee/required';

const scope = Scope({ scopes: ['usersProfile', 'actions'] });

export function addMembersToSection (parameters:{users: Array<{ address:string }>, roomId:string, sectionId:string}) {
  const { requiredDefined } = scope.subScope('addUsersProfiles');
  const { users, roomId, sectionId } = parameters;
  requiredDefined(users, 'users should be defined');
  requiredDefined(roomId, 'roomId should be defined');
  requiredDefined(sectionId, 'sectionId should be defined');

  getStore().dispatch({
    type: ActionTypes.SECTION.addMembers,
    payload: {
      users,
      roomId,
      sectionId
    }
  });
}
