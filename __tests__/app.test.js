'use strict';

const request = require('supertest');

import app from '../src/app';
import Note from '../src/models/note';

describe('app', () => {
  it('responds with 404 for unknown path', () => {
    return request(app)
      .get('/404')
      .expect(404)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });

  it('responds with JSON 404 for unknown path given Accept: application/json', () => {
    return request(app)
      .get('/404')
      .set('Accept', 'application/json')
      .expect(404)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect({ error: 'Not Found' });
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
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(response => {
        expect(response.body).toBeDefined();
        expect(response.body.message).toBe('Hello, Keith!');
      });
  });

  it('responds with 500 for /500', () => {
    return request(app)
      .get('/500')
      .expect(500)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });

  it('responds with JSON 500 for /500 with Accept: application/json', () => {
    return request(app)
      .get('/500')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect({
        error: 'Test Error',
      });
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
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(savedNotes);
      });
    });

    it('can get /api/notes/:id', () => {
      var note = new Note({ title: 'save me', content: 'please' });

      return note.save()
        .then(saved => {
          return request(app)
            .get(`/api/notes/${saved.id}`)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(saved);
        });
    });

    it('returns 400 for POST /api/notes without body', () => {
      return request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json; charset=utf-8')
        .send('this is not json')
        .expect(400);
    });

    it('returns 400 for POST /api/notes with empty body', () => {
      return request(app)
        .post('/api/notes')
        .send({})
        .expect(400);
    });

    it('can POST /api/notes to create note', () => {
      return request(app)
        .post('/api/notes')
        .send({ title: 'Testing', content: 'It works!' })
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(response => {
          expect(response.body).toBeDefined();
          expect(response.body.id).toBeDefined();
          expect(response.body.title).toBe('Testing');
          expect(response.body.content).toBe('It works!');
        });
    });

    it('can delete /api/notes/deleteme', () => {
      return request(app)
        .delete('/api/notes/deleteme')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect({ message: `ID deleteme was deleted` });
    });
  });
});
