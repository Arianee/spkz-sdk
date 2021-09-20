import { Lifecycle, scoped } from 'tsyringe';
import { ContractService } from '../contractService/contractService';
import { HttpService } from '../httpService/httpService';
import { getStrategyHelperFactory } from '../../../../helpers/getStrategyHelper/getStrategyHelper.helper';
import { executeStrategies } from '../../../../strategies/executeStrategy';
import { StrategiesReturn } from '../../../../models/strategyReturn';
import { MessagingWallet } from '../messagingWallet/messagingWallet';
import { PayloadService } from '../payloadService/payloadService';
import { NFTROOM } from '../../../../models/NFTROOM';
import { JSONRPCMethods } from '../../../../models/JSONRPCMethods.enum';
import { required } from '../../../../helpers/required';

@scoped(Lifecycle.ContainerScoped)
export class Room {
  constructor (private contractService:ContractService,
               private messagingService:MessagingWallet,
               private payloadService:PayloadService,
               private httpService:HttpService) {

  }

  public async fetchRoom (roomId:string):Promise<NFTROOM> {
    const tokenURI = await this.contractService.erc721Contract.methods.tokenURI(roomId).call();

    return await this.httpService.fetch(tokenURI);
  }

  /**
   * Get all messages from roomId and section
   * @param {{roomId: string; sectionId: string}} parameters
   * @returns {Promise<{jsonrpc: number; id: string; result?: any}>}
   */
  async getMessages (parameters:{roomId:string, sectionId:string}) {
    const { roomId, sectionId } = parameters;
    required(roomId, 'roomId is required');
    required(sectionId, 'sectionId is required');
    const tokenContent = await this.fetchRoom(roomId);

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
    required(roomId, 'roomId is required');
    required(sectionId, 'sectionId is required');
    required(messageContent, 'messageContent is required');

    const tokenContent = await this.fetchRoom(roomId);
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
    const { roomId } = parameters;
    const tokenContent = await this.fetchRoom(roomId);

    const strategies = getStrategyHelperFactory(tokenContent, this.messagingService.authorizedAddresses[0])
      .getRoomStrategies();
    return executeStrategies(strategies);
  }

  /**
   * Can user write message in this room AND section
   * @param {string} roomId
   * @param {string} sectionId
   * @returns {Promise<StrategiesReturn>}
   */
  async canWriteSection (parameters:{roomId:string, sectionId:string}):Promise<StrategiesReturn> {
    const { roomId, sectionId } = parameters;
    const tokenContent = await this.fetchRoom(roomId);
    const strategies = getStrategyHelperFactory(tokenContent, this.messagingService.authorizedAddresses[0])
      .getSectionWriteStrategies(sectionId);

    return executeStrategies(strategies);
  }

  /**
   *  Can user read message in this room AND section
   * @param {string} roomId
   * @param {string} sectionId
   * @returns {Promise<StrategiesReturn>}
   */
  async canReadSection (parameters:{roomId:string, sectionId:string}):Promise<StrategiesReturn> {
    const { roomId, sectionId } = parameters;
    const tokenContent = await this.fetchRoom(roomId);

    const strategies = getStrategyHelperFactory(tokenContent, this.messagingService.authorizedAddresses[0])
      .getSectionReadStrategies(sectionId);
    return executeStrategies(strategies);
  }

  public getMembers (rooms:string|string[]) { console.info('not implemented'); }
}
