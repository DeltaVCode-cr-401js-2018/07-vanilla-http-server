'use strict';

const request = require('supertest');
const server = require('../src/app');
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
      .expect(response => {expect(response.text[0]).toBe('<');
      });
  });
  it('json response for the /api/cowsay route', () => {
    return request(app)
      .get('/api/cowsay?text=Hello')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .expect(response => {
        expect(response.body).toBeDefined();
        expect(response.body.content).toMatch('Hello');
      });
  });

  it('handles a POST request', () => {
  
    return request(app)
      .post('/api/cowsay?text=TEST')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .expect(response => {
        expect(response.body).toBeDefined();
        expect(response.body.content).toMatch('TEST');
      });
  }); 



  it('respond with 500 for /500', () => {
    return request(app)
      .post('/500')
      .expect(500)
      .expect('Content-Type', 'text/html')
      .expect('Test Error');
  });



});//closes describe app
