import 'reflect-metadata';
import { container } from 'tsyringe';
import { ProxyWalletService } from './services/proxyWalletService/proxyWalletService';
import { RoomService } from './services/roomService/roomService';
import { RoomsService } from './services/roomsService/roomsService';
import { PayloadService } from './services/payloadService/payloadService';
import { MetamaskService } from './services/metamask/metamaskService';
import { network } from '../../models/network.enum';
import { BouncerService } from './services/bouncerService/bouncerService';

export class SPKZ {
    private container = container.createChildContainer();
    public wallets: ProxyWalletService = this.container.resolve(ProxyWalletService);
    public room: RoomService = this.container.resolve(RoomService);
    public bouncer: BouncerService = this.container.resolve(BouncerService);

    public rooms: RoomsService = this.container.resolve(RoomsService);
    public payloadService:PayloadService=this.container.resolve(PayloadService);
    public metamaskService:MetamaskService =this.container.resolve(MetamaskService);

    public get privateKey () {
      return this.wallets.privateKey;
    }

    public static fromPrivateKey = (privateKey): SPKZ => {
      const spkzInstance = new SPKZ();
      spkzInstance.wallets.privateKey = privateKey;
      return spkzInstance;
    }

 public checkAuthorizations=this.wallets.checkBlockchainWalletAuthorizations;
}

export { network };
