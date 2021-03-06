import 'reflect-metadata';
import { container } from 'tsyringe';
import { ProxyWalletService } from './services/proxyWalletService/proxyWalletService';
import { RoomService } from './services/roomService/roomService';
import { PayloadService } from './services/payloadService/payloadService';
import { MetamaskService } from './services/metamask/metamaskService';
import { network } from '../../models/network.enum';
import { BouncerService } from './services/bouncerService/bouncerService';
import { EnvironmentService } from '../utils/services/environmentService/environementService';
import { FetchRoomService } from '../utils/services/fetchRoomService/fetchRoomService';
import { RightService } from '../utils/services/rightService/rightService';
import { UserAndProfileService } from './services/userAndProfileService/userAndProfileService';
import { RightUtilsService } from './services/rightUtilsService/rightUtilsService';
import { MessageService } from './services/messageService/messageService';
import { UsersService } from './services/usersService/usersService';

export class SPKZ {
  public container = container.createChildContainer();
  public wallets: ProxyWalletService = this.container.resolve(ProxyWalletService);
  public bouncer: BouncerService = this.container.resolve(BouncerService);
  public environmentService = this.container.resolve(EnvironmentService);
  public room: RoomService = this.container.resolve(RoomService);

  public payloadService: PayloadService = this.container.resolve(PayloadService);
  public metamaskService: MetamaskService = this.container.resolve(MetamaskService);
  public fetchRoomService: FetchRoomService = this.container.resolve(FetchRoomService);
  public rightService: RightService = this.container.resolve(RightService);
  public userAndProfileService: UserAndProfileService = this.container.resolve(UserAndProfileService);
  public rightUtilsService: RightUtilsService = this.container.resolve(RightUtilsService);
  public messageService: MessageService = this.container.resolve(MessageService);
  public usersService: UsersService = this.container.resolve(UsersService);

  public get privateKey () {
    return this.wallets.privateKey;
  }

  public static fromPrivateKey = (privateKey): SPKZ => {
    const spkzInstance = new SPKZ();
    spkzInstance.wallets.privateKey = privateKey;
    return spkzInstance;
  };

  public checkAuthorizations = this.wallets.checkBlockchainWalletAuthorizations;
}

export { network };
