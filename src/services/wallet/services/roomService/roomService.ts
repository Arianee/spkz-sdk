import { Lifecycle, scoped } from 'tsyringe';
import { RPCJSONService } from '../httpService/RPCJSONService';
import { StrategiesReturn } from '../../../../models/strategyReturn';
import { ProxyWalletService } from '../proxyWalletService/proxyWalletService';
import { JSONRPCMethods } from '../../../../models/JSONRPCMethods.enum';
import { required, requiredDefined } from '../../../../helpers/required/required';
import { FetchRoomService } from '../../../utils/services/fetchRoomService/fetchRoomService';
import { RightService } from '../../../utils/services/rightService/rightService';

@scoped(Lifecycle.ContainerScoped)
export class RoomService {
  constructor (
               private messagingService:ProxyWalletService,
               private fetchRoomService:FetchRoomService,
               private rightService:RightService,
               private httpService:RPCJSONService) {

  }

  /**
   * Get all messages from roomId and section
   * @param {{roomId: string; sectionId: string}} parameters
   * @returns {Promise<{jsonrpc: number; id: string; result?: any}>}
   */
  async getMessages (parameters:{roomId:string, sectionId:string}) {
    const { roomId, sectionId } = parameters;
    requiredDefined(roomId, 'roomId is required');
    requiredDefined(sectionId, 'sectionId is required');
    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

    const { endpoint } = tokenContent;
    const params = {
      sectionId,
      roomId
    };

    return this.httpService.signedRPCCall(endpoint, JSONRPCMethods.room.message.read, params);
  }

  /**
   * Send message to roomId + sectionId
   * @param {{roomId: string; sectionId: string; messageContent: any}} parameters
   * @returns {Promise<{jsonrpc: number; id: string; result?: any}>}
   */
  async sendMessage (parameters:{roomId:string, sectionId:string, messageContent:any}) {
    const { roomId, sectionId, messageContent } = parameters;
    requiredDefined(roomId, 'roomId is required');
    requiredDefined(sectionId, 'sectionId is required');
    requiredDefined(messageContent, 'messageContent is required');

    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

    const { endpoint } = tokenContent;
    const params = {
      content: messageContent,
      sectionId,
      roomId
    };

    return this.httpService.signedRPCCall(endpoint, JSONRPCMethods.room.message.write, params);
  }

  /**
   * Check if user can join room depending on main room strategies
   * @param {{roomId: string}} parameters
   * @returns {Promise<StrategiesReturn>}
   */
  async canJoin (parameters:{roomId:string}):Promise<StrategiesReturn> {
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
  async canWriteSection (parameters:{roomId:string, sectionId:string}):Promise<StrategiesReturn> {
    return this.rightService.canWriteSection({ ...parameters, address: this.messagingService.authorizedAddresses[0] });
  }

  /**
   *  Can user read message in this room AND section
   * @returns {Promise<StrategiesReturn>}
   * @param parameters
   */
  async canReadSection (parameters:{roomId:string, sectionId:string}):Promise<StrategiesReturn> {
    return this.rightService.canReadSection({ ...parameters, address: this.messagingService.authorizedAddresses[0] });
  }

  public getMembers (rooms:string|string[]) { console.info('not implemented'); }
}
