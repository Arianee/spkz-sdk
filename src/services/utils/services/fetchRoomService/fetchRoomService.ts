import { Lifecycle, scoped, singleton } from 'tsyringe';
import { NFTROOM } from '../../../../models/NFTROOM';
import Web3 from 'web3';
import { erc721ABI } from '../../../../abi/erc721.abi';
import { HttpService } from '../httpService/httpService';
import cache from 'memory-cache';
import { environment } from '../../../../environment/environment';

@singleton()
export class FetchRoomService {
  constructor (private httpService:HttpService) {
  }

    public erc721Contract=new (new Web3(environment.defaultProvider))
      .eth.Contract(erc721ABI as any, environment.roomContractAddress);

    public fetchRoom= async (roomId:string):Promise<NFTROOM> => {
      const nftRoom = cache.get(roomId);
      if (!nftRoom) {
        const tokenURI = await this.erc721Contract.methods.tokenURI(roomId).call();

        const cacheTimeout = 30 * 1000;
        cache.put(roomId,
          this.httpService.fetch(tokenURI),
          cacheTimeout);
      }

      return cache.get(roomId);
    }
}
