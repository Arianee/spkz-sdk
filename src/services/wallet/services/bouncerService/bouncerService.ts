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
import cache from 'memory-cache';

@scoped(Lifecycle.ContainerScoped)
export class BouncerService {
  private _cache = new cache.Cache();

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

  public getMyProfile (): Promise<UserProfile> {
    if (!this._cache.get('bouncerUserProfile')) {
      this._cache.put('bouncerUserProfile', this.rpcService.signedRPCCall(this.environementService.environment.bouncerRPCURL,
        JSONRPCMethods.bouncer.users.getMyProfile,
        {}));
    }

    return this._cache.get('bouncerUserProfile');
  }

  public updateMyProfile (profile:UserProfile) {
    this._cache.del('bouncerUserProfile');

    return this.rpcService.signedRPCCall(this.environementService.environment.bouncerRPCURL,
      JSONRPCMethods.bouncer.users.updateMyProfile,
      profile);
  }

  public async getUserRooms ():Promise<RoomUser[]> {
    if (!this._cache.get('bouncerUserRooms')) {
      const getUserRoom = async () => {
        const userRooms: RoomUser[] = await this.rpcService.signedRPCCall(this.environementService.environment.bouncerRPCURL,
          JSONRPCMethods.bouncer.rooms.getUserRooms,
          {});

        userRooms.forEach(room => this.fetchRoomService.addToCache(room.roomId, room.roomDetails));
        return userRooms;
      };
      this._cache.put('bouncerUserRooms', getUserRoom());
    }

    return this._cache.get('bouncerUserRooms');
  }

  public async joinRoom (parameters:{roomId}) {
    this._cache.del('bouncerUserRooms');

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
    const url = `${this.environementService.environment.bouncerURL}/rooms/recommended`;
    const recommendedRooms:RecommendedOrFeaturedRoom[] = await this.httpService.fetchWithCache(url);
    recommendedRooms.forEach(d => this.fetchRoomService.addToCache(d.roomId, d.roomDetails));
    return recommendedRooms;
  }

  public async getFeaturedRooms (chainId?: string):Promise<RecommendedOrFeaturedRoom[]> {
    const url = `${this.environementService.environment.bouncerURL}/rooms/featured`;
    const featuredRooms = await this.httpService.fetchWithCache(url);
    featuredRooms.forEach(d => this.fetchRoomService.addToCache(d.roomId, d.roomDetails));
    return featuredRooms;
  }
}
