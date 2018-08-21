'use strict';

const http = require('http');

const requestParser = require('./lib/request-parser');

const app = http.createServer(requestHandler);
module.exports = app;

app.start = (port) =>
  new Promise((resolveCallback, rejectCallback) => {
    app.listen(port, (err, result) => {
      if (err) {
        rejectCallback(err);
      } else {
        resolveCallback(result);
      }
    });
  });

function requestHandler(req, res){

}
