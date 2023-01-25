import { Lifecycle, scoped } from 'tsyringe';
import Web3 from 'web3';
import { erc721ABI } from '../../../../abi/erc721.abi';
import { EnvironmentService } from '../environmentService/environementService';
import { spkzERC721Abi } from '../../../../abi/spkzERC721.abi';

@scoped(Lifecycle.ContainerScoped)
export class ContractService {
  constructor (private environmentService:EnvironmentService) {

  }

  /**
   * Initiate contract with spkz erc 721
   * @param provider
   */
  public erc721Contract=(provider = this.environmentService.environment.defaultProvider) => {
    return new (new Web3(provider))
      .eth.Contract(spkzERC721Abi as any, this.environmentService.environment.roomContractAddress);
  };
}
