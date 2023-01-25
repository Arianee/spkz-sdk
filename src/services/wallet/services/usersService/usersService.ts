import { Lifecycle, scoped } from 'tsyringe';
import { requiredDefined } from '../../../../helpers/required/required';
import { FetchRoomService } from '../../../utils/services/fetchRoomService/fetchRoomService';
import { Observable } from 'rxjs';
import { UserProfileFromStore } from '../../../../models/userProfile/userProfile';
import {
  subscribeToOneSectionMemberWithProfle,
  subscribeToSectionMemberWithProfle
} from '../../../../stateManagement/src/selectors/sectionMembers.selector';
import { FetchStatusEnum } from '../../../../stateManagement/src/reducers/fetchStatus/FetchStatusEnum';
import { getFetchStatus } from '../../../../stateManagement/src/selectors/fetchStatus.selector';
import { updateFetchStatus } from '../../../../stateManagement/src/reducers/fetchStatus/actions';
import { addUsersProfiles } from '../../../../stateManagement/src/reducers/usersProfile/actions';
import { addMembersToSection } from '../../../../stateManagement/src/reducers/sectionMembers/actions';
import { UsersClientService } from './usersClientService';
import { WebsocketService } from '../websocketService/websocketService';
import {
  InternalMessageEventEmitterService
} from '../internalMessageEventEmitterService/internalMessageEventEmitterService';

@scoped(Lifecycle.ContainerScoped)
export class UsersService {
  constructor (
    private fetchRoomService:FetchRoomService,
    private usersClientService:UsersClientService,
    private websocketService: WebsocketService,
    private messageService: InternalMessageEventEmitterService
  ) {
  }

  public subscribeToOneSectionUsers (parameters: {
    roomId: string,
    sectionId: string,
    address:string,
    forceRefresh?:boolean }): Observable<UserProfileFromStore> {
    this.initialFetch(parameters);

    return subscribeToOneSectionMemberWithProfle(parameters);
  }

  private initialFetch (parameters: {
    roomId: string,
    sectionId: string,
    forceRefresh?:boolean }) {
    const {
      roomId,
      sectionId,
      forceRefresh
    } = parameters;

    requiredDefined(roomId, 'roomId is required');
    requiredDefined(sectionId, 'sectionId is required');
    const shouldRefresh = forceRefresh || false;
    const name = `${FetchStatusEnum.profile}${roomId}${sectionId}`;
    const { ws, initialHttpCall } = getFetchStatus({ name });

    if (!initialHttpCall || shouldRefresh) {
      updateFetchStatus({
        name,
        status: {
          initialHttpCall: true
        }
      });
      this.usersClientService.getSectionUsers(parameters)
        .then(usersFromDB => {
          const users = usersFromDB.map(d => {
            return {
              ...d.payload,
              address: d.blockchainWallet
            };
          });
          addUsersProfiles({ roomId: roomId, users: usersFromDB });
          addMembersToSection({ sectionId, roomId, users });
        });
    }

    if (!ws) {
      this.websocketService.joinSection(parameters);
      updateFetchStatus({
        name,
        status: {
          ws: true
        }
      });

      this.messageService.userJoinSectionEvent((data:string) => {
        const member = JSON.parse(data);
        addUsersProfiles({ roomId: member.roomId, users: [member] });
        addMembersToSection({ sectionId: member.sectionId, roomId: member.roomId, users: [{ address: member.blockchainWallet }] });
        return member;
      });
      // to code!
    }
  }

  /**
   * Get list of section's users
   * @param {{roomId: string; sectionId: string}} parameters
   * @returns {Promise<{jsonrpc: number; id: string; result?: any}>}
   */
  public subscribeToSectionUsers (parameters: {
    roomId: string,
    sectionId: string,
    forceRefresh?:boolean }): Observable<UserProfileFromStore[]> {
    this.initialFetch(parameters);

    return subscribeToSectionMemberWithProfle(parameters);
  }
}
