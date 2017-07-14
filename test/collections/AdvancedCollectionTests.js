var assert = require('assert')

var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var o = require('@carbon-io/carbon-core').atom.o(module).main
var testtube = require('@carbon-io/carbon-core').testtube

var carbond = require('../../')

/**************************************************************************
 * AdvancedCollectionTests
 */
module.exports = o({

  /**********************************************************************
   * _type
   */
  _type: carbond.test.ServiceTest,

  /**********************************************************************
   * name
   */
  name: "AdvancedCollectionTests",

  /**********************************************************************
   * service
   */
  service: _o('../fixtures/ServiceForCollectionTests2'),

  /**********************************************************************
   * doTest
   */
  doTest: function() {
    this.testConfiguration()
  },

  /**********************************************************************
   * tests
   */
  tests: [

    // Test saveObject
    {
      reqSpec: {
        url: '/advanced1/foo',
        method: "PUT",
        body: {
          _id: "foo",
          "name": "Foo",
        }
      },
      resSpec: {
        statusCode: 201,
        body: undefined,
        headers: function(headers) {
          assert.equal(headers.location, "/advanced1/foo")
        },
      }
    },

    // Test updateObject
    {
      reqSpec: {
        url: '/advanced1/foo',
        method: "PATCH",
        body: {
          name: "Fooby"
        }
      },
      resSpec: {
        statusCode: 200,
        body: { _id: "1111" }
      }
    },

    {
      reqSpec: {
        url: '/advanced2/foo',
        method: "PATCH",
        body: {
          name: "Fooby"
        }
      },
      resSpec: {
        statusCode: 200,
        body: { _id: "1111" }
      }
    },

    {
      reqSpec: {
        url: '/advanced3/foo',
        method: "PATCH",
        body: {
          name: "Fooby"
        }
      },
      resSpec: {
        statusCode: 204,
        body: null
      }
    },

    // Test removeObject
    {
      reqSpec: {
        url: '/advanced1/foo',
        method: "DELETE"
      },
      resSpec: {
        statusCode: 200,
        body: { _id: "1234" }
      }
    },

    {
      reqSpec: {
        url: '/advanced2/foo',
        method: "DELETE"
      },
      resSpec: {
        statusCode: 204,
      }
    },

    {
      reqSpec: {
        url: '/advanced3/foo',
        method: "DELETE"
      },
      resSpec: {
        statusCode: 404,
      }
    },

    // Test returnsInsertedObject

    {
      reqSpec: {
        url: '/advanced4/',
        method: 'POST',
        body: {_id: 'foobar'}
      },
      resSpec: {
        statusCode: 201,
        body: {_id: 'foobar'}
      }
    },

    // Test config responses are honored

    o({
      _type: testtube.Test,
      doTest: function() {
        assert(_.some(this.parent.service.endpoints.advanced4.post.responses,
                      function(val) {
                        return val.statusCode === 201
                      }))
      }
    })
  ],

  /**********************************************************************
   * testConfiguration()
   */
  testConfiguration: function() {
    var ce = this.service.endpoints['advanced1']
    var oe = ce.endpoints[':_id']

    var ce2 = this.service.endpoints['advanced2']
    var oe2 = ce2.endpoints[':_id']

    var defaultObjectSchema = {
      type: 'object',
      properties: {
        _id: { type: 'string' }
      },
      required: ['_id']
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

    // saveObject
    assert.deepEqual(oe.getOperation('put').responses,
                     [
                       {
                         statusCode: 201,
                         description:
                         "Returns the URL of the newly inserted object " +
                           "in the Location header of the response.",
                         schema: { type: 'undefined' },
                         headers: ['Location', ce.idHeader]
                       },
                       {
                         statusCode: 204,
                         description: "Returns no content.",
                         schema: { type: 'undefined' },
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
                         description: "Full object for update. Must contain _id field that has the same value as the _id in the path.",
                         schema:  defaultObjectSchema,
                         location: 'body',
                         required: true,
                         default: null
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

    // updateObject
    assert.deepEqual(oe.getOperation('patch').responses,
                     [
                       {
                         statusCode: 200,
                         description: "Returns the updated object.",
                         schema: defaultObjectSchema,
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
                         description: "Update spec (JSON). Update operator (e.g {\"$inc\": {\"n\": 1}})",
                         schema:  { type: "object" },
                         location: 'body',
                         required: true,
                         default: null
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
    assert.deepEqual(oe2.getOperation('patch').responses,
                     [
                       {
                         statusCode: 200,
                         description: "Returns the original object.",
                         schema: defaultObjectSchema,
                         headers: []
                       },
                       NotFoundResponse,
                       BadRequestResponse,
                       ForbiddenResponse,
                       InternalServerErrorResponse
                     ])

    // removeObject
    assert.deepEqual(oe.getOperation('delete').responses,
                     [
                       {
                         statusCode: 200,
                         description: "Returns the removed object.",
                         schema: defaultObjectSchema,
                         headers: []
                       },
                       NotFoundResponse,
                       ForbiddenResponse,
                       InternalServerErrorResponse
                     ])
    assert.deepEqual(oe.getOperation('delete').parameters,
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
})
