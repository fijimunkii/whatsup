process.setMaxListeners(0);

const env = require('./lib/env');
const os = require('os');

const express = require('express');
let app = express();
app.use(require('body-parser').json());
app.use(require('hpp')());

app.use('/', require('./whatsup'));

if (env.get('HTTPS')) {
  app = require('https').createServer(require('./lib/ssl-config'), app);
}

const port = env.get('PORT')||5555;
app.listen(port, () => {
  if (typeof process.send === 'function') {
    process.send('ready'); // signal ready for `pm2 start index.js --wait-ready`
  }
  console.log(`Listening at http://localhost:${port}`);
});
