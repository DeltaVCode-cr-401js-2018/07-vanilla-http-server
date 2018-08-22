'use strict';

const router = require('../lib/router');

router.get('/api/notes', (req, res) => {
  json(res, [
    { id: 1 },
  ]);
});

router.delete('/api/notes', (req, res) => {
  json(res, {
    message: `ID ${req.query.id} was deleted`,
  });
});

function json(res, object) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(object));
  res.end();
}
