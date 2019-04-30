const handleError = require('./lib/handle-error');
const aws = require('./lib/aws');
const revtimes = require('./lib/revtimes');

module.exports = (req, res) => {
  return whatsup(req,res)
    .catch(err => handleError(err,req,res));
};

async function whatsup(req, res) {
  let html;
  // build html
  html = `
    <html>
    <body>
    whats up!
    <br><br>
    ${ await aws.toString() }
    </body>
    </html>
  `;
  res.write(html);
  res.end();
};
