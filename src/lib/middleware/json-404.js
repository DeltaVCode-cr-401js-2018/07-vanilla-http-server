'use strict';

export default (req, res, next) => {
  if (req.headers['accept'] !== 'application/json') {
    next();
    return;
  }

  res.statusCode = 404;
  res.json({
    error: 'Not Found',
  });
};
