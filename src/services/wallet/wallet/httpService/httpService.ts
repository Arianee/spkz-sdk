import { Lifecycle, scoped } from 'tsyringe';
import axios from 'axios';
import { requiredDefined } from '../../../../helpers/required';
import { PayloadService } from '../payloadService/payloadService';

@scoped(Lifecycle.ContainerScoped)
export class HttpService {
  constructor (private payloadService:PayloadService) {

  }

  public static get defaultConfig () {
    return {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }

  /**
   * HTTP call
   * Default configuration of headers is method GET and content-type: application/json
   * @param url
   * @param config
   * @return Promise{any}
   */
  public async fetch (
    url: string,
    config: any = { ...HttpService.defaultConfig }
  ) {
    if (config.body) {
      config.data = config.body;
    }

    try {
      return this.httpFetch(url, config);
    } catch (e) {
      console.warn('Error on fetch', url, config);
      Promise.reject(e);
    }
  }

    public httpFetch=(url, config) => axios(url, config).then(result => result.data);

  public hydrateJSONRPCPayload=(method, params) => {
    return {
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: new Date().getTime()
    };
  };

    private RPCConfigurationFactory = (endpoint, method, data) => {
      return {
        method: 'POST',
        data,
        headers: {
          'Content-Type': 'application/json'
        }
      };
    }

    /**
     * It signs payload with messaging wallet and send rpc call
     * @param {string} endpoint
     * @param {string} method
     * @param params
     * @returns {Promise<{jsonrpc: number; id: string; result?: resultType}>}
     * @constructor
     */
    public signedRPCCall = async <resultType=any>(endpoint: string, method: string, params: any): Promise<{
        jsonrpc: number,
        id: string,
        result?: resultType
    }> => {
      requiredDefined(endpoint, 'endpoint should be defined');
      requiredDefined(method, 'method should be defined');
      requiredDefined(params, 'params should be defined');

      const config = this.RPCConfigurationFactory(endpoint, method, params);

      const signedPayload = this.payloadService.globalSignPayload(config);

      const RPCRes = await this.httpFetch(endpoint, signedPayload);

      if (RPCRes.error) {
        throw new Error(JSON.stringify(RPCRes.error));
      }

      if (RPCRes.result) {
        RPCRes.result = (typeof (RPCRes.result) === 'string') ? JSON.parse(RPCRes.result) : RPCRes.result;
      }

      return RPCRes;
    }
}
