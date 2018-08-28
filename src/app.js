'use strict';

import express from 'express';
import morgan from 'morgan';

import errorMiddleware from './lib/middleware/error';
import json404 from './lib/middleware/json-404';

const app = express();

// Make app available for testing
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

// NOTE: Typically this would be done immediately after creating the app
// NOTE: Our requestHandler function is largely obsolete
// NOTE: Express has a built-in 404 handler
// NOTE: Express has a built-in 500 handler

// This replaces the request-parser that was used in our router
app.use(express.json());
// if you want to handle normal HTML <form> POST
// app.use(express.urlencoded({ extended: true }));

// Log each request
app.use(morgan('dev'));

app.get('/500', (req, res) => {
  throw new Error('Test Error');
});

app.get('/', (req, res) => {
  html(res, '<html><body><h1>HOME</h1></body></html>');
});

app.post('/api/hello', (req, res) => {
  res.json({
    message: `Hello, ${req.body.name}!`,
  });
});

// Note: previously this modified our global router
// require('./routes/api');
import router from './routes/api';
app.use(router);

app.use(json404);

// Log error then pass it through to default handler
app.use(errorMiddleware);

// Today we learned: function.length = number of parameters!
// console.log(((req, res, next) => {}).length);

function html(res, content, statusCode = 200, statusMessage = 'OK') {
  res.statusCode = statusCode;
  res.statusMessage = statusMessage;
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
}
