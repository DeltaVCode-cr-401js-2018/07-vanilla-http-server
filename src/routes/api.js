'use strict';

const router = require('../lib/router');
const Note = require('../models/note');

router.get('/api/notes', (req, res) => {
  if (req.query.id) {
    return Note.findById(req.query.id)
      .then(note => {
        json(res, note);
      });
  }

  Note.fetchAll()
    .then(notes => {
      json(res, notes);
    });
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
