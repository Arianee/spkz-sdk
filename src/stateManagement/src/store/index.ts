import { combineReducers, createStore } from 'redux';

import { HelloWorld } from '../reducers/helloWorld/reducer';
import { REDUCERNAME } from '../reducerName';
import { MessagesReducer } from '../reducers/messages/reducer';

const rootReducer = combineReducers(
  {
    HelloWorld,
    [REDUCERNAME.MESSAGES]: MessagesReducer
  });

let store;
export const getStore = (reset = false) => {
  if (!store || reset === true) {
    store = createStore(rootReducer
      // applyMiddleware(logger)
    );
  }
  return store;
};
