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

function requestHandler(req, res) {
  console.log(`${req.method} ${req.url}`);

  requestParser(req)
    .then(() => {
      if (req.parsedUrl.pathname === '/500') {
        throw new Error('Test Error');
      }

      if (req.method === 'GET' && req.parsedUrl.pathname === '/') {
        html(res, '<html><body><h1>HOME</h1></body></html>');
        return;
      }

      if (req.method === 'POST' &&
        req.parsedUrl.pathname === '/api/hello') {
        json(res, {
          message: `Hello, ${req.body.name}!`,
        });
        return;
      }

      notFound(res);
    })
    .catch(err => {
      console.error(err);
      html(res, err.message, 500, 'Internal Server Error');
    });
}

function html(res, content, statusCode = 200, statusMessage = 'OK') {
  res.statusCode = statusCode;
  res.statusMessage = statusMessage;
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
}

function json(res, object) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(object));
  res.end();
}

function notFound(res) {
  res.statusCode = 404;
  res.statusMessage = 'Not Found';
  res.setHeader('Content-Type', 'text/html');
  res.write('Resource Not Found');
  res.end();
}
