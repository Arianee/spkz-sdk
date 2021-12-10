import { ActionTypes } from '../../actionTypes/actionTypes';
import { Scope } from '@arianee/required';
import { difference, isEqual, uniqWith } from 'lodash';

interface State{
  [roomId:string]:{
       [sectionId: string]: string[];
  }
}

const scope = Scope({ scopes: ['sectionMembersReducer'] });

const getState = (state) => (parameters:{roomId:string, sectionId:string}) => {
  const { requiredDefined } = scope.subScope('getState');

  const { roomId, sectionId } = parameters;
  requiredDefined(roomId, 'roomId should be defined');
  requiredDefined(sectionId, 'roomId should be defined');

  if (state[roomId]) {
    if (state[roomId][sectionId]) {
      return state[roomId][sectionId];
    }
  }
  return [];
};
const reducerMethods = {
  [ActionTypes.SECTION.addMembers]: (state: State, action: {
    type: string,
    payload: {
      roomId:string,
      sectionId:string,
      users: { address:string }[],
    }
  }) => {
    const { requiredDefined } = scope.subScope(ActionTypes.SECTION.addMembers);
    const { users, roomId, sectionId } = action.payload;
    requiredDefined(users, 'users should be defined');
    requiredDefined(roomId, 'roomId should be defined');

    requiredDefined(sectionId, 'sectionId should be defined');

    const oldSectionState = getState(state)({ roomId, sectionId });
    const newSectionState = [...oldSectionState, ...users.map(({ address }) => address)];
    const newSectionStateUniq = uniqWith(newSectionState, isEqual).sort();
    const isDifferent = difference(newSectionStateUniq, oldSectionState).length > 0;
    if (isDifferent) {
      const oldRoomState = state[roomId];

      const newRoomState = {
        ...oldRoomState,
        [sectionId]: newSectionStateUniq
      };

      return {
        ...state,
        [roomId]: newRoomState
      };
    } else {
      return state;
    }
  }

};

export function SectionMemberReducer (state: State = {}, action: { type: string, payload: any }) {
  if (Object.hasOwnProperty.call(reducerMethods, action.type)) {
    return reducerMethods[action.type](state, action);
  } else {
    return state;
  }
}
