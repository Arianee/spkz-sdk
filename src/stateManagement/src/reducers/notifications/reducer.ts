import { ActionTypes } from '../../actionTypes/actionTypes';
import { cloneDeep } from 'lodash';
import { Scope } from '@arianee/required';
import * as _ from 'lodash';
import { NewMessageCount } from '../../../../models/jsonrpc/writeMessageParameters';

interface subState {
  newMessagesCount:number,
  sectionId:string,
  roomId:string
};

interface State {
  [roomId:string]: {
    [sectionId:string]:subState
};

}
const getDefaultSubState = (parameters:{roomId:string, sectionId:string}):subState => {
  const { sectionId, roomId } = parameters;
  return ({
    newMessagesCount: 0,
    sectionId,
    roomId
  });
};
const scope = Scope({ scopes: ['notificationsReducer'] });

const reducerMethods = {
  [ActionTypes.NOTIFICATION.newMessageCounts]: (state:State, action: {
    type: string,
    payload: {
      newMessagesCounts:NewMessageCount[],
      id: string,
      roomId:string,
      sectionId:string
    }
  }) => {
    const { requiredDefined } = scope.subScope(ActionTypes.NOTIFICATION.newMessageCounts);
    const { newMessagesCounts, roomId } = action.payload;

    requiredDefined(newMessagesCounts, 'newMessagesCount should be defined');
    requiredDefined(roomId, 'roomId should be defined');

    if (!state[roomId]) {
      state[roomId] = {};
    }

    let newState = state;
    newMessagesCounts
      .forEach(({ roomId, sectionId, newMessagesCount }) => {
        const subState = state[roomId][sectionId] || getDefaultSubState({ roomId, sectionId });
        const newNotificationStatus:subState = cloneDeep(subState);
        newNotificationStatus.newMessagesCount = newMessagesCount;
        newState = {
          ...newState
        };
        state[roomId][sectionId] = newNotificationStatus;
      });

    return newState;
  }

};

export function NotificationsReducer (state: State = {}, action: { type: string, payload: any }) {
  if (Object.hasOwnProperty.call(reducerMethods, action.type)) {
    return reducerMethods[action.type](state, action);
  } else {
    return state;
  }
}
