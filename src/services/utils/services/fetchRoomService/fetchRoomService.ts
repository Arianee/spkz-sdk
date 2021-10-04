import { Lifecycle, scoped } from 'tsyringe';
import { NFTROOM } from '../../../../models/NFTROOM';
import { HttpService } from '../httpService/httpService';
import cache from 'memory-cache';
import { ContractService } from '../contractService/contractService';
import { AsyncFunc } from '../../../../models/AsyncFunc';
import { requiredDefined } from '../../../../helpers/required/required';

@scoped(Lifecycle.ContainerScoped)
export class FetchRoomService {
  private _getCacheRoom: AsyncFunc<string, NFTROOM>;
  private _setCacheRoom: AsyncFunc<{ roomId: string, content: NFTROOM }>;

  private memCache=new cache.Cache();

  constructor (private httpService: HttpService,
              private contractService: ContractService) {
  }

  public setCacheMethods = async (parameters:
                                   {
                                     get: AsyncFunc<string, NFTROOM>,
                                     set: AsyncFunc<{ roomId: string, content: NFTROOM }>
                                   }) => {
    requiredDefined(parameters.get, 'get must be defined');
    requiredDefined(parameters.set, 'set must be defined');
    this._getCacheRoom = parameters.get;
    this._setCacheRoom = parameters.set;
    return this;
  };

  /**
   * Add to cache a room
   * @param roomId
   * @param {NFTROOM} content
   */
  public addToCache = (roomId, content: NFTROOM) => {
    this.memCache.put(roomId, Promise.resolve(content));
    if (this._setCacheRoom) {
      this._setCacheRoom({ roomId, content });
    }
  };

  public rawFetchRoom = async (roomId) => {
    const tokenURI = await this.contractService.erc721Contract().methods.tokenURI(roomId).call();
    return this.httpService.fetch(tokenURI);
  };

  /**
   * Fetch room.
   * If a room exist in custom cache, it will return custom cache.
   * Otherwise it returns a cached promise of the fetching room
   * @param {string} roomId
   * @returns {Promise<NFTROOM>}
   */
  public fetchRoom = async (roomId: string): Promise<NFTROOM> => {
    let nftRoom: NFTROOM;
    if (this._getCacheRoom) {
      nftRoom = await this._getCacheRoom(roomId);
      if (nftRoom) {
        return nftRoom;
      }
    }
    nftRoom = this.memCache.get(roomId);
    if (!nftRoom) {
      const cacheTimeout = 30 * 1000;
      this.memCache.put(roomId,
        this.rawFetchRoom(roomId)
          .then(d => {
            if (this._setCacheRoom) {
              this.memCache.del(roomId);
              this._setCacheRoom({ roomId: roomId, content: d });
            }
            return d;
          }), cacheTimeout);
    }

    return this.memCache.get(roomId);
  }
}
