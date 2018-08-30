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
  describe('findById', () => {
    let testNote;
    beforeEach(() => {
      testNote = new Note({ title: 'Find Me!' });
      return testNote.save();
    });

    it('can find by id that exists', () => {
      return Note.findById(testNote._id)
        .then(foundNote => {
          expect(foundNote).toBeDefined();
          expect(foundNote._id).toEqual(testNote._id);
          expect(foundNote.title).toEqual(testNote.title);
        });
    });

    it('can find by string id that exists', () => {
      return Note.findById(testNote._id.toString())
        .then(foundNote => {
          expect(foundNote).toBeDefined();
          expect(foundNote._id).toEqual(testNote._id);
          expect(foundNote.title).toEqual(testNote.title);
        });
    });

    it('reject given id that is invalid', () => {
      return expect(Note.findById('oops'))
        .rejects.toThrowError('Cast to ObjectId failed');
    });

    it('resolves with null given id that is valid but missing', () => {
      return expect(Note.findById('deadbeefdeadbeefdeadbeef'))
        .resolves.toBe(null);
    });
  });
});
