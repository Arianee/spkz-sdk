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
import { RecommendedOrFeaturedRoom } from '../../../..';
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
    const userRooms:RoomUser[] = await this.rpcService.signedRPCCall(this.environementService.environment.bouncerRPCURL,
      JSONRPCMethods.bouncer.rooms.getUserRooms,
      {});

    userRooms.forEach(room => this.fetchRoomService.addToCache(room.roomId, room.roomDetails));
    return userRooms;
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

  public async getRecommendedRooms (chainId?: string):Promise<RecommendedOrFeaturedRoom[]> {
    const chain = chainId || this.environementService.environment.chainId;
    const url = `https://raw.githubusercontent.com/Arianee/spkz-metadata/main/${chain}/recommended-rooms.json`;
    const recommendedRooms:RecommendedOrFeaturedRoom[] = await this.httpService.fetchWithCache(url);
    recommendedRooms.forEach(d => this.fetchRoomService.addToCache(d.roomId, d.roomDetails));
    return recommendedRooms;
  }

  public async getFeaturedRooms (chainId?: string):Promise<RecommendedOrFeaturedRoom[]> {
    const chain = chainId || this.environementService.environment.chainId;
    const url = `https://raw.githubusercontent.com/Arianee/spkz-metadata/main/${chain}/featured-rooms.json`;
    const featuredRooms = await this.httpService.fetchWithCache(url);
    featuredRooms.forEach(d => this.fetchRoomService.addToCache(d.roomId, d.roomDetails));
    return featuredRooms;
  }
}
