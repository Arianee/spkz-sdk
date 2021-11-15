import { getStore } from '../../store';
import { ActionTypes } from '../../actionTypes/actionTypes';

export function addNameToHelloWorld (name:string) {
  getStore().dispatch({
    type: ActionTypes.HELLOWORLD.ADDNAME,
    payload: {
      name
    }
  });
}
