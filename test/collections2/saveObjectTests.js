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
              enabled: {saveObject: true}
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.saveObject.idParameter
          context.global.idHeader = this.service.endpoints.saveObject.idHeader
        },
        teardown: function(context) {
          delete context.global.idHeader
          delete context.global.idParameter
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
                  {[context.global.idParameter]: '0', foo: 'bar'},
                  {[context.global.idParameter]: '1', bar: 'baz'},
                  {[context.global.idParameter]: '2', baz: 'yaz'}
                ]
              }
            },
            resSpec: {
              statusCode: 400
            }
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
                    saveObject: {$args: 0}
                  })
                },
                body: {[context.global.idParameter]: '0', foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(body, context) {
                assert.deepStrictEqual(body, {
                  [context.global.idParameter]: '0',
                  foo: 'bar'
                })
              }
            }
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
                      created: true
                    }
                  })
                },
                body: {[context.global.idParameter]: '0', foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepStrictEqual(
                  headers[context.global.idHeader],
                  ejson.stringify('0'))
                assert.deepStrictEqual(headers.location, '/saveObject/0')
              },
              body: function(body, context) {
                assert.deepStrictEqual(body, {
                  [context.global.idParameter]: '0',
                  foo: 'bar'
                })
              }
            }
          },
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'customSchemaConfigSaveObjectTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            saveObject: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {saveObject: true},
              saveObjectConfig: {
                saveObjectSchema: {
                  type: 'object',
                  properties: {
                    _id: {type: 'string'},
                    foo: {
                      type: 'string',
                      pattern: '^(bar|baz|yaz)$'
                    }
                  },
                  required: ['_id'],
                  patternProperties: {
                    '^\\d+$': {type: 'string'}
                  },
                  additionalProperties: false
                }
              }
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.saveObject.idParameter
        },
        teardown: function(context) {
          delete context.global.idParameter
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'failSaveObjectSchemaTest',
            description: 'Test PUT of malformed object',
            setup: function() {
              pong.util.collectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/saveObject/0',
                method: 'PUT',
                body: {[context.global.idParameter]: '0', bar: 'baz'}
              }
            },
            resSpec: {
              statusCode: 400,
            }
          },
          {
            name: 'successSaveObjectSchemaTest',
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
                    saveObject: {$args: 0}
                  })
                },
                body: {[context.global.idParameter]: '0', foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(body, context) {
                assert.deepStrictEqual(body, {
                  [context.global.idParameter]: '0', foo: 'bar'
                })
              }
            }
          },
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'doesNotReturnSavedObjectConfigSaveObjectTest',
        service: o({
          _type: pong.Service,
          endpoints: {
            saveObject: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {saveObject: true},
              saveObjectConfig: {
                returnsSavedObject: false
              }
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.saveObject.idParameter
          context.global.idHeader = this.service.endpoints.saveObject.idHeader
        },
        teardown: function(context) {
          delete context.global.idHeader
          delete context.global.idParameter
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
                    saveObject: {$args: 0}
                  })
                },
                body: {[context.global.idParameter]: '0', foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 204,
              body: undefined
            }
          }
        ]
      })
    ]
  })
})

