import { Lifecycle, scoped } from 'tsyringe';
import { RPCJSONService } from '../httpService/RPCJSONService';
import { StrategiesReturn } from '../../../../models/strategyReturn';
import { ProxyWalletService } from '../proxyWalletService/proxyWalletService';
import { JSONRPCMethods } from '../../../../models/JSONRPCMethods.enum';
import { requiredDefined } from '../../../../helpers/required/required';
import { FetchRoomService } from '../../../utils/services/fetchRoomService/fetchRoomService';
import { RightService } from '../../../utils/services/rightService/rightService';
import { UserProfile } from '../../../../models/userProfile';
import { WebsocketService } from '../websocketService/websocketService';
import { NFTROOM } from '../../../../models/NFTROOM';
import { InternalMessageEventEmitterService } from '../internalMessageEventEmitterService/internalMessageEventEmitterService';
import {
  isWSInitilized,
  nextTimestamp,
  $messagesFromSection,
  hasFetchInitialData, getMessages
} from '../../../../stateManagement/src/selectors/messages.selector';
import {
  addMessagesToSection, toggleInitialFetch,
  updateMessagesPagination
} from '../../../../stateManagement/src/reducers/messages/actions';
import { NewMessageCount, ReadMessageReturn } from '../../../../models/jsonrpc/writeMessageParameters';
import { FetchParameters } from '../../../../models/FetchParameters';
import { Observable } from 'redux';
import { $newMessagesFromSection } from '../../../../stateManagement/src/selectors/notifications.selector';
import { updateNewMessageCountForARoom } from '../../../../stateManagement/src/reducers/notifications/actions';
import { MessageService } from '../messageService/messageService';
import { UserAndProfileService } from '../userAndProfileService/userAndProfileService';
import { UsersService } from '../usersService/usersService';
import { RightUtilsService } from '../rightUtilsService/rightUtilsService';

@scoped(Lifecycle.ContainerScoped)
export class RoomService {
  constructor (
    private messageService: MessageService,
    private userAndProfileService: UserAndProfileService,
    private usersService: UsersService,
    private rightUtilsService: RightUtilsService
  ) {
  }

  public message = this.messageService;
  public userAndProfile = this.userAndProfileService;
  public users = this.usersService;
  public rightUtils = this.rightUtilsService;
}
