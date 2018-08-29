'use strict';

require('babel-register');

require('dotenv').config();

const server = require('./src/app');

const PORT = process.env.PORT;
if (!PORT) throw new Error('PORT not set!');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('MONGODB_URI is not set!');

const mongoConnect = require('./src/util/mongo-connect');
mongoConnect(MONGODB_URI)
  .then(() => {
    server.start(process.env.PORT)
      .then(() => console.log(`Listening on ${PORT}`));
  });
