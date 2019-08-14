module.exports = async(err, req, res) => {
  err = String(err && err.stack || err);
  console.log(err);
  try { res.end(errorHtml(err)); } catch(e) { }
};

function errorHtml(err) {
  return `<html>
    <head>
      <title>Whats up with that error!</title>
      <meta http-equiv="refresh" content="15">
    </head>
    <body>
      <h2>There was an error.</h2>
      <p>${err}</p>
    </body>
  </html>`;
}
