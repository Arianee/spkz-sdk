import { ActionTypes } from '../../actionTypes/actionTypes';
import { Scope } from '@arianee/required';
import { UserProfileToSend } from '../../../../models/userProfile/userProfile';
import { ResultUserProfileRPC } from '../../../../models/userProfile/userProfileRPC';

interface State{
  [roomId:string]:{
       [userId: string]: UserProfileToSend;
  }
}

const scope = Scope({ scopes: ['usersReducers'] });

const getState = (state) => (parameters:{roomId:string}) => {
  const { requiredDefined } = scope.subScope('getState');

  const { roomId } = parameters;
  requiredDefined(roomId, 'roomId should be defined');

  if (state[roomId]) {
    return state[roomId];
  }
  return {};
};
const reducerMethods = {
  [ActionTypes.USERS.addOrUpdateUser]: (state: State, action: {
    type: string,
    payload: {
      roomId:string,
      users: ResultUserProfileRPC[],
    }
  }) => {
    const { requiredDefined } = scope.subScope(ActionTypes.USERS.addOrUpdateUser);
    const { users, roomId } = action.payload;
    requiredDefined(users, 'users should be defined');
    requiredDefined(roomId, 'roomId should be defined');

    const newUserState: { [userId:string]:ResultUserProfileRPC } = {

    };

    const oldRoomState = getState(state)({ roomId });
    users.forEach(user => {
      requiredDefined(user.blockchainWallet, 'blockchainWallet should be defined');
      newUserState[user.blockchainWallet.toLowerCase()] = user;
    });
    const newRoomState = {
      ...oldRoomState,
      ...newUserState
    };

    return {
      ...state,
      [roomId]: newRoomState
    };
  }

};

export function UsersProfileReducer (state: State = {}, action: { type: string, payload: any }) {
  if (Object.hasOwnProperty.call(reducerMethods, action.type)) {
    return reducerMethods[action.type](state, action);
  } else {
    return state;
  }
}
