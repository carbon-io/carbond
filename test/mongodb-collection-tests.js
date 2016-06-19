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

  var service = _o('./fixtures/ServiceForMongoDBCollectionTests')

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
        headers: function(headers) { return headers.location === "/zipcodes/94114" },
        body: { _id: "94114", state: "CA" }
      }
    },

    // Test find
    {
      req: {
        url: url,
        method: "GET",
        parameters: {
          query: { _id: "94114" },
        },
      },
      res: {
        statusCode: 200,
        body: [{ _id: "94114", state: "CA" }]
      }
    },

/*
    // Insert another and test find again
    {
      req: {
        url: url,
        method: "POST",
        body: {
          _id: "94110",
          state: "CA"
        },
      },
      res: {
        statusCode: 201,
      }
    },
    {
      req: {
        url: url,
        method: "GET",
        parameters: {
          query: { _id: "94110" },
          sort: { '_id': 1 },
          limit: 1
        },
      },
      res: {
        statusCode: 200,
        body: [{ _id: "94110", state: "CA" }]
      }
    },
*/    

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
        statusCode: 201,
        body: { _id: "94114", state: "CA", }
      }
    },
    {
      req: {
        url: url + '/94114',
        method: "PUT",
        body: { _id: "94114", state: "CA", }
      },
      res: {
        statusCode: 200,
        body: undefined
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
    {
      req: {
        url: url + '/94119',
        method: "GET"
      },
      res: {
        statusCode: 404,
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
    service.start()

    // Clear the database
    clearDatabase(service.db)

    // Run the configuration tests
    configurationTests(service)

    // Run the HTTP tests
    assertRequests(tests)

    // Clear the database again
    clearDatabase(service.db)

    // Stop the server
    service.stop()

  } catch (e) {
    console.log(e.message)
    console.log(e.stack)
    service.stop()
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
  var oe = ce.endpoints[':_id']

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

  var defaultErrorSchema = {
    type: 'object',
    properties: {
      code: { type: 'integer' },
      description: { type: 'string' },
      message: { type: 'string' },
    },
    required: ['code', 'description', 'message']
  }

  var NotFoundResponse = {
    statusCode: 404,
    description: "Collection resource cannot be found by the supplied _id.",
    schema: defaultErrorSchema,
    headers: []
  }
  
  var BadRequestResponse = {
    statusCode: 400,
    description: "Request is malformed (i.e. invalid parameters).",
    schema: defaultErrorSchema,
    headers: []
  }
      
  var ForbiddenResponse = {
    statusCode: 403,
    description: "User is not authorized to run this operation.",
    schema: defaultErrorSchema,
    headers: []
  }

  var InternalServerErrorResponse = {
    statusCode: 500,
    description: "There was an unexpected internal error processing this request.",
    schema: defaultErrorSchema,
    headers: []
  }

  // insert
  assert.deepEqual(ce.getOperation('post').responses, 
                   [
                     {
                       statusCode: 201,
                       description: 
                       "Returns the object inserted, along with the URL of the newly inserted object " +
                         "in the Location header of the response.",
                       schema: schema,
                       headers: ['Location']
                     },
                     BadRequestResponse,
                     ForbiddenResponse,
                     InternalServerErrorResponse
                   ]),
  assert.deepEqual(ce.getOperation('post').parameters, { "body" : { description: "Object to insert",
                                                                    name: "body",
                                                                    schema: schema,
                                                                    location: "body", 
                                                                    required: true, 
                                                                    default: undefined }})
 
  // find
  assert.deepEqual(ce.getOperation('get').responses,
                   [
                     {
                       statusCode: 200,
                       description: 
                       "Returns an array of objects. Each object has an _id and possible additional properties.",
                       schema: {
                         type: 'array',
                         items: schema
                       },
                       headers: []
                     },
                     BadRequestResponse,
                     ForbiddenResponse,
                     InternalServerErrorResponse
                   ])
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

  // update
  assert.deepEqual(ce.getOperation('patch').responses, 
                   [
                     {
                       statusCode: 200,
                       description: "Returns an update result specifying the number of documents updated.",
                       schema:  { 
                         type: 'object',
                         properties: {
                           n: { type: 'integer' }
                         },
                         required: [ 'n' ],
                         additionalProperties: false
                       },
                       headers: []
                     },
                     BadRequestResponse,
                     ForbiddenResponse,
                     InternalServerErrorResponse
                   ]),
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

  // remove
  assert.deepEqual(ce.getOperation('delete').responses,
                   [
                     {
                       statusCode: 200,
                       description: "Returns a remove result specifying the number of documents removed.",
                       schema:  { 
                         type: 'object',
                         properties: {
                           n: { type: 'integer' } // Respond with the number of items updated
                         },
                         required: [ 'n' ],
                         additionalProperties: false
                       },
                       headers: []
                     },
                     BadRequestResponse,
                     ForbiddenResponse,
                     InternalServerErrorResponse
                   ]),
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

  // saveObject
 assert.deepEqual(oe.getOperation('put').responses,
                  [
                    {
                      statusCode: 201,
                      description: 
                       "Returns the object inserted, along with the URL of the newly inserted object " +
                        "in the Location header of the response.",
                      schema: schema,
                      headers: ['Location']
                    },
                    {
                      statusCode: 200,
                      description: "Returns no content.",
                      schema: { type: "Undefined" }, 
                      headers: []
                    },
                    BadRequestResponse,
                    ForbiddenResponse,
                    InternalServerErrorResponse
                  ])
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

  // findObject
  assert.deepEqual(oe.getOperation('get').responses,
                   [
                     {
                       statusCode: 200,
                       description: "Returns the object resource found at this URL specified by id.",
                       schema: schema,
                       headers: []
                     },
                     NotFoundResponse,
                     BadRequestResponse,
                     ForbiddenResponse,
                     InternalServerErrorResponse
                   ])
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

  // updateObject
  assert.deepEqual(oe.getOperation('patch').responses,
                   [
                     {
                       statusCode: 200,
                       description: "Returns no content.",
                       schema: { type: "Undefined" }, 
                       headers: []
                     },
                     NotFoundResponse,
                     BadRequestResponse,
                     ForbiddenResponse,
                     InternalServerErrorResponse
                   ])
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

  // removeObject
  assert.deepEqual(oe.getOperation('delete').responses,
                   [
                     {
                       statusCode: 200,
                       description: "Returns no content.",
                       schema: { type: "Undefined" }, 
                       headers: []
                     },
                     NotFoundResponse,
                     ForbiddenResponse,
                     InternalServerErrorResponse
                   ])
  assert.deepEqual(oe.getOperation('delete').parameters, {})

}
