import { ActionTypes } from '../../actionTypes/actionTypes';

export function HelloWorld (state = [], action) {
  switch (action.type) {
    case ActionTypes.HELLOWORLD.ADDNAME:
      return [...state, action.payload.name];
    default:
      return state;
  }
}
