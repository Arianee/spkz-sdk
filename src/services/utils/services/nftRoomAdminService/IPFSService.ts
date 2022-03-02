import { Lifecycle, scoped } from 'tsyringe';
import { EnvironmentService } from '../environmentService/environementService';
import { create, IPFSHTTPClient } from 'ipfs-http-client';

export const enum IPFSContentType {
  JSON,
  FILE,
  STRING,
}
@scoped(Lifecycle.ContainerScoped)
export class IPFSService {
  public ipfsClient:IPFSHTTPClient=create({ url: 'https://ipfs.infura.io:5001' });

  public publicGateway=(id:string) => `https://ipfs.infura.io:5001/api/v0/cat?arg=${id}`
  constructor (private environmentService:EnvironmentService) {

  }

  public storeContentOnIPFS=async (data:Object | any, type:IPFSContentType) => {
    const dataToSend:any = type === IPFSContentType.JSON ? JSON.stringify(data) : data;

    const { path } = await this.ipfsClient.add(dataToSend);
    return this.publicGateway(path);
  }
}
