var assert = require('assert')

var _ = require('lodash')
var sinon = require('sinon')

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
      {
        name: 'headWithExplicitQueryTest',
        reqSpec: {
          url: '/zipcodes',
          method: 'HEAD',
          parameters: {
            query: {_id: '94577'},
          },
        },
        resSpec: {
          statusCode: 200,
          body: null
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
      {
        name: 'headWithPagingAndImplicitQueryTest',
        reqSpec: {
          url: '/zipcodes',
          method: 'HEAD'
        },
        resSpec: {
          statusCode: 200,
          body: null
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
      {
        name: 'headMaxPageSizeTest',
        reqSpec: function() {
          return {
            url: '/zipcodes',
            method: 'HEAD',
            parameters: {
              limit: this.parent.service.endpoints.zipcodes.findConfig.maxPageSize + 5
            }
          }
        },
        resSpec: {
          statusCode: 200,
          body: null
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
      {
        name: 'headMaxPageSizeTest',
        reqSpec: function() {
          return {
            url: '/zipcodes',
            method: 'HEAD',
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
          body: null
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
          // body needs to be a list
          statusCode: 400
        }
      },
      {
        reqSpec: {
          url: '/zipcodes',
          method: 'POST',
          body: [{
            _id: '94114',
            state: 'CA'
          }],
        },
        resSpec: {
          // _id is not allowed on insert, save must be used in this case
          statusCode: 400
        }
      },
      {
        setup: function() {
          // overriding generateId to get what we want here... save should be used
          // instead
          this.generateIdStub =
            sinon.stub(this.parent.service.endpoints.zipcodes.idGenerator,
                       'generateId').callsFake(function() {
                          return '94114'
                        })
        },
        teardown: function() {
          try {
            var collection = this.parent.service.endpoints.zipcodes
            var dbObject =
              collection._db.getCollection(collection.collection).findOne({
                _id: '94114'
              })
            assert(!_.isNil(dbObject))
            assert.deepEqual(dbObject, {
              _id: '94114',
              state: 'CA'
            })
          } finally {
            this.generateIdStub.restore()
          }
        },
        reqSpec: {
          url: '/zipcodes',
          method: 'POST',
          body: [{
            state: 'CA'
          }],
        },
        resSpec: {
          statusCode: 201,
          headers: function(headers, ctx) {
            assert.equal(headers.location, '/zipcodes?_id=94114')
            assert.equal(ejson.parse(headers[ctx.global.idHeader]), ['94114'])
          },
          body: [{
            _id: '94114',
            state: 'CA'
          }]
        }
      },

      // Test GET of previously inserted object

      {
        reqSpec: {
          url: '/zipcodes',
          method: 'GET',
          parameters: {
            query: {_id: '94114'},
            sort: {'_id': 1},
            limit: 1
          },
        },
        resSpec: {
          statusCode: 200,
          body: [{_id: '94114', state: 'CA'}]
        }
      },

      // Test for carbond#172
      {
        name: 'carbon-io/carbond#172',
        description: 'Test that carbon-io/carbond#172 is fixed',
        reqSpec: {
          url: '/zipcodes/95125',
          method: 'PUT',
          body: {
            _id: '95125',
            state: 'CA'
          },
        },
        resSpec: {
          statusCode: 201,
          headers: function(headers, ctx) {
            assert.equal(headers.location, '/zipcodes/95125')
          }
        }
      },
      {
        name: 'carbon-io/carbond#174',
        description: 'Test that carbon-io/carbond#174 is fixed',
        setup: function() {
          throw new SkipTestError('reminder to fix carbon-io/carbond#174')
        },
        reqSpec: {
          url: '/zipcodes',
          method: 'PUT',
          body: {
            _id: '945/77',
            state: 'CA'
          },
        },
        resSpec: {
          statusCode: 400
        }
      },

      // Test update
      {
        reqSpec: {
          url: '/zipcodes',
          method: 'PATCH',
          parameters: {query: {_id: '00631'}},
          body: {state: 'NY'}
        },
        resSpec: {
          statusCode: 400
        }
      },
      {
        reqSpec: {
          url: '/zipcodes',
          method: 'PATCH',
          parameters: {query: {_id: '00631'}},
          body: {$set: {state: 'NY'}}
        },
        resSpec: {
          statusCode: 200,
          body: {n: 1},
        }
      },

      // Test remove
      {
        reqSpec: {
          url: '/zipcodes',
          method: 'DELETE',
          parameters: {query: {_id: '94114'}},
        },
        resSpec: {
          statusCode: 200,
          body: {n: 1}
        }
      },

      // Test saveObject
      {
        reqSpec: {
          url: '/zipcodes/94114',
          method: 'PUT',
          body: {_id: '94114', state: 'CA'}
        },
        resSpec: {
          statusCode: 201,
          headers: function(headers, ctx) {
            assert.equal(headers.location, '/zipcodes/94114')
            assert.equal(ejson.parse(headers[ctx.global.idHeader]), '94114')
          },
          body: {_id: '94114', state: 'CA'}
        }
      },
      {
        reqSpec: {
          url: '/zipcodes/94114',
          method: 'PUT',
          body: {_id: '94114', state: 'CA'}
        },
        resSpec: {
          statusCode: 200,
          headers: function(headers, ctx) {
            assert(_.isUndefined(headers.location))
            assert(_.isUndefined(headers[ctx.global.idHeader]))
          },
          body: {_id: '94114', state: 'CA'}
        }
      },

      // Test updateObject
      {
        reqSpec: {
          url: '/zipcodes/94114',
          method: 'PATCH',
          body: {state: 'NY'}
        },
        resSpec: {
          statusCode: 200,
          headers: function(headers, ctx) {
            assert(_.isUndefined(headers.location))
            assert(_.isUndefined(headers[ctx.global.idHeader]))
          },
          body: {n: 1}
        }
      },

      // Test removeObject
      {
        reqSpec: {
          url: '/zipcodes/94114',
          method: 'DELETE'
        },
        resSpec: {
          statusCode: 200,
          body: {n: 1}
        }
      },

      // Test whole collection replace
      {
        reqSpec: {
          url: '/zipcodes',
          method: 'PUT',
          body: [
            {
              _id: '94114',
              state: 'CA',
              city: 'San Francisco'
            },
            {
              _id: '94577',
              state: 'CA',
              city: 'San Leandro'
            },
          ]
        },
        resSpec: {
          // body does not match schema
          statusCode: 400
        }
      },
      {
        setup: function() {
          assert(this.parent.service.db.getCollection('zipcodes').find().count() > 2)
        },
        teardown: function() {
          assert.equal(this.parent.service.db.getCollection('zipcodes').find().count(), 2)
        },
        reqSpec: {
          url: '/zipcodes',
          method: 'PUT',
          body: [
            {
              _id: '94114',
              state: 'CA'
            },
            {
              _id: '94577',
              state: 'CA'
            },
          ]
        },
        resSpec: {
          statusCode: 200,
          body: [
            {
              _id: '94114',
              state: 'CA'
            },
            {
              _id: '94577',
              state: 'CA'
            },
          ]
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
        name: 'Issue114Test1',
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
        resSpec: {
          statusCode: 200,
          body: {n: 1}
        }
      },
      {
        name: 'Issue114Test2',
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
        resSpec: {
          statusCode: 200,
          body: {n: 1}
        }
      },

      o({
        _type: testtube.Test,
        name: 'ConfigurationTests',
        setup: function() {
          this.ce = this.parent.service.endpoints['zipcodes']
          this.oe = this.ce.endpoints[':_id']

          this.schema = {
            type: 'object',
            properties: {
              _id: {type: 'string'},
              state: {type: 'string'}
            },
            additionalProperties: false,
            required: ['_id', 'state']
          }

          this.querySchema =  {
            type: 'object',
            properties: {
              _id: {type: 'string'},
              state: {type: 'string'}
            },
            additionalProperties: false
          }

          this.updateSchema = {
            type: 'object',
            patternProperties: {
              '^\\$.+': {
                type: 'object',
                properties: {
                  state: {type: 'string'}
                },
                required: ['state'],
                additionalProperties: false
              }
            },
            additionalProperties: false
          }

          this.updateObjectSchema = {
            type: 'object',
            properties: {
              state: {type: 'string'}
            },
            required: ['state'],
            additionalProperties: false
          }

          this.defaultErrorSchema = {
            type: 'object',
            properties: {
              code: {type: 'integer'},
              description: {type: 'string'},
              message: {type: 'string'},
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
                  'objects' : {
                    description: 'Object(s) to insert',
                    name: 'objects',
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
                  },
                  'object' : {
                    description: 'Object to insert',
                    name: 'object',
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
                  }
                })
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
              assert.deepEqual(this.parent.ce.getOperation('patch').responses,
                               [
                                 {
                                   statusCode: 200,
                                   description: 'Object(s) in the collection were successfully updated',
                                   schema:  {
                                     type: 'object',
                                     properties: {
                                       n: {
                                         type: 'number',
                                         minimum: 0,
                                         multipleOf: 1
                                       }
                                     },
                                     required: ['n'],
                                     additionalProperties: false
                                   },
                                   headers: []
                                 },
                                 this.parent.BadRequestResponse,
                                 this.parent.ForbiddenResponse,
                                 this.parent.InternalServerErrorResponse
                               ]),
              assert.deepEqual(this.parent.ce.getOperation('patch').parameters,
                               {
                                 query: {
                                   name: 'query',
                                   description: 'Query spec (JSON)',
                                   schema: this.parent.querySchema,
                                   location: 'query',
                                   required: false,
                                   default: {}
                                 },
                                 update: {
                                   name: 'update',
                                   location: 'body',
                                   description: 'The update spec',
                                   schema: this.parent.updateSchema,
                                   required: true,
                                   default: undefined
                                 }
                               })
            }
          }),
          o({
            _type: testtube.Test,
            name: 'RemoveConfigTest',
            doTest: function() {
              // remove
              assert.deepEqual(this.parent.ce.getOperation('delete').responses,
                               [
                                 {
                                   statusCode: 200,
                                   description: 'Object(s) in collection were successfully removed',
                                   schema:  {
                                     type: 'object',
                                     properties: {
                                       n: {
                                         type: 'number',
                                         minimum: 0,
                                         multipleOf: 1
                                       }
                                     },
                                     required: ['n'],
                                     additionalProperties: false
                                   },
                                   headers: []
                                 },
                                 this.parent.BadRequestResponse,
                                 this.parent.ForbiddenResponse,
                                 this.parent.InternalServerErrorResponse
                               ]),
              assert.deepEqual(this.parent.ce.getOperation('delete').parameters,
                               {
                                 query: {
                                   name: 'query',
                                   description: 'Query spec (JSON)',
                                   schema: this.parent.querySchema,
                                   location: 'query',
                                   required: false,
                                   default: {}
                                 }
                               })
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
              assert.deepEqual(this.parent.oe.getOperation('put').responses,
                               [
                                 {
                                   statusCode: 200,
                                   description: 'The object was successfully saved. The body will ' +
                                                'contain the saved object.',
                                   schema: this.parent.schema,
                                   headers: []
                                 },
                                 {
                                   statusCode: 201,
                                   description: 'The object was successfully inserted. The Location ' +
                                                'header will contain a URL pointing to the newly created ' +
                                                'resource and the body will contain the inserted object if ' +
                                                'configured to do so.',
                                   schema: this.parent.schema,
                                   headers: ['Location', this.parent.ce.idHeader]
                                 },
                                 this.parent.BadRequestResponse,
                                 this.parent.ForbiddenResponse,
                                 this.parent.InternalServerErrorResponse
                               ])
              assert.deepEqual(this.parent.oe.getOperation('put').parameters,
                               {
                                 object: {
                                   name: 'object',
                                   description: 'Object to save',
                                   schema:  this.parent.schema,
                                   location: 'body',
                                   required: true,
                                   default: undefined
                                 },
                                 _id: {
                                   name: '_id',
                                   description: 'Object _id',
                                   location: 'path',
                                   schema: {type: 'string'},
                                   required: true,
                                   default: null,
                                   resolver: null
                                 }
                               })
            }
          }),
          o({
            _type: testtube.Test,
            name: 'UpdateObjectConfigTest',
            doTest: function() {
              // updateObject
              assert.deepEqual(this.parent.oe.getOperation('patch').responses,
                               [
                                 {
                                   statusCode: 200,
                                   description: 'The object was successfully updated',
                                   schema: {
                                     type: 'object',
                                     properties: {
                                       n: {
                                         type: 'number',
                                         minimum: 0,
                                         maximum: 1,
                                         multipleOf: 1
                                       }
                                     },
                                     required: ['n'],
                                     additionalProperties: false
                                   },
                                   headers: []
                                 },
                                 this.parent.NotFoundResponse,
                                 this.parent.BadRequestResponse,
                                 this.parent.ForbiddenResponse,
                                 this.parent.InternalServerErrorResponse
                               ])
              assert.deepEqual(this.parent.oe.getOperation('patch').parameters,
                               {
                                 update: {
                                   name: 'update',
                                   description: 'The update spec',
                                   schema:  this.parent.updateObjectSchema,
                                   location: 'body',
                                   required: true,
                                   default: undefined
                                 },
                                 _id: {
                                   name: '_id',
                                   description: 'Object _id',
                                   location: 'path',
                                   schema: { type: 'string' },
                                   required: true,
                                   default: null,
                                   resolver: null
                                 }
                               })
            }
          }),
          o({
            _type: testtube.Test,
            name: 'RemoveObjectConfigTest',
            doTest: function() {
              // removeObject
              assert.deepEqual(this.parent.oe.getOperation('delete').responses,
                               [
                                 {
                                   statusCode: 200,
                                   description: 'The object was successfully removed',
                                   schema: {
                                     type: 'object',
                                     properties: {
                                       n: {
                                         type: 'number',
                                         minimum: 0,
                                         maximum: 1,
                                         multipleOf: 1
                                       }
                                     },
                                     required: ['n'],
                                     additionalProperties: false
                                   },
                                   headers: []
                                 },
                                 this.parent.NotFoundResponse,
                                 this.parent.BadRequestResponse,
                                 this.parent.ForbiddenResponse,
                                 this.parent.InternalServerErrorResponse
                               ])
              assert.deepEqual(this.parent.oe.getOperation('delete').parameters,
                               {
                                 _id: {
                                   name: '_id',
                                   description: 'Object _id',
                                   location: 'path',
                                   schema: { type: 'string' },
                                   required: true,
                                   default: null,
                                   resolver: null
                                 }
                               })
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
      },
      {
        _id: '30301',
        state: 'GA'
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
