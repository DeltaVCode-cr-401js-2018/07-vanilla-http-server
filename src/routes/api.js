'use strict';

import express from 'express';
const router = express.Router();

export default router;

import modelFinder from '../lib/middleware/models';
// Only populate req.Model for API requests
router.param('model', modelFinder);

// Get all notes
router.get('/api/:model', (req, res, next) => {
  req.Model.find({})
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
router.get('/api/:model/:id', (req, res, next) => {
  return req.Model.findById(req.params.id)
    .then(model => {
      if (model === null) {
        // 404 Option 1:
        res.sendStatus(404);
        // apparently this works (without return)?
        res.end();
        // but we should return anyway to skip extra work
        return;
      }
      res.json(model);
    })
    .catch(err => {
      // Could not convert to ObjectId
      if (err.name === 'CastError') {
        // 404 Option 2:
        // Preferred for 404 because it lets the rest of the
        // express middelware pipeline do its thing,
        // e.g. respond with JSON or HTML
        next();
      } else {
        // Do whatever we do for real errors
        next(err);
      }
    });
});

router.delete('/api/:model/:id', (req, res) => {
  // TODO: implement delete?
  res.json({
    message: `ID ${req.params.id} was deleted`,
  });
});
