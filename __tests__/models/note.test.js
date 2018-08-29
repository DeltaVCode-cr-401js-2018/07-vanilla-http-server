'use strict';

import Note from '../../src/models/note';

const mongoConnect = require('../../src/util/mongo-connect');

const MONGODB_URI = process.env.MONGODB_URI ||
  'mongodb://localhost/401-2018-notes';

describe('note model', () => {
  beforeAll(() => {
    return mongoConnect(MONGODB_URI);
  });

  it('can save a note', () => {
    let note = new Note({
      title: 'Test Note',
      created: new Date(),
    });

    return note.save()
      .then(saved => {
        expect(saved.title).toBe('Test Note');
        expect(saved.created).toEqual(note.created);
      });
  });

  it('fails if title is missing', () => {
    let note = new Note({
      // no title
      created: new Date(),
    });

    return expect(note.save())
      .rejects.toBeDefined();
  });

  // TODO: test Note.find()
  // TODO: test Note.findById()
  // TODO: test Note.remove() <= how does this work?
});
