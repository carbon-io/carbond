var assert = require('assert')

var _ = require('lodash')
var sinon = require('sinon')

var __ = require('@carbon-io/carbon-core').fibers.__(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)
var ejson = require('@carbon-io/carbon-core').ejson
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
   * op
   */
  op: undefined,

  /***************************************************************************
   * setup
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
   * teardown
   */
  teardown: function() {
    this.sb.restore()
  },

  /***************************************************************************
   * genDoc
   */
  genDoc: function(id, page, skip, limit) {
    return {
      '_id': (this.config.pageSize * page + skip + id).toString(),
      op: 'find',
      context: {
        skip: this.config.pageSize * page + skip,
        limit: limit,
        _id: undefined
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
        ]
      }),
      o({
        _type: OpHttpTest,
        name: 'InsertObjectTests',
        op: 'insertObject',
        tests: [
          {
            reqSpec: {
              url: '/basic/',
              method: 'POST',
              body: {foo: 'foo'}
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers) {
                assert.equal(headers.location, '/basic/0')
              },
              body: {_id: "0", foo: "foo"}
            }
          },
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
        _type: OpHttpTest,
        name: 'FindObjectTests',
        op: 'findObject',
        tests: [
          {
            reqSpec: {
              url: '/basic/1',
              method: 'GET',
            },
            resSpec: {
              statusCode: 200,
              body: function(body) {
                assert.deepEqual(body, {
                  _id: 1,
                  op: 'findObject',
                  context: {}
                })
              }
            }
          },
          {
            reqSpec: {
              url: '/basic/-1',
              method: 'GET',
            },
            resSpec: {
              statusCode: 404,
            }
          },
        ]
      }),
      o({
        _type: OpHttpTest,
        name: 'SaveTests',
        op: 'save',
        tests: [
          {
            reqSpec: {
              url: '/basic',
              method: 'PUT',
              body: [
                {
                  _id: '666',
                  foo: 'foo'
                },
                {
                  _id: '777',
                  bar: 'bar'
                },
                {
                  _id: '888',
                  baz: 'baz'
                }
              ]
            },
            resSpec: {
              statusCode: 200,
              body: [
                {
                  _id: '666',
                  foo: 'foo'
                },
                {
                  _id: '777',
                  bar: 'bar'
                },
                {
                  _id: '888',
                  baz: 'baz'
                }
              ]
            }
          },
          {
            reqSpec: {
              url: '/basic',
              method: 'PUT',
              body: {
                _id: '666',
                foo: 'foo',
              }
            },
            resSpec: {
              statusCode: 400,
              body: function(body) {
                assert.equal(body.code, 400)
                assert.equal(body.description, 'Bad Request')
              }
            }
          },
        ]
      }),
      o({
        _type: OpHttpTest,
        name: 'SaveObjectTests',
        op: 'saveObject',
        tests: [
          {
            reqSpec: {
              url: '/basic/666',
              method: 'PUT',
              body: {
                _id: '666',
                foo: 'foo',
              }
            },
            resSpec: {
              statusCode: 201,
              body: {
                _id: '666',
                foo: 'foo'
              },
              headers: function(headers) {
                assert.equal(headers.location, '/basic/666')
                assert.equal(ejson.parse(headers['carbonio-id']), '666')
              }
            }
          },
          {
            reqSpec: {
              url: '/basic/666',
              method: 'PUT',
              body: [
                {
                  _id: '666',
                  foo: 'foo'
                },
              ]
            },
            resSpec: {
              statusCode: 400,
              body: function(body) {
                assert.equal(body.code, 400)
                assert.equal(body.description, 'Bad Request')
              }
            }
          },
          {
            reqSpec: {
              url: '/basic/777',
              method: 'PUT',
              body: {
                _id: '666',
                foo: 'foo',
              }
            },
            resSpec: {
              statusCode: 400,
              body: function(body) {
                assert.equal(body.code, 400)
                assert.equal(body.description, 'Bad Request')
              }
            }
          }
        ]
      }),
      o({
        _type: OpHttpTest,
        name: 'UpdateTests',
        op: 'update',
        tests: [
          {
            reqSpec: {
              url: '/basic',
              method: 'PATCH',
              body: {
                // XXX: there is no format specified update specs on Collection
                append: 'foo'
              }
            },
            resSpec: {
              statusCode: 200,
              body: {
                n: 1
              }
            }
          },
          {
            reqSpec: {
              url: '/basic',
              method: 'PATCH',
              body: []
            },
            resSpec: {
              statusCode: 400
            }
          },
          // XXX: empty bodies are converted to {} before schema validation
          // {
          //   reqSpec: {
          //     url: '/basic',
          //     method: 'PATCH',
          //     body: undefined
          //   },
          //   resSpec: {
          //     statusCode: 400
          //   }
          // },
        ]
      }),
      o({
        _type: OpHttpTest,
        name: 'UpdateObjectTest',
        op: 'updateObject',
        tests: [
          {
            reqSpec: {
              url: '/basic/1',
              method: 'PATCH',
              body: {
                append: 'foo'
              }
            },
            resSpec: {
              statusCode: 200,
              body: {
                n: 1
              }
            }
          },
          {
            reqSpec: {
              url: '/basic/1',
              method: 'PATCH',
              body: []
            },
            resSpec: {
              statusCode: 400
            }
          },
          // XXX: empty bodies are converted to {} before schema validation
          // {
          //   reqSpec: {
          //     url: '/basic/1',
          //     method: 'PATCH',
          //     body: undefined
          //   },
          //   resSpec: {
          //     statusCode: 400
          //   }
          // },
        ]
      }),
      o({
        _type: OpHttpTest,
        name: 'RemoveTests',
        op: 'remove',
        tests: [
          {
            reqSpec: {
              url: '/basic',
              method: 'DELETE'
            },
            resSpec: {
              statusCode: 200,
              body: {
                n: 1
              }
            }
          },
        ]
      }),
      o({
        _type: OpHttpTest,
        name: 'RemoveObjectTests',
        op: 'removeObject',
        tests: [
          {
            reqSpec: {
              url: '/basic/1',
              method: 'DELETE'
            },
            resSpec: {
              statusCode: 200,
              body: {
                n: 1
              }
            }
          },
        ]
      }),
      o({
        _type: testtube.Test,
        name: 'ConfigurationTests',
        setup: function() {
          this.ce = this.parent.service.endpoints['basic']
          this.oe = this.ce.endpoints[':_id']

          this.normalizedDefaultObjectSchema = {
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

          this.saveSchema = {
            type: 'object',
            properties: {
              _id: { type: 'string' }
            },
            required: ['_id'],
            additionalProperties: true
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
            name: 'InsertAndInsertObjectConfigTest',
            doTest: function() {
              // insert
              assert.deepEqual(
                this.parent.ce.getOperation('post').responses, {
                  '201': {
                    statusCode: 201,
                    description: 'The object(s) were successfully inserted. The Location ' +
                                 'header will contain a URL pointing to the newly created ' +
                                 'resources and the body will contain the list of inserted ' +
                                 'object(s) if configured to do so.',
                    schema: {
                      oneOf: [
                        {
                          items: {
                            properties: {_id: {type: 'string'}},
                            required: ['_id'],
                            type: 'object'
                          },
                          type: 'array'
                        },
                        {
                          properties: {_id: {type: 'string'}},
                          required: ['_id'],
                          type: 'object'
                        }
                      ]
                    },
                    headers: ['Location', this.parent.ce.defaultIdHeader]
                  },
                  '400': this.parent.BadRequestResponse,
                  '403': this.parent.ForbiddenResponse,
                  '500': this.parent.InternalServerErrorResponse
                })
              assert.deepEqual(
                this.parent.ce.getOperation('post').parameters, {
                  object: {
                    description: 'Object to insert',
                    location: 'body',
                    name: 'object',
                    required: true,
                    schema: {
                      oneOf: [
                        {
                          items: {
                            properties: {_id: {type: 'string'}},
                            type: 'object'
                          },
                          type: 'array'
                        },
                        {
                          properties: {_id: {type: 'string'}},
                          type: 'object'
                        }
                      ]
                    },
                    default: null
                  },
                  objects: {
                    description: 'Object(s) to insert',
                    location: 'body',
                    name: 'objects',
                    required: true,
                    schema: {
                      oneOf: [
                        {
                          items: {
                            properties: {_id: {type: 'string'}},
                            type: 'object'
                          },
                          type: 'array'
                        },
                        {
                          properties: {_id: {type: 'string'}},
                          type: 'object'
                        }
                      ]
                    },
                    default: null
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
                this.parent.ce.getOperation('get').responses, {
                  '200': {
                    statusCode: 200,
                    description: 'Returns an array of objects. Each object has an _id and possible ' +
                                 'additional properties.',
                    schema: {
                      type: 'array',
                      items: this.parent.normalizedDefaultObjectSchema
                    },
                    headers: []
                  },
                  '400': this.parent.BadRequestResponse,
                  '403': this.parent.ForbiddenResponse,
                  '500': this.parent.InternalServerErrorResponse
                })
              debugger
              assert.deepEqual(
                this.parent.ce.getOperation('get').parameters, {
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
                  pageSize: {
                    name: 'pageSize',
                    description: 'The page size used for pagination (skip/limit are derived from this and page)',
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
                      oneOf: [
                        {type: 'string'},
                        {type: 'array', items: {type: 'string'}}
                      ]
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
              assert.deepEqual(
                this.parent.ce.getOperation('patch').responses, {
                  '200': {
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
                  '400': this.parent.BadRequestResponse,
                  '403': this.parent.ForbiddenResponse,
                  '500': this.parent.InternalServerErrorResponse
                })
            assert.deepEqual(
              this.parent.ce.getOperation('patch').parameters, {
                update: {
                  name: 'update',
                  location: 'body',
                  description: 'The update spec',
                  schema: {type: 'object'},
                  required: true,
                  default: null
                }})
            }
          }),
          o({
            _type: testtube.Test,
            name: 'RemoveConfigTest',
            doTest: function() {
              // remove
              assert.deepEqual(
                this.parent.ce.getOperation('delete').responses, {
                  '200': {
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
                  '400': this.parent.BadRequestResponse,
                  '403': this.parent.ForbiddenResponse,
                  '500': this.parent.InternalServerErrorResponse
                })
              assert.deepEqual(
                this.parent.ce.getOperation('delete').parameters, {})
            }
          }),
          o({
            _type: testtube.Test,
            name: 'SaveObjectConfigTest',
            doTest: function() {
              // saveObject
              assert.deepEqual(
                this.parent.oe.getOperation('put').responses, {
                  '200': {
                    statusCode: 200,
                    description: 'The object was successfully saved. The body will ' +
                                 'contain the saved object.',
                    schema: this.parent.normalizedDefaultObjectSchema,
                    headers: []
                  },
                  '201': {
                    statusCode: 201,
                    description: 'The object was successfully inserted. The Location ' +
                                 'header will contain a URL pointing to the newly created ' +
                                 'resource and the body will contain the inserted object if ' +
                                 'configured to do so.',
                    schema: this.parent.normalizedDefaultObjectSchema,
                    headers: ['Location', this.parent.ce.idHeader]
                  },
                  '400': this.parent.BadRequestResponse,
                  '403': this.parent.ForbiddenResponse,
                  '500': this.parent.InternalServerErrorResponse
                })
              assert.deepEqual(
                this.parent.oe.getOperation('put').parameters, {
                  object: {
                    name: 'object',
                    description: 'Object to save',
                    location: 'body',
                    schema: this.parent.saveSchema,
                    required: true,
                    default: null
                  },
                  _id: {
                    name: '_id',
                    description: 'Object _id',
                    location: 'path',
                    schema: {
                      type: 'string'
                    },
                    required: true,
                    default: null,
                    resolver: null
                  }
                 })
            }
          }),
          o({
            _type: testtube.Test,
            name: 'FindObjectConfigTest',
            doTest: function() {
              // findObject
              assert.deepEqual(this.parent.oe.getOperation('get').responses, {
                '200': {
                  statusCode: 200,
                  description: 'Returns the object resource found at this URL specified by id.',
                  schema: this.parent.normalizedDefaultObjectSchema,
                  headers: []
                },
                '404': this.parent.NotFoundResponse,
                '400': this.parent.BadRequestResponse,
                '403': this.parent.ForbiddenResponse,
                '500': this.parent.InternalServerErrorResponse
              })
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
              assert.deepEqual(
                this.parent.oe.getOperation('patch').responses, {
                  '200': {
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
                  '404': this.parent.NotFoundResponse,
                  '400': this.parent.BadRequestResponse,
                  '403': this.parent.ForbiddenResponse,
                  '500': this.parent.InternalServerErrorResponse
                })
              assert.deepEqual(
                this.parent.oe.getOperation('patch').parameters, {
                  update: {
                    name: 'update',
                    description: 'The update spec',
                    schema:  {
                      type: 'object'
                    },
                    location: 'body',
                    required: true,
                    default: null
                  },
                  _id: {
                    name: '_id',
                    description: 'Object _id',
                    location: 'path',
                    schema: {
                      type: 'string'
                    },
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
              assert.deepEqual(
                this.parent.oe.getOperation('delete').responses, {
                  '200': {
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
                  '404': this.parent.NotFoundResponse,
                  '400': this.parent.BadRequestResponse,
                  '403': this.parent.ForbiddenResponse,
                  '500': this.parent.InternalServerErrorResponse
                })
              assert.deepEqual(
                this.parent.oe.getOperation('delete').parameters,
                  {
                    _id: {
                      name: '_id',
                      description: 'Object _id',
                      location: 'path',
                      schema: { type: 'string' },
                      required: true,
                      default: null,
                      resolver: null
                    }})
            }
          })
        ]
      })
    ],
  })
})
