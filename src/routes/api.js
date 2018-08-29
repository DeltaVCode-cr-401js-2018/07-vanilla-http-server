'use strict';

import express from 'express';
const router = express.Router();

export default router;

// Get all notes
router.get('/api/:model', (req, res, next) => {
  req.Model.fetchAll()
    .then(models => {
      res.json(models);
    });
});

// Create a note
router.post('/api/:model', (req, res) => {
  if (!req.body || !req.body.title) {
    res.send(400);
    res.end();
    return;
  }

  var newModel = new req.Model(req.body);
  newModel.save()
    .then(saved => {
      res.json(saved);
    });
});

// Get an individual note
router.get('/api/:model/:id', (req, res) => {
  return req.Model.findById(req.params.id)
    .then(model => {
      res.json(model);
    });
});

router.delete('/api/:model/:id', (req, res) => {
  // TODO: implement delete?
  res.json({
    message: `ID ${req.params.id} was deleted`,
  });
});
