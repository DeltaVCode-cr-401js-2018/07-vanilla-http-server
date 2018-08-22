'use strict';

// Optional, since exports starts as an empty object
// const router = module.exports = {};
const router = exports;

// Make me my router
const routes = exports.routes = {};

// Instead of this...
routes.GET = {};
router.get = (path, callback) => {
  routes.GET[path] = callback;
};

// List of supported methods
const methods = ['GET', 'POST', 'DELETE', 'PUT'];

methods.forEach(method => {
  // Initialize this method's route table
  routes[method] = {};

  router[method.toLowerCase()] = (path, callback) => {
    routes[method][path] = callback;
  };
});
