import { Lifecycle, scoped } from 'tsyringe';
import { RPCJSONService } from '../httpService/RPCJSONService';
import { StrategiesReturn } from '../../../../models/strategyReturn';
import { ProxyWalletService } from '../proxyWalletService/proxyWalletService';
import { JSONRPCMethods } from '../../../../models/JSONRPCMethods.enum';
import { requiredDefined } from '../../../../helpers/required/required';
import { FetchRoomService } from '../../../utils/services/fetchRoomService/fetchRoomService';
import { RightService } from '../../../utils/services/rightService/rightService';
import { UserProfile } from '../../../../models/userProfile';

@scoped(Lifecycle.ContainerScoped)
export class BouncerService {
  constructor (
               private messagingService:ProxyWalletService,
               private fetchRoomService:FetchRoomService,
               private rightService:RightService,
               private httpService:RPCJSONService) {

  }

  public getMyProfile () {
    return this.httpService.signedRPCCall('http://localhost:3000/spkz/rpc',
      JSONRPCMethods.bouncer.users.getMyProfile,
      {});
  }

  public updateMyProfile (profile:UserProfile) {
    return this.httpService.signedRPCCall('http://localhost:3000/spkz/rpc',
      JSONRPCMethods.bouncer.users.updateMyProfile,
      profile);
  }

  public async getUserRooms () {
    return this.httpService.signedRPCCall('http://localhost:3000/spkz/rpc',
      JSONRPCMethods.bouncer.rooms.getUserRooms,
      {});
  }

  public async joinRoom (parameters:{roomId}) {
    const { roomId } = parameters;
    requiredDefined(roomId, 'roomId is required');

    const params = {
      roomId
    };

    return this.httpService.signedRPCCall('http://localhost:3000/spkz/rpc',
      JSONRPCMethods.bouncer.rooms.join,
      params);
  }
}
