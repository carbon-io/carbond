var assert = require('assert')
var url = require('url')

var _ = require('lodash')
var sinon = require('sinon')

var __ = require('@carbon-io/carbon-core').fibers.__(module)
var ejson = require('@carbon-io/carbon-core').ejson
var o = require('@carbon-io/carbon-core').atom.o(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)
var testtube = require('@carbon-io/carbon-core').testtube

var carbond = require('../..')
var pong = require('../fixtures/pong')

/**************************************************************************
 * saveObject tests
 */
__(function() {
  module.exports = o.main({

    /**********************************************************************
     * _type
     */
    _type: testtube.Test,

    /**********************************************************************
     * name
     */
    name: 'saveObjectTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'defaultConfigSaveObjectTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            saveObject: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {saveObject: true},
            }),
          },
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameterName = this.service.endpoints.saveObject.idParameterName
          context.global.idHeaderName = this.service.endpoints.saveObject.idHeaderName
        },
        teardown: function(context) {
          delete context.global.idHeaderName
          delete context.global.idParameterName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'SaveObjectsResultsInBadRequestTest',
            description: 'Test PUT of array with multiple objects',
            reqSpec: function(context) {
              return {
                url: '/saveObject/0',
                method: 'PUT',
                body: [
                  {[context.global.idParameterName]: '0', foo: 'bar'},
                  {[context.global.idParameterName]: '1', bar: 'baz'},
                  {[context.global.idParameterName]: '2', baz: 'yaz'},
                ],
              }
            },
            resSpec: {
              statusCode: 400,
            },
          },
          {
            name: 'SaveObjectExistingTest',
            description: 'Test PUT of existing object',
            reqSpec: function(context) {
              return {
                url: '/saveObject/0',
                method: 'PUT',
                headers: {
                  'x-pong': ejson.stringify({
                    saveObject: {$args: 0},
                  }),
                },
                body: {[context.global.idParameterName]: '0', foo: 'bar'},
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(body, context) {
                assert.deepStrictEqual(body, {
                  [context.global.idParameterName]: '0',
                  foo: 'bar',
                })
              },
            },
          },
        ],
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'CustomSchemaConfigSaveObjectTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            saveObject: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {saveObject: true},
              saveObjectConfig: {
                schema: {
                  type: 'object',
                  properties: {
                    _id: {type: 'string'},
                    foo: {
                      type: 'string',
                      pattern: '^(bar|baz|yaz)$',
                    },
                  },
                  required: ['_id'],
                  patternProperties: {
                    '^\\d+$': {type: 'string'},
                  },
                  additionalProperties: false,
                },
              },
            }),
            saveObject1: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {saveObject: true},
              saveObjectConfig: {
                '$parameters.object.schema': {
                  type: 'object',
                  properties: {
                    _id: {type: 'string'},
                    foo: {
                      type: 'string',
                      pattern: '^(bar|baz|yaz)$',
                    },
                  },
                  required: ['_id'],
                  patternProperties: {
                    '^\\d+$': {type: 'string'},
                  },
                  additionalProperties: false,
                },
              },
            }),
          },
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameterName = this.service.endpoints.saveObject.idParameterName
        },
        teardown: function(context) {
          delete context.global.idParameterName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'FailSaveObjectSchemaTest',
            description: 'Test PUT of malformed object',
            setup: function() {
              pong.util.collectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/saveObject/0',
                method: 'PUT',
                body: {[context.global.idParameterName]: '0', bar: 'baz'},
              }
            },
            resSpec: {
              statusCode: 400,
            },
          },
          {
            name: 'SuccessSaveObjectSchemaTest',
            description: 'Test PUT with well formed object',
            setup: function() {
              pong.util.collectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/saveObject/0',
                method: 'PUT',
                headers: {
                  'x-pong': ejson.stringify({
                    saveObject: {$args: 0},
                  }),
                },
                body: {[context.global.idParameterName]: '0', foo: 'bar'},
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(body, context) {
                assert.deepStrictEqual(body, {
                  [context.global.idParameterName]: '0', foo: 'bar',
                })
              },
            },
          },
          {
            name: 'FailSaveObject1SchemaTest',
            description: 'Test PUT with malformed body',
            setup: function(context) {
              this.history = context.httpHistory
            },
            reqSpec: function() {
              return _.assign(_.clone(this.history.getReqSpec('FailSaveObjectSchemaTest')),
                {url: '/saveObject1/0'})
            },
            resSpec: {
              $property: {
                get: function() {
                  return this.history.getResSpec('FailSaveObjectSchemaTest')
                },
              },
            },
          },
          {
            name: 'SuccessSaveObject1SchemaTest',
            description: 'Test PUT with well formed body',
            setup: function(context) {
              this.history = context.httpHistory
            },
            reqSpec: function() {
              return _.assign(_.clone(this.history.getReqSpec('SuccessSaveObjectSchemaTest')),
                {url: '/saveObject1/0'})
            },
            resSpec: {
              $property: {
                get: function() {
                  return this.history.getResSpec('SuccessSaveObjectSchemaTest')
                },
              },
            },
          },
        ],
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'DoesNotReturnSavedObjectConfigSaveObjectTest',
        service: o({
          _type: pong.Service,
          endpoints: {
            saveObject: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {saveObject: true},
              saveObjectConfig: {
                returnsSavedObject: false,
              },
            }),
          },
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameterName = this.service.endpoints.saveObject.idParameterName
          context.global.idHeaderName = this.service.endpoints.saveObject.idHeaderName
        },
        teardown: function(context) {
          delete context.global.idHeaderName
          delete context.global.idParameterName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'SaveObjectExistingTest',
            description: 'Test PUT of existing object',
            reqSpec: function(context) {
              return {
                url: '/saveObject/0',
                method: 'PUT',
                headers: {
                  'x-pong': ejson.stringify({
                    saveObject: {$args: 0},
                  }),
                },
                body: {[context.global.idParameterName]: '0', foo: 'bar'},
              }
            },
            resSpec: {
              statusCode: 204,
              body: undefined,
            },
          },
        ],
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'CustomConfigParameterTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            saveObject: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {saveObject: true},
              saveObjectConfig: {
                parameters: {
                  $merge: {
                    foo: {
                      location: 'header',
                      schema: {
                        type: 'number',
                        minimum: 0,
                        multipleOf: 2,
                      },
                    },
                  },
                },
              },
            }),
          },
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameterName = this.service.endpoints.saveObject.idParameterName
        },
        teardown: function(context) {
          delete context.global.idParameterName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          o({
            _type: testtube.Test,
            name: 'SaveObjectConfigCustomParameterInitializationTest',
            doTest: function(context) {
              let saveObjectOperation =
                this.parent.service.endpoints.saveObject.endpoints[`:${context.global.idParameterName}`].put
              assert.deepEqual(saveObjectOperation.parameters, {
                object: {
                  name: 'object',
                  location: 'body',
                  description: 'Object to save',
                  schema:
                  {
                    type: 'object',
                    properties: {_id: {type: 'string'}},
                    required: ['_id'],
                    additionalProperties: true,
                  },
                  required: true,
                  default: undefined,
                },
                foo: {
                  name: 'foo',
                  location: 'header',
                  description: undefined,
                  schema: {type: 'number', minimum: 0, multipleOf: 2},
                  required: false,
                  default: undefined,
                },
              })
            },
          }),
          {
            name: 'SaveObjectConfigCustomParameterPassedViaOptionsFailTest',
            setup: function(context) {
              context.local.saveObjectSpy = sinon.spy(this.parent.service.endpoints.saveObject, 'saveObject')
            },
            teardown: function(context) {
              assert.equal(context.local.saveObjectSpy.called, false)
              context.local.saveObjectSpy.restore()
            },
            reqSpec: function(context) {
              return {
                url: '/saveObject/0',
                method: 'PUT',
                headers: {
                  'x-pong': ejson.stringify({
                    saveObject: {$args: 0},
                  }),
                  foo: 3,
                },
                body: {[context.global.idParameterName]: '0', foo: 'bar'},
              }
            },
            resSpec: {
              statusCode: 400,
            },
          },
          {
            name: 'SaveObjectConfigCustomParameterPassedViaOptionsSuccessTest',
            setup: function(context) {
              context.local.saveObjectSpy = sinon.spy(this.parent.service.endpoints.saveObject, 'saveObject')
            },
            teardown: function(context) {
              assert.equal(context.local.saveObjectSpy.firstCall.args[1].foo, 4)
              context.local.saveObjectSpy.restore()
            },
            reqSpec: function(context) {
              return {
                url: '/saveObject/0',
                method: 'PUT',
                headers: {
                  'x-pong': ejson.stringify({
                    saveObject: {$args: 0},
                  }),
                  foo: 4,
                },
                body: {[context.global.idParameterName]: '0', foo: 'bar'},
              }
            },
            resSpec: {
              statusCode: 200,
            },
          },
        ],
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'SupportsUpsertConfigSaveObjectTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            saveObject: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {saveObject: true},
              saveObjectConfig: {
                supportsUpsert: true,
              },
            }),
          },
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameterName = this.service.endpoints.saveObject.idParameterName
          context.global.idHeaderName = this.service.endpoints.saveObject.idHeaderName
        },
        teardown: function(context) {
          delete context.global.idHeaderName
          delete context.global.idParameterName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'SaveObjectsResultsInBadRequestTest',
            description: 'Test PUT of array with multiple objects',
            reqSpec: function(context) {
              return {
                url: '/saveObject/0',
                method: 'PUT',
                body: [
                  {[context.global.idParameterName]: '0', foo: 'bar'},
                  {[context.global.idParameterName]: '1', bar: 'baz'},
                  {[context.global.idParameterName]: '2', baz: 'yaz'},
                ],
              }
            },
            resSpec: {
              statusCode: 400,
            },
          },
          {
            name: 'SaveObjectExistingTest',
            description: 'Test PUT of existing object',
            reqSpec: function(context) {
              return {
                url: '/saveObject/0',
                method: 'PUT',
                headers: {
                  'x-pong': ejson.stringify({
                    saveObject: {$args: 0},
                  }),
                },
                body: {[context.global.idParameterName]: '0', foo: 'bar'},
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(body, context) {
                assert.deepStrictEqual(body, {
                  [context.global.idParameterName]: '0',
                  foo: 'bar',
                })
              },
            },
          },
          {
            name: 'SaveObjectCreatedTest',
            description: 'Test PUT of new object',
            reqSpec: function(context) {
              return {
                url: '/saveObject/0',
                method: 'PUT',
                headers: {
                  'x-pong': ejson.stringify({
                    saveObject: {
                      val: {$args: 0},
                      created: true,
                    },
                  }),
                },
                body: {[context.global.idParameterName]: '0', foo: 'bar'},
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepStrictEqual(
                  headers[context.global.idHeaderName],
                  ejson.stringify('0')
                )
                assert.deepStrictEqual(headers.location, '/saveObject/0')
              },
              body: function(body, context) {
                assert.deepStrictEqual(body, {
                  [context.global.idParameterName]: '0',
                  foo: 'bar',
                })
              },
            },
          },
        ],
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'HookAndHandlerContextTests',
        service: o({
          _type: carbond.Service,
          endpoints: {
            saveObject: o({
              _type: carbond.collections.Collection,
              enabled: {saveObject: true},
              preSaveObjectOperation: function(config, req, res, context) {
                context.preSaveObjectOperation = 1
                return carbond.collections.Collection.prototype.preSaveObjectOperation.apply(this, arguments)
              },
              preSaveObject: function(object, options, context) {
                context.preSaveObject = 1
                return carbond.collections.Collection.prototype.preSaveObject.apply(this, arguments)
              },
              saveObject: function(object, options, context) {
                context.saveObject = 1
                return object
              },
              postSaveObject: function(result, object, options, context) {
                context.postSaveObject = 1
                return carbond.collections.Collection.prototype.postSaveObject.apply(this, arguments)
              },
              postSaveObjectOperation: function(result, config, req, res, context) {
                context.postSaveObjectOperation = 1
                res.set('context', ejson.stringify(context))
                return carbond.collections.Collection.prototype.postSaveObjectOperation.apply(this, arguments)
              },
            }),
          },
        }),
        tests: [
          {
            reqSpec: function() {
              return {
                url: '/saveObject/0',
                method: 'PUT',
                body: {[this.parent.service.endpoints.saveObject.idParameterName]: '0'},
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert.deepEqual(ejson.parse(headers.context), {
                  preSaveObjectOperation: 1,
                  preSaveObject: 1,
                  saveObject: 1,
                  postSaveObject: 1,
                  postSaveObjectOperation: 1,
                })
              },
            },
          },
        ],
      }),
    ],
  })
})

