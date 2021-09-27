import { AsyncFunc } from '../../models/AsyncFunc';
import { messagesJSONRPCFactory } from './messages/messages';
import * as jayson from 'jayson';
import {
  ReadMessageParameters,
  RoomUser,
  SectionUser,
  SectionUserGet,
  WriteMessageParameters
} from '../../models/jsonrpc/writeMessageParameters';
import { requiredDefined } from '../../helpers/required/required';
import { NetworkParameters } from '../../models/jsonrpc/networkParameters';
import { userJSONRPCFactory } from './users/users';
import { BouncerUser, BouncerUserQuery } from '../../models/jsonrpc/bouncer';
import { bouncerJSONRPCFactory } from './bouncer/bouncer';

export class SPKZJSONRPC {
    private messagesJSONRPC;
    private usersJSONRPC;
    private bouncerJSONRPC;
    constructor (public networkParameters:NetworkParameters) {
      requiredDefined(networkParameters.chainId, 'chainId is required');
      requiredDefined(networkParameters.network, 'network is required');
    }

    setMessagesMethod (parameters: {
        read: AsyncFunc<ReadMessageParameters, any>,
        write: AsyncFunc<WriteMessageParameters, any>,
    }): SPKZJSONRPC {
      this.messagesJSONRPC = messagesJSONRPCFactory(this.networkParameters)(parameters);
      return this;
    }

    setUsersMethod (parameters: {
        createOrUpdateSectionUser: AsyncFunc<SectionUser, any>,
        createOrUpdateRoomUser: AsyncFunc<RoomUser, any>,
        getUsers:AsyncFunc<SectionUserGet, SectionUser[]>
    }): SPKZJSONRPC {
      this.usersJSONRPC = userJSONRPCFactory(this.networkParameters)(parameters);
      return this;
    }

    setBouncerMethod (parameters: {
        getMyProfile: AsyncFunc<BouncerUserQuery, BouncerUser>,
        getUserRooms: AsyncFunc<BouncerUserQuery, RoomUser[]>,
        joinRoom: AsyncFunc<RoomUser>,
        updateProfile: AsyncFunc<BouncerUser, BouncerUser>
    }): SPKZJSONRPC {
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
