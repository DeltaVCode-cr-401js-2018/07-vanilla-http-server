'use strict';

const request = require('supertest');

const app = require('../src/app');
const Note = require('../src/models/note');

describe('app', () => {
  it('responds with 404 for unknown path', () => {
    return request(app)
      .get('/404')
      .expect(404)
      .expect('Content-Type', 'text/html')
      .expect('Resource Not Found');
  });

  it('responds with HTML for /', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect(response => {
        expect(response.text[0]).toBe('<');
      });
  });

  it('responds with message for POST /api/hello', () => {
    return request(app)
      .post('/api/hello')
      .send({ name: 'Keith' })
      .expect(200)
      .expect('Content-Type', 'application/json')
      .expect(response => {
        expect(response.body).toBeDefined();
        expect(response.body.message).toBe('Hello, Keith!');
      });
  });

  it('responds with 500 for /500', () => {
    return request(app)
      .post('/500')
      .expect(500)
      .expect('Content-Type', 'text/html')
      .expect('Test Error');
  });

  describe('api routes', () => {
    it('can get /api/notes', () => {
      var notes = [
        new Note({ title: 'test 1', content: 'uno' }),
        new Note({ title: 'test 2', content: 'dos' }),
        new Note({ title: 'test 3', content: 'tres' }),
      ];

      return Promise.all(
        notes.map(note => note.save())
      ).then(savedNotes => {
        return request(app)
          .get('/api/notes')
          .expect(200)
          .expect('Content-Type', 'application/json')
          .expect(savedNotes);
      });
    });

    it('can get /api/notes?id=...', () => {
      var note = new Note({ title: 'save me', content: 'please' });

      return note.save()
        .then(saved => {
          return request(app)
            .get(`/api/notes?id=${saved.id}`)
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect(saved);
        });
    });

    it('can delete /api/notes?id=deleteme', () => {
      return request(app)
        .delete('/api/notes?id=deleteme')
        .expect(200)
        .expect('Content-Type', 'application/json')
        .expect({ message: `ID deleteme was deleted` });
    });
  });
});
