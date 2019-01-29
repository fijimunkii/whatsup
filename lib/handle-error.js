module.exports = async(err, req, res) => {
  err = String(err && err.stack || err);
  console.log(err);
  try { res.end(err); } catch(e) { }
};
