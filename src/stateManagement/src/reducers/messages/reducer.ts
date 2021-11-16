import { ActionTypes } from '../../actionTypes/actionTypes';
import { cloneDeep } from 'lodash';
import { Scope } from '@arianee/required';
import * as _ from 'lodash';

interface subState {
  messages: any[],
  status:{
    hasWSConnection: boolean,
    hasFetchedInitialMessages: boolean,
    previousTimestamp?:number,
    nextTimestamp?:number,
  }
};
interface State {
  id?: subState;
}
const getDefaultSubState = ():subState => ({
  messages: [],
  status: {
    hasWSConnection: false,
    hasFetchedInitialMessages: false
  }
});
const scope = Scope({ scopes: ['messagesReducer'] });

const reducerMethods = {
  [ActionTypes.MESSAGE.paginationStatus]: (state:State, action: {
    type: string,
    payload: {
      timestamp: number,
      next?: boolean,
      previous?:boolean
      id: string,
    }
  }) => {
    const { requiredDefined } = scope.subScope(ActionTypes.MESSAGE.paginationStatus);
    const { timestamp, next, previous, id } = action.payload;

    requiredDefined(next || previous, 'next or previous should be defined');
    const subState = state[action.payload.id] || getDefaultSubState();
    const newStatus = cloneDeep(subState.status);

    if (next) {
      newStatus.nextTimestamp = timestamp;
    } else if (previous) {
      newStatus.previousTimestamp = timestamp;
    }

    return {
      ...state,
      [action.payload.id]: {
        ...subState,
        status: newStatus
      }
    };
  },
  [ActionTypes.MESSAGE.toggleInitialFetch]: (state: State,
    action: {
      type: string,
      payload: {
        id: string, initialFetch: boolean
      }
    }) => {
    const { requiredDefined } = scope.subScope(ActionTypes.MESSAGE.toggleInitialFetch);
    const { initialFetch, id } = action.payload;
    requiredDefined(initialFetch, 'initialFetch should be defined');
    requiredDefined(id, 'id should be defined');

    const subState = state[action.payload.id] || getDefaultSubState();
    const newStatus = cloneDeep(subState.status);

    newStatus.hasFetchedInitialMessages = initialFetch;

    return {
      ...state,
      [action.payload.id]: {
        ...subState,
        status: newStatus
      }
    };
  },
  [ActionTypes.MESSAGE.toggleWS]: (state: State, action: {
    type: string, payload: {
      id: string,
      ws: boolean
    }
  }) => {
    const { requiredDefined } = scope.subScope(ActionTypes.MESSAGE.toggleInitialFetch);
    const { ws, id } = action.payload;
    requiredDefined(ws, 'initialFetch should be defined');
    requiredDefined(id, 'id should be defined');

    const subState = state[action.payload.id] || getDefaultSubState();

    const newStatus = cloneDeep(subState.status);
    newStatus.hasWSConnection = ws;

    return {
      ...state,
      [action.payload.id]: {
        ...subState,
        status: newStatus
      }
    };
  },
  [ActionTypes.MESSAGE.addMessage]: (state: State, action: {
    type: string, payload: {
      id: string, messages: any[]
    }
  }) => {
    const { requiredDefined } = scope.subScope(ActionTypes.MESSAGE.toggleInitialFetch);
    const { messages, id } = action.payload;
    requiredDefined(messages, 'messages should be defined');
    requiredDefined(id, 'id should be defined');
    const subState = state[action.payload.id] || getDefaultSubState();

    const newMessages = _.uniqWith([...subState.messages, ...messages], _.isEqual);

    if (newMessages.length === state[action.payload.id]?.messages?.length) {
      return state;
    }

    return {
      ...state,
      [action.payload.id]: {
        ...subState,
        messages: newMessages
      }
    };
  }
};

export function MessagesReducer (state: State = {}, action: { type: string, payload: any }) {
  if (Object.hasOwnProperty.call(reducerMethods, action.type)) {
    return reducerMethods[action.type](state, action);
  } else {
    return state;
  }
}
