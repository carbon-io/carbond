var o = require('atom').o(module)
var _o = require('bond')._o(module)
var __ = require('fiber').__(module, true)
var assert = require('assert')
var BSON = require('leafnode').BSON
var carbond = require('../')
var assertRequests = require('./test-helper').assertRequests

/*******************************************************************************
 * endpoint tests
 */

__(function() {

  var objectServer1 = _o('./fixtures/ObjectServer1')

  var url = "http://localhost:8888/e1"
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
        url: "http://localhost:8888/e1",
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
        url: "http://localhost:8888/e1",
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
        url: "http://localhost:8888/e1",
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
        url: "http://localhost:8888/e1",
        method: "DELETE",
        parameters: {
//          n: 3,
  //        m: { x: [1, 2] }
        }
      },
      res: {
        statusCode: 200,
        body: {
          methodCalled: "delete",
          reqParams: {
  //          n: 3, // XXX not working
//            m: { x: [1, 2] }
          }
        }
      }
    },
  ]


  // Run the tests
  objectServer1.start()
  assertRequests(tests)
  objectServer1.stop()
})


            
