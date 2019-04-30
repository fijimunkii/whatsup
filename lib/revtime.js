const env = require('./env');
const Promise = require('bluebird');
const request = Promise.promisifyAll(require('request'),{multiArgs:true});
const moment = require('moment');

const urls = env.get('revtime') || [];

const getRevtimes = () => Promise.all(urls.map(url =>
  request.getAsync(`https://${url}/auth/revtime`).spread((res,body) => ({url,body}))));

const toString = async () => {
  const revtimes = await getRevtimes();
  let txt = '<u>Deployment times</u>';
  revtimes.forEach(d => {
    txt += `<br>${ d.url } - ${ d.body } - ${ moment(d.body).fromNow() }`;
  });
  return txt;
};

module.exports = {
  toString
};
