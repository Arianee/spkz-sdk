import { Lifecycle, scoped } from 'tsyringe';
import { fetchGasStation } from '@arianee/gas-station';
import web3 from 'web3';

import { EnvironmentService } from '../environmentService/environementService';
import { retryExecFactory } from '../../../../helpers/retryExecFactory/retryExecFactory';

@scoped(Lifecycle.ContainerScoped)
export class GasStationService {
  constructor (private environmentService:EnvironmentService) {

  }

  /**
   * Return standard gas in wei. If it fails it return 1.
   */
  public async fetchGasStation ():Promise<string> {
    try {
      const { standard } = await retryExecFactory(() =>
        fetchGasStation(this.environmentService.environment.chainId.toString())
      );

      return web3.utils.toWei(standard.toString(), 'gwei').toString();
    } catch (e) {
      return web3.utils.toWei('1', 'gwei').toString();
    }
  }
}
