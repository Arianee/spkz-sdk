import 'reflect-metadata';
import { SPKZJSONRPC } from './services/JSONRPCServer';
import {
  NewMessageCount,
  NewMessageCountParameters,
  ReadMessageParameters,
  ReadMessageReturn,
  RoomUser,
  SectionUser,
  WriteMessageParameters
} from './models/jsonrpc/writeMessageParameters';
import { BouncerUser, BouncerUserQuery, NotificationPreferences } from './models/jsonrpc/bouncer';
import cors from 'cors';

const express = require('express');
const app = express();
const port = 3000;
var bodyParser = require('body-parser');
const messagesDB = {};
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let dbMessage = {};
let dbRoomUsers = {};
let dbSectionUsers = {};
let dbbouncerUserProfile = {};
let dbbouncerNotificationPreferences = {};
let dbProfile = {};
let dbBouncerRoom = {};

const spkzJSONRPC = new SPKZJSONRPC({
  chainId: '1',
  network: '1'
})
  // @ts-ignore
  .setMessagesMethod({
    read: (parameters: ReadMessageParameters):Promise<ReadMessageReturn> => {
      const {
        roomId,
        sectionId
      } = parameters;

      if (!dbMessage[roomId + sectionId]) {
        return Promise.resolve({
          messages: [],
          messageCount: 0,
          isMoreMessages: false
        });
      }
      const messages = dbMessage[roomId + sectionId];
      return Promise.resolve(
        {
          messages: messages,
          messageCount: messages.length,
          isMoreMessages: false
        }
      );
    },
    write: (parameters: WriteMessageParameters) => {
      const {
        roomId,
        sectionId
      } = parameters;
      if (!dbMessage[roomId + sectionId]) {
        dbMessage[roomId + sectionId] = [];
      }
      dbMessage[roomId + sectionId].push(parameters);
      return Promise.resolve(parameters);
    },
    newMessage: (parameters: NewMessageCountParameters) => {
      const result:NewMessageCount[] = [{
        roomId: parameters.roomId,
        chainId: parameters.chainId,
        network: parameters.network,
        newMessagesCount: 11,
        lastViewed: Date.now(),
        sectionId: '11'
      }];
      return Promise.resolve([]);
    }
  })
  .setUsersMethod({
    getUsers: (sectionUser: SectionUser) => {
      const {
        sectionId,
        roomId
      } = sectionUser;
      if (dbSectionUsers && dbSectionUsers[roomId + sectionId]) {
        const sectionUsers: SectionUser[] = Object.values(dbSectionUsers[roomId + sectionId]);
        const userWithProfiles = sectionUsers
          .map(user => ({
            ...user,
            ...dbRoomUsers[roomId + sectionId][user.blockchainWallet]
          }));
        return Promise.resolve(userWithProfiles);
      } else {
        return Promise.resolve([]);
      }
    },
    createOrUpdateProfile: (param: SectionUser) => {
      const {
        sectionId,
        roomId,
        blockchainWallet
      } = param;
      if (!dbRoomUsers[roomId + sectionId]) {
        dbRoomUsers[roomId + sectionId] = {};
      }
      dbRoomUsers[roomId + sectionId][blockchainWallet] = param;
      return Promise.resolve(param);
    },
    joinSection: (param: SectionUser) => {
      const {
        sectionId,
        roomId,
        blockchainWallet
      } = param;
      if (!dbSectionUsers[roomId + sectionId]) {
        dbSectionUsers[roomId + sectionId] = {};
      }
      dbSectionUsers[roomId + sectionId][blockchainWallet] = {
        ...param,
        blockchainWallet
      };

      return Promise.resolve(param);
    },
    updateLastViewed: (param: SectionUser) => {
      const {
        sectionId,
        roomId,
        blockchainWallet
      } = param;
      if (!dbSectionUsers[roomId + sectionId]) {
        dbSectionUsers[roomId + sectionId] = {};
      }
      dbSectionUsers[roomId + sectionId][blockchainWallet] = {
        ...param,
        lastViewed: Date.now()
      };
      return Promise.resolve(param);
    }
  })
  .setBouncerMethod({
    updateNotificationPreferences: (notificationPref: NotificationPreferences): Promise<NotificationPreferences> => {
      dbbouncerNotificationPreferences[notificationPref.blockchainWallet] = notificationPref;
      return Promise.resolve(dbbouncerNotificationPreferences[notificationPref.blockchainWallet]);
    },
    updateProfile: (bouncerUser: BouncerUser): Promise<BouncerUser> => {
      dbbouncerUserProfile[bouncerUser.blockchainWallet] = bouncerUser;
      return Promise.resolve(dbbouncerUserProfile[bouncerUser.blockchainWallet]);
    },
    getMyProfile: (bouncerUser: BouncerUserQuery): Promise<BouncerUser> => {
      return Promise.resolve(dbbouncerUserProfile[bouncerUser.blockchainWallet]);
    },
    getUserRooms: (bouncerUserQuery: BouncerUserQuery): Promise<RoomUser[]> => {
      if (dbBouncerRoom[bouncerUserQuery.blockchainWallet]) {
        const bouncerUserRoom: SectionUser[] = Object.values(dbBouncerRoom[bouncerUserQuery.blockchainWallet]);
        return Promise.resolve(bouncerUserRoom);
      } else {
        return Promise.resolve([]);
      }
    },
    joinRoom: (bouncerRoomUser: RoomUser): Promise<any> => {
      if (!dbBouncerRoom[bouncerRoomUser.blockchainWallet]) {
        dbBouncerRoom[bouncerRoomUser.blockchainWallet] = {};
      }
      dbBouncerRoom[bouncerRoomUser.blockchainWallet][bouncerRoomUser.roomId] = bouncerRoomUser;

      return Promise.resolve(dbBouncerRoom[bouncerRoomUser.blockchainWallet][bouncerRoomUser.roomId]);
    }
  })
  .build();

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/reset', (req, res) => {
  console.info('reseting database');
  dbMessage = {};
  dbRoomUsers = {};
  dbSectionUsers = {};
  dbProfile = {};
  dbbouncerUserProfile = {};
  dbbouncerNotificationPreferences = {};
  dbBouncerRoom = {};
  res.send('database reset');
});
app.post('/spkz/rpc', spkzJSONRPC);

app.listen(port, async () => {
  console.info(`Example app listening at http://localhost:${port}`);
});
