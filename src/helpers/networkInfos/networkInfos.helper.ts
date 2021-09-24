import { network } from '../../models/network.enum';
import { NetworkInfos } from '../../models/networkInfos';
import axios from 'axios';

export const getNetworkInfo = async (chainId: network|string|number): Promise<NetworkInfos> => {
  const infos = await axios('https://chainid.network/chains.json');

  const chainIdNumber = typeof chainId === 'string' ? parseInt(chainId) : chainId;
  const chain = infos.data.filter(network => network.chainId === chainIdNumber);
  if (chain.length === 0) {
    throw new Error('Chain not found');
  }
  return chain[0];
};
