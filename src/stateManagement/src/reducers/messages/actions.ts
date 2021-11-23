import { getStore } from '../../store';
import { ActionTypes } from '../../actionTypes/actionTypes';
import { Scope } from '@arianee/required';
import { hashFromRoomIdSectionId } from '../../helpers/hasFromRoomIdAndSectionId';
import { updateNewMessageCountForASection } from '../notifications/actions';

const scope = Scope({ scopes: ['messages', 'actions'] });

/**
 * Toggle if ws has been connected
 * @param parameters
 */
export const toggleWS = (parameters:{
  roomId: string,
  sectionId: string,
  ws:boolean
}) => {
  getStore().dispatch({
    type: ActionTypes.MESSAGE.toggleWS,
    payload: {
      id: hashFromRoomIdSectionId(parameters),
      ws: parameters.ws
    }
  });
};
/**
 * Toggle if messages from initial fetch has been fetched
 * @param parameters
 */
export const toggleInitialFetch = (parameters:{
  roomId: string,
  sectionId: string,
  initialFetch:boolean
}) => {
  getStore().dispatch({
    type: ActionTypes.MESSAGE.toggleInitialFetch,
    payload: {
      id: hashFromRoomIdSectionId(parameters),
      initialFetch: parameters.initialFetch
    }
  });
};
/**
 * Add message to sectionId and RoomId
 * @param parameters
 */
export function addMessagesToSection (parameters:{
  roomId: string,
  sectionId: string,
  messages: any
}) {
  const { requiredDefined, requiredType } = scope.subScope('addMessageToSectionId');
  const { roomId, sectionId, messages } = parameters;
  requiredDefined(roomId, 'roomId should be defined');
  requiredDefined(sectionId, 'sectionId should be defined');
  requiredDefined(messages, 'message should be defined');
  requiredType(messages, 'array', 'message should be an array');

  getStore().dispatch({
    type: ActionTypes.MESSAGE.addMessage,
    payload: {
      id: hashFromRoomIdSectionId(parameters),
      messages: parameters.messages
    }
  });
  updateNewMessageCountForASection({
    ...parameters,
    increment: parameters.messages.length
  });
}

export function updateMessagesPagination (parameters:{
  roomId, sectionId,
  nextTimestamp?:number,
  previousTimestamp?:number
}) {
  const { requiredDefined, requiredType } = scope.subScope('updateMessagesPagination');
  const { roomId, sectionId, nextTimestamp, previousTimestamp } = parameters;
  requiredDefined(roomId, 'roomId should be defined');
  requiredDefined(sectionId, 'sectionId should be defined');
  requiredDefined(nextTimestamp || previousTimestamp, 'hasNextMessages or hasNextMessages should be an defined');

  if (previousTimestamp) {
    getStore().dispatch({
      type: ActionTypes.MESSAGE.paginationStatus,
      payload: {
        id: hashFromRoomIdSectionId(parameters),
        timestamp: previousTimestamp,
        previous: true
      }
    });
  }

  if (nextTimestamp) {
    getStore().dispatch({
      type: ActionTypes.MESSAGE.paginationStatus,
      payload: {
        id: hashFromRoomIdSectionId(parameters),
        timestamp: nextTimestamp,
        next: true
      }
    });
  }
}
