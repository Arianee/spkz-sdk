import { singleton } from 'tsyringe';
import { NFTROOM } from '../../../../models/NFTROOM';
import { HttpService } from '../httpService/httpService';
import cache from 'memory-cache';
import { ContractService } from '../contractService/contractService';

@singleton()
export class FetchRoomService {
  constructor (private httpService:HttpService, private contractService:ContractService) {
  }

    public fetchRoom= async (roomId:string):Promise<NFTROOM> => {
      const nftRoom = cache.get(roomId);
      if (!nftRoom) {
        const tokenURI = await this.contractService.erc721Contract().methods.tokenURI(roomId).call();

        const cacheTimeout = 30 * 1000;
        cache.put(roomId,
          this.httpService.fetch(tokenURI),
          cacheTimeout);
      }

      return cache.get(roomId);
    }
}
