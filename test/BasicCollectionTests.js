var assert = require('assert')

var _o = require('carbon-core').bond._o(module)
var o  = require('carbon-core').atom.o(module).main

var carbond = require('../')

/**************************************************************************
 * BasicCollectionTests
 */
module.exports = o({

  /**********************************************************************
   * _type
   */
  _type: carbond.test.ServiceTest,

  /**********************************************************************
   * name
   */
  name: "BasicCollectionTests",

  /**********************************************************************
   * service
   */
  service: _o('./fixtures/ServiceForCollectionTests1'),

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
    // Test insert
    {
      reqSpec: {
        url: "/basic",
        method: "POST",
        body: {
          msg: "hello"
        },
      },
      resSpec: {
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
      reqSpec: {
        url: "/basic",
        method: "GET",
        parameters: {
          query: {
            x: "hello",
            y: "goodbye"
          }
        },
      },
      resSpec: {
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
      reqSpec: {
        url: "/basic",
        method: "PATCH",
        parameters: {
          query: { name: "bar" }
        },
        body: {
          name: "foo"
        }
      },
      resSpec: {
        statusCode: 200,
        body: { n: 1 }
      }
    },

    // Test remove
    {
      reqSpec: {
        url: "/basic",
        method: "DELETE",
        parameters: {
          query: { name: "bar" }
        }
      },
      resSpec: {
        statusCode: 200,
        body: { n: 1 }
      }
    },

    // Test saveObject
    {
      reqSpec: {
        url: '/basic/foo',
        method: "PUT",
        body: {
          _id: "foo",
          "name": "Foo",
        }
      },
      resSpec: {
        statusCode: 201,
        body: { _id: "foo", "name": "Foo" },
        headers: function(headers) { return headers.location === "/basic/foo" },
      }
    },

    // Test findObject
    {
      reqSpec: {
        url: '/basic/foo',
        method: "GET",
      },
      resSpec: {
        statusCode: 200,
        body: {
          _id: "foo",
          op: "findObject",
        }
      }
    },

    {
      reqSpec: {
        url: '/basic/doesnotexist',
        method: "GET",
      },
      resSpec: {
        statusCode: 404,
      }
    },

    // Test updateObject
    {
      reqSpec: {
        url: '/basic/foo',
        method: "PATCH",
        body: {
          name: "Fooby"
        }
      },
      resSpec: {
        statusCode: 200,
        body: undefined
      }
    },

    // Test removeObject
    {
      reqSpec: {
        url: '/basic/foo',
        method: "DELETE"
      },
      resSpec: {
        statusCode: 200,
        body: undefined
      }
    },
  ],

  /**********************************************************************
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
    assert.deepEqual(ce.getOperation('post').responses, 
                     [
                       {
                         statusCode: 201,
                         description: 
                         "Returns the object inserted, along with the URL of the newly inserted object " +
                           "in the Location header of the response.",
                         schema: defaultObjectSchema,
                         headers: ['Location']
                       },
                       BadRequestResponse,
                       ForbiddenResponse,
                       InternalServerErrorResponse
                     ]),
    assert.deepEqual(ce.getOperation('post').parameters, { "body" : { description: "Object to insert",
                                                                      name: "body",
                                                                      schema: insertSchema,
                                                                      location: "body", 
                                                                      required: true, 
                                                                      default: null }})
    
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
                     ])
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
                     ])
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

    // saveObject
    assert.deepEqual(oe.getOperation('put').responses,
                     [
                       {
                         statusCode: 201,
                         description: 
                         "Returns the object inserted, along with the URL of the newly inserted object " +
                           "in the Location header of the response.",
                         schema: defaultObjectSchema,
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
                         schema:  defaultObjectSchema,
                         location: 'body',
                         required: true,
                         default: null
                       }
                     })
    
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
                         schema:  { type: "object" },
                         location: 'body',
                         required: true,
                         default: null
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
})
