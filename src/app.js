'use strict';

const http = require('http');
const cowsay = require('cowsay');

const requestParser = require('./lib/request-parser');

const app = http.createServer(requestHandler);
module.exports = app;

app.start = (port) => 
  new Promise((resolveCallback, rejectCallback) => {
    app.listen(port, (err, result) => {
      if (err) {
        rejectCallback(err);
      }
      else {
        resolveCallback(result);
      }
    });
  });

function requestHandler(req,res) {
  console.log(`${req.method} ${req.url}`);

  requestParser(req)
    .then(() => {
      if(req.parsedUrl.pathname === '/500') {
        throw new Error('Test Error');
      }
      if(req.method === 'GET' && req.parsedUrl.pathname === '/'){
        html(res, '<!DOCTYPE html><html><head><title> cowsay </title>  </head><body><header><nav><ul><li><a href="/cowsay">cowsay</a></li></ul></nav><header><main><!-- project description --></main></body></html>');
        return;
      }

      notFound(res);
    })
    .catch(err => {
      html(res,err.message, 500, 'Internal Server Error');
    });
}

function html(res,content, statusCode =200, statusMessage = 'OK') {
  res.statusCode = statusCode;
  res.statusMessage = statusMessage;
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
}

function notFound(res){
  res.statusCode = 404;
  res.statusMessage = 'NotFound';
  res.setHeader('Content-Type', 'text/html');
  res.write('Resource Not Found');
  res.end();
}