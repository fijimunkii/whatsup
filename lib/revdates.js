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
  let txt = `
      <u>Release build times</u>
      <table>
    `;
  revdates.forEach(d => {
    if (d.err) {
      txt += `<tr class="inverted" style="background-color: red">
          <td>&#x274C; ${ d.url.replace(/\..*/,'') }</td>
          <td>${ d.err }</td>
        </tr>`;
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
        <tr class="inverted" style="color: ${ data.color }">
          <td style="width:700px">${ data.image } ${ d.url.replace(/\..*/,'') }</td>
          <td>${ time.format('ddd, hA') } - ${ time.fromNow() }</td>
        </tr>
      `;
    }
  });
  txt += '</table>';
  return txt;
};

module.exports = {
  toString
};
