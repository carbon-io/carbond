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
    name: 'saveTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'defaultConfigSaveTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            save: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {save: true}
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.save.idParameter
        },
        teardown: function(context) {
          delete context.global.idParameter
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
                    save: {$args: 0}
                  })
                },
                body: {[context.global.idParameter]: '0', foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 400
            }
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
                    save: {$args: 0}
                  })
                },
                body: [
                  {[context.global.idParameter]: '0', foo: 'bar'},
                ]
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(body, context) {
                assert.deepStrictEqual(body, [
                  {[context.global.idParameter]: '0', foo: 'bar'},
                ])
              }
            }
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
                    save: {$args: 0}
                  })
                },
                body: [
                  {[context.global.idParameter]: '0', foo: 'bar'},
                  {[context.global.idParameter]: '1', bar: 'baz'},
                  {[context.global.idParameter]: '2', baz: 'yaz'}
                ]
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(body, context) {
                assert.deepStrictEqual(body, [
                  {[context.global.idParameter]: '0', foo: 'bar'},
                  {[context.global.idParameter]: '1', bar: 'baz'},
                  {[context.global.idParameter]: '2', baz: 'yaz'}
                ])
              }
            }
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
                    save: {$args: 0}
                  })
                },
                body: [
                  {foo: 'bar'},
                ]
              }
            },
            resSpec: {
              statusCode: 400
            }
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
                    save: {$args: 0}
                  })
                },
                body: [
                  {foo: 'bar'},
                  {bar: 'baz'},
                  {baz: 'yaz'}
                ]
              }
            },
            resSpec: {
              statusCode: 400
            }
          },
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'customSchemaConfigSaveTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            save: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {save: true},
              saveConfig: {
                saveSchema: {
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
          context.global.idParameter = this.service.endpoints.save.idParameter
        },
        teardown: function(context) {
          delete context.global.idParameter
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
                  {[context.global.idParameter]: '0', foo: 'bar'},
                  {[context.global.idParameter]: '1', bar: 'baz'},
                  {[context.global.idParameter]: '2', foo: 'bur'},
                ]
              }
            },
            resSpec: {
              statusCode: 400,
            }
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
                    save: {$args: 0}
                  })
                },
                body: [
                  {[context.global.idParameter]: '0', foo: 'bar'},
                  {[context.global.idParameter]: '1', '666': 'bar'},
                  {[context.global.idParameter]: '2', '777': 'baz'}
                ]
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(body, context) {
                assert.deepStrictEqual(body, [
                  {[context.global.idParameter]: '0', foo: 'bar'},
                  {[context.global.idParameter]: '1', '666': 'bar'},
                  {[context.global.idParameter]: '2', '777': 'baz'}
                ])
              }
            }
          },
        ]
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
                returnsSavedObjects: false
              }
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.save.idParameter
        },
        teardown: function(context) {
          delete context.global.idParameter
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
                    save: {$args: 0}
                  })
                },
                body: [
                  {[context.global.idParameter]: '0', foo: 'bar'},
                ]
              }
            },
            resSpec: {
              statusCode: 204,
              body: undefined
            }
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
                    save: {$args: 0}
                  })
                },
                body: [
                  {[context.global.idParameter]: '0', foo: 'bar'},
                  {[context.global.idParameter]: '1', bar: 'baz'},
                  {[context.global.idParameter]: '2', baz: 'yaz'}
                ]
              }
            },
            resSpec: {
              statusCode: 204,
              body: undefined
            }
          },
        ]
      })
    ]
  })
})

