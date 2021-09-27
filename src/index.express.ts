import 'reflect-metadata';
import { SPKZJSONRPC } from './services/JSONRPCServer';
import { SPKZ } from './services/wallet';
import { ReadMessageParameters, WriteMessageParameters } from './models/jsonrpc/writeMessageParameters';

const express = require('express');
const app = express();
const port = 3000;
var bodyParser = require('body-parser');
const messagesDB = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const dbMessage = {};

const spkzJSONRPC = new SPKZJSONRPC({ chainId: '1', network: '1' })
// @ts-ignore
  .setMessagesMethod({
    read: (parameters:ReadMessageParameters) => {
      const { roomId, sectionId } = parameters;
      return Promise.resolve(dbMessage[roomId + sectionId]);
    },
    write: (parameters:WriteMessageParameters) => {
      const { roomId, sectionId } = parameters;
      dbMessage[roomId + sectionId] = parameters;
      return Promise.resolve({});
    }
  })
  .build();

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.post('/spkz/rpc', spkzJSONRPC);

app.listen(port, async () => {
  console.info(`Example app listening at http://localhost:${port}`);
  const spkz = SPKZ.fromPrivateKey('0xc88c2enbe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161'); // 0x1462B397bf8845f6448a6C0e6F521ed2458F68D0
  await spkz.wallets.addWalletFromPrivateKey('0x555a72847a70a73911029412fb98a0d347bbc7785128fc38e184c8607b6bec07'); // 0x0EfBf243b5105c2fe8F14943EB3EEE5f3D9D2A48
  const r = await spkz.room.canJoin({ roomId: '0' });

  await spkz.room.sendMessage({
    roomId: '0',
    sectionId: 'chat',
    messageContent: {
      title: 'hello world'
    }
  });
});
