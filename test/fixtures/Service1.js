var o = require('@carbon-io/carbon-core').atom.o(module).main

var carbond = require('../../')

/*******************************************************************************
 * Service1
 * 
 * This is a very simple Service. This is meant for testing sync 
 * operations defined as simple functions. 
 */
var middlewareCalled = false

module.exports = {
  _type: carbond.Service,
  
  port: 8888,
  verbosity: 'info',
  apiRoot: '/api',

  middlewareCalled: false,
  middleware: [
    function(req, res, next) {
      middlewareCalled = true
      next()
    }
  ],
  
  endpoints: {
    // Simple endpoint with operations defined as functions
    e1: o({
      _type: carbond.Endpoint,
      get: function(req, res) {
        return { 
          methodCalled: "get",
          reqParams: req.query
        }
      },
      
      post: function(req, res) {
        return {
          methodCalled: "post",
          reqParams: req.query,
          reqBody: req.body
        }
      },
      
      put: function(req, res) {
        return {
          methodCalled: "put",
          reqParams: req.query,
          reqBody: req.body
        }
      },

      patch: function(req, res) {
        return {
          methodCalled: "patch",
          reqParams: req.query,
          reqBody: req.body
        }
      },

      delete: function(req, res) {
        return {
          methodCalled: "delete",
          reqParams: {
            n: req.query.n,
            m: req.query.m
          },
          middlewareCalled: middlewareCalled
        }
      }
      
    })
  }
}
