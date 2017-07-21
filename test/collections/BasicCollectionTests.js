var assert = require('assert')

var _ = require('lodash')
var sinon = require('sinon')

var __ = require('@carbon-io/carbon-core').fibers.__(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)
var o = require('@carbon-io/carbon-core').atom.o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)
var testtube = require('@carbon-io/carbon-core').testtube

var carbond = require('../../')

function getContext(config, page, skip, limit) {
  return {
    skip: page * config.pageSize + skip,
    limit: limit
  }
}

var OpHttpTest = oo({
  _type: testtube.HttpTest,

  /***************************************************************************
   * genDoc
   */
  op: undefined,

  /***************************************************************************
   * genDoc
   */
  setup: function() {
    var self = this
    if (_.isNil(this.op)) {
      throw new TypeError('"op" must be specified')
    }
    this.baseUrl = this.parent.baseUrl
    this.config = undefined
    this.ce = this.parent.service.endpoints['basic']
    var preOperationName = 'pre' + _.capitalize(this.op) + 'Operation'
    var originalPreOperation = this.ce[preOperationName]
    this.sb = sinon.sandbox.create()
    this.sb.stub(this.ce, preOperationName).callsFake(
      function(config, req, res) {
        self.config = config
        return originalPreOperation.call(self.ce, config, req, res)
      })
  },

  /***************************************************************************
   * genDoc
   */
  teardown: function() {
    this.sb.restore()
  },

  /***************************************************************************
   * genDoc
   */
  genDoc: function(id, page, skip, limit) {
    return {
      '_id': (this.config.opConfig.pageSize * page + skip + id).toString(),
      op: 'find',
      context: {
        skip: this.config.opConfig.pageSize * page + skip,
        limit: limit,
        _id: []
      }
    }
  }
})

/***************************************************************************************************
 * BasicCollectionTests
 */
__(function() {
  module.exports = o.main({

    /***************************************************************************
     * _type
     */
    _type: carbond.test.ServiceTest,

    /***************************************************************************
     * name
     */
    name: 'BasicCollectionTests',

    /***************************************************************************
     * service
     */
    service: _o('../fixtures/ServiceForCollectionTests1'),

    /***************************************************************************
     * tests
     */
    tests: [
      o({
        _type: OpHttpTest,
        name: 'InsertTests',
        op: 'insert',
        tests: [
          {
            reqSpec: {
              url: '/basic',
              method: 'POST',
              body: [
                {foo: 'foo'},
                {bar: 'bar'},
                {baz: 'baz'}
              ],
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers) {
                assert.equal(headers.location, '/basic?_id=0&_id=1&_id=2')
              },
              body: [
                {_id: "0", foo: 'foo'},
                {_id: "1", bar: 'bar'},
                {_id: "2", baz: 'baz'}
              ]
            }
          },
          // {
          //   reqSpec: {
          //     url: '/basic/',
          //     method: 'POST',
          //   },
          //   resSpec: {
          //     statusCode: 201,
          //     headers: function(headers) {
          //       assert.equal(headers.location, '/basic/000')
          //     }
          //   }
          // },
        ]
      }),
      o({
        _type: testtube.HttpTest,
        name: 'InsertObjectTests',
        setup: function() {
          this.baseUrl = this.parent.baseUrl
        },
        teardown: function() {
        },
        tests: [
        ]
      }),
      o({
        _type: OpHttpTest,
        name: 'FindTests',
        op: 'find',
        tests: [
          {
            reqSpec: {
              url: '/basic',
              method: 'GET',
              parameters: {
                skip: 1,
                limit: 2,
                page: 2
              },
            },
            resSpec: {
              statusCode: 200,
              body: function(body) {
                var self = this
                assert.deepEqual(
                  body,
                  _.map(_.range(2), function(id) {
                    return self.parent.genDoc(id, 2, 1, 2)
                  }))
              },
            }
          },
        ]
      }),
      o({
        _type: testtube.HttpTest,
        name: 'FindObjectTests',
        setup: function() {
          this.baseUrl = this.parent.baseUrl
        },
        teardown: function() {
        },
        tests: [
          {
            reqSpec: {
              url: '/basic/foo',
              method: 'GET',
            },
            resSpec: {
              statusCode: 200,
              body: function(body) {
                assert.deepEqual(body, {
                  _id: 'foo',
                  op: 'findObject',
                  context: { }
                })
              }
            }
          },
          {
            reqSpec: {
              url: '/basic/doesnotexist',
              method: 'GET',
            },
            resSpec: {
              statusCode: 404,
            }
          },
        ]
      }),
      o({
        _type: testtube.HttpTest,
        name: 'save',
        setup: function() {
          this.baseUrl = this.parent.baseUrl
        },
        teardown: function() {
        },
        tests: [
        ]
      }),
      o({
        _type: testtube.HttpTest,
        name: 'saveObject',
        setup: function() {
          this.baseUrl = this.parent.baseUrl
        },
        teardown: function() {
        },
        tests: [
          // {
          //   reqSpec: {
          //     url: '/basic/666/',
          //     method: 'PUT',
          //     body: {
          //       _id: '666'
          //     }
          //   },
          //   resSpec: {
          //     statusCode: 201,
          //     headers: function(headers) {
          //       assert.equal(headers.location, '/basic/666')
          //     }
          //   }
          // },
          // {
          //   reqSpec: {
          //     url: '/basic/foo',
          //     method: 'PUT',
          //     body: {
          //       _id: 'foo',
          //       'name': 'Foo',
          //     }
          //   },
          //   resSpec: {
          //     statusCode: 201,
          //     body: undefined,
          //     headers: function(headers) {
          //       assert.equal(headers.location, '/basic/foo')
          //     },
          //   }
          // },
        ]
      }),
      o({
        _type: testtube.HttpTest,
        name: 'update',
        setup: function() {
          this.baseUrl = this.parent.baseUrl
        },
        teardown: function() {
        },
        tests: [
          // {
          //   reqSpec: {
          //     url: '/basic',
          //     method: 'PATCH',
          //     parameters: {
          //       query: { name: 'bar' }
          //     },
          //     body: {
          //       name: 'foo'
          //     }
          //   },
          //   resSpec: {
          //     statusCode: 200,
          //     body: { n: 1 }
          //   }
          // },
        ]
      }),
      o({
        _type: testtube.HttpTest,
        name: 'updateObject',
        setup: function() {
          this.baseUrl = this.parent.baseUrl
        },
        teardown: function() {
        },
        tests: [
          // {
          //   reqSpec: {
          //     url: '/basic/foo',
          //     method: 'PATCH',
          //     body: {
          //       name: 'Fooby'
          //     }
          //   },
          //   resSpec: {
          //     statusCode: 204,
          //     body: undefined
          //   }
          // },
        ]
      }),
      o({
        _type: testtube.HttpTest,
        name: 'remove',
        setup: function() {
          this.baseUrl = this.parent.baseUrl
        },
        teardown: function() {
        },
        tests: [
          // {
          //   reqSpec: {
          //     url: '/basic',
          //     method: 'DELETE',
          //     parameters: {
          //       query: { name: 'bar' }
          //     }
          //   },
          //   resSpec: {
          //     statusCode: 200,
          //     body: { n: 1 }
          //   }
          // },
        ]
      }),
      o({
        _type: testtube.HttpTest,
        name: 'removeObject',
        setup: function() {
          this.baseUrl = this.parent.baseUrl
        },
        teardown: function() {
        },
        tests: [
          // {
          //   reqSpec: {
          //     url: '/basic/foo',
          //     method: 'DELETE'
          //   },
          //   resSpec: {
          //     statusCode: 204,
          //     body: undefined
          //   }
          // },
        ]
      }),
      o({
        _type: testtube.Test,
        name: 'ConfigurationTests',
        setup: function() {
          this.ce = this.parent.service.endpoints['basic']
          this.oe = this.ce.endpoints[':_id']

          this.defaultObjectSchema = {
            type: 'object',
            properties: {
              _id: { type: 'string' }
            },
            required: ['_id']
          }

          this.insertSchema = {
            type: 'object',
            properties: {
              _id: { type: 'string' }
            }
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
        tests: [
          o({
            _type: testtube.Test,
            name: 'InsertConfigTest',
            doTest: function() {
              // insert
              // assert.deepEqual(ce.getOperation('post').responses,
              //                  [
              //                    {
              //                      statusCode: 201,
              //                      description:
              //                      'Returns the URL of the newly inserted object ' +
              //                        'in the Location header of the response.',
              //                      schema: { type: 'undefined' },
              //                      headers: ['Location', ce.defaultIdHeader]
              //                    },
              //                    BadRequestResponse,
              //                    ForbiddenResponse,
              //                    InternalServerErrorResponse
              //                  ]),
              // assert.deepEqual(ce.getOperation('post').parameters, { 'body' : { description: 'Object to insert',
              //                                                                   name: 'body',
              //                                                                   schema: insertSchema,
              //                                                                   location: 'body',
              //                                                                   required: true,
              //                                                                   default: null }})
            }
          }),
          o({
            _type: testtube.Test,
            name: 'FindConfigTest',
            doTest: function() {
              // find
              assert.deepEqual(this.parent.ce.getOperation('get').responses,
                               [
                                 {
                                   statusCode: 200,
                                   description:
                                   'Returns an array of objects. Each object has an _id and possible additional properties.',
                                   schema: {
                                     type: 'array',
                                     items: this.parent.defaultObjectSchema
                                   },
                                   headers: []
                                 },
                                 this.parent.BadRequestResponse,
                                 this.parent.ForbiddenResponse,
                                 this.parent.InternalServerErrorResponse
                               ])
              assert.deepEqual(this.parent.ce.getOperation('get').parameters,
                               {
                                 page: {
                                   name: 'page',
                                   description: 'The page to navigate to (skip/limit are derived from this)',
                                   schema: {
                                     type: 'number',
                                     multipleOf: 1,
                                     minimum: 0
                                   },
                                   location: 'query',
                                   required: false,
                                   default: 0
                                 },
                                 skip: {
                                   name: 'skip',
                                   description: 'The number of objects to skip when iterating pages',
                                   schema: {
                                     type: 'number',
                                     multipleOf: 1,
                                     minimum: 0
                                   },
                                   location: 'query',
                                   required: false,
                                   default: null
                                 },
                                 limit: {
                                   name: 'limit',
                                   description: 'The maximum number of objects for a given page',
                                   schema: {
                                     type: 'number',
                                     multipleOf: 1,
                                     minimum: 0
                                   },
                                   location: 'query',
                                   required: false,
                                   default: null
                                 },
                                 _id: {
                                   name: '_id',
                                   description: 'Id query parameter',
                                   schema: {
                                     type: 'string'
                                   },
                                   location: 'query',
                                   required: false,
                                   default: null
                                 }
                               })
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
              //                  ])
            // assert.deepEqual(ce.getOperation('patch').parameters,
              //                {
              //                  query: {
              //                    name: 'query',
              //                    description: undefined,
              //                    schema: { type: 'object' },
              //                    location: 'query',
              //                    required: false,
              //                    default: null
              //                  },
              //                  body: {
              //                    name: 'body',
              //                    location: 'body',
              //                    description: 'Update spec (JSON). Update operator (e.g {\'$inc\': {\'n\': 1}})',
              //                    schema: { type: 'object' },
              //                    required: true,
              //                    default: null
              //                  }
              //                })
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
              //                  ])
              // assert.deepEqual(ce.getOperation('delete').parameters,
              //                  {
              //                    query: {
              //                      name: 'query',
              //                      description: undefined,
              //                      schema: { type: 'object' },
              //                      location: 'query',
              //                      required: false,
              //                      default: null
              //                    }
              //                  })
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
              //                        'in the Location header of the response.',
              //                      schema: { type: 'undefined' },
              //                      headers: ['Location', ce.defaultIdHeader]
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
              //                      schema:  defaultObjectSchema,
              //                      location: 'body',
              //                      required: true,
              //                      default: null
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
            name: 'FindObjectConfigTest',
            doTest: function() {
              // findObject
              assert.deepEqual(this.parent.oe.getOperation('get').responses, [
                {
                  statusCode: 200,
                  description: 'Returns the object resource found at this URL specified by id.',
                  schema: this.parent.defaultObjectSchema,
                  headers: []
                },
                this.parent.NotFoundResponse,
                this.parent.BadRequestResponse,
                this.parent.ForbiddenResponse,
                this.parent.InternalServerErrorResponse])
              assert.deepEqual(this.parent.oe.getOperation('get').parameters, {
                _id: {
                  name: '_id',
                  description: 'Object _id',
                  location: 'path',
                  schema: { type: 'string' },
                  required: true,
                  default: undefined,
                  resolver: undefined
                }})
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
              //                      description: 'Update spec (JSON). Update operator (e.g {\'$inc\': {\'n\': 1}})',
              //                      schema:  { type: 'object' },
              //                      location: 'body',
              //                      required: true,
              //                      default: null
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
          })
        ]
      })
    ],
  })
})
