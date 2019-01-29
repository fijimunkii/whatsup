const handleError = require('./lib/handle-error');

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
    </body>
    </html>
  `;
  res.write(html);
  res.end();
};
