import { Lifecycle, scoped } from 'tsyringe';
import { StrategiesReturn } from '../../../../models/strategyReturn';
import { ProxyWalletService } from '../proxyWalletService/proxyWalletService';
import { FetchRoomService } from '../../../utils/services/fetchRoomService/fetchRoomService';
import { RightService } from '../../../utils/services/rightService/rightService';

@scoped(Lifecycle.ContainerScoped)
export class RightUtilsService {
  constructor (
    private messagingService: ProxyWalletService,
    private fetchRoomService: FetchRoomService,
    private rightService: RightService) {
  }

  /**
   * Check if user can join room depending on main room strategies
   * @param {{roomId: string}} parameters
   * @returns {Promise<StrategiesReturn>}
   */
  async canJoin (parameters: { roomId: string }): Promise<StrategiesReturn> {
    return this.rightService.canJoinRoom({
      ...parameters,
      address: this.messagingService.authorizedAddresses[0]
    });
  }

  /**
   * Can user write message in this room AND section
   * @returns {Promise<StrategiesReturn>}
   * @param parameters
   */
  async canWriteSection (parameters: { roomId: string, sectionId: string }): Promise<StrategiesReturn> {
    return this.rightService.canWriteSection({
      ...parameters,
      address: this.messagingService.authorizedAddresses[0]
    });
  }

  /**
   *  Can user read message in this room AND section
   * @returns {Promise<StrategiesReturn>}
   * @param parameters
   */
  async canReadSection (parameters: { roomId: string, sectionId: string }): Promise<StrategiesReturn> {
    return this.rightService.canReadSection({
      ...parameters,
      address: this.messagingService.authorizedAddresses[0]
    });
  }
}
