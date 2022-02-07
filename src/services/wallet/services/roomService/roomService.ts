import { Lifecycle, scoped } from 'tsyringe';
import { MessageService } from '../messageService/messageService';
import { UserAndProfileService } from '../userAndProfileService/userAndProfileService';
import { UsersService } from '../usersService/usersService';
import { RightUtilsService } from '../rightUtilsService/rightUtilsService';
import { NFTROOM } from '../../../../models/NFTROOM';
import { IPFSService } from '../../../utils/services/nftRoomAdminService/IPFSService';
import { MetamaskService } from '../metamask/metamaskService';
import { Scope } from '@arianee/required';
import { HttpService } from '../../../utils/services/httpService/httpService';
import { retryExecFactory } from '../../../../helpers/retryExecFactory/retryExecFactory';

@scoped(Lifecycle.ContainerScoped)
export class RoomService {
  constructor (
    private messageService: MessageService,
    private userAndProfileService: UserAndProfileService,
    private usersService: UsersService,
    private rightUtilsService: RightUtilsService,
    private IPFSService: IPFSService,
    private metamask: MetamaskService,
    private httpService:HttpService
  ) {
  }

  public scope=Scope({ scopes: ['RoomService'] })

public message = this.messageService;
  public userAndProfile = this.userAndProfileService;
  public users = this.usersService;
  public rightUtils = this.rightUtilsService;

  public updateOnIPFSOnlyAndWaitForAvalaibility=async (content:NFTROOM | any) => {
    const contentURLOnIPFS = await this.IPFSService.storeContentOnIPFS(content);
    await retryExecFactory(
      () => this.httpService.fetch(contentURLOnIPFS, { timeout: 10000 }),
      12
    );
    return contentURLOnIPFS;
  }

  public updateContent = async (parameters: { content: NFTROOM, roomId: string }) => {
    const {
      roomId,
      content
    } = parameters;
    const { requiredDefined } = this.scope.subScope('updateContent');
    requiredDefined(roomId, 'roomId must be defined');
    requiredDefined(content, 'content must be defined');

    const contentURLOnIPFS = await this.IPFSService.storeContentOnIPFS(content);
    // check if metamaskadddress == owner address
    // network === polygon
    await this.metamask.initMetamaskSilently();

    await this.metamask
      .roomSmartContract()
      .methods
      .setTokenUri(roomId, contentURLOnIPFS)
      .send({ from: this.metamask.defaultAccount });
  };
}
