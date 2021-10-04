import { Lifecycle, scoped } from 'tsyringe';
import { RPCJSONService } from '../httpService/RPCJSONService';
import { ProxyWalletService } from '../proxyWalletService/proxyWalletService';
import { JSONRPCMethods } from '../../../../models/JSONRPCMethods.enum';
import { requiredDefined } from '../../../../helpers/required/required';
import { FetchRoomService } from '../../../utils/services/fetchRoomService/fetchRoomService';
import { RightService } from '../../../utils/services/rightService/rightService';
import { UserProfile } from '../../../../models/userProfile';
import { MetamaskService } from '../metamask/metamaskService';
import { HttpService } from '../../../utils/services/httpService/httpService';
import { RecommendedOrFeaturedRoom } from '../../../../models/recommendedOrFeaturedRoom';
import { EnvironmentService } from '../../../utils/services/environmentService/environementService';
import { RoomUser } from '../../../../models/jsonrpc/writeMessageParameters';

@scoped(Lifecycle.ContainerScoped)
export class BouncerService {
  constructor (
      private messagingService:ProxyWalletService,
      private fetchRoomService:FetchRoomService,
      private rightService:RightService,
      private rpcService: RPCJSONService,
      private metamaskService: MetamaskService,
      private httpService: HttpService,
      private environementService:EnvironmentService
  ) {

  }

  public getMyProfile () {
    return this.rpcService.signedRPCCall(this.environementService.environment.bouncerRPCURL,
      JSONRPCMethods.bouncer.users.getMyProfile,
      {});
  }

  public updateMyProfile (profile:UserProfile) {
    return this.rpcService.signedRPCCall(this.environementService.environment.bouncerRPCURL,
      JSONRPCMethods.bouncer.users.updateMyProfile,
      profile);
  }

  public async getUserRooms ():Promise<RoomUser[]> {
    return this.rpcService.signedRPCCall(this.environementService.environment.bouncerRPCURL,
      JSONRPCMethods.bouncer.rooms.getUserRooms,
      {});
  }

  public async joinRoom (parameters:{roomId}) {
    const { roomId } = parameters;
    requiredDefined(roomId, 'roomId is required');

    const params = {
      roomId
    };

    return this.rpcService.signedRPCCall(this.environementService.environment.bouncerRPCURL,
      JSONRPCMethods.bouncer.rooms.join,
      params);
  }

  public async getRecommendedRooms ():Promise<RecommendedOrFeaturedRoom[]> {
    const url = `${this.environementService.environment.bouncerURL}/rooms/recommended`;
    return this.httpService.fetchWithCache(url);
  }

  public async getFeaturedRooms ():Promise<RecommendedOrFeaturedRoom[]> {
    const url = `${this.environementService.environment.bouncerURL}/rooms/featured`;
    return this.httpService.fetchWithCache(url);
  }
}
