'use strict';

const url = require('url');
const queryString = require('querystring');

module.exports = (request) => {
  return new Promise((resolve, reject) => {
    // TODO: validate that request exists
    // TODO: validate that request.url exists

    request.parsedUrl = url.parse(request.url);
    request.query = queryString.parse(request.parsedUrl.query);

    if (!request.method.match(/POST|PUT|PATCH/)) {
      return resolve(request);
    }

    let text = '';

    request.on('data', (buffer) => {
      text += buffer.toString();
    });

    request.on('end', () => {
      try {
        request.body = text;
        resolve(request);
      } catch(err) {
        reject(err);
      }
    });

    request.on('err', reject);
  });
};
