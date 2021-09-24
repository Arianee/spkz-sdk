import { AsyncFunc } from '../../models/AsyncFunc';
import { messagesJSONRPCFactory } from './messages/messages';
import * as jayson from 'jayson';
import { ReadMessageParameters, WriteMessageParameters } from '../../models/jsonrpc/writeMessageParameters';
import { requiredDefined } from '../../helpers/required/required';
import { NetworkParameters } from '../../models/jsonrpc/networkParameters';

export class SPKZJSONRPC {
    private messagesJSONRPC;

    constructor (public networkParameters:NetworkParameters) {
      requiredDefined(networkParameters.chainId, 'chainId is required');
      requiredDefined(networkParameters.network, 'network is required');
    }

    setMessagesMethod (parameters: {
        read: AsyncFunc<ReadMessageParameters, any>,
        write: AsyncFunc<WriteMessageParameters, any>
    }): SPKZJSONRPC {
      this.messagesJSONRPC = messagesJSONRPCFactory(this.networkParameters)(parameters);
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
        ...this.messagesJSONRPC
      });

      return server.middleware();
    }
}
