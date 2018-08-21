'use strict';

const request = require('supertest');

const app = require('../src/app');

describe('app', () => {
  it('responds with 404 for unknown path', ()=>{
    return request(app)
      .get('/404')
      .expect(404)
      .expect('Content-Type', 'text/html')
      .expect('Resource Not Found');
  });

  it('responds with HTML for /', ()=>{
    return request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect(response =>{
        expect(response.text[0]).toBe('<');
      });
  });
  it('responds with JSON for /api/cowsay?text={message}', ()=>{
    return request(app)
      .post('/api/cowsay?text=hi')
      .expect(200)
      .expect(response =>{
        console.log(response);
        expect(response.text[2]).toBe('c');
      })
      .expect('Content-Type', 'application/json');
  });
});
