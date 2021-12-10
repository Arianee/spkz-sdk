import { ActionTypes } from '../../actionTypes/actionTypes';
import { Scope } from '@arianee/required';

export interface Substate{
  ws?: boolean;
  initialHttpCall?: boolean
}

interface State {
  [name: string]: Substate
}

const scope = Scope({ scopes: ['fetchStatus'] });
export const defautlSubState = () => ({ ws: false, initialHttpCall: false });
const getState = (state) => (parameters: { name: string }) :Substate => {
  const { requiredDefined } = scope.subScope('getState');

  const { name } = parameters;
  requiredDefined(name, 'name should be defined');

  if (state[name]) {
    return state[name];
  }
  return defautlSubState();
};
const reducerMethods = {
  [ActionTypes.FetchStatus.updateFetchStatus]: (state: State, action: {
    type: string,
    payload: {
      name: string,
      status:Substate
    }
  }) => {
    const { requiredDefined } = scope.subScope(ActionTypes.USERS.addOrUpdateUser);
    const {
      name,
      status
    } = action.payload;
    requiredDefined(name, 'name should be defined');
    requiredDefined(state, 'state should be defined');

    const oldState = getState(state)({ name });

    return {
      ...state,
      [name]: { ...oldState, ...status }
    };
  }

};

export function FetchStatusReducer (state: State = {}, action: { type: string, payload: any }) {
  if (Object.hasOwnProperty.call(reducerMethods, action.type)) {
    return reducerMethods[action.type](state, action);
  } else {
    return state;
  }
}
