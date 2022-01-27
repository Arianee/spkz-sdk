import { Lifecycle, scoped } from 'tsyringe';
import { EnvironmentService } from '../environmentService/environementService';
import { NFTROOM } from '../../../../models/NFTROOM';
import { create, IPFSHTTPClient } from 'ipfs-http-client';

@scoped(Lifecycle.ContainerScoped)
export class IPFSService {
  public ipfsClient:IPFSHTTPClient=create({ url: 'https://ipfs.infura.io:5001' });

  public publicGateway=(id:string) => `https://ipfs.infura.io:5001/api/v0/cat?arg=${id}`
  constructor (private environmentService:EnvironmentService) {

  }

  public storeContentOnIPFS=async (nftroom:NFTROOM | any) => {
    const nftroomString = JSON.stringify(nftroom);
    const { path } = await this.ipfsClient.add(nftroomString);
    return this.publicGateway(path);
  }
}
