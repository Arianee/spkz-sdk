import { Lifecycle, scoped } from 'tsyringe';
import { MessagingWallet } from '../messagingWallet/messagingWallet';
import Web3 from 'web3';
import { erc721ABI } from '../../../../abi/erc721.abi';

@scoped(Lifecycle.ContainerScoped)
export class ContractService {
  constructor (private messagingWallet:MessagingWallet) {

  }

  public erc721Contract=new (new Web3('https://matic-mumbai.chainstacklabs.com'))
    .eth.Contract(erc721ABI as any, '0x395bE7b1443b6c3Ce5177b2300E5cc20bF22576E');
}
