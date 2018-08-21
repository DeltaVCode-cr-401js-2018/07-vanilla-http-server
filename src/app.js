'use strict';

const http = require('http');

const requestParser = require('./lib/request-parser');
const cowsay = require('cowsay');

const app = http.createServer(requestHandler);
module.exports = app;

app.start = (port) =>{
  return new Promise((resolve, reject)=>{
    app.listen(port,(err,result)=>{
      if(err){
        reject(err);
      } else{
        resolve(result);
      }
    });
  });
};

function requestHandler(req,res){
  console.log(`${req.method} ${req.url}`);
  requestParser(req)
    .then(()=>{
      if(req.parsedUrl.pathname === '/500'){
        throw new Error('Test Error');
      }
      if(req.method === 'GET' && req.parsedUrl.pathname === '/'){
        html(res, '<!DOCTYPE html><html><head><title> cowsay </title>  </head><body><header><nav><ul><li><a href="/cowsay">cowsay</a></li></ul></nav><header><main><!-- project description --></main></body></html>');
        return;
      }
      if(req.method === 'GET' && req.parsedUrl.pathname === '/cowsay' && req.parsedUrl.query.includes('text=')){
        html(res, `<!DOCTYPE html><html><head><title> cowsay </title>  </head><body><h1> cowsay </h1><pre>${cowsay.say({text: req.query.text})}</pre></body></html>`);
        return;
      }
      if(req.method === 'POST' && req.parsedUrl.pathname === '/api/cowsay' && req.query.text){
        console.log('Method is post');
        json(res, req.query.text);
        return;
      }
      notFound(res);
    })
    .catch(err =>{
      console.error(err);
      html(res, err.message, 500, 'Internal Server Error');
    });
  
  
}

function html(res, content, statusCode=200, statusMessage='OK'){
  res.statusCode = statusCode;
  res.statusMessage = statusMessage;
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
}

function json(res, content){
  if(content){
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.setHeader('Content-Type', 'application/json');
    res.write(`{"content": "<${content}>"}`);
    res.end();
  } else{
    res.statusCode = 400;
    res.statusMessage = 'Invalid Request';
    res.write('{"error": "invalid request: text query required"}');
    res.end();
  }
}

function notFound(res){
  res.statusCode = 404;
  res.statusMessage = 'Not Found';
  res.setHeader('Content-Type', 'text/html');
  res.write('Resource Not Found');
  res.end();
}