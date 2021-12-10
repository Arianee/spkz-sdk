import { getStore } from '../../store';
import { ActionTypes } from '../../actionTypes/actionTypes';
import { Scope } from '@arianee/required';
import { Substate } from './reducer';

const scope = Scope({ scopes: ['usersProfile', 'actions'] });

export function updateFetchStatus (parameters:{name:string, status:Substate}) {
  const { requiredDefined } = scope.subScope('addUsersProfiles');
  const { name, status } = parameters;
  requiredDefined(name, 'name should be defined');
  requiredDefined(status, 'status should be defined');

  getStore().dispatch({
    type: ActionTypes.FetchStatus.updateFetchStatus,
    payload: {
      name,
      status
    }
  });
}
