'use strict';

const url = require('url');
const queryString = require('querystring');

module.exports = (request) => {
  return new Promise((resolve, reject) => {
    //TODO: Validate that request exists
    //TODO: validate that request.url exists

    request.parsedUrl = url.parse(request.url);
    request.query = queryString.parse(request.parsedUrl.query);
    
    resolve(request);
  });
};
