import { messagesJSONRPCFactory } from './messages/messages';
import * as jayson from 'jayson';
import { requiredDefined } from '../../helpers/required/required';
import { NetworkParameters } from '../../models/jsonrpc/networkParameters';
import { userJSONRPCFactory } from './users/users';
import { bouncerJSONRPCFactory } from './bouncer/bouncer';
import { BouncerParameters, MessageParameters, SectionUserParameters } from '../../models/jsonrpc/JSONRPCParameters';

export class SPKZJSONRPC {
    private messagesJSONRPC;
    private usersJSONRPC;
    private bouncerJSONRPC;
    constructor (public networkParameters:NetworkParameters) {
      requiredDefined(networkParameters.chainId, 'chainId is required');
      requiredDefined(networkParameters.network, 'network is required');
    }

    setMessagesMethod (parameters: MessageParameters): SPKZJSONRPC {
      this.messagesJSONRPC = messagesJSONRPCFactory(this.networkParameters)(parameters);
      return this;
    }

    setUsersMethod (parameters: SectionUserParameters): SPKZJSONRPC {
      this.usersJSONRPC = userJSONRPCFactory(this.networkParameters)(parameters);
      return this;
    }

    setBouncerMethod (parameters: BouncerParameters): SPKZJSONRPC {
      this.bouncerJSONRPC = bouncerJSONRPCFactory(this.networkParameters)(parameters);
      return this;
    }

    /**
     * Create a RPC server middleware
     */
    public build () {
      return this.createServerMiddleWare();
    }

    private createServerMiddleWare () {
      const server = new jayson.Server({
        ...this.usersJSONRPC,
        ...this.messagesJSONRPC,
        ...this.bouncerJSONRPC
      });

      return server.middleware();
    }
}
