var o = require('atom').o(module)
var _o = require('bond')._o(module)
var __ = require('fiber').__.main(module)
var assert = require('assert')
var BSON = require('leafnode').BSON
var carbond = require('../')
var assertRequests = require('./test-helper').assertRequests

/*******************************************************************************
 * endpoint tests
 */

var middlewareCalled = false

__(function() {

  var service = _o('./fixtures/Service1')
  service.middleware = [
    function(req, res, next) {
      middlewareCalled = true
      next()
    }
  ]

  var url = "http://localhost:8888/api/e1"
  var tests = [
    // Test GET
    {
      req: {
        url: url,
        method: "GET"
      },
      res: {
        statusCode: 200,
        body: {
          methodCalled: "get",
          reqParams: {}
        }
      }
    },

    // Test POST
    {
      req: {
        url: "http://localhost:8888/api/e1",
        method: "POST",
        body: {
          x: 1,
          y: 2
        }
      },
      res: {
        statusCode: 200,
        body: {
          methodCalled: "post",
          reqParams: {},
          reqBody:  {
            x: 1, 
            y: 2
          }
        }
      }
    },

    // Test PUT
    {
      req: {
        url: "http://localhost:8888/api/e1",
        method: "PUT",
        body: {
          x: [1],
          y: 2
        }
      },
      res: {
        statusCode: 200,
        body: {
          methodCalled: "put",
          reqParams: {},
          reqBody:  {
            x: [1], 
            y: 2
          }
        }
      }
    },

    // Test PATCH
    {
      req: {
        url: "http://localhost:8888/api/e1",
        method: "PATCH",
        body: {
          x: { a: 1 },
          y: 2
        }
      },
      res: {
        statusCode: 200,
        body: {
          methodCalled: "patch",
          reqParams: {},
          reqBody:  {
            y: 2,
            x: { a: 1 }
          }
        }
      }
    },

    // Test DELETE
    {
      req: {
        url: "http://localhost:8888/api/e1",
        method: "DELETE",
        parameters: {
          n: 3,
          m: { x: "hello" }
        }
      },
      res: {
        statusCode: 200,
        body: {
          methodCalled: "delete",
          reqParams: {
            n: 3, 
            m: { x: "hello" }
          }
        }
      }
    },
  ]


  // Run the tests
  service.start()
  assertRequests(tests)
  assert(middlewareCalled)
  service.stop()
})


            
