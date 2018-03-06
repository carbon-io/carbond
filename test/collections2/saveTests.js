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
 * save tests
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
    name: 'SaveTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'DefaultConfigSaveTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            save: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {save: true},
            }),
          },
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameterName = this.service.endpoints.save.idParameterName
        },
        teardown: function(context) {
          delete context.global.idParameterName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'SaveObjectResultsInBadRequestTest',
            description: 'Test PUT of a single object is rejected',
            reqSpec: function(context) {
              return {
                url: '/save',
                method: 'PUT',
                headers: {
                  'x-pong': ejson.stringify({
                    save: {$args: 0},
                  }),
                },
                body: {[context.global.idParameterName]: '0', foo: 'bar'},
              }
            },
            resSpec: {
              statusCode: 400,
            },
          },
          {
            name: 'SaveSingleObjectInArrayTest',
            description: 'Test PUT of array with single object',
            reqSpec: function(context) {
              return {
                url: '/save',
                method: 'PUT',
                headers: {
                  'x-pong': ejson.stringify({
                    save: {$args: 0},
                  }),
                },
                body: [
                  {[context.global.idParameterName]: '0', foo: 'bar'},
                ],
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(body, context) {
                assert.deepStrictEqual(body, [
                  {[context.global.idParameterName]: '0', foo: 'bar'},
                ])
              },
            },
          },
          {
            name: 'SaveMultipleObjectsTest',
            description: 'Test PUT of array with multiple objects',
            reqSpec: function(context) {
              return {
                url: '/save',
                method: 'PUT',
                headers: {
                  'x-pong': ejson.stringify({
                    save: {$args: 0},
                  }),
                },
                body: [
                  {[context.global.idParameterName]: '0', foo: 'bar'},
                  {[context.global.idParameterName]: '1', bar: 'baz'},
                  {[context.global.idParameterName]: '2', baz: 'yaz'},
                ],
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(body, context) {
                assert.deepStrictEqual(body, [
                  {[context.global.idParameterName]: '0', foo: 'bar'},
                  {[context.global.idParameterName]: '1', bar: 'baz'},
                  {[context.global.idParameterName]: '2', baz: 'yaz'},
                ])
              },
            },
          },
          {
            name: 'SaveSingleObjectWithoutIdTest',
            description: 'Test PUT of array with single object without and ID',
            reqSpec: function(context) {
              return {
                url: '/save',
                method: 'PUT',
                headers: {
                  'x-pong': ejson.stringify({
                    save: {$args: 0},
                  }),
                },
                body: [
                  {foo: 'bar'},
                ],
              }
            },
            resSpec: {
              statusCode: 400,
            },
          },
          {
            name: 'SaveMultipleObjectsWithoutIdsTest',
            description: 'Test PUT of array with multiple objects without IDs',
            reqSpec: function(context) {
              return {
                url: '/save',
                method: 'PUT',
                headers: {
                  'x-pong': ejson.stringify({
                    save: {$args: 0},
                  }),
                },
                body: [
                  {foo: 'bar'},
                  {bar: 'baz'},
                  {baz: 'yaz'},
                ],
              }
            },
            resSpec: {
              statusCode: 400,
            },
          },
        ],
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'CustomSchemaConfigSaveTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            save: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {save: true},
              saveConfig: {
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
            save1: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {save: true},
              saveConfig: {
                '$parameters.objects.schema': {
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
          context.global.idParameterName = this.service.endpoints.save.idParameterName
        },
        teardown: function(context) {
          delete context.global.idParameterName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'FailSaveSchemaTest',
            description: 'Test PUT of array with malformed object',
            reqSpec: function(context) {
              return {
                url: '/save',
                method: 'PUT',
                body: [
                  {[context.global.idParameterName]: '0', foo: 'bar'},
                  {[context.global.idParameterName]: '1', bar: 'baz'},
                  {[context.global.idParameterName]: '2', foo: 'bur'},
                ],
              }
            },
            resSpec: {
              statusCode: 400,
            },
          },
          {
            name: 'SuccessSaveSchemaTest',
            description: 'Test PUT of array with multiple objects',
            reqSpec: function(context) {
              return {
                url: '/save',
                method: 'PUT',
                headers: {
                  'x-pong': ejson.stringify({
                    save: {$args: 0},
                  }),
                },
                body: [
                  {[context.global.idParameterName]: '0', foo: 'bar'},
                  {[context.global.idParameterName]: '1', '666': 'bar'},
                  {[context.global.idParameterName]: '2', '777': 'baz'},
                ],
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(body, context) {
                assert.deepStrictEqual(body, [
                  {[context.global.idParameterName]: '0', foo: 'bar'},
                  {[context.global.idParameterName]: '1', '666': 'bar'},
                  {[context.global.idParameterName]: '2', '777': 'baz'},
                ])
              },
            },
          },
          {
            name: 'FailSave1SchemaTest',
            description: 'Test PUT with malformed body',
            setup: function(context) {
              this.history = context.httpHistory
            },
            reqSpec: function() {
              return _.assign(_.clone(this.history.getReqSpec('FailSaveSchemaTest')),
                {url: '/save1'})
            },
            resSpec: {
              $property: {
                get: function() {
                  return this.history.getResSpec('FailSaveSchemaTest')
                },
              },
            },
          },
          {
            name: 'SuccessSave1SchemaTest',
            description: 'Test PUT with well formed body',
            setup: function(context) {
              this.history = context.httpHistory
            },
            reqSpec: function() {
              return _.assign(_.clone(this.history.getReqSpec('SuccessSaveSchemaTest')),
                {url: '/save1'})
            },
            resSpec: {
              $property: {
                get: function() {
                  return this.history.getResSpec('SuccessSaveSchemaTest')
                },
              },
            },
          },
        ],
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'DoesNotReturnSavedObjectsConfigSaveTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            save: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {save: true},
              saveConfig: {
                returnsSavedObjects: false,
              },
            }),
          },
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameterName = this.service.endpoints.save.idParameterName
        },
        teardown: function(context) {
          delete context.global.idParameterName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'SaveSingleObjectInArrayTest',
            description: 'Test PUT of array with single object',
            reqSpec: function(context) {
              return {
                url: '/save',
                method: 'PUT',
                headers: {
                  'x-pong': ejson.stringify({
                    save: {$args: 0},
                  }),
                },
                body: [
                  {[context.global.idParameterName]: '0', foo: 'bar'},
                ],
              }
            },
            resSpec: {
              statusCode: 204,
              body: undefined,
            },
          },
          {
            name: 'SaveMultipleObjectsTest',
            description: 'Test PUT of array with multiple objects',
            reqSpec: function(context) {
              return {
                url: '/save',
                method: 'PUT',
                headers: {
                  'x-pong': ejson.stringify({
                    save: {$args: 0},
                  }),
                },
                body: [
                  {[context.global.idParameterName]: '0', foo: 'bar'},
                  {[context.global.idParameterName]: '1', bar: 'baz'},
                  {[context.global.idParameterName]: '2', baz: 'yaz'},
                ],
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
            save: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {save: true},
              saveConfig: {
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
          context.global.idParameterName = this.service.endpoints.save.idParameterName
        },
        teardown: function(context) {
          delete context.global.idParameterName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          o({
            _type: testtube.Test,
            name: 'SaveConfigCustomParameterInitializationTest',
            doTest: function(context) {
              let saveOperation = this.parent.service.endpoints.save.put
              assert.deepEqual(saveOperation.parameters, {
                objects: {
                  name: 'objects',
                  location: 'body',
                  description: carbond.collections.SaveConfig._STRINGS.parameters.objects.description,
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        [context.global.idParameterName]: {
                          type: 'string',
                        },
                      },
                      required: [context.global.idParameterName],
                      additionalProperties: true,
                    },
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
            name: 'SaveConfigCustomParameterPassedViaOptionsFailTest',
            setup: function(context) {
              context.local.saveSpy = sinon.spy(this.parent.service.endpoints.save, 'save')
            },
            teardown: function(context) {
              assert.equal(context.local.saveSpy.called, false)
              context.local.saveSpy.restore()
            },
            reqSpec: function(context) {
              return {
                url: '/save',
                method: 'PUT',
                headers: {
                  'x-pong': ejson.stringify({
                    save: {$args: 0},
                  }),
                  foo: 3,
                },
                body: [{[context.global.idParameterName]: '0', foo: 'bar'}],
              }
            },
            resSpec: {
              statusCode: 400,
            },
          },
          {
            name: 'SaveConfigCustomParameterPassedViaOptionsSuccessTest',
            setup: function(context) {
              context.local.saveSpy = sinon.spy(this.parent.service.endpoints.save, 'save')
            },
            teardown: function(context) {
              assert.equal(context.local.saveSpy.firstCall.args[1].foo, 4)
              context.local.saveSpy.restore()
            },
            reqSpec: function(context) {
              return {
                url: '/save',
                method: 'PUT',
                headers: {
                  'x-pong': ejson.stringify({
                    save: {$args: 0},
                  }),
                  foo: 4,
                },
                body: [{[context.global.idParameterName]: '0', foo: 'bar'}],
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
        name: 'HookAndHandlerContextTests',
        service: o({
          _type: carbond.Service,
          endpoints: {
            save: o({
              _type: carbond.collections.Collection,
              enabled: {save: true},
              preSaveOperation: function(config, req, res, context) {
                context.preSaveOperation = 1
                return carbond.collections.Collection.prototype.preSaveOperation.apply(this, arguments)
              },
              preSave: function(objects, options, context) {
                context.preSave = 1
                return carbond.collections.Collection.prototype.preSave.apply(this, arguments)
              },
              save: function(objects, options, context) {
                context.save = 1
                return objects
              },
              postSave: function(result, objects, options, context) {
                context.postSave = 1
                return carbond.collections.Collection.prototype.postSave.apply(this, arguments)
              },
              postSaveOperation: function(result, config, req, res, context) {
                context.postSaveOperation = 1
                res.set('context', ejson.stringify(context))
                return carbond.collections.Collection.prototype.postSaveOperation.apply(this, arguments)
              },
            }),
          },
        }),
        tests: [
          {
            reqSpec: function() {
              return {
                url: '/save',
                method: 'PUT',
                body: [{[this.parent.service.endpoints.save.idParameterName]: '0'}],
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert.deepEqual(ejson.parse(headers.context), {
                  preSaveOperation: 1,
                  preSave: 1,
                  save: 1,
                  postSave: 1,
                  postSaveOperation: 1,
                })
              },
            },
          },
        ],
      }),
    ],
  })
})

