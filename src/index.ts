const express = require('express');
const app = express();
const port = 3000;
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(port, () => {
  console.info(`Example app listening at http://localhost:${port}`);
});
