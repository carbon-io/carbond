var o = require('atom').o(module)
var _o = require('bond')._o(module)
var __ = require('fiber').__.main(module)
var assert = require('assert')
var BSON = require('leafnode').BSON
var carbond = require('../')
var assertRequests = require('./test-helper').assertRequests

/*******************************************************************************
 * Basic Collection tests
 */

__(function() {

  var objectServer1 = _o('./fixtures/ObjectServerForCollectionTests1')

  // Meta tests (make sure endpoints look like they should)

  // HTTP tests of endpoints. These tests use low-level REST and are not 
  // testing CarbonClient's Collection interface. The idea here is that 
  // we want to test low-level / what a normal REST client would see.

  var url = "http://localhost:8888/basic"
  var tests = [
    // Test insert
    {
      req: {
        url: url,
        method: "POST",
        body: {
          msg: "hello"
        },
      },
      res: {
        statusCode: 201,
        headers: function(headers) { return headers.location === "/basic/000" },
        body: { 
          _id: "000",
          op: "insert",
          obj: {
            msg: "hello"
          }
        }
      }
    },

    // Test find
    {
      req: {
        url: url,
        method: "GET",
        parameters: {
          query: {
            x: "hello",
            y: "goodbye"
          }
        },
      },
      res: {
        statusCode: 200,
        body: [{
          _id: "000",
          op: "find",
          query: {
            x: "hello",
            y: "goodbye"
          }
        }]
      }
    },

    // Test update
    {
      req: {
        url: url,
        method: "PATCH",
        parameters: {
          query: { name: "bar" }
        },
        body: {
          name: "foo"
        }
      },
      res: {
        statusCode: 200,
        body: { n: 1 }
      }
    },

    // Test remove
    {
      req: {
        url: url,
        method: "DELETE",
        parameters: {
          query: { name: "bar" }
        }
      },
      res: {
        statusCode: 200,
        body: { n: 1 }
      }
    },

    // Test saveObject
    {
      req: {
        url: url + '/foo',
        method: "PUT",
        body: {
          _id: "foo",
          "name": "Foo",
        }
      },
      res: {
        statusCode: 200,
        body: {
          op: "saveObject",
          obj:  { _id: "foo", "name": "Foo" }
        }
      }
    },

    // Test findObject
    {
      req: {
        url: url + '/foo',
        method: "GET",
      },
      res: {
        statusCode: 200,
        body: {
          _id: "foo",
          op: "findObject",
        }
      }
    },

    // Test updateObject
    {
      req: {
        url: url + '/foo',
        method: "PATCH",
        body: {
          name: "Fooby"
        }
      },
      res: {
        statusCode: 200,
        body: undefined
      }
    },

    // Test removeObject
    {
      req: {
        url: url + '/foo',
        method: "DELETE"
      },
      res: {
        statusCode: 200,
        body: undefined
      }
    }
  ]

  try {
    // Start the server
    objectServer1.start()

    // Run the configuration tests
    configurationTests(objectServer1)

    // Run the HTTP tests
    assertRequests(tests)

    // Stop the server
    objectServer1.stop()

  } catch (e) {
    console.log(e.message)
    console.log(e.stack)
    objectServer1.stop()
  }
})

function configurationTests(service) {
  var ce = service.endpoints['basic']
  var oe = ce.endpoints[':id']

  var defaultObjectSchema = {
    type: 'object',
    properties: {
      _id: { type: 'string' }
    },
    required: ['_id']
  }

  // insert
  assert.deepStrictEqual(ce.getOperation('post').responseSchema, defaultObjectSchema)
  assert.deepEqual(ce.getOperation('post').parameters, { "body" : { description: "Object to insert",
                                                                    name: "body",
                                                                    schema: { type: "object" },
                                                                    location: "body", 
                                                                    required: true, 
                                                                    default: null }})
 
  // find
  assert.deepStrictEqual(ce.getOperation('get').responseSchema,
                         { 
                           type: 'array',
                           items: defaultObjectSchema
                         })
  assert.deepEqual(ce.getOperation('get').parameters,
                   { 
                     query: {
                       name: 'query',
                       description: "Query spec (JSON)",
                       location: 'query',
                       schema:  { type: 'object' },
                       required: false,
                       default: null
                     },
                     view: {
                       name: 'view',
                       description: "View",
                       schema: { type: 'string' },
                       location: 'query',
                       required: false,
                       default: undefined
                     }
                   })

  assert.deepStrictEqual(ce.getOperation('get').errorResponses, undefined)                         

  // update
  assert.deepStrictEqual(ce.getOperation('patch').responseSchema,
                         { 
                           type: 'object',
                           properties: {
                             n: { type: 'integer' } 
                           },
                           required: [ 'n' ],
                           additionalProperties: false
                         }), 
  assert.deepEqual(ce.getOperation('patch').parameters,
                   {
                     query: {
                       name: "query",
                       description: undefined,
                       schema: { type: 'object' },
                       location: 'query',
                       required: false,
                       default: null
                     },
                     body: { 
                       name: "body",
                       location: "body", 
                       description: "Update spec (JSON). Update operator (e.g {'$inc': {'n': 1}})",
                       schema: { type: "object" },
                       required: true,
                       default: null
                     }
                   })
  assert.deepStrictEqual(ce.getOperation('patch').errorResponses, undefined)
  
  // remove
  assert.deepStrictEqual(ce.getOperation('delete').responseSchema,
                         { 
                           type: 'object',
                           properties: {
                             n: { type: 'integer' } 
                           },
                           required: [ 'n' ],
                           additionalProperties: false
                         }), 
  assert.deepEqual(ce.getOperation('delete').parameters,
                   {
                     query: {
                       name: "query",
                       description: undefined,
                       schema: { type: 'object' },
                       location: 'query',
                       required: false,
                       default: null
                     }
                   })
  assert.deepStrictEqual(ce.getOperation('delete').errorResponses, undefined)

  // saveObject
  assert.deepStrictEqual(oe.getOperation('put').responseSchema, undefined)
  assert.deepEqual(oe.getOperation('put').parameters,
                   {
                     body: {
                       name: "body",
                       description: "Full object for update. Must contain _id field that has the same value is the id in the path.",
                       schema:  defaultObjectSchema,
                       location: 'body',
                       required: true,
                       default: null
                     }
                   })
  assert.deepStrictEqual(oe.getOperation('put').errorResponses, undefined)

  // findObject
  assert.deepStrictEqual(oe.getOperation('get').responseSchema, defaultObjectSchema)
  assert.deepEqual(oe.getOperation('get').parameters, {
    view: {
      name: 'view',
      description: "View",
      schema: { type: 'string' },
      location: 'query',
      required: false,
    default: undefined
    }
  })
  assert.deepStrictEqual(oe.getOperation('get').errorResponses, undefined)

  // updateObject
  assert.deepStrictEqual(oe.getOperation('patch').responseSchema, { type: "Undefined" })
  assert.deepEqual(oe.getOperation('patch').parameters,
                   {
                     body: {
                       name: "body",
                       description: "Update spec (JSON). Update operator (e.g {'$inc': {'n': 1}})", 
                       schema:  { type: "object" },
                       location: 'body',
                       required: true,
                       default: null
                     }
                   })
  assert.deepStrictEqual(oe.getOperation('patch').errorResponses, undefined)

  // removeObject
  assert.deepStrictEqual(oe.getOperation('delete').responseSchema, { type: "Undefined" })
  assert.deepEqual(oe.getOperation('delete').parameters, {})
  assert.deepStrictEqual(oe.getOperation('delete').errorResponses, undefined)
  

}
