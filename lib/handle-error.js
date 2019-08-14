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
      <h2>Whats up with that error!</h2>
      <h3>This page will reload in 15 seconds.</h3>
      <p>${err}</p>
    </body>
  </html>`;
}
