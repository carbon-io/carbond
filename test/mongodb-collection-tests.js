var o = require('atom').o(module)
var _o = require('bond')._o(module)
var __ = require('fiber').__.main(module)
var assert = require('assert')
var BSON = require('leafnode').BSON
var carbond = require('../')
var assertRequests = require('./test-helper').assertRequests

/*******************************************************************************
 * MongoDBCollection tests
 */

__(function() {

  var objectServer = _o('./fixtures/ObjectServerForMongoDBCollectionTests')

  // Meta tests (make sure endpoints look like they should)

  // HTTP tests of endpoints. These tests use low-level REST and are not 
  // testing CarbonClient's Collection interface. The idea here is that 
  // we want to test low-level / what a normal REST client would see.

  var url = "http://localhost:8888/zipcodes"
  var tests = [
    // Test insert
    {
      req: {
        url: url,
        method: "POST",
        body: {
          _id: "94114",
          state: "CA"
        },
      },
      res: {
        statusCode: 201,
        body: { _id: "94114", state: "CA" }
      }
    },

    // Test find
    {
      req: {
        url: url,
        method: "GET",
        parameters: {
          query: {
            _id: "94114"
          }
        },
      },
      res: {
        statusCode: 200,
        body: [{ _id: "94114", state: "CA" }]
      }
    },

    // Test update
    {
      req: {
        url: url,
        method: "PATCH",
        parameters: { query: { _id: "94114" } },
        body: { state: "NY" }
      },
      res: {
        statusCode: 200,
        body: { n: 1 },
      }
    },

    // Test remove
    {
      req: {
        url: url,
        method: "DELETE",
        parameters: { query: { state: "NY" } },
      },
      res: {
        statusCode: 200,
        body: { n: 1 }
      }
    },

    // Test saveObject
    {
      req: {
        url: url + '/94114',
        method: "PUT",
        body: { _id: "94114", state: "CA", }
      },
      res: {
        statusCode: 200,
        body: { nUpdated: 0, nUpserted: 1 }
      }
    },

    // Test findObject
    {
      req: {
        url: url + '/94114',
        method: "GET"
      },
      res: {
        statusCode: 200,
        body: { _id: "94114", state: "CA", }
      }
    },

    // Test updateObject
    {
      req: {
        url: url + '/94114',
        method: "PATCH",
        body: { state: "NY" }
      },
      res: {
        statusCode: 200,
        body: undefined
      }
    },

    // Test removeObject
    {
      req: {
        url: url + '/94114',
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
    objectServer.start()

    // Clear the database
    clearDatabase(objectServer.db)

    // Run the configuration tests
    configurationTests(objectServer)

    // Run the HTTP tests
    assertRequests(tests)

    // Clear the database again
    clearDatabase(objectServer.db)

    // Stop the server
    objectServer.stop()

  } catch (e) {
    console.log(e.message)
    console.log(e.stack)
    objectServer.stop()
  }
})

function clearDatabase(db) {
  var c = db.getCollection("zipcodes")
  try {
    c.drop()
  } catch (e) {
    // ignore
  }
}

function configurationTests(service) {
  var ce = service.endpoints['zipcodes']
  var oe = ce.endpoints[':id']

  var schema = {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      state: { type: 'string' }
    },
    additionalProperties: false,
    required: ['_id', 'state']
  }

  var querySchema =  {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      state: { type: 'string' }
    },
    additionalProperties: false
  }

  var updateSchema = {
    type: 'object',
    properties: {
      state: { type: 'string' }
    },
    required: ['state'],
    additionalProperties: false
  }

  // insert
  assert.deepStrictEqual(ce.getOperation('post').responseSchema, schema)
  assert.deepEqual(ce.getOperation('post').parameters, { "body" : { description: "Object to insert",
                                                                    name: "body",
                                                                    schema: schema,
                                                                    location: "body", 
                                                                    required: true, 
                                                                    default: undefined }})
 
  // find
  assert.deepStrictEqual(ce.getOperation('get').responseSchema,
                         { 
                           type: 'array',
                           items: schema
                         })
  assert.deepEqual(ce.getOperation('get').parameters,
                   { 
                     query: {
                       name: 'query',
                       description: "Query spec (JSON)",
                       location: 'query',
                       schema:  querySchema,
                       required: false,
                       default: undefined
                     },
                     view: {
                       name: 'view',
                       description: "View",
                       schema: { type: 'string' },
                       location: 'query',
                       required: false,
                       default: undefined
                     },
                     sort : {
                       name: 'sort',
                       description: "Sort spec (JSON)",
                       location: "query", 
                       schema: { type: "object"}, 
                       required: false,
                       default: undefined
                     },
                     fields : {
                       name: 'fields',
                       description: "Fields spec (JSON)",
                       location: "query", 
                       schema: { type: "object" }, 
                       required: false,
                       default: undefined
                     },
                     skip: {
                       name: 'skip',
                       description: "Results to skip",
                       location: "query", 
                       schema: { type: "integer" },
                       required: false,
                       default: undefined
                     },
                     limit: {
                       name: 'limit',
                       description: "Results to limit",
                       location: "query", 
                       schema: { type: "integer" },
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
                       description: undefined, // XXX should not be undefined right?
                       schema: querySchema,
                       location: 'query',
                       required: false,
                       default: undefined
                     },
                     body: { 
                       name: "body",
                       location: "body", 
                       description: "Update spec (JSON). Update operator (e.g {'$inc': {'n': 1}})",
                       schema: updateSchema,
                       required: true,
                       default: undefined
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
                       schema: querySchema,
                       location: 'query',
                       required: false,
                       default: undefined
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
                       schema:  schema,
                       location: 'body',
                       required: true,
                       default: undefined
                     }
                   })
  assert.deepStrictEqual(oe.getOperation('put').errorResponses, undefined)

  // findObject
  assert.deepStrictEqual(oe.getOperation('get').responseSchema, schema)
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
                       schema:  updateSchema,
                       location: 'body',
                       required: true,
                       default: undefined
                     }
                   })
  assert.deepStrictEqual(oe.getOperation('patch').errorResponses, undefined)

  // removeObject
  assert.deepStrictEqual(oe.getOperation('delete').responseSchema, { type: "Undefined" })
  assert.deepEqual(oe.getOperation('delete').parameters, {})
  assert.deepStrictEqual(oe.getOperation('delete').errorResponses, undefined)

}
