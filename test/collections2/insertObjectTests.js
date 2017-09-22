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
 * insertObject tests
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
    name: 'InsertObjectTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'DefaultConfigInsertObjectTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            insertObject: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {insertObject: true}
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.insertObject.idParameter
          context.global.idHeader = this.service.endpoints.insertObject.idHeader
        },
        teardown: function(context) {
          pong.util.collectionIdGenerator.resetId()
          delete context.global.idHeader
          delete context.global.idParameter
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'InsertObjectsResultsInBadRequestTest',
            description: 'Test POST of array with multiple objects',
            reqSpec: {
              url: '/insertObject',
              method: 'POST',
              body: [
                {foo: 'bar'},
                {bar: 'baz'},
                {baz: 'yaz'}
              ]
            },
            resSpec: {
              statusCode: 400
            }
          },
          {
            name: 'InsertObjectTest',
            description: 'Test POST of object',
            setup: function() {
              pong.util.collectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/insertObject',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insertObject: {$args: 0}
                  })
                },
                body: {foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepStrictEqual(
                  headers[context.global.idHeader],
                  ejson.stringify('0'))
                assert.deepStrictEqual(headers.location, '/insertObject/0')
              },
              body: function(body, context) {
                assert.deepStrictEqual(body, {
                  [context.global.idParameter]: '0',
                  foo: 'bar'
                })
              }
            }
          },
          {
            name: 'InsertObjectWithIdTest',
            description: 'Test POST of object with ID',
            setup: function() {
              pong.util.collectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/insertObject',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insertObject: {$args: 0}
                  })
                },
                body: {[context.global.idParameter]: '0', foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 400,
            }
          },
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'CustomSchemaConfigInsertObjectTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            insertObject: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {insertObject: true},
              insertObjectConfig: {
                insertObjectSchema: {
                  type: 'object',
                  properties: {
                    foo: {
                      type: 'string',
                      pattern: '^(bar|baz|yaz)$'
                    }
                  },
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
          context.global.idParameter = this.service.endpoints.insertObject.idParameter
          context.global.idHeader = this.service.endpoints.insertObject.idHeader
        },
        teardown: function(context) {
          pong.util.collectionIdGenerator.resetId()
          delete context.global.idHeader
          delete context.global.idParameter
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'FailInsertObjectSchemaTest',
            description: 'Test POST of malformed object',
            setup: function() {
              pong.util.collectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/insertObject',
                method: 'POST',
                body: {bar: 'baz'}
              }
            },
            resSpec: {
              statusCode: 400,
            }
          },
          {
            name: 'SuccessInsertObjectSchemaTest',
            description: 'Test POST with well formed object',
            setup: function() {
              pong.util.collectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/insertObject',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insertObject: {$args: 0}
                  })
                },
                body: {foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepStrictEqual(
                  headers[context.global.idHeader],
                  ejson.stringify('0'))
                assert.deepStrictEqual(
                  headers.location, '/insertObject/0')
              },
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
        name: 'DoesNotReturnInsertedObjectConfigInsertObjectTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            insertObject: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {insertObject: true},
              insertObjectConfig: {
                returnsInsertedObject: false
              }
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.insertObject.idParameter
          context.global.idHeader = this.service.endpoints.insertObject.idHeader
        },
        teardown: function(context) {
          pong.util.collectionIdGenerator.resetId()
          delete context.global.idHeader
          delete context.global.idParameter
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'InsertObjectTest',
            description: 'Test POST of object',
            setup: function() {
              pong.util.collectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/insertObject',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insertObject: {$args: 0}
                  })
                },
                body: {foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepStrictEqual(
                  headers[context.global.idHeader],
                  ejson.stringify('0'))
                assert.deepStrictEqual(
                  headers.location, '/insertObject/0')
              },
              body: undefined
            }
          }
        ]
      })
    ]
  })
})

