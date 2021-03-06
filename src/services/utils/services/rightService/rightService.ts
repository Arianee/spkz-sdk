import { getStrategyHelperFactory } from '../../../../helpers/getStrategyHelper/getStrategyHelper.helper';
import { executeStrategies, executeStrategiesWithCache } from '../../../../strategies/executeStrategy';
import { FetchRoomService } from '../fetchRoomService/fetchRoomService';
import { EnvironmentService } from '../environmentService/environementService';
import { cloneDeep } from 'lodash';
import { Lifecycle, scoped } from 'tsyringe';
import { requiredDefined } from '../../../../helpers/required/required';
import { decoder, JWTDecoder } from '../../../../helpers/JWTGeneric/signerAndDecoderFromPrivateKey';
import { AuthorizationsDetails, AuthorizationsStatus } from '../../../../models/authorizationsStatus';
import { StrategiesReturn } from '../../../../models/strategyReturn';
import { FullRoomStrategies } from '../../../..';
import { ErrorPayload } from '../../../../models/jsonrpc/errorPayload';

@scoped(Lifecycle.ContainerScoped)
export class RightService {
  constructor (
    private fetchRoomService: FetchRoomService,
    private environmentService: EnvironmentService
  ) {}

  public proxyWalletAuthorisationStatus=RightService.proxyWalletAuthorisationStatus;

  public static proxyWalletAuthorisationStatus=(authorizationsJWT:string[], publicKeyToVerify):AuthorizationsStatus => {
    requiredDefined(authorizationsJWT, 'authorizations should not be null');
    requiredDefined(publicKeyToVerify, 'publicKeyToVerify  should not be null');

    const authorisationStatus = authorizationsJWT
      .map(authorization => {
        const { payload } = JWTDecoder(authorization).decode();
        const { iss, sub } = payload;

        const { isValid, details } = JWTDecoder(authorization).verify(iss);

        const isProxyWalletAuthorized = sub.toLowerCase() === publicKeyToVerify.toLowerCase();
        return {
          blockchainWalletAddress: iss,
          proxyWallet: sub,
          isAuthorized: isValid && isProxyWalletAuthorized,
          details
        };
      });

    return {
      isAuthorized: authorisationStatus.map(d => d.isAuthorized).includes(false) === false,
      authorizations: authorisationStatus,
      details: authorisationStatus.map(d => d.details)
    };
  }

    /**
     * Verify if all jwt in authorization correponds to global signing public key
     * @param authorizationsJWT
     * @param publicKeyToVerify
     * @returns {boolean}
     */
    public static isProxyWalletAuthorized=(authorizationsJWT:string[], publicKeyToVerify): { isAuthorized: boolean, details: ErrorPayload[] } => {
      const authStatus = RightService.proxyWalletAuthorisationStatus(authorizationsJWT, publicKeyToVerify);
      return {
        isAuthorized: authStatus.isAuthorized,
        details: authStatus.details
      };
    }

    public static extractBlockchainWalletAddressWhoAuthorizedProxyWallet=
        (authorizationsJWT:string[], proxyWalletAddress:string):{
          isAuthorized:boolean, proxyWalletAddress:string, blockchainWallets:string[], details: ErrorPayload[], issuedAt: Date[], expirationDate: Date[]
        } => {
          const { isAuthorized, details } = RightService.isProxyWalletAuthorized(authorizationsJWT, proxyWalletAddress);
          if (isAuthorized) {
            const blockchainWallets = authorizationsJWT
              .map(authorization => JWTDecoder(authorization).decode().payload.iss);

            const issuedAt = authorizationsJWT
              .map(authorization => {
                const iat = JWTDecoder(authorization).decode().payload.iat;
                return iat ? new Date(iat) : null;
              });

            const expirationDate = authorizationsJWT
              .map(authorization => {
                const exp = JWTDecoder(authorization).decode().payload.exp;
                return exp ? new Date(exp) : null;
              });

            return {
              isAuthorized,
              blockchainWallets,
              proxyWalletAddress,
              details,
              issuedAt,
              expirationDate
            };
          } else {
            return {
              isAuthorized,
              blockchainWallets: [],
              proxyWalletAddress,
              details,
              issuedAt: [],
              expirationDate: []
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
      isAuthorized:boolean, proxyWalletAddress:string, blockchainWallets:string[], details: ErrorPayload[], issuedAt: Date[], expirationDate: Date[]
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

  /**
   * Can user join section
   * @param {{roomId: string; sectionId: string; address: string}} parameters
   * @returns {Promise<{isAuthorized: boolean; read: StrategiesReturn; write: StrategiesReturn}>}
   */
  public canJoinSection = async (parameters: { roomId: string, sectionId: string, address?: string }): Promise<{
    isAuthorized: boolean,
    read: StrategiesReturn,
    write: StrategiesReturn
  }> => {
    const { roomId, address, sectionId } = parameters;
    requiredDefined(roomId, 'roomId must be defined');
    requiredDefined(sectionId, 'sectionId must be defined');

    const [read, write] = await Promise.all([
      this.canReadSection(parameters),
      this.canWriteSection(parameters)
    ]);
    return {
      isAuthorized: read.isAuthorized,
      read,
      write
    };
  };

  public canJoinRoom = async (parameters: { roomId: string, address?: string }) => {
    const { roomId, address } = parameters;
    requiredDefined(roomId, 'roomId must be defined');

    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

    const strategies = getStrategyHelperFactory(tokenContent, [address])
      .getRoomStrategies();

    return executeStrategiesWithCache(strategies, { tokenId: roomId, chainId: this.environmentService.environment.chainId });
  };

  public canWriteSection=async (parameters:{ roomId: string, sectionId:string, address?:string}) => {
    const { roomId, address, sectionId } = parameters;
    requiredDefined(roomId, 'roomId must be defined');
    requiredDefined(sectionId, 'sectionId must be defined');

    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

    const strategies = getStrategyHelperFactory(tokenContent, [address])
      .getSectionWriteStrategies(sectionId);

    return executeStrategiesWithCache(strategies, { tokenId: roomId, chainId: this.environmentService.environment.chainId });
  }

  public canReadSection=async (parameters:{ roomId: string, sectionId:string, address?:string}) => {
    const { roomId, address, sectionId } = parameters;
    requiredDefined(roomId, 'roomId must be defined');
    requiredDefined(sectionId, 'sectionId must be defined');

    const tokenContent = await this.fetchRoomService.fetchRoom(roomId);

    const strategies = getStrategyHelperFactory(tokenContent, [address])
      .getSectionReadStrategies(sectionId);

    return executeStrategiesWithCache(strategies, { tokenId: roomId, chainId: this.environmentService.environment.chainId });
  }

  /**
   * Get full strategies with description.
   * @param {{roomId: string; address: string}} parameters
   * @returns {Promise<FullRoomStrategies>}
   */
  public async fullRoomStrategies (parameters: { roomId: string, address?: string }):Promise<FullRoomStrategies> {
    const { roomId, address } = parameters;
    const nftRoomContent = await this.fetchRoomService.fetchRoom(roomId);

    const sectionIds = nftRoomContent.sections.map(d => d.id);
    const canJoinRoom = await this.canJoinRoom({ roomId, address });

    const returnObject:FullRoomStrategies = {
      roomId,
      sections: {},
      room: canJoinRoom
    };

    await Promise.all(sectionIds.map(sectionId =>
      this.canJoinSection({ roomId, sectionId, address })
        .then(result => {
          returnObject.sections[sectionId] = result;
        })
    )
    );

    return returnObject;
  }
}
