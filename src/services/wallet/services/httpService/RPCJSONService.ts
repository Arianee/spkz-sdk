import { Lifecycle, scoped } from 'tsyringe';
import { requiredDefined } from '../../../../helpers/required/required';
import { PayloadService } from '../payloadService/payloadService';
import { HttpService } from '../../../utils/services/httpService/httpService';
import { ProxyWalletService } from '../proxyWalletService/proxyWalletService';

@scoped(Lifecycle.ContainerScoped)
export class RPCJSONService {
  constructor (private payloadService: PayloadService, private httpService: HttpService, private proxyWalletService: ProxyWalletService) {

  }

    /**
     * It signs payload with messaging wallet and send rpc call
     * @param {string} endpoint
     * @param rpcMethodName
     * @param params
     * @returns {Promise<{jsonrpc: number; id: string; result?: resultType}>}
     * @constructor
     */
    public signedRPCCall = async <resultType=any>(endpoint: string, rpcMethodName: string, params: any): Promise<{
        jsonrpc: number,
        id: string,
        result?: resultType
    }> => {
      // {"jsonrpc": "2.0",
      // "method": "subtract",
      // "params": {"authorizations":[],"content": 42, "subtrahend": 23}, "id": 4}

      requiredDefined(endpoint, 'endpoint should be defined');
      requiredDefined(rpcMethodName, 'method should be defined');
      requiredDefined(params, 'params should be defined');

      const signedPayload = await this.JSONRPCHydrateParameters(params);

      const httpRequest = this.prepareRPCRequest(signedPayload, rpcMethodName);

      const RPCRes = await this.httpService.fetch(endpoint, httpRequest);

      if (RPCRes.error) {
        throw new Error(JSON.stringify(RPCRes.error));
      }

      if (RPCRes.result) {
        RPCRes.result = (typeof (RPCRes.result) === 'string') ? JSON.parse(RPCRes.result) : RPCRes.result;
      }
      return RPCRes.result;
    }

    private JSONRPCHydrateParameters=async (params)
:Promise<any> => {
      params.authorizations = this.proxyWalletService.authorizations;
      params.nonce = Date.now().toString();
      return await this.payloadService.globalSignPayload(params);
    }

  private prepareRPCRequest = (params, rpcMethodName) => {
    return {
      method: 'POST',
      data: {
        jsonrpc: '2.0',
        params,
        method: rpcMethodName,
        id: Date.now().toString()
      },
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
}
