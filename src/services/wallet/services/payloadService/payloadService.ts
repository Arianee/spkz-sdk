import { Lifecycle, scoped } from 'tsyringe';
import { ProxyWalletService } from '../proxyWalletService/proxyWalletService';
import { required, requiredDefined } from '../../../../helpers/required/required';
import { cloneDeep } from 'lodash';
import { JWTGeneric } from '../../../../helpers/JWTGeneric/JWTGeneric';
import { RightService } from '../../../utils/services/rightService/rightService';

@scoped(Lifecycle.ContainerScoped)
export class PayloadService {
  constructor (private messagingWallet:ProxyWalletService) {

  }

  public verifyPayloadSignatures=RightService.verifyPayloadSignatures;

  /**
   * Add signature of this payload in params.signature
   * @param payload
   * @returns {Promise<any>}
   */
  public async globalSignPayload (params:any) {
    requiredDefined(params, 'params payload should not be null');
    requiredDefined(params.authorizations, 'params.authorizations rpc payload should not be null');

    const payloadClone = cloneDeep(params);
    payloadClone.signature = await this.messagingWallet.signer(JSON.stringify(params));

    return payloadClone;
  }

  public hydratePayloadParameters=async (params):Promise<any> => {
    params.authorizations = this.messagingWallet.authorizations;
    params.nonce = params.nonce ? params.nonce : Date.now().toString();
    return await this.globalSignPayload(params);
  }
}
