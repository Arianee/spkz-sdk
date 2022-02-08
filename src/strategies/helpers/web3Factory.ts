import Web3 from 'web3';
import { getNetworkInfo } from '../../helpers/networkInfos/networkInfos.helper';
import { network } from '../../models/network.enum';

const config = {
  77: 'https://sokol.arianee.net',
  137: 'https://polygon.spkz.io',
  80001: 'https://matic-mumbai.chainstacklabs.com',
  99: 'https://poa.arianee.net',
  1: 'https://eth.spkz.io',
  3: 'https://ropsten.infura.io/v3/2a9cbd5377b6406f8780c2958dc7bad6',
  4: 'https://rinkeby.arianee.net',

  42: 'https://kovan.infura.io/v3/2a9cbd5377b6406f8780c2958dc7bad6',
  56: 'https://speedy-nodes-nyc.moralis.io/33cb8e850e3bf3962b9c7163/bsc/mainnet',
  42161: 'https://speedy-nodes-nyc.moralis.io/33cb8e850e3bf3962b9c7163/arbitrum/mainnet',
  43114: 'https://speedy-nodes-nyc.moralis.io/33cb8e850e3bf3962b9c7163/avalanche/mainnet',
  250: 'https://speedy-nodes-nyc.moralis.io/33cb8e850e3bf3962b9c7163/fantom/mainnet',
  100: 'https://rpc.xdaichain.com',
  1285: 'https://rpc.moonriver.moonbeam.network',
  11297108109: 'https://palm-mainnet.infura.io/v3/3a961d6501e54add9a41aa53f15de99b'
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
