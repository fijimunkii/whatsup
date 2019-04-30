const handleError = require('./lib/handle-error');
const aws = require('./lib/aws');
const revtimes = require('./lib/revtimes');

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
      <meta http-equiv="refresh" content="30">
      <link rel="shortcut icon" href="${favicon}">
      <link rel="apple-touch-icon" href="${favicon}">
    </head>
    <body>
      whats up!
      <br><br>
      ${ await revtimes.toString() }
      <br><br>
      ${ await aws.toString() }
    </body>
    </html>
  `;
  res.write(html);
  res.end();
};
