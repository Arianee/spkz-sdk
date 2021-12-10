import { Lifecycle, scoped } from 'tsyringe';
import { RPCJSONService } from '../httpService/RPCJSONService';
import { requiredDefined } from '../../../../helpers/required/required';
import { FetchRoomService } from '../../../utils/services/fetchRoomService/fetchRoomService';
import { Observable } from 'rxjs';
import { UserProfile } from '../../../../models/userProfile';
import { subscribeToSectionMemberWithProfle } from '../../../../stateManagement/src/selectors/sectionMembers.selector';
import { FetchStatusEnum } from '../../../../stateManagement/src/reducers/FetchStatus/FetchStatusEnum';
import { getFetchStatus } from '../../../../stateManagement/src/selectors/fetchStatus.selector';

@scoped(Lifecycle.ContainerScoped)
export class UsersService {
  constructor (private fetchRoomService:FetchRoomService, private rpcJSONService:RPCJSONService) {
  }

  /**
   * Get list of section's users
   * @param {{roomId: string; sectionId: string}} parameters
   * @returns {Promise<{jsonrpc: number; id: string; result?: any}>}
   */
  public getSectionUsers (parameters: { roomId: string, sectionId: string }): Observable<UserProfile[]> {
    const {
      roomId,
      sectionId
    } = parameters;
    requiredDefined(roomId, 'roomId is required');
    requiredDefined(sectionId, 'sectionId is required');
    const name = `${FetchStatusEnum.profile}${roomId}${sectionId}`;
    const { ws, initialHttpCall } = getFetchStatus({ name });
    if (!initialHttpCall) {

    }
    if (!ws) {

    }
    return subscribeToSectionMemberWithProfle(parameters);
  }
}
