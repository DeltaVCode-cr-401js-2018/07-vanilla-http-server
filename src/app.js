'use strict';

const http = require('http');
const cowsay = require('cowsay');
const requestParser = require('./lib/request-parser');


const app = http.createServer(requestHandler);
module.exports = app;
app.start = (port) => 
  new Promise((resolveCallback, rejectCallback) => {
    app.listen(port, (err, result) => {
      if(err) {
        rejectCallback(err);
      }else{ 
        resolveCallback(result);
      }
    });
  });


function requestHandler(req,res){
  console.log(`${req.method} ${req.url}`);
  requestParser(req)
    .then(() => {
      if(req.parsedUrl.pathname === '/500'){
        throw new Error('Test Error');
      } if(req.method === 'GET' && req.parsedUrl.pathname === '/'){
        html(res, `<!DOCTYPE html>
        <html>
          <head>
            <title> cowsay </title>  
          </head>
          <body>
           <header>
             <nav>
               <ul>
                 <li><a href="/cowsay">cowsay</a></li>
               </ul>
             </nav>
           <header>
           <main>
             <!-- project description -->
           </main>
          </body>
        </html>`);
        return;
      }
      if(req.method === 'GET' && req.parsedUrl.pathname === '/api/cowsay' && req.query.text){
        console.log('Method is post');
        json(res, {
          content: cowsay.say(req.query),
        });
        return;
      }
      if(req.method === 'POST' && req.parsedUrl.pathname === '/api/cowsay'  && req.query.text){
        console.log('Method is POST');
        // let content ='';
        // if(!req.body){content = 'Invalid content: request: body required';}
        //  if (req.body.text) );}
        // else {content = 'Invalid content: text query required';}
    
        // let object = {content: content};
        json(res, {content : cowsay.say({text: req.query.text})});
        // res.setHeader('Content-Type', 'text/html');
        // res.statusCode = 200;
        // res.statusMessage = 'OK';
        // res.
        return;
      }
      notFound(res);
    })
    .catch(err => {
      console.error(err);
      html(res, err.message, 500, 'Internal Server Error');
    });

  







}


function html(res, content, statusCode = 200, statusMessage = 'OK'){
  res.statusCode = statusCode;
  res.statusMessage = statusMessage;
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
}

function json (res, object){
  if(object){
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(object));
    res.end();
  }else{ 
    res.statusCode = 400;
  }
}


function notFound(res){
  res.statusCode = 404;
  res.statusMessage = 'Not Found';
  res.setHeader('Content-Type', 'text/html');
  res.write('Resource Not Found');
  res.end();
}
