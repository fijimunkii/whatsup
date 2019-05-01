const env = require('./env');
const Promise = require('bluebird');
const request = Promise.promisifyAll(require('request'),{multiArgs:true});
const moment = require('moment');

const urls = env.get('revdates') || [];

const getRevdates = () => Promise.all(urls.map(url =>
  request
    .getAsync(`https://${url}/auth/revdate`)
    .spread((res,body) => ({url,body}))
    .catch(err => ({url,err}))));

const toString = async () => {
  const revtimes = await getRevtimes();
  let txt = '<u>Deployment times</u>';
  revtimes.forEach(d => {
    if (d.err) {
      txt += `<br>${ d.url } - ${ d.err }`;
    } else {
      txt += `<br>${ d.url } - ${ d.body } - ${ moment(d.body).fromNow() }`;
    }
  });
  return txt;
};

module.exports = {
  toString
};
