import Web3 from 'web3';
import { requiredDefined } from '../../helpers/required/required';

const chainConfig = require('../../../chain.config.json');

export const web3Factory = (chainIdOrUrl: string) => {
  if (chainIdOrUrl.startsWith('http://') || chainIdOrUrl.startsWith('https://') || chainIdOrUrl.startsWith('ws://')) {
    return new Web3(chainIdOrUrl);
  } else {
    const urlProvider = chainConfig[chainIdOrUrl.toString()];
    requiredDefined(urlProvider, `no url provider found for ${chainIdOrUrl}`);
    return new Web3(urlProvider);
  }
};
