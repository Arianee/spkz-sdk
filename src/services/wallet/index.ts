import 'reflect-metadata';
import { container } from 'tsyringe';
import { MessagingWalletService } from './services/messagingWalletService/messagingWalletService';
import { RoomService } from './services/roomService/roomService';
import { RoomsService } from './services/roomsService/roomsService';

export class SPKZ {
    private container = container.createChildContainer();
    public wallets: MessagingWalletService = this.container.resolve(MessagingWalletService);
    public room: RoomService = this.container.resolve(RoomService);
    public rooms: RoomsService = this.container.resolve(RoomsService);

    public get privateKey () {
      return this.wallets.privateKey;
    }

    public static fromPrivateKey = (privateKey): SPKZ => {
      const spkzInstance = new SPKZ();
      spkzInstance.wallets.privateKey = privateKey;
      return spkzInstance;
    }
}
