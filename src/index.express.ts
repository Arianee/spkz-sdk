import { SPKZJSONRPC } from './services/JSONRPCServer';

const express = require('express');
const app = express();
const port = 3000;
var bodyParser = require('body-parser');
const messagesDB = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const spkzJSONRPC = new SPKZJSONRPC()
// @ts-ignore
  .setMessagesMethod({ read: () => {}, write: () => {} })
  .build();

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.post('/spkz/rpc', (req, res, next) => spkzJSONRPC(req, res, next));

app.listen(port, () => {
  console.info(`Example app listening at http://localhost:${port}`);
});
