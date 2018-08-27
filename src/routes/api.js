'use strict';

import express from 'express';
const router = express.Router();

export default router;

import Note from '../models/note';

// Get all notes
router.get('/api/notes', (req, res) => {
  Note.fetchAll()
    .then(notes => {
      json(res, notes);
    });
});

// Create a note
router.post('/api/notes', (req, res) => {
  if (!req.body || !req.body.title) {
    res.send(400);
    res.end();
    return;
  }

  var newNote = new Note(req.body);
  newNote.save()
    .then(saved => {
      json(res, saved);
    });
});

// Get an individual note
router.get('/api/notes/:id', (req, res) => {
  return Note.findById(req.params.id)
    .then(note => {
      json(res, note);
    });
});

router.delete('/api/notes/:id', (req, res) => {
  json(res, {
    message: `ID ${req.params.id} was deleted`,
  });
});

function json(res, object) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(object));
  res.end();
}
