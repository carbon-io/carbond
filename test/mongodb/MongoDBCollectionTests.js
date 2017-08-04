var assert = require('assert')

var _ = require('lodash')

var SkipTestError = require('@carbon-io/carbon-core').testtube.errors.SkipTestError
var __ = require('@carbon-io/fibers').__(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)
var ejson = require('@carbon-io/carbon-core').ejson
var o  = require('@carbon-io/carbon-core').atom.o(module)
var testtube = require('@carbon-io/carbon-core').testtube

var carbond = require('../../')

/***************************************************************************************************
 * MongoDBCollectionTests
 */
__(function() {
  module.exports = o.main({

    /*****************************************************************************
     * _type
     */
    _type: carbond.test.ServiceTest,

    /*****************************************************************************
     * name
     */
    name: 'MongoDBCollectionTests',

    /*****************************************************************************
     * service
     */
    service: _o('../fixtures/ServiceForMongoDBCollectionTests'),

    /*****************************************************************************
     * setup
     */
    setup: function(ctx) {
      carbond.test.ServiceTest.prototype.setup.call(this, ctx)
      this.idHeader = ctx.global.idHeader
      ctx.global.idHeader = this.service.endpoints.zipcodes.idHeader
      this.initializeDatabase(this.service.db)
    },

    /*****************************************************************************
     * teardown
     */
    teardown: function(ctx) {
      this.clearDatabase(this.service.db)
      ctx.global.idHeader = this.idHeader
      carbond.test.ServiceTest.prototype.teardown.call(this, ctx)
    },

    /*****************************************************************************
     * tests
     */
    tests: [

      // Test find
      {
        name: 'findWithExplicitQueryTest',
        reqSpec: {
          url: '/zipcodes',
          method: 'GET',
          parameters: {
            query: {_id: '94577'},
          },
        },
        resSpec: {
          statusCode: 200,
          body: [{_id: '94577', state: 'CA'}]
        }
      },

      // Test find with paging and implicit query
      {
        name: 'findWithPagingAndImplicitQueryTest',
        reqSpec: {
          url: '/zipcodes',
          method: 'GET'
        },
        resSpec: {
          statusCode: 200,
          body: function(body) {
            assert(_.isArray(body))
            assert.equal(
              body.length,
              this.parent.service.endpoints.zipcodes.findConfig.pageSize)
          }
        }
      },

      // Test find maxPageSize enforcement
      {
        name: 'findMaxPageSizeTest',
        reqSpec: function() {
          return {
            url: '/zipcodes',
            method: 'GET',
            parameters: {
              limit: this.parent.service.endpoints.zipcodes.findConfig.maxPageSize + 5
            }
          }
        },
        resSpec: {
          statusCode: 200,
          body: function(body) {
            assert(_.isArray(body))
            assert.equal(
              body.length,
              this.parent.service.endpoints.zipcodes.findConfig.maxPageSize)
          }
        }
      },

      // Test find with paging and implicit query
      {
        name: 'findMaxPageSizeTest',
        reqSpec: function() {
          return {
            url: '/zipcodes',
            method: 'GET',
            parameters: {
              limit: this.parent.service.endpoints.zipcodes.findConfig.maxPageSize + 5
            }
          }
        },
        resSpec: {
          statusCode: 200,
          headers: function(headers) {
            assert('link' in headers)
            assert.equal(
              headers.link,
              '<http://localhost:8888/zipcodes?page=1&limit=15>; rel="next"')
          },
          body: function(body) {
            assert(_.isArray(body))
            assert.equal(
              body.length,
              this.parent.service.endpoints.zipcodes.findConfig.maxPageSize)
          }
        }
      },

      // Test findObject
      {
        reqSpec: {
          url: '/zipcodes/94577',
          method: 'GET'
        },
        resSpec: {
          statusCode: 200,
          body: { _id: '94577', state: 'CA', }
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

      // Test insert
      // {
      //   reqSpec: {
      //     url: '/zipcodes',
      //     method: 'POST',
      //     body: {
      //       _id: '94114',
      //       state: 'CA'
      //     },
      //   },
      //   resSpec: {
      //     statusCode: 201,
      //     headers: function(headers, ctx) {
      //       mssert.equal(headers.location, '/zipcodes/94114')
      //       assert.equal(ejson.parse(headers[ctx.global.idHeader]), '94114')
      //     },
      //     body: undefined
      //   }
      // },
      //
      // Insert another and test find again
      // {
      //   reqSpec: {
      //     url: '/zipcodes',
      //     method: 'POST',
      //     body: {
      //       _id: '94110',
      //       state: 'CA'
      //     },
      //   },
      //   resSpec: {
      //     statusCode: 201,
      //   }
      // },

      // {
      //   reqSpec: {
      //     url: '/zipcodes',
      //     method: 'GET',
      //     parameters: {
      //       query: { _id: '94110' },
      //       sort: { '_id': 1 },
      //       limit: 1
      //     },
      //   },
      //   resSpec: {
      //     statusCode: 200,
      //     body: [{ _id: '94110', state: 'CA' }]
      //   }
      // },

      // // Test for carbond#172
      // {
      //   name: 'carbon-io/carbond#172',
      //   description: 'Test that carbon-io/carbond#172 is fixed',
      //   reqSpec: {
      //     url: '/zipcodes/',
      //     method: 'POST',
      //     body: {
      //       _id: '95125',
      //       state: 'CA'
      //     },
      //   },
      //   resSpec: {
      //     headers: function(headers, ctx) {
      //       assert.equal(headers.location, '/zipcodes/95125')
      //     },
      //     statusCode: 201,
      //   }
      // },
      // {
      //   name: 'carbon-io/carbond#174',
      //   description: 'Test that carbon-io/carbond#174 is fixed',
      //   setup: function() {
      //     throw new SkipTestError('reminder to fix carbon-io/carbond#174')
      //   },
      //   reqSpec: {
      //     url: '/zipcodes',
      //     method: 'POST',
      //     body: {
      //       _id: '945/77',
      //       state: 'CA'
      //     },
      //   },
      //   resSpec: {
      //     statusCode: 400
      //   }
      // },

      // // Test update
      // {
      //   reqSpec: {
      //     url: '/zipcodes',
      //     method: 'PATCH',
      //     parameters: { query: { _id: '94114' } },
      //     body: { state: 'NY' }
      //   },
      //   resSpec: {
      //     statusCode: 200,
      //     body: { n: 1 },
      //   }
      // },

      // // Test remove
      // {
      //   reqSpec: {
      //     url: '/zipcodes',
      //     method: 'DELETE',
      //     parameters: { query: { state: 'NY' } },
      //   },
      //   resSpec: {
      //     statusCode: 200,
      //     body: { n: 1 }
      //   }
      // },

      // // Test saveObject
      // {
      //   reqSpec: {
      //     url: '/zipcodes/94114',
      //     method: 'PUT',
      //     body: { _id: '94114', state: 'CA', }
      //   },
      //   resSpec: {
      //     statusCode: 201,
      //     headers: function(headers, ctx) {
      //       assert.equal(headers.location, '/zipcodes/94114')
      //       assert.equal(ejson.parse(headers[ctx.global.idHeader]), '94114')
      //     },
      //     body: undefined
      //   }
      // },
      // {
      //   reqSpec: {
      //     url: '/zipcodes/94114',
      //     method: 'PUT',
      //     body: { _id: '94114', state: 'CA', }
      //   },
      //   resSpec: {
      //     statusCode: 204,
      //     headers: function(headers, ctx) {
      //       assert(_.isUndefined(headers.location))
      //       assert(_.isUndefined(headers[ctx.global.idHeader]))
      //     },
      //     body: undefined
      //   }
      // },

      // Test updateObject
      // {
      //   reqSpec: {
      //     url: '/zipcodes/94114',
      //     method: 'PATCH',
      //     body: { state: 'NY' }
      //   },
      //   resSpec: {
      //     statusCode: 204,
      //     headers: function(headers, ctx) {
      //       assert(_.isUndefined(headers.location))
      //       assert(_.isUndefined(headers[ctx.global.idHeader]))
      //     },
      //     body: undefined
      //   }
      // },

      // // Test removeObject
      // {
      //   reqSpec: {
      //     url: '/zipcodes/94114',
      //     method: 'DELETE'
      //   },
      //   resSpec: {
      //     statusCode: 204,
      //     body: undefined
      //   }
      // },

      // // Test patch with ObjectId
      // // https://github.com/carbon-io/carbond/issues/114
      // {
      //   reqSpec: {
      //     url: '/bag-of-props',
      //     method: 'POST',
      //     body: {
      //       firstName: 'foo'
      //     }
      //   },
      //   resSpec: {
      //     statusCode: 201
      //   }
      // },
      // {
      //   reqSpec: function(context) {
      //     return {
      //       url: context.httpHistory.getRes(-1).headers.location,
      //       method: 'PATCH',
      //       body: {
      //         '$set': {
      //           lastName: 'bar'
      //         }
      //       }
      //     }
      //   },
      //   resSpec: function(response) {
      //     assert.equal(response.statusCode, 204)
      //     assert.equal(typeof body, 'undefined')
      //   }
      // },
      // {
      //   // validate subsequent updates using ObjectId
      //   reqSpec: function(context) {
      //     return {
      //       url: context.httpHistory.getRes(-2).headers.location,
      //       method: 'PATCH',
      //       body: {
      //         '$set': {
      //           lastName: 'baz'
      //         }
      //       }
      //     }
      //   },
      //   resSpec: function(response) {
      //     assert.equal(response.statusCode, 204)
      //     assert.equal(typeof body, 'undefined')
      //   }
      // }

      o({
        _type: testtube.Test,
        name: 'ConfigurationTests',
        setup: function() {
          this.ce = this.parent.service.endpoints['zipcodes']
          this.oe = this.ce.endpoints[':_id']

          this.schema = {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              state: { type: 'string' }
            },
            additionalProperties: false,
            required: ['_id', 'state']
          }

          this.querySchema =  {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              state: { type: 'string' }
            },
            additionalProperties: false
          }

          this.updateSchema = {
            type: 'object',
            properties: {
              state: { type: 'string' }
            },
            required: ['state'],
            additionalProperties: false
          }

          this.defaultErrorSchema = {
            type: 'object',
            properties: {
              code: { type: 'integer' },
              description: { type: 'string' },
              message: { type: 'string' },
            },
            required: ['code', 'description', 'message']
          }

          this.NotFoundResponse = {
            statusCode: 404,
            description: 'Collection resource cannot be found by the supplied _id.',
            schema: this.defaultErrorSchema,
            headers: []
          }

          this.BadRequestResponse = {
            statusCode: 400,
            description: 'Request is malformed (i.e. invalid parameters).',
            schema: this.defaultErrorSchema,
            headers: []
          }

          this.ForbiddenResponse = {
            statusCode: 403,
            description: 'User is not authorized to run this operation.',
            schema: this.defaultErrorSchema,
            headers: []
          }

          this.InternalServerErrorResponse = {
            statusCode: 500,
            description: 'There was an unexpected internal error processing this request.',
            schema: this.defaultErrorSchema,
            headers: []
          }
        },
        teardown: function() {
        },
        tests: [
          o({
            _type: testtube.Test,
            name: 'InsertAndInsertObjectConfigTest',
            doTest: function() {
              // insert
              assert.deepEqual(
                this.parent.ce.getOperation('post').responses, [
                  {
                    statusCode: 201,
                    description: 'The object(s) were successfully inserted. The Location ' +
                                 'header will contain a URL pointing to the newly created ' +
                                 'resources and the body will contain the list of inserted ' +
                                 'object(s) if configured to do so.',
                    schema: {
                      oneOf: [
                        {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              _id: {type: 'string'},
                              state: {type: 'string'}
                            },
                            additionalProperties: false,
                            required: ['_id', 'state']
                          }
                        }, {
                          type: 'object',
                          properties: {
                            _id: {type: 'string'},
                            state: {type: 'string'}
                          },
                          additionalProperties: false,
                          required: ['_id', 'state']
                        }
                      ]
                    },
                    headers: ['Location', this.parent.ce.idHeader]
                  },
                  this.parent.BadRequestResponse,
                  this.parent.ForbiddenResponse,
                  this.parent.InternalServerErrorResponse])
              assert.deepEqual(
                this.parent.ce.getOperation('post').parameters, {
                  'body' : {
                    description: 'Object(s) to insert',
                    name: 'body',
                    schema: {
                      oneOf: [
                        {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              _id: {type: 'string'},
                              state: {type: 'string'}
                            },
                            additionalProperties: false,
                            required: ['state']
                          }
                        }, {
                          type: 'object',
                          properties: {
                            _id: {type: 'string'},
                            state: {type: 'string'}
                          },
                          additionalProperties: false,
                          required: ['state']
                        }
                      ]
                    },
                    location: 'body',
                    required: true,
                    default: undefined
                  }})
            }
          }),
          o({
            _type: testtube.Test,
            name: 'FindConfigTest',
            doTest: function() {
              // find
              assert.deepEqual(
                this.parent.ce.getOperation('get').responses, [
                  {
                    statusCode: 200,
                    description:
                    'Returns an array of objects. Each object has an _id and ' +
                    'possible additional properties.',
                    schema: {
                      type: 'array',
                      items: this.parent.schema
                    },
                    headers: []
                  },
                  this.parent.BadRequestResponse,
                  this.parent.ForbiddenResponse,
                  this.parent.InternalServerErrorResponse])
              assert.deepEqual(
                this.parent.ce.getOperation('get').parameters, {
                  _id: {
                    name: '_id',
                    description: 'Id query parameter',
                    location: 'query',
                    schema: {
                      type: 'string'
                    },
                    required: false,
                    default: undefined
                  },
                  page: {
                    name: 'page',
                    description: 'The page to navigate to (skip/limit are derived from this)',
                    location: 'query',
                    schema: {
                      type: 'number',
                      multipleOf: 1,
                      minimum: 0
                    },
                    required: false,
                    default: 0
                  },
                  skip: {
                    name: 'skip',
                    description: 'The number of objects to skip when iterating pages',
                    location: 'query',
                    schema: {
                      type: 'number',
                      multipleOf: 1,
                      minimum: 0
                    },
                    required: false,
                    default: null
                  },
                  limit: {
                    name: 'limit',
                    description: 'The maximum number of objects for a given page',
                    location: 'query',
                    schema: {
                      type: 'number',
                      multipleOf: 1,
                      minimum: 0
                    },
                    required: false,
                    default: null
                  },
                  query: {
                    name: 'query',
                    description: 'Query spec (JSON)',
                    location: 'query',
                    schema: {
                      type: 'object',
                      properties: {
                        _id: {
                          type: 'string'
                        },
                        state: {
                          type: 'string'
                        }
                      },
                      additionalProperties: false
                    },
                    required: false,
                    default: {}
                  },
                  sort: {
                    name: 'sort',
                    description: 'Sort spec (JSON)',
                    location: 'query',
                    schema: {
                      type: 'object'
                    },
                    required: false,
                    default: null
                  },
                  projection: {
                    name: 'projection',
                    description: 'Projection spec (JSON)',
                    location: 'query',
                    schema: {
                      type: 'object'
                    },
                    required: false,
                    default: null
                  }
                })
            }
          }),
          o({
            _type: testtube.Test,
            name: 'SaveConfigTest',
            doTest: function() {
            }
          }),
          o({
            _type: testtube.Test,
            name: 'UpdateConfigTest',
            doTest: function() {
              // update
              // assert.deepEqual(ce.getOperation('patch').responses,
              //                  [
              //                    {
              //                      statusCode: 200,
              //                      description: 'Returns an update result specifying the number of documents updated.',
              //                      schema:  {
              //                        type: 'object',
              //                        properties: {
              //                          n: { type: 'integer' }
              //                        },
              //                        required: [ 'n' ],
              //                        additionalProperties: false
              //                      },
              //                      headers: []
              //                    },
              //                    BadRequestResponse,
              //                    ForbiddenResponse,
              //                    InternalServerErrorResponse
              //                  ]),
              // assert.deepEqual(ce.getOperation('patch').parameters,
              //                  {
              //                    query: {
              //                      name: 'query',
              //                      description: undefined, // XXX should not be undefined right?
              //                      schema: querySchema,
              //                      location: 'query',
              //                      required: false,
              //                      default: undefined
              //                    },
              //                    body: {
              //                      name: 'body',
              //                      location: 'body',
              //                      description: "Update spec (JSON). Update operator (e.g {\"$inc\": {\"n\": 1}})",
              //                      schema: updateSchema,
              //                      required: true,
              //                      default: undefined
              //                    }
              //                  })
            }
          }),
          o({
            _type: testtube.Test,
            name: 'RemoveConfigTest',
            doTest: function() {
              // remove
              // assert.deepEqual(ce.getOperation('delete').responses,
              //                  [
              //                    {
              //                      statusCode: 200,
              //                      description: 'Returns a remove result specifying the number of documents removed.',
              //                      schema:  {
              //                        type: 'object',
              //                        properties: {
              //                          n: { type: 'integer' } // Respond with the number of items updated
              //                        },
              //                        required: [ 'n' ],
              //                        additionalProperties: false
              //                      },
              //                      headers: []
              //                    },
              //                    BadRequestResponse,
              //                    ForbiddenResponse,
              //                    InternalServerErrorResponse
              //                  ]),
              // assert.deepEqual(ce.getOperation('delete').parameters,
              //                  {
              //                    query: {
              //                      name: 'query',
              //                      description: undefined,
              //                      schema: querySchema,
              //                      location: 'query',
              //                      required: false,
              //                      default: undefined
              //                    }
              //                  })
            }
          }),
          o({
            _type: testtube.Test,
            name: 'FindObjectConfigTest',
            doTest: function() {
              // findObject
              assert.deepEqual(
                this.parent.oe.getOperation('get').responses, [
                  {
                    statusCode: 200,
                    description: 'Returns the object resource found at this URL specified by id.',
                    schema: this.parent.schema,
                    headers: []
                  },
                  this.parent.NotFoundResponse,
                  this.parent.BadRequestResponse,
                  this.parent.ForbiddenResponse,
                  this.parent.InternalServerErrorResponse])
              assert.deepEqual(
                this.parent.oe.getOperation('get').parameters, {
                  _id: {
                    name: '_id',
                    description: 'Object _id',
                    location: 'path',
                    schema: {type: 'string'},
                    required: true,
                    default: null,
                    resolver: null
                  }})
            }
          }),
          o({
            _type: testtube.Test,
            name: 'SaveObjectConfigTest',
            doTest: function() {
              // saveObject
              // assert.deepEqual(oe.getOperation('put').responses,
              //                  [
              //                    {
              //                      statusCode: 201,
              //                      description:
              //                      'Returns the URL of the newly inserted object ' +
              //                     'in the Location header of the response.',
              //                      schema: { type: 'undefined' },
              //                      headers: ['Location', ce.idHeader]
              //                    },
              //                    {
              //                      statusCode: 204,
              //                      description: 'Returns no content.',
              //                      schema: { type: 'undefined' },
              //                      headers: []
              //                    },
              //                    BadRequestResponse,
              //                    ForbiddenResponse,
              //                    InternalServerErrorResponse
              //                  ])
              // assert.deepEqual(oe.getOperation('put').parameters,
              //                  {
              //                    body: {
              //                      name: 'body',
              //                      description: 'Full object for update. Must contain _id field that has the same value as the _id in the path.',
              //                      schema:  schema,
              //                      location: 'body',
              //                      required: true,
              //                      default: undefined
              //                    },
              //                    _id: {
              //                      name: '_id',
              //                      description: 'Object _id',
              //                      location: 'path',
              //                      schema: { type: 'string' },
              //                      required: true,
              //                      default: null,
              //                      resolver: null
              //                    }
              //                  })
            }
          }),
          o({
            _type: testtube.Test,
            name: 'UpdateObjectConfigTest',
            doTest: function() {
              // updateObject
              // assert.deepEqual(oe.getOperation('patch').responses,
              //                  [
              //                    {
              //                      statusCode: 204,
              //                      description: 'Returns no content.',
              //                      schema: { type: 'undefined' },
              //                      headers: []
              //                    },
              //                    NotFoundResponse,
              //                    BadRequestResponse,
              //                    ForbiddenResponse,
              //                    InternalServerErrorResponse
              //                  ])
              // assert.deepEqual(oe.getOperation('patch').parameters,
              //                  {
              //                    body: {
              //                      name: 'body',
              //                      description: "Update spec (JSON). Update operator (e.g {\"$inc\": {\"n\": 1}})",
              //                      schema:  updateSchema,
              //                      location: 'body',
              //                      required: true,
              //                      default: undefined
              //                    },
              //                    _id: {
              //                      name: '_id',
              //                      description: 'Object _id',
              //                      location: 'path',
              //                      schema: { type: 'string' },
              //                      required: true,
              //                      default: null,
              //                      resolver: null
              //                    }
              //                  })
            }
          }),
          o({
            _type: testtube.Test,
            name: 'RemoveObjectConfigTest',
            doTest: function() {
              // removeObject
              // assert.deepEqual(oe.getOperation('delete').responses,
              //                  [
              //                    {
              //                      statusCode: 204,
              //                      description: 'Returns no content.',
              //                      schema: { type: 'undefined' },
              //                      headers: []
              //                    },
              //                    NotFoundResponse,
              //                    ForbiddenResponse,
              //                    InternalServerErrorResponse
              //                  ])
              // assert.deepEqual(oe.getOperation('delete').parameters,
              //                  {
              //                    _id: {
              //                      name: '_id',
              //                      description: 'Object _id',
              //                      location: 'path',
              //                      schema: { type: 'string' },
              //                      required: true,
              //                      default: null,
              //                      resolver: null
              //                    }
              //                  })
            }
          }),
        ]
      })
    ],

    // XXX: move to fixtures

    zipcodes: [
      {
        _id: '00501',
        state: 'NY'
      },
      {
        _id: '00544',
        state: 'NY'
      },
      {
        _id: '00601',
        state: 'PR'
      },
      {
        _id: '00602',
        state: 'PR'
      },
      {
        _id: '00603',
        state: 'PR'
      },
      {
        _id: '00604',
        state: 'PR'
      },
      {
        _id: '00605',
        state: 'PR'
      },
      {
        _id: '00606',
        state: 'PR'
      },
      {
        _id: '00610',
        state: 'PR'
      },
      {
        _id: '00611',
        state: 'PR'
      },
      {
        _id: '00612',
        state: 'PR'
      },
      {
        _id: '00613',
        state: 'PR'
      },
      {
        _id: '00614',
        state: 'PR'
      },
      {
        _id: '00616',
        state: 'PR'
      },
      {
        _id: '00617',
        state: 'PR'
      },
      {
        _id: '00622',
        state: 'PR'
      },
      {
        _id: '00623',
        state: 'PR'
      },
      {
        _id: '00624',
        state: 'PR'
      },
      {
        _id: '00627',
        state: 'PR'
      },
      {
        _id: '00631',
        state: 'PR'
      },
      {
        _id: '94577',
        state: 'CA'
      }
    ],

    /*****************************************************************************
     * initializeDatabase
     */
    initializeDatabase: function(db) {
      this.clearDatabase(db)
      this.zipcodes.forEach(function(zipcode) {
        var c = db.getCollection('zipcodes')
        try {
          c.insert(zipcode)
        } catch (e) {
          // ignore
        }
      })
    },

    /*****************************************************************************
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
})
