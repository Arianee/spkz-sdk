import { Lifecycle, scoped } from 'tsyringe';
import Web3 from 'web3';
import { erc721ABI } from '../../../../abi/erc721.abi';
import { EnvironmentService } from '../environmentService/environementService';

@scoped(Lifecycle.ContainerScoped)
export class ContractService {
  constructor (private environmentService:EnvironmentService) {

  }

  public erc721Contract=() => {
    return new (new Web3(this.environmentService.environment.defaultProvider))
      .eth.Contract(erc721ABI as any, this.environmentService.environment.roomContractAddress);
  };
}
