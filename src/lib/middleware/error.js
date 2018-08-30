'use strict';

const debug = require('debug')('app/middleware/error');

export default (err, req, res, next) => {
  if (err.name === 'CastError') {
    res.sendStatus(404);
    return;
  }

  debug(err);

  if (req.headers['accept'] !== 'application/json') {
    next(err);
    return;
  }

  res.statusCode = 500;
  res.json({
    error: err.message,
  });
};
