import { Lifecycle, scoped } from 'tsyringe';
import { MessagingWalletService } from '../messagingWalletService/messagingWalletService';
import { required, requiredDefined } from '../../../../helpers/required/required';
import { cloneDeep } from 'lodash';
import { JWTGeneric } from '../../../../helpers/JWTGeneric/JWTGeneric';

@scoped(Lifecycle.ContainerScoped)
export class PayloadService {
  constructor (private messagingWallet:MessagingWalletService) {

  }

  /**
   * Verify if all jwt in authorization correponds to global signing public key
   * @param payload
   * @param publicKeyToVerify
   * @returns {boolean}
   */
  public verifyAuthorizationSignature=(payload, publicKeyToVerify):boolean => {
    requiredDefined(payload.params.authorizations, 'authorizations rpc payload should not be null');

    const authorizations:any[] = payload.params.authorizations
      .map(authorization => this.messagingWallet.jwtHelper.setToken(authorization).verify(publicKeyToVerify));

    return !authorizations.includes(false);
  }

  /**
   * Verify global signature and jwt signature.
   * It clones payload, delete signature and check signature of that new modified payload
   * @param payload
   * @returns {Promise<boolean>}
   */
  public async verifyPayloadSignatures (payload:any):Promise<boolean> {
    requiredDefined(payload.params, 'params rpc should not be null');
    requiredDefined(payload.params.signature, 'params.signature rpc payload should not be null');

    const clonedPayload = cloneDeep(payload);
    const signature = clonedPayload.params.signature;
    delete clonedPayload.params.signature;

    const signingPublickey = this.messagingWallet.decoder(
      JSON.stringify(clonedPayload),
      signature);

    return this.verifyAuthorizationSignature(payload, signingPublickey);
  }

  /**
     * Verify if user has right according to strategies
     */
  public verifyStrategiesRights () {

  }

  /**
   * Add signature of this payload in params.signature
   * @param payload
   * @returns {Promise<any>}
   */
  public async globalSignPayload (payload:any) {
    requiredDefined(payload.jsonrpc, 'json rpc payload should not be null');
    requiredDefined(payload.method, 'method rpc payload should not be null');
    requiredDefined(payload.params, 'params rpc payload should not be null');
    requiredDefined(payload.params.authorizations, 'params.authorizations rpc payload should not be null');

    const payloadClone = cloneDeep(payload);
    payloadClone.params.signature = await this.messagingWallet.signer(JSON.stringify(payload));

    return payloadClone;
  }
}
