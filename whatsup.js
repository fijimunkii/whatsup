const handleError = require('./lib/handle-error');
const aws = require('./lib/aws');
const revdates = require('./lib/revdates');

const favicon = 'https://github.githubassets.com/images/icons/emoji/shipit.png';

module.exports = (req, res) => {
  return whatsup(req,res)
    .catch(err => handleError(err,req,res));
};

async function whatsup(req, res) {
  let html;
  // build html
  html = `
    <html>
    <head>
      <title>Whats up!</title>
      <meta http-equiv="refresh" content="30">
      <link rel="shortcut icon" href="${favicon}">
      <link rel="apple-touch-icon" href="${favicon}">
    </head>
    <body>
      whats up!
      <br><br>
      ${ await revdates.toString() }
      <br><br>
      ${ await aws.toString() }
    </body>
    </html>
  `;
  res.write(html);
  res.end();
};
