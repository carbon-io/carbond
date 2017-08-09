var assert = require('assert')

var _ = require('lodash')

var __ = require('@carbon-io/carbon-core').fibers.__(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)
var o = require('@carbon-io/carbon-core').atom.o(module)
var testtube = require('@carbon-io/carbon-core').testtube

var carbond = require('../../')

__(function() {
  /**************************************************************************
   * AdvancedCollectionTests
   */
  module.exports = o.main({

    /**********************************************************************
     * _type
     */
    _type: carbond.test.ServiceTest,

    /**********************************************************************
     * name
     */
    name: 'AdvancedCollectionTests',

    /**********************************************************************
     * service
     */
    service: _o('../fixtures/ServiceForCollectionTests2'),

    /**********************************************************************
     * tests
     */
    tests: [

      // Test saveObject
      {
        reqSpec: {
          url: '/advanced1/foo',
          method: 'PUT',
          body: {
            _id: 'foo',
            name: 'bar',
          }
        },
        resSpec: {
          statusCode: 201,
          body: {
            _id: 'foo',
            name: 'bar'
          },
          headers: function(headers) {
            assert.equal(headers.location, '/advanced1/foo')
          },
        }
      },

      // Test updateObject
      {
        reqSpec: {
          url: '/advanced1/foo',
          method: 'PATCH',
          parameters: {
            upsert: true
          },
          body: {
            name: 'bar'
          }
        },
        resSpec: {
          statusCode: 201,
          body: {n: 1}
        }
      },

      {
        reqSpec: {
          url: '/advanced2/foo',
          method: 'PATCH',
          parameters: {
            upsert: true
          },
          body: {
            name: 'bar'
          }
        },
        resSpec: {
          statusCode: 201,
          body: {_id: 'foo', name: 'bar'}
        }
      },

      {
        reqSpec: {
          url: '/advanced3/foo',
          method: 'PATCH',
          body: {
            name: 'bar'
          }
        },
        resSpec: {
          statusCode: 404,
          body: {
            code: 404,
            description: 'Not Found',
            message: 'foo'
          }
        }
      },

      // Test removeObject
      {
        reqSpec: {
          url: '/advanced1/foo',
          method: 'DELETE'
        },
        resSpec: {
          statusCode: 200,
          body: {_id: 'foo'}
        }
      },

      {
        reqSpec: {
          url: '/advanced2/foo',
          method: 'DELETE'
        },
        resSpec: {
          statusCode: 404,
        }
      },

      {
        reqSpec: {
          url: '/advanced3/foo',
          method: 'DELETE'
        },
        resSpec: {
          statusCode: 200,
          body: {n: 1}
        }
      },

      // Test returnsInsertedObjects

      {
        reqSpec: {
          url: '/advanced4/',
          method: 'POST',
          body: [{foo: 'bar'}, {foo: 'bar'}]
        },
        resSpec: {
          statusCode: 201,
          body: [{_id: '0', foo: 'bar'}, {_id: '1', foo: 'bar'}]
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
      }),

      o({
        _type: testtube.Test,
        name: 'ConfigurationTests',
        setup: function() {
          this.ce = this.parent.service.endpoints['advanced1']
          this.oe = this.ce.endpoints[':_id']

          this.ce2 = this.parent.service.endpoints['advanced2']
          this.oe2 = this.ce2.endpoints[':_id']

          this.normalizedDefaultObjectSchema = {
            type: 'object',
            properties: {
              _id: {type: 'string'}
            },
            required: ['_id']
          }

          this.defaultObjectSchema =
            _.assign({additionalProperties: true}, this.normalizedDefaultObjectSchema)

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
            name: 'SaveObjectTest',
            doTest: function() {
              // saveObject
              assert.deepEqual(this.parent.oe.getOperation('put').responses,
                               [
                                 {
                                   statusCode: 200,
                                   description: 'The object was successfully saved. The body will ' +
                                                'contain the saved object.',
                                   schema: this.parent.normalizedDefaultObjectSchema,
                                   headers: []
                                 },
                                 {
                                   statusCode: 201,
                                   description: 'The object was successfully inserted. The Location ' +
                                                'header will contain a URL pointing to the newly created ' +
                                                'resource and the body will contain the inserted object if ' +
                                                'configured to do so.',
                                   schema: this.parent.normalizedDefaultObjectSchema,
                                   headers: ['Location', this.parent.ce.idHeader]
                                 },
                                 this.parent.BadRequestResponse,
                                 this.parent.ForbiddenResponse,
                                 this.parent.InternalServerErrorResponse
                               ])
              assert.deepEqual(this.parent.oe.getOperation('put').parameters,
                               {
                                 body: {
                                   name: 'body',
                                   description: 'Object to save',
                                   schema:  this.parent.defaultObjectSchema,
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
                                   default: undefined,
                                   resolver: null
                                 }
                               })

            }
          }),
          o({
            _type: testtube.Test,
            name: 'UpdateObjectTest',
            doTest: function() {
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
                                 {
                                   statusCode: 201,
                                   description: 'The object was successfully upserted. The Location ' +
                                                'header will contain a URL pointing to the newly created ' +
                                                'resource and the body will contain the upserted object if ' +
                                                'configured to do so.',
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
                                   headers: ['Location', this.parent.ce.idHeader]
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
                                   schema:  {type: 'object'},
                                   location: 'body',
                                   required: true,
                                   default: undefined
                                 },
                                 upsert: {
                                   name: 'upsert',
                                   description: 'Enable upsert',
                                   location: 'query',
                                   schema: {
                                     oneOf: [
                                       {type: 'boolean', default: false},
                                       {
                                         type: 'number',
                                         maximum: 1,
                                         minimum: 0,
                                         multipleOf: 1
                                       }
                                     ]
                                   },
                                   required: false,
                                   default: false
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
              assert.deepEqual(this.parent.oe2.getOperation('patch').responses,
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
                                 {
                                   statusCode: 201,
                                   description: 'The object was successfully upserted. The Location ' +
                                                'header will contain a URL pointing to the newly created ' +
                                                'resource and the body will contain the upserted object if ' +
                                                'configured to do so.',
                                   schema: this.parent.normalizedDefaultObjectSchema,
                                   headers: ['Location', this.parent.ce.idHeader]
                                 },
                                 this.parent.NotFoundResponse,
                                 this.parent.BadRequestResponse,
                                 this.parent.ForbiddenResponse,
                                 this.parent.InternalServerErrorResponse
                               ])
            }
          }),
          o({
            _type: testtube.Test,
            name: 'RemoveObjectTest',
            doTest: function() {
              assert.deepEqual(this.parent.oe.getOperation('delete').responses,
                               [
                                 {
                                   statusCode: 200,
                                   description: 'The object was successfully removed',
                                   schema: this.parent.normalizedDefaultObjectSchema,
                                   headers: []
                                 },
                                 this.parent.NotFoundResponse,
                                 this.parent.ForbiddenResponse,
                                 this.parent.InternalServerErrorResponse
                               ])
              assert.deepEqual(this.parent.oe.getOperation('delete').parameters,
                               {
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
        ]
      })
    ]
  })
})
