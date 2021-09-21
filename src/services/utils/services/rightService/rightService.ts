import { getStrategyHelperFactory } from '../../../../helpers/getStrategyHelper/getStrategyHelper.helper';
import { executeStrategies } from '../../../../strategies/executeStrategy';
import { FetchRoomService } from '../fetchRoomService/fetchRoomService';
import { cloneDeep } from 'lodash';
import { Lifecycle, scoped } from 'tsyringe';
import { requiredDefined } from '../../../../helpers/required/required';
import { decoder, JWTDecoder } from '../../../../helpers/JWTGeneric/signerAndDecoderFromPrivateKey';

@scoped(Lifecycle.ContainerScoped)
export class RightService {
  constructor (private fetchRoomService?:FetchRoomService) {

  }

    /**
     * Verify if all jwt in authorization correponds to global signing public key
     * @param payload
     * @param publicKeyToVerify
     * @returns {boolean}
     */
    public static isProxyWalletAuthorized=(authorizationsJWT:string[], publicKeyToVerify):boolean => {
      requiredDefined(authorizationsJWT, 'authorizations rpc payload should not be null');

      const authorizations:any[] = authorizationsJWT
        .map(authorization => {
          const { payload } = JWTDecoder(authorization).decode();
          const { iss, sub } = payload;
          const isValid = JWTDecoder(authorization).verify(iss);

          const isProxyWalletAuthorized = sub === publicKeyToVerify;
          return isValid && isProxyWalletAuthorized;
        });

      return !authorizations.includes(false);
    }

    public static extractBlockchainWalletAddressWhoAuthorizedProxyWallet=
        (authorizationsJWT:string[], proxyWalletAddress:string):{
          isAuthorized:boolean, proxyWalletAddress:string, blockchainWallets:string[]
        } => {
          const isAuthorized = RightService.isProxyWalletAuthorized(authorizationsJWT, proxyWalletAddress);
          if (isAuthorized) {
            const blockchainWallets = authorizationsJWT
              .map(authorization => JWTDecoder(authorization).decode().payload.iss);

            return {
              isAuthorized,
              blockchainWallets,
              proxyWalletAddress
            };
          } else {
            return {
              isAuthorized,
              blockchainWallets: [],
              proxyWalletAddress
            };
          }
        }

    public isProxyWallet=RightService.isProxyWalletAuthorized;
    /**
     * Verify global signature and jwt signature.
     * It clones payload, delete signature and check signature of that new modified payload
     * @param payload
     * @returns {Promise<boolean>}
     */
    public static async verifyPayloadSignatures (params:any):Promise<{
      isAuthorized:boolean, proxyWalletAddress:string, blockchainWallets:string[]
    }> {
      requiredDefined(params, 'params rpc should not be null');
      requiredDefined(params.signature, 'params.signature rpc payload should not be null');

      const clonedParams = cloneDeep(params);
      const signature = clonedParams.signature;
      delete clonedParams.signature;

      const proxyWalletAddress = decoder(
        JSON.stringify(clonedParams),
        signature);

      return RightService.extractBlockchainWalletAddressWhoAuthorizedProxyWallet(params
        .authorizations,
      proxyWalletAddress);
    }

    public verifyPayloadSignatures=RightService.verifyPayloadSignatures;

     canJoinRoom=async (parameters:{ roomId: string, address:string}) => {
       const { roomId, address } = parameters;
       requiredDefined(address, 'address must be defined');
       requiredDefined(roomId, 'roomId must be defined');

       const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

       const strategies = getStrategyHelperFactory(tokenContent, address)
         .getRoomStrategies();
       return executeStrategies(strategies);
     }

    canWriteSection=async (parameters:{ roomId: string, sectionId:string, address:string}) => {
      const { roomId, address, sectionId } = parameters;
      requiredDefined(address, 'address must be defined');
      requiredDefined(roomId, 'roomId must be defined');
      requiredDefined(sectionId, 'sectionId must be defined');

      const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

      const strategies = getStrategyHelperFactory(tokenContent, address)
        .getSectionWriteStrategies(sectionId);

      return executeStrategies(strategies);
    }

    canReadSection=async (parameters:{ roomId: string, sectionId:string, address:string}) => {
      const { roomId, address, sectionId } = parameters;
      requiredDefined(address, 'address must be defined');
      requiredDefined(roomId, 'roomId must be defined');
      requiredDefined(sectionId, 'sectionId must be defined');

      const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

      const strategies = getStrategyHelperFactory(tokenContent, address)
        .getSectionReadStrategies(sectionId);

      return executeStrategies(strategies);
    }
}
