import { getStore } from '../../store';
import { ActionTypes } from '../../actionTypes/actionTypes';
import { Scope } from '@arianee/required';
import { hashFromRoomIdSectionId } from '../../helpers/hasFromRoomIdAndSectionId';
import { NewMessageCount } from '../../../../models/jsonrpc/writeMessageParameters';

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
    }
  });
};
