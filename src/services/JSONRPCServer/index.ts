import { AsyncFunc } from '../../models/AsyncFunc';
import { messagesJSONRPCFactory } from './messages/messages';
import * as jayson from 'jayson';

export class SPKZJSONRPC {
    private messagesJSONRPC;

    setMessagesMethod (parameters: {
        read: AsyncFunc<{ roomId: string, sectionId: string }, any>,
        write: AsyncFunc<{ roomId: string, sectionId: string }, any>
    }): SPKZJSONRPC {
      this.messagesJSONRPC = messagesJSONRPCFactory(parameters);
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
