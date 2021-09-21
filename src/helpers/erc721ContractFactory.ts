import { erc721ABI } from '../abi/erc721.abi';
import Web3 from 'web3';

export const erc721ContractFactory = (web3) => (erc20Address:string) => {
  return new new Web3('https://matic-mumbai.chainstacklabs.com').eth.Contract(erc721ABI as any, erc20Address);
};
