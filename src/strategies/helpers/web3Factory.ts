import Web3 from 'web3';
import { getNetworkInfo } from '../../helpers/networkInfos/networkInfos.helper';
import { network } from '../../models/network.enum';

const config = {
  77: 'https://sokol.arianee.net',
  137: 'https://polygon.arianee.net',
  80001: 'https://speedy-nodes-nyc.moralis.io/5685425d2d9a5b4b4fe38355/polygon/mumbai',
  99: 'https://poa.arianee.net',
  1: 'https://mainnet.infura.io/v3/2a9cbd5377b6406f8780c2958dc7bad6',
  3: 'https://ropsten.infura.io/v3/2a9cbd5377b6406f8780c2958dc7bad6',
  42: 'https://kovan.infura.io/v3/2a9cbd5377b6406f8780c2958dc7bad6'
};

export const web3Factory = async (chainIdOrUrl: string):Promise<Web3> => {
  if (chainIdOrUrl.startsWith('http://') || chainIdOrUrl.startsWith('https://') || chainIdOrUrl.startsWith('ws://')) {
    return new Web3(chainIdOrUrl);
  } else if (config[chainIdOrUrl]) {
    return new Web3(config[chainIdOrUrl]);
  } else {
    const networkInfo = await getNetworkInfo(chainIdOrUrl as unknown as network);
    const goodrpcUrls = getGoodRpcUrl(networkInfo.rpc);
    return new Web3(goodrpcUrls[0]);
  }
};

const getGoodRpcUrl = (rpcUrls:string[]) => {
  return rpcUrls.filter(rpcUrl => !rpcUrl.includes('$'));
};
