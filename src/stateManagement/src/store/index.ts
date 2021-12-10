import { combineReducers, createStore } from 'redux';

import { HelloWorld } from '../reducers/helloWorld/reducer';
import { REDUCERNAME } from '../reducerName';
import { MessagesReducer } from '../reducers/messages/reducer';
import { NotificationsReducer } from '../reducers/notifications/reducer';
import { UsersProfileReducer } from '../reducers/usersProfile/reducer';
import { SectionMemberReducer } from '../reducers/sectionMembers/reducer';
import { FetchStatusReducer } from '../reducers/FetchStatus/reducer';

const rootReducer = combineReducers(
  {
    HelloWorld,
    [REDUCERNAME.MESSAGES]: MessagesReducer,
    [REDUCERNAME.NOTIFICATIONS]: NotificationsReducer,
    [REDUCERNAME.USERS]: UsersProfileReducer,
    [REDUCERNAME.SECTIONMEMBER]: SectionMemberReducer,
    [REDUCERNAME.FETCHSTATUS]: FetchStatusReducer
  });

let store;
export const getStore = (reset = false) => {
  if (!store || reset === true) {
    store = createStore(rootReducer,
      // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
      // applyMiddleware(logger)
    );
  }
  return store;
};
