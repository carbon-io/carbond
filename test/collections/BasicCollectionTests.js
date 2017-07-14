var assert = require('assert')

var _ = require('lodash')
var sinon = require('sinon')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var o  = require('@carbon-io/carbon-core').atom.o(module).main

var carbond = require('../../')

function getContext(config, page, skip, limit) {
  return {
    skip: page * config.pageSize + skip,
    limit: limit
  }
}

/***************************************************************************************************
 * BasicCollectionTests
 */
module.exports = o({

  /*****************************************************************************
   * _type
   */
  _type: carbond.test.ServiceTest,

  /*****************************************************************************
   * name
   */
  name: "BasicCollectionTests",

  /*****************************************************************************
   * service
   */
  service: _o('../fixtures/ServiceForCollectionTests1'),

  /*****************************************************************************
   * doTest
   */
  doTest: function() {
    this.testConfiguration()
  },

  /*****************************************************************************
   * tests
   */
  tests: [
    // Test insert
    // {
    //   reqSpec: {
    //     url: "/basic",
    //     method: "POST",
    //     body: {
    //       msg: "hello"
    //     },
    //   },
    //   resSpec: {
    //     statusCode: 201,
    //     headers: function(headers) {
    //       assert.equal(headers.location, "/basic/000")
    //     },
    //     body: undefined,
    //   }
    // },

    // Test find
    {
      setup: function() {
        var self = this
        this.config = undefined
        this.ce = this.parent.service.endpoints['basic']
        var originalPreFindOperation = this.ce.preFindOperation
        this.sb = sinon.sandbox.create()
        this.sb.stub(this.ce, 'preFindOperation').callsFake(
          function(config, req, res) {
            self.config = config
            return originalPreFindOperation.call(self.ce, config, req, res)
          })
        this.genDoc = function(id) {
          return {
            '_id': (self.config.opConfig.pageSize * 2 + 1 + id).toString(),
            op: 'find',
            context: {
              skip: self.config.opConfig.pageSize * 2 + 1,
              limit: 2
            }
          }
        }
      },
      teardown: function() {
        this.sb.restore()
      },
      reqSpec: {
        url: "/basic",
        method: "GET",
        parameters: {
          skip: 1,
          limit: 2,
          page: 2
        },
      },
      resSpec: {
        statusCode: 200,
        body: function(body) {
          debugger
          assert.deepEqual(
            body,
            _.map(_.range(2), this.genDoc))
        },
      }
    },

    // Test update
    // {
    //   reqSpec: {
    //     url: "/basic",
    //     method: "PATCH",
    //     parameters: {
    //       query: { name: "bar" }
    //     },
    //     body: {
    //       name: "foo"
    //     }
    //   },
    //   resSpec: {
    //     statusCode: 200,
    //     body: { n: 1 }
    //   }
    // },

    // // Test remove
    // {
    //   reqSpec: {
    //     url: "/basic",
    //     method: "DELETE",
    //     parameters: {
    //       query: { name: "bar" }
    //     }
    //   },
    //   resSpec: {
    //     statusCode: 200,
    //     body: { n: 1 }
    //   }
    // },

    // // Test saveObject
    // {
    //   reqSpec: {
    //     url: '/basic/foo',
    //     method: "PUT",
    //     body: {
    //       _id: "foo",
    //       "name": "Foo",
    //     }
    //   },
    //   resSpec: {
    //     statusCode: 201,
    //     body: undefined,
    //     headers: function(headers) {
    //       assert.equal(headers.location, "/basic/foo")
    //     },
    //   }
    // },

    // // Test findObject
    // {
    //   reqSpec: {
    //     url: '/basic/foo',
    //     method: "GET",
    //   },
    //   resSpec: {
    //     statusCode: 200,
    //     body: {
    //       _id: "foo",
    //       op: "findObject",
    //     }
    //   }
    // },

    // {
    //   reqSpec: {
    //     url: '/basic/doesnotexist',
    //     method: "GET",
    //   },
    //   resSpec: {
    //     statusCode: 404,
    //   }
    // },

    // // Test updateObject
    // {
    //   reqSpec: {
    //     url: '/basic/foo',
    //     method: "PATCH",
    //     body: {
    //       name: "Fooby"
    //     }
    //   },
    //   resSpec: {
    //     statusCode: 204,
    //     body: undefined
    //   }
    // },

    // // Test removeObject
    // {
    //   reqSpec: {
    //     url: '/basic/foo',
    //     method: "DELETE"
    //   },
    //   resSpec: {
    //     statusCode: 204,
    //     body: undefined
    //   }
    // },

    // // Test Location header properly normalized

    // {
    //   reqSpec: {
    //     url: '/basic/',
    //     method: "POST",
    //   },
    //   resSpec: {
    //     statusCode: 201,
    //     headers: function(headers) {
    //       assert.equal(headers.location, '/basic/000')
    //     }
    //   }
    // },

    // {
    //   reqSpec: {
    //     url: '/basic/666/',
    //     method: "PUT",
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
  ],

  /*****************************************************************************
   * testConfiguration()
   */
  testConfiguration: function() {
    var ce = this.service.endpoints['basic']
    var oe = ce.endpoints[':_id']

    var defaultObjectSchema = {
      type: 'object',
      properties: {
        _id: { type: 'string' }
      },
      required: ['_id']
    }

    var insertSchema = {
      type: 'object',
      properties: {
        _id: { type: 'string' }
      }
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
    // assert.deepEqual(ce.getOperation('post').responses,
    //                  [
    //                    {
    //                      statusCode: 201,
    //                      description:
    //                      "Returns the URL of the newly inserted object " +
    //                        "in the Location header of the response.",
    //                      schema: { type: 'undefined' },
    //                      headers: ['Location', ce.defaultIdHeader]
    //                    },
    //                    BadRequestResponse,
    //                    ForbiddenResponse,
    //                    InternalServerErrorResponse
    //                  ]),
    // assert.deepEqual(ce.getOperation('post').parameters, { "body" : { description: "Object to insert",
    //                                                                   name: "body",
    //                                                                   schema: insertSchema,
    //                                                                   location: "body",
    //                                                                   required: true,
    //                                                                   default: null }})

    // find
    assert.deepEqual(ce.getOperation('get').responses,
                     [
                       {
                         statusCode: 200,
                         description:
                         "Returns an array of objects. Each object has an _id and possible additional properties.",
                         schema: {
                           type: 'array',
                           items: defaultObjectSchema
                         },
                         headers: []
                       },
                       BadRequestResponse,
                       ForbiddenResponse,
                       InternalServerErrorResponse
                     ])
    assert.deepEqual(ce.getOperation('get').parameters,
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
                       }
                     })

    // update
    // assert.deepEqual(ce.getOperation('patch').responses,
    //                  [
    //                    {
    //                      statusCode: 200,
    //                      description: "Returns an update result specifying the number of documents updated.",
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
    //                    name: "query",
    //                    description: undefined,
    //                    schema: { type: 'object' },
    //                    location: 'query',
    //                    required: false,
    //                    default: null
    //                  },
    //                  body: {
    //                    name: "body",
    //                    location: "body",
    //                    description: "Update spec (JSON). Update operator (e.g {\"$inc\": {\"n\": 1}})",
    //                    schema: { type: "object" },
    //                    required: true,
    //                    default: null
    //                  }
    //                })

    // remove
    // assert.deepEqual(ce.getOperation('delete').responses,
    //                  [
    //                    {
    //                      statusCode: 200,
    //                      description: "Returns a remove result specifying the number of documents removed.",
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
    //                      name: "query",
    //                      description: undefined,
    //                      schema: { type: 'object' },
    //                      location: 'query',
    //                      required: false,
    //                      default: null
    //                    }
    //                  })

    // saveObject
    // assert.deepEqual(oe.getOperation('put').responses,
    //                  [
    //                    {
    //                      statusCode: 201,
    //                      description:
    //                      "Returns the URL of the newly inserted object " +
    //                        "in the Location header of the response.",
    //                      schema: { type: 'undefined' },
    //                      headers: ['Location', ce.defaultIdHeader]
    //                    },
    //                    {
    //                      statusCode: 204,
    //                      description: "Returns no content.",
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
    //                      name: "body",
    //                      description: "Full object for update. Must contain _id field that has the same value as the _id in the path.",
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

    // findObject
    assert.deepEqual(oe.getOperation('get').responses,
                     [
                       {
                         statusCode: 200,
                         description: "Returns the object resource found at this URL specified by id.",
                         schema: defaultObjectSchema,
                         headers: []
                       },
                       NotFoundResponse,
                       BadRequestResponse,
                       ForbiddenResponse,
                       InternalServerErrorResponse
                     ])
    assert.deepEqual(oe.getOperation('get').parameters, {})

    // updateObject
    // assert.deepEqual(oe.getOperation('patch').responses,
    //                  [
    //                    {
    //                      statusCode: 204,
    //                      description: "Returns no content.",
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
    //                      name: "body",
    //                      description: "Update spec (JSON). Update operator (e.g {\"$inc\": {\"n\": 1}})",
    //                      schema:  { type: "object" },
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

    // removeObject
    // assert.deepEqual(oe.getOperation('delete').responses,
    //                  [
    //                    {
    //                      statusCode: 204,
    //                      description: "Returns no content.",
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
