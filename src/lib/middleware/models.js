'use strict';

import Note from '../../models/note';

export default (req, res, next) => {
  let model = req.params.model;

  if (model === 'notes') {
    req.Model = Note;
    return next();
  }

  throw new Error('Model Not Found');
};
