const handleError = require('./lib/handle-error');
const aws = require('./lib/aws');
const revdates = require('./lib/revdates');
const css = require('./lib/css');

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
        ${ inverted ? '.inverted {  filter: invert(100%); }' : '' }
        ${ css }
      </style>
      <script>
        function showHide(id) {
          var e = document.getElementById(id);
          e.style.display = (e.style.display == 'block') ? 'none' : 'block';
        }
      </script>
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
