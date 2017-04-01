var assert = require('assert')

var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var ejson = require('@carbon-io/carbon-core').ejson
var o  = require('@carbon-io/carbon-core').atom.o(module).main

var carbond = require('../../')

/**************************************************************************
 * MongoDBCollectionTests
 */
module.exports = o({

  /**********************************************************************
   * _type
   */
  _type: carbond.test.ServiceTest,

  /**********************************************************************
   * name
   */
  name: 'MongoDBCollectionTests',

  /**********************************************************************
   * service
   */
  service: _o('../fixtures/ServiceForMongoDBCollectionTests'),

  /**********************************************************************
   * setup
   */
  setup: function(ctx) {
    carbond.test.ServiceTest.prototype.setup.call(this, ctx)
    // XXX: move idHeader somewhere else so it's consistent, but keep it configurable
    ctx.global.idHeader = this.service.endpoints.zipcodes.idHeader
  }, 

  /**********************************************************************
   * setup
   */
  teardown: function(ctx) {
    ctx.global.idHeader = this.service.idHeader
    carbond.test.ServiceTest.prototype.teardown.call(this, ctx)
  }, 

  /**********************************************************************
   * doTest
   */
  doTest: function() {
    this.clearDatabase(this.service.db) // ensure clean database just in case
    this.testConfiguration()
    this.clearDatabase(this.service.db) // clean database (good hygiene)
  },
  
  /**********************************************************************
   * tests
   */
  tests: [
    // Test insert
    {
      reqSpec: {
        url: '/zipcodes',
        method: 'POST',
        body: {
          _id: '94114',
          state: 'CA'
        },
      },
      resSpec: {
        statusCode: 201,
        headers: function(headers, ctx) { 
          assert.equal(headers.location, '/zipcodes/94114')
          assert.equal(ejson.parse(headers[ctx.global.idHeader]), '94114')
        },
        body: undefined
      }
    },

    // Test find
    {
      reqSpec: {
        url: '/zipcodes',
        method: 'GET',
        parameters: {
          query: { _id: '94114' },
        },
      },
      resSpec: {
        statusCode: 200,
        body: [{ _id: '94114', state: 'CA' }]
      }
    },

    // Insert another and test find again
    {
      reqSpec: {
        url: '/zipcodes',
        method: 'POST',
        body: {
          _id: '94110',
          state: 'CA'
        },
      },
      resSpec: {
        statusCode: 201,
      }
    },

    {
      reqSpec: {
        url: '/zipcodes',
        method: 'GET',
        parameters: {
          query: { _id: '94110' },
          sort: { '_id': 1 },
          limit: 1
        },
      },
      resSpec: {
        statusCode: 200,
        body: [{ _id: '94110', state: 'CA' }]
      }
    },

    // Test update
    {
      reqSpec: {
        url: '/zipcodes',
        method: 'PATCH',
        parameters: { query: { _id: '94114' } },
        body: { state: 'NY' }
      },
      resSpec: {
        statusCode: 200,
        body: { n: 1 },
      }
    },

    // Test remove
    {
      reqSpec: {
        url: '/zipcodes',
        method: 'DELETE',
        parameters: { query: { state: 'NY' } },
      },
      resSpec: {
        statusCode: 200,
        body: { n: 1 }
      }
    },

    // Test saveObject
    {
      reqSpec: {
        url: '/zipcodes/94114',
        method: 'PUT',
        body: { _id: '94114', state: 'CA', }
      },
      resSpec: {
        statusCode: 201,
        headers: function(headers, ctx) {
          assert.equal(headers.location, '/zipcodes/94114')
          assert.equal(ejson.parse(headers[ctx.global.idHeader]), '94114')
        },
        body: undefined
      }
    },
    {
      reqSpec: {
        url: '/zipcodes/94114',
        method: 'PUT',
        body: { _id: '94114', state: 'CA', }
      },
      resSpec: {
        statusCode: 204,
        headers: function(headers, ctx) {
          assert(_.isUndefined(headers.location))
          assert(_.isUndefined(headers[ctx.global.idHeader]))
        },
        body: undefined
      }
    },

    // Test findObject
    {
      reqSpec: {
        url: '/zipcodes/94114',
        method: 'GET'
      },
      resSpec: {
        statusCode: 200,
        body: { _id: '94114', state: 'CA', }
      }
    },
    {
      reqSpec: {
        url: '/zipcodes/94119',
        method: 'GET'
      },
      resSpec: {
        statusCode: 404,
      }
    },

    // Test updateObject
    {
      reqSpec: {
        url: '/zipcodes/94114',
        method: 'PATCH',
        body: { state: 'NY' }
      },
      resSpec: {
        statusCode: 204,
        headers: function(headers, ctx) { 
          assert(_.isUndefined(headers.location))
          assert(_.isUndefined(headers[ctx.global.idHeader]))
        },
        body: undefined
      }
    },

    // Test removeObject
    {
      reqSpec: {
        url: '/zipcodes/94114',
        method: 'DELETE'
      },
      resSpec: {
        statusCode: 204,
        body: undefined
      }
    },

    // Test patch with ObjectId
    // https://github.com/carbon-io/carbond/issues/114
    {
      reqSpec: {
        url: '/bag-of-props',
        method: 'POST',
        body: {
          firstName: 'foo'
        }
      },
      resSpec: {
        statusCode: 201
      }
    },
    {
      reqSpec: function(context) {
        return {
          url: context.httpHistory.getRes(-1).headers.location,
          method: 'PATCH',
          body: {
            '$set': {
              lastName: 'bar'
            }
          }
        }
      },
      resSpec: function(response) {
        assert.equal(response.statusCode, 204)
        assert.equal(typeof body, 'undefined')
      }
    },
    {
      // validate subsequent updates using ObjectId
      reqSpec: function(context) {
        return {
          url: context.httpHistory.getRes(-2).headers.location,
          method: 'PATCH',
          body: {
            '$set': {
              lastName: 'baz'
            }
          }
        }
      },
      resSpec: function(response) {
        assert.equal(response.statusCode, 204)
        assert.equal(typeof body, 'undefined')
      }
    }
  ],

  /**********************************************************************
   * testConfiguration()
   */
  testConfiguration: function() {
    var ce = this.service.endpoints['zipcodes']
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
      description: 'Collection resource cannot be found by the supplied _id.',
      schema: defaultErrorSchema,
      headers: []
    }
  
    var BadRequestResponse = {
      statusCode: 400,
      description: 'Request is malformed (i.e. invalid parameters).',
      schema: defaultErrorSchema,
      headers: []
    }
      
    var ForbiddenResponse = {
      statusCode: 403,
      description: 'User is not authorized to run this operation.',
      schema: defaultErrorSchema,
      headers: []
    }

    var InternalServerErrorResponse = {
      statusCode: 500,
      description: 'There was an unexpected internal error processing this request.',
      schema: defaultErrorSchema,
      headers: []
    }

    // insert
    assert.deepEqual(ce.getOperation('post').responses, 
                     [
                       {
                         statusCode: 201,
                         description: 
                         'Returns the URL of the newly inserted object ' +
                           'in the Location header of the response.',
                         schema: { type: "Undefined" },
                         headers: ['Location', ce.idHeader]
                       },
                       BadRequestResponse,
                       ForbiddenResponse,
                       InternalServerErrorResponse
                     ]),
    assert.deepEqual(ce.getOperation('post').parameters, { 'body' : { description: 'Object to insert',
                                                                      name: 'body',
                                                                      schema: schema,
                                                                      location: 'body', 
                                                                      required: true, 
                                                                      default: undefined }})
 
    // find
    assert.deepEqual(ce.getOperation('get').responses,
                     [
                       {
                         statusCode: 200,
                         description: 
                         'Returns an array of objects. Each object has an _id and possible additional properties.',
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
                         description: 'Query spec (JSON)',
                         location: 'query',
                         schema:  querySchema,
                         required: false,
                         default: undefined
                       },
                       sort : {
                         name: 'sort',
                         description: 'Sort spec (JSON)',
                         location: 'query', 
                         schema: { type: 'object'}, 
                         required: false,
                         default: undefined
                       },
                       projection : {
                         name: 'projection',
                         description: 'Projection spec (JSON)',
                         location: 'query', 
                         schema: { type: 'object' }, 
                         required: false,
                         default: undefined
                       },
                       skip: {
                         name: 'skip',
                         description: 'Results to skip',
                         location: 'query', 
                         schema: { type: 'integer' },
                         required: false,
                         default: undefined
                       },
                       limit: {
                         name: 'limit',
                         description: 'Results to limit',
                         location: 'query', 
                         schema: { type: 'integer' },
                         required: false,
                       default: undefined
                       }
                     })
    
    // update
    assert.deepEqual(ce.getOperation('patch').responses, 
                     [
                       {
                         statusCode: 200,
                         description: 'Returns an update result specifying the number of documents updated.',
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
                         name: 'query',
                         description: undefined, // XXX should not be undefined right?
                         schema: querySchema,
                         location: 'query',
                         required: false,
                         default: undefined
                       },
                       body: { 
                         name: 'body',
                         location: 'body', 
                         description: "Update spec (JSON). Update operator (e.g {\"$inc\": {\"n\": 1}})",
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
                         description: 'Returns a remove result specifying the number of documents removed.',
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
                         name: 'query',
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
                         'Returns the URL of the newly inserted object ' +
                        'in the Location header of the response.',
                         schema: { type: 'Undefined' },
                         headers: ['Location', ce.idHeader]
                       },
                       {
                         statusCode: 204,
                         description: 'Returns no content.',
                         schema: { type: 'Undefined' }, 
                         headers: []
                       },
                       BadRequestResponse,
                       ForbiddenResponse,
                       InternalServerErrorResponse
                     ])
    assert.deepEqual(oe.getOperation('put').parameters,
                     {
                       body: {
                         name: 'body',
                         description: 'Full object for update. Must contain _id field that has the same value is the id in the path.',
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
                         description: 'Returns the object resource found at this URL specified by id.',
                         schema: schema,
                         headers: []
                       },
                       NotFoundResponse,
                       BadRequestResponse,
                       ForbiddenResponse,
                       InternalServerErrorResponse
                     ])
    assert.deepEqual(oe.getOperation('get').parameters, {})
    
    // updateObject
    assert.deepEqual(oe.getOperation('patch').responses,
                     [
                       {
                         statusCode: 204,
                         description: 'Returns no content.',
                         schema: { type: 'Undefined' }, 
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
                         name: 'body',
                         description: "Update spec (JSON). Update operator (e.g {\"$inc\": {\"n\": 1}})", 
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
                         statusCode: 204,
                         description: 'Returns no content.',
                         schema: { type: 'Undefined' },
                         headers: []
                       },
                       NotFoundResponse,
                       ForbiddenResponse,
                       InternalServerErrorResponse
                     ])
    assert.deepEqual(oe.getOperation('delete').parameters, {})    
  },


  /**********************************************************************
   * clearDatabase
   */
  clearDatabase: function(db) {
    var collections = ['zipcodes', 'bag-of-props']
    collections.forEach(function(collection) {
      var c = db.getCollection(collection)
      try {
        c.drop()
      } catch (e) {
        // ignore
      }
    })
  }
  
})
