import { Lifecycle, scoped } from 'tsyringe';
import { ProxyWalletService } from '../proxyWalletService/proxyWalletService';
import Web3 from 'web3';
import { erc721ABI } from '../../../../abi/erc721.abi';
import { environment } from '../../../../environment/environment';

@scoped(Lifecycle.ContainerScoped)
export class ContractService {
  constructor (private messagingWallet:ProxyWalletService) {

  }

  public erc721Contract=new (new Web3(environment.defaultProvider))
    .eth.Contract(erc721ABI as any, environment.roomContractAddress);
}
