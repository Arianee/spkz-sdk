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

@scoped(Lifecycle.ContainerScoped)
export class BouncerService {
  public bouncerURL='https://bouncer.spkz.io/spkz/rpc';
  constructor (
      private messagingService:ProxyWalletService,
      private fetchRoomService:FetchRoomService,
      private rightService:RightService,
      private rpcService: RPCJSONService,
      private metamaskService: MetamaskService,
      private httpService: HttpService
  ) {

  }

  public getMyProfile () {
    return this.rpcService.signedRPCCall(this.bouncerURL,
      JSONRPCMethods.bouncer.users.getMyProfile,
      {});
  }

  public updateMyProfile (profile:UserProfile) {
    return this.rpcService.signedRPCCall(this.bouncerURL,
      JSONRPCMethods.bouncer.users.updateMyProfile,
      profile);
  }

  public async getUserRooms () {
    return this.rpcService.signedRPCCall(this.bouncerURL,
      JSONRPCMethods.bouncer.rooms.getUserRooms,
      {});
  }

  public async joinRoom (parameters:{roomId}) {
    const { roomId } = parameters;
    requiredDefined(roomId, 'roomId is required');

    const params = {
      roomId
    };

    return this.rpcService.signedRPCCall(this.bouncerURL,
      JSONRPCMethods.bouncer.rooms.join,
      params);
  }

  public async getRecommendedRooms (chainId?: string):Promise<RecommendedOrFeaturedRoom[]> {
    const chain = chainId || this.metamaskService.currentChainId.toString();
    const url = `https://raw.githubusercontent.com/Arianee/spkz-metadata/main/${chain}/recommended-rooms.json`;
    return this.httpService.fetchWithCache(url);
  }

  public async getFeaturedRooms (chainId?: string):Promise<RecommendedOrFeaturedRoom[]> {
    const chain = chainId || this.metamaskService.currentChainId.toString();
    const url = `https://raw.githubusercontent.com/Arianee/spkz-metadata/main/${chain}/featured-rooms.json`;
    return this.httpService.fetchWithCache(url);
  }
}
