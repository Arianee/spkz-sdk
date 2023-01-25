import { Lifecycle, scoped } from 'tsyringe';
import { MessageService } from '../messageService/messageService';
import { UserAndProfileService } from '../userAndProfileService/userAndProfileService';
import { UsersService } from '../usersService/usersService';
import { RightUtilsService } from '../rightUtilsService/rightUtilsService';
import { NFTROOM } from '../../../../models/NFTROOM';
import { IPFSContentType, IPFSService } from '../../../utils/services/nftRoomAdminService/IPFSService';
import { MetamaskService } from '../metamask/metamaskService';
import { Scope } from '@arianee/required';
import { HttpService } from '../../../utils/services/httpService/httpService';
import { EnvironmentService } from '../../../utils/services/environmentService/environementService';
import { GasStationService } from '../../../utils/services/gasStationService/gasStationService';

@scoped(Lifecycle.ContainerScoped)
export class RoomService {
  constructor (
    private messageService: MessageService,
    private userAndProfileService: UserAndProfileService,
    private usersService: UsersService,
    private rightUtilsService: RightUtilsService,
    public IPFSService: IPFSService,
    private metamask: MetamaskService,
    private httpService: HttpService,
    private environmentService: EnvironmentService,
    private gasStationService:GasStationService
  ) {
  }

  public scope = Scope({ scopes: ['RoomService'] });

  public message = this.messageService;
  public userAndProfile = this.userAndProfileService;
  public users = this.usersService;
  public rightUtils = this.rightUtilsService;

  // Promise<{ content: NFTROOM, roomId: string }>
  public createRoom = async (parameters: { content: NFTROOM }): Promise<{ content: NFTROOM, roomId: string, [key: string]: any }> => {
    const {
      content
    } = parameters;
    const { requiredDefined } = this.scope.subScope('createRoom');
    requiredDefined(content, 'content must be defined');
    const contentURLOnIPFS = await this.IPFSService.updateOnIPFSOnlyAndWaitForAvalaibility(content, IPFSContentType.JSON);

    await this.metamask.initMetamaskSilently(this.environmentService.environment.chainId);

    const to = this.metamask.defaultAccount;
    const gasPrice = await this.gasStationService.fetchGasStation();

    const result = await this.metamask
      .roomSmartContract()
      .methods
      .safeMint(to, contentURLOnIPFS)
      .send({ from: this.metamask.defaultAccount, gasPrice });

    const roomId = result.events.Transfer.returnValues.tokenId;

    return {
      roomId,
      content,
      tokenURI: contentURLOnIPFS
    };
  };

  public updateContent = async (parameters: { content: NFTROOM, roomId: string }) => {
    const {
      roomId,
      content
    } = parameters;
    const { requiredDefined } = this.scope.subScope('updateContent');
    requiredDefined(roomId, 'roomId must be defined');
    requiredDefined(content, 'content must be defined');

    const contentURLOnIPFS = await this.IPFSService.updateOnIPFSOnlyAndWaitForAvalaibility(content, IPFSContentType.JSON);
    // check if metamaskadddress == owner address
    // network === polygon
    await this.metamask.initMetamaskSilently(this.environmentService.environment.chainId);
    const gasPrice = await this.gasStationService.fetchGasStation();

    await this.metamask
      .roomSmartContract()
      .methods
      .setTokenUri(roomId, contentURLOnIPFS)
      .send({ from: this.metamask.defaultAccount, gasPrice });
  };
}
