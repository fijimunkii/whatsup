const handleError = require('./lib/handle-error');
const aws = require('./lib/aws');
const revdates = require('./lib/revdates');

const favicon = 'https://github.githubassets.com/images/icons/emoji/shipit.png';

module.exports = (req, res) => {
  return whatsup(req,res)
    .catch(err => handleError(err,req,res));
};

async function whatsup(req, res) {
  const inverted = req.query && req.query.inverted;
  let html;
  // build html
  html = `
    <html>
    <head>
      <title>Whats up!</title>
      <meta http-equiv="refresh" content="30">
      <link rel="shortcut icon" href="${favicon}">
      <link rel="apple-touch-icon" href="${favicon}">
      <style>
        html { font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; }
        .largefont u, .largefont table { font-size: 150%; }
        ${ inverted ? '.inverted {  filter: invert(100%); }' : '' }
        .row { display: flex; }
        .column { flex: 50%; }
      </style>
    </head>
    <body>
      whats up!
      <br><br>
      <div class="largefont">
        ${ await revdates.toString() }
      </div>
      ${ await aws.toString() }
    </body>
    </html>
  `;
  res.write(html);
  res.end();
};
