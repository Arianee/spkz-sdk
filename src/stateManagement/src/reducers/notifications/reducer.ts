import { ActionTypes } from '../../actionTypes/actionTypes';
import { cloneDeep, merge } from 'lodash';
import { Scope } from '@arianee/required';
import { NewMessageCount } from '../../../../models/jsonrpc/writeMessageParameters';

interface SectionState {
  newMessagesCount: number,
  sectionId: string,
  roomId: string
};

interface RoomState{
  sections: {
    [sectionId: string]: SectionState
  },
  status: {
    isFetched?: boolean
  }
}
interface State {
  [roomId: string]: RoomState;

}

const getDefaultState = (state:State) => {
  const getRoomOrDefaultState = (parameters: { roomId: string}): RoomState => {
    const {
      roomId
    } = parameters;
    if (!state[roomId]) {
      return ({
        sections: {},
        status: {
          isFetched: false
        }
      });
    } else {
      return cloneDeep(state[roomId]);
    }
  };

  const getSectionOrDefaultSectionState = (parameters: { roomId: string, sectionId: string }): SectionState => {
    const {
      sectionId,
      roomId
    } = parameters;
    if (!state[roomId] || !state[roomId].sections[sectionId]) {
      return ({
        newMessagesCount: 0,
        sectionId,
        roomId
      });
    } else {
      return cloneDeep(state[roomId].sections[sectionId]);
    }
  };

  return {
    getRoomOrDefaultState,
    getSectionOrDefaultSectionState
  };
};

const scope = Scope({ scopes: ['notificationsReducer'] });

const reducerMethods = {
  [ActionTypes.NOTIFICATION.updateFetchStatus]: (state: State, action: {
    type: string,
    payload: {
      roomId: string,
    }
  }) => {
    const { requiredDefined } = scope.subScope(ActionTypes.NOTIFICATION.updateFetchStatus);
    const {
      roomId
    } = action.payload;

    requiredDefined(roomId, 'roomId should be defined');

    const roomState = getDefaultState(state).getRoomOrDefaultState({ roomId });

    if (!roomState.status) {
      roomState.status = {};
    }

    roomState.status.isFetched = true;

    return {
      ...state,
      [roomId]: roomState
    };
  },
  [ActionTypes.NOTIFICATION.updateNewMessageCountForASection]: (state: State, action: {
    type: string,
    payload: {
      roomId: string,
      sectionId: string,
      newMessageCount:number
    }
  }) => {
    const { requiredDefined } = scope.subScope(ActionTypes.NOTIFICATION.updateNewMessageCountForASection);
    const {
      sectionId,
      roomId,
      newMessageCount
    } = action.payload;

    requiredDefined(sectionId, 'sectionId should be defined');
    requiredDefined(roomId, 'roomId should be defined');
    requiredDefined(newMessageCount, 'newMessageCount should be defined');

    const sectionState = getDefaultState(state).getSectionOrDefaultSectionState({
      roomId,
      sectionId
    });

    sectionState.newMessagesCount = newMessageCount;
    const newSubState = cloneDeep(merge(
      {
        [roomId]:
          state[roomId]
      },
      {
        [roomId]: {
          sections: {
            [sectionId]: sectionState
          }
        }
      }));

    return {
      ...state,
      ...newSubState
    };
  },
  [ActionTypes.NOTIFICATION.newMessageCounts]: (state: State, action: {
    type: string,
    payload: {
      newMessagesCounts: NewMessageCount[],
      id: string,
      roomId: string,
      sectionId: string
    }
  }) => {
    const { requiredDefined } = scope.subScope(ActionTypes.NOTIFICATION.newMessageCounts);
    const {
      newMessagesCounts,
      roomId
    } = action.payload;

    requiredDefined(newMessagesCounts, 'newMessagesCount should be defined');
    requiredDefined(roomId, 'roomId should be defined');

    let newRoomState = getDefaultState(state).getRoomOrDefaultState({ roomId });

    newMessagesCounts
      .forEach((notifStatus) => {
        const roomId = action.payload.roomId;
        const { sectionId } = notifStatus;
        const newNotificationStatus = getDefaultState(state).getSectionOrDefaultSectionState({
          roomId: roomId,
          sectionId
        });

        newRoomState = merge(
          newRoomState,
          {
            sections: {
              [sectionId]: { ...newNotificationStatus, ...notifStatus }
            }
          });
      });

    return {
      ...state,
      [roomId]: newRoomState
    };
  }

};

export function NotificationsReducer (state: State = {}, action: { type: string, payload: any }) {
  if (Object.hasOwnProperty.call(reducerMethods, action.type)) {
    return reducerMethods[action.type](state, action);
  } else {
    return state;
  }
}
