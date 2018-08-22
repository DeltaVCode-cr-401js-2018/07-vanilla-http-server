'use strict';

const router = require('../../src/lib/router');

describe('router', () => {
  it('has no routes when initialized', () => {
    expect(router.routes.GET).toEqual({});
    expect(router.routes.POST).toEqual({});
    expect(router.routes.DELETE).toEqual({});

    console.log('initialized', router);
  });

  it('accepts new routes with per-method helpers', () => {
    router.get('/get', () => 'got');
    expect(router.routes.GET['/get']).toBeDefined();
    expect(router.routes.GET['/get']()).toBe('got');

    router.post('/post', () => 'posted');
    expect(router.routes.POST['/post']).toBeDefined();
    expect(router.routes.POST['/post']()).toBe('posted');

    router.delete('/api/book/1', () => 'gone');
    expect(router.routes.DELETE['/api/book/1']).toBeDefined();
    expect(router.routes.DELETE['/api/book/1']()).toBe('gone');

    router.delete('/api/author/2', () => 'real gone');
    expect(router.routes.DELETE['/api/author/2']).toBeDefined();
    expect(router.routes.DELETE['/api/author/2']()).toBe('real gone');

    console.log('with routes', router);
  });
});
