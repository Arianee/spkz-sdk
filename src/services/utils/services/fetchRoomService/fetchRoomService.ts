import { Lifecycle, scoped } from 'tsyringe';
import { NFTROOM } from '../../../../models/NFTROOM';
import Web3 from 'web3';
import { erc721ABI } from '../../../../abi/erc721.abi';
import { HttpService } from '../httpService/httpService';

@scoped(Lifecycle.ContainerScoped)
export class FetchRoomService {
  constructor (private httpService:HttpService) {

  }

    public erc721Contract=new (new Web3('https://matic-mumbai.chainstacklabs.com'))
      .eth.Contract(erc721ABI as any, '0x395bE7b1443b6c3Ce5177b2300E5cc20bF22576E');

    public async fetchRoom (roomId:string):Promise<NFTROOM> {
      const tokenURI = await this.erc721Contract.methods.tokenURI(roomId).call();

      return await this.httpService.fetch(tokenURI);
    }
}
