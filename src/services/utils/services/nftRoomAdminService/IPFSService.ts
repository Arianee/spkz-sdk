import { Lifecycle, scoped } from 'tsyringe';
import { EnvironmentService } from '../environmentService/environementService';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { HttpService } from '../httpService/httpService';
import { retryExecFactory } from '../../../../helpers/retryExecFactory/retryExecFactory';
import axios from 'axios';

export const enum IPFSContentType {
  JSON,
  FILE,
  STRING,
}

@scoped(Lifecycle.ContainerScoped)
export class IPFSService {
  public ipfsClient: IPFSHTTPClient = create({ url: 'https://ipfs.moralis.io:2053' });

  public readonly ipfsProviders = [
    'https://cloudflare-ipfs.com/ipfs/:ipfsHash',
    'https://ipfs.moralis.io:2053/ipfs/:ipfsHash',
    'https://ipfs.io/ipfs/:ipfsHash'
  ];

  /**
   * Take ipfs hash or ipfs uri and try to fetch on multiple ipfs providers
   * @param hashOrIPFSURI
   */
  public fetchOnIPFS = async (hashOrIPFSURI: string) => {
    const hashWithoutIPFSProtocol = hashOrIPFSURI.replace('ipfs://', '');

    const ipfsProvidersWithHash = this.ipfsProviders
      .map(provider => provider
        .replace(':ipfsHash', hashWithoutIPFSProtocol));

    let response;
    let error;
    let i = 0;
    do {
      const ipfsURL = ipfsProvidersWithHash[i];
      try {
        response = await this.httpService.fetch(ipfsURL, { timeout: 10000 });
      } catch (e) {
        error = e;
        console.error(`error fetch ${ipfsURL}`);
      }
      i++;
    } while (!response && i < ipfsProvidersWithHash.length);
    if (response) {
      return response;
    } else {
      throw new Error(error);
    }
  };

  constructor (private environmentService: EnvironmentService, private httpService: HttpService
  ) {

  }

  public updateOnIPFSOnlyAndWaitForAvalaibility = async (content: any, type:IPFSContentType = IPFSContentType.JSON) => {
    const contentURLOnIPFS = await this.storeContentOnIPFS(content, type);
    await retryExecFactory(
      () => this.fetchOnIPFS(contentURLOnIPFS),
      12
    );
    return contentURLOnIPFS;
  };

  /**
   * Store content on ipfs
   * @param data
   * @param type
   */
  public storeContentOnIPFS = async (data: Object | any, type: IPFSContentType) : Promise<string> => {
    const dataToSend: any = type === IPFSContentType.JSON ? JSON.stringify(data) : data;
    const contentType = new Map<IPFSContentType, string>([
      [IPFSContentType.STRING, 'text/plain'],
      [IPFSContentType.JSON, 'application/json'],
      [IPFSContentType.FILE, 'image/*']]
    );

    const response = await axios.post(`${this.environmentService.environment.bouncerURL}/ipfs/add`, dataToSend, {
      headers: {
        'Content-Type': contentType[type] || 'text/plain'
      }
    });
    const { Hash } = await response.data;
    return `ipfs://${Hash}`;
  };
}
