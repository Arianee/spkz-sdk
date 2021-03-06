import { getStore } from '../../store';
import { ActionTypes } from '../../actionTypes/actionTypes';
import { Scope } from '@arianee/required';
import { NewMessageCount } from '../../../../models/jsonrpc/writeMessageParameters';
import { getSectionNewMessagesCount } from '../../selectors/notifications.selector';

const scope = Scope({ scopes: ['notifications', 'actions'] });

/**
 * Toggle if ws has been connected
 * @param parameters
 */
export const updateNewMessageCountForARoom = (parameters:{
  roomId: string,
  newMessagesCounts:NewMessageCount[]
}) => {
  const { requiredDefined } = scope.subScope('updateNewMessageCount');
  const { roomId, newMessagesCounts } = parameters;
  requiredDefined(roomId, 'roomId is not defined');
  requiredDefined(newMessagesCounts, 'newMessagesCounts is not defined');

  getStore().dispatch({
    type: ActionTypes.NOTIFICATION.newMessageCounts,
    payload: {
      roomId,
      newMessagesCounts: newMessagesCounts
        .map(d => {
          d.newMessagesCount = +d.newMessagesCount;
          return d;
        })
    }
  });
};

/**
 * Toggle if ws has been connected
 * @param parameters
 */
export const updateFetchStatus = (parameters:{
  roomId: string
}) => {
  const { requiredDefined } = scope.subScope('updateNewMessageCount');
  const { roomId } = parameters;
  requiredDefined(roomId, 'roomId is not defined');

  getStore().dispatch({
    type: ActionTypes.NOTIFICATION.updateFetchStatus,
    payload: {
      roomId
    }
  });
};

/**
 * Toggle if ws has been connected
 * @param parameters
 */
export const resetNewMessageCountForASection = (parameters:{
  roomId: string,
  sectionId:string,
}) => {
  const { requiredDefined } = scope.subScope('resetNewMessageCountForASection');
  const { roomId, sectionId } = parameters;
  requiredDefined(roomId, 'roomId is not defined');
  requiredDefined(sectionId, 'sectionId is not defined');

  getStore().dispatch({
    type: ActionTypes.NOTIFICATION.updateNewMessageCountForASection,
    payload: {
      roomId,
      sectionId,
      newMessageCount: 0,
      lastViewed: new Date().toISOString()
    }
  });
};

/**
 * Toggle if ws has been connected
 * @param parameters
 */
export const updateNewMessageCountForASection = (parameters:{
  roomId: string,
  sectionId:string,
  increment:number
}) => {
  const { requiredDefined } = scope.subScope('resetNewMessageCountForASection');
  const { roomId, sectionId } = parameters;
  requiredDefined(roomId, 'roomId is not defined');
  requiredDefined(sectionId, 'sectionId is not defined');

  const countNow = getSectionNewMessagesCount(parameters);
  getStore().dispatch({
    type: ActionTypes.NOTIFICATION.updateNewMessageCountForASection,
    payload: {
      roomId,
      sectionId,
      newMessageCount: (parameters.increment) + countNow
    }
  });
};
