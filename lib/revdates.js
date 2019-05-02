const env = require('./env');
const Promise = require('bluebird');
const request = Promise.promisifyAll(require('request'),{multiArgs:true});
const moment = require('moment-timezone');
moment.tz.setDefault('America/New_York');

const urls = env.get('revdates') || [];

const getRevdates = () => Promise.all(urls.map(url =>
  request
    .getAsync(`https://${url}/auth/revdate`)
    .spread((res,body) => ({url,body}))
    .catch(err => ({url,err}))));

const toString = async () => {
  const revdates = await getRevdates();
  let txt = '<u>Deployment times</u>';
  revdates.forEach(d => {
    if (d.err) {
      txt += `<br>${ d.url } - ${ d.err }`;
    } else {
      const time = moment(d.body);
      let data;
      if (time.isAfter(moment().subtract(2,'day'))) {
        data = { color: 'green', image: '&#128640;' };
      } else if (time.isAfter(moment().subtract(3,'day'))) {
        data = { color: 'yellow', image: '&#128034;' };
      } else {
        data = { color: 'red', image: '&#128012;' };
      }
      txt += `
        <br>
        <p style="color: ${ data.color }">
          ${ data.image }
          ${ d.url.replace(/\..*/,'') } - ${ time.format('ddd, hA') } - ${ time.fromNow() }
        </p>
      `;
    }
  });
  return txt;
};

module.exports = {
  toString
};
