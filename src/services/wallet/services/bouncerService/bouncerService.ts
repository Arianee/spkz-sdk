import { Lifecycle, scoped } from 'tsyringe';
import { RPCJSONService } from '../httpService/RPCJSONService';
import { ProxyWalletService } from '../proxyWalletService/proxyWalletService';
import { JSONRPCMethods } from '../../../../models/JSONRPCMethods.enum';
import { requiredDefined } from '../../../../helpers/required/required';
import { FetchRoomService } from '../../../utils/services/fetchRoomService/fetchRoomService';
import { RightService } from '../../../utils/services/rightService/rightService';
import { UserProfileToSend } from '../../../../models/userProfile/userProfile';
import { MetamaskService } from '../metamask/metamaskService';
import { HttpService } from '../../../utils/services/httpService/httpService';
import { EnvironmentService } from '../../../utils/services/environmentService/environementService';
import { RoomUser } from '../../../../models/jsonrpc/writeMessageParameters';
import cache from 'memory-cache';
import { RoomFromStore } from '../../../../models/room/recommendedAndFeaturedRoom';
import { addOrUpdateRooms } from '../../../../stateManagement/src/reducers/rooms/actions';
import { getFetchStatus } from '../../../../stateManagement/src/selectors/fetchStatus.selector';
import { lastValueFrom, Observable } from 'rxjs';
import {
  $subscribeFeaturedRooms,
  $subscribeRecommendedRooms
} from '../../../../stateManagement/src/selectors/room.selector';
import { filter, take } from 'rxjs/operators';
import { updateFetchStatus } from '../../../../stateManagement/src/reducers/fetchStatus/actions';
import { addUserRooms } from '../../../../stateManagement/src/reducers/userRooms/actions';
import { userRooms } from '../../../../stateManagement/src/selectors/userRooms.selector';

@scoped(Lifecycle.ContainerScoped)
export class BouncerService {
  private _cache = new cache.Cache();

  constructor (
    private messagingService: ProxyWalletService,
    private fetchRoomService: FetchRoomService,
    private rightService: RightService,
    private rpcService: RPCJSONService,
    private metamaskService: MetamaskService,
    private httpService: HttpService,
    private environementService: EnvironmentService
  ) {

  }

  public async getMyProfile (): Promise<UserProfileToSend> {
    if (!this._cache.get('bouncerUserProfile')) {
      this._cache.put('bouncerUserProfile', this.rpcService.signedRPCCall(this.environementService.environment.bouncerRPCURL,
        JSONRPCMethods.bouncer.users.getMyProfile,
        {}).then(profile => profile?.payload || {}));
    }

    return this._cache.get('bouncerUserProfile');
  }

  public updateMyProfile (profile: UserProfileToSend) {
    this._cache.del('bouncerUserProfile');

    return this.rpcService.signedRPCCall(this.environementService.environment.bouncerRPCURL,
      JSONRPCMethods.bouncer.users.updateMyProfile,
      profile);
  }

  public getUserRooms (): Observable<RoomUser[]> {
    this.rpcService.signedRPCCall(this.environementService.environment.bouncerRPCURL,
      JSONRPCMethods.bouncer.rooms.getUserRooms,
      {})
      .then((userRooms: RoomUser[]) => {
        addUserRooms({ userRooms });
      });
    return userRooms();
  }

  public async joinRoom (parameters: { roomId }) {
    this._cache.del('bouncerUserRooms');

    const { roomId } = parameters;
    requiredDefined(roomId, 'roomId is required');

    const params = {
      roomId
    };
    const signedRPCCall = await this.rpcService.signedRPCCall(this.environementService.environment.bouncerRPCURL,
      JSONRPCMethods.bouncer.rooms.join,
      params);

    this.getUserRooms();
    return signedRPCCall;
  }

  /**
   * Subscribe to recommened rooms
   */
  public $recommendedRooms = (): Observable<RoomFromStore[]> => {
    const name = '$recommendedRooms';

    const { initialHttpCall } = getFetchStatus({ name });

    if (!initialHttpCall) {
      const url = `${this.environementService.environment.bouncerURL}/rooms/recommended`;
      this.httpService.fetchWithCache(url)
        .then(recommendedRooms => {
          recommendedRooms.forEach(d => this.fetchRoomService.addToCache(d.roomId, d.roomDetails));

          const recommendedRoomsModified = recommendedRooms
            .map(room => ({
              ...room,
              recommended: true
            }));
          updateFetchStatus({ name, status: { initialHttpCall: true } });
          addOrUpdateRooms(recommendedRoomsModified);
        });
    }

    return $subscribeRecommendedRooms()
      .pipe(filter(() => getFetchStatus({ name }).initialHttpCall));
  };

  /**
   * Subscribe to featured rooms
   */
  public $featuredRooms = (): Observable<RoomFromStore[]> => {
    const name = '$featuredRooms';

    const { initialHttpCall } = getFetchStatus({ name });

    if (!initialHttpCall) {
      const url = `${this.environementService.environment.bouncerURL}/rooms/featured`;
      this.httpService.fetchWithCache(url)
        .then(featuredRooms => {
          featuredRooms.forEach(d => this.fetchRoomService.addToCache(d.roomId, d.roomDetails));

          const featuredRoomsModified = featuredRooms
            .map(room => ({
              ...room,
              featured: true
            }));
          updateFetchStatus({ name, status: { initialHttpCall: true } });
          addOrUpdateRooms(featuredRoomsModified);
        });
    }

    return $subscribeFeaturedRooms()
      .pipe(filter(() => getFetchStatus({ name }).initialHttpCall));
  };

  public getRecommendedRooms = (): Promise<RoomFromStore[]> => lastValueFrom(this.$recommendedRooms().pipe(take(1)));

  public getFeaturedRooms = (): Promise<RoomFromStore[]> => lastValueFrom(this.$featuredRooms().pipe(take(1)));

  public async getVerifiedRoomsId (): Promise<string[]> {
    const chainId = this.environementService.environment.chainId;
    const url = `https://raw.githubusercontent.com/Arianee/spkz-metadata/main/${chainId}/verified-rooms.json`;
    const verifiedRoomsId = await this.httpService.fetchWithCache(url);
    return verifiedRoomsId;
  }

  public async getSpecialRoomsId (): Promise<string[]> {
    const chainId = this.environementService.environment.chainId;
    const url = `https://raw.githubusercontent.com/Arianee/spkz-metadata/main/${chainId}/special-rooms.json`;
    const specialRoomsId = await this.httpService.fetchWithCache(url);
    return specialRoomsId;
  }
}
