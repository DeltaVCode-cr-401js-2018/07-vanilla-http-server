'use strict';

const request = require('supertest');

import app from '../src/app';
import Note from '../src/models/note';
import List from '../src/models/list';

const mongoConnect = require('../src/util/mongo-connect');

const MONGODB_URI = process.env.MONGODB_URI ||
  'mongodb://localhost/401-2018-notes';

describe('list/note interaction', () => {
  beforeAll(() => {
    return mongoConnect(MONGODB_URI);
  });

  describe('with list', () => {
    let testList;
    beforeEach(() => {
      testList = new List({ name: 'Add notes to me' });
      return testList.save();
    });

    it('can create note on list', () => {
      let noteBody = {
        title: 'Add me to a list',
        list: testList._id,
      };
      return request(app)
        .post('/api/notes')
        .send(noteBody)
        .expect(200)
        .expect(response => {
          console.log(response.body);
        });
    });
  });
});