'use strict';

const request = require('supertest');

const app = require('../src/app');

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
      return request(app)
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', 'application/json')
        .expect([{ id: 1 }]);
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
