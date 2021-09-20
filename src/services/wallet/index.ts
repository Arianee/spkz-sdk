import 'reflect-metadata';
import { container } from 'tsyringe';
import { MessagingWallet } from './wallet/messagingWallet/messagingWallet';
import { Room } from './wallet/room/room';
import { Rooms } from './wallet/rooms/rooms';

export class SPKZ {
    private container = container.createChildContainer();
    public wallets: MessagingWallet = this.container.resolve(MessagingWallet);
    public room: Room = this.container.resolve(Room);
    public rooms: Rooms = this.container.resolve(Rooms);

    public get privateKey () {
      return this.wallets.privateKey;
    }

    public static fromPrivateKey = (privateKey): SPKZ => {
      const spkzInstance = new SPKZ();
      spkzInstance.wallets.privateKey = privateKey;
      return spkzInstance;
    }
}
