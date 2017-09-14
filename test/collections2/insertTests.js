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
 * insert tests
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
    name: 'insertTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'defaultConfigInsertTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            insert: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {insert: true}
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.insert.idParameter
          context.global.idHeader = this.service.endpoints.insert.idHeader
        },
        teardown: function(context) {
          pong.util.collectionIdGenerator.resetId()
          delete context.global.idHeader
          delete context.global.idParameter
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'InsertObjectResultsInBadRequestTest',
            description: 'Test POST of a single object is rejected',
            reqSpec: {
              url: '/insert',
              method: 'POST',
              body: {
                foo: 'bar'
              }
            },
            resSpec: {
              statusCode: 400
            }
          },
          {
            name: 'InsertSinglObjectInArrayTest',
            description: 'Test POST of array with single object',
            setup: function() {
              pong.util.collectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/insert',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insert: {$args: 0}
                  })
                },
                body: [{foo: 'bar'}]
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepEqual(
                  headers[context.global.idHeader],
                  ejson.stringify(['0']))
                assert.deepEqual(
                  headers.location,
                  url.format({pathname: '/insert', query: {[context.global.idParameter]: '0'}}))
              },
              body: function(body, context) {
                assert.deepEqual(body, [{
                  [context.global.idParameter]: 0,
                  foo: 'bar'
                }])
              }
            }
          },
          {
            name: 'InsertMultipleObjectsTest',
            description: 'Test POST of array with multiple objects',
            setup: function() {
              pong.util.collectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/insert',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insert: {$args: 0}
                  })
                },
                body: [{foo: 'bar'}, {bar: 'baz'}, {baz: 'yaz'}]
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepEqual(
                  headers[context.global.idHeader],
                  ejson.stringify(['0', '1', '2']))
                assert.deepEqual(
                  headers.location,
                  url.format(
                    {pathname: '/insert', query: {[context.global.idParameter]: ['0', '1', '2']}}))
              },
              body: function(body, context) {
                assert.deepEqual(body, [
                  {[context.global.idParameter]: 0, foo: 'bar'},
                  {[context.global.idParameter]: 1, bar: 'baz'},
                  {[context.global.idParameter]: 2, baz: 'yaz'}
                ])
              }
            }
          },
          {
            name: 'InsertSingleObjectWithIdTest',
            description: 'Test POST of array with single object with ID',
            setup: function() {
              pong.util.collectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/insert',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insert: {$args: 0}
                  })
                },
                body: [{[context.global.idParameter]: '0', foo: 'bar'}]
              }
            },
            resSpec: {
              statusCode: 400,
            }
          },
          {
            name: 'InsertMultipleObjectsWithIdsTest',
            description: 'Test POST of array with multiple objects with IDs',
            setup: function() {
              pong.util.collectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/insert',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insert: {$args: 0}
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
              statusCode: 400,
            }
          }
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'customSchemaConfigInsertTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            insert: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {insert: true},
              insertConfig: {
                insertSchema: {
                  type: 'object',
                  properties: {
                    foo: {
                      type: 'string', 
                      pattern: '^(bar|baz|yaz)$'
                    }
                  },
                  additionalProperties: {
                    type: 'string',
                    patter: '^\\d+$'
                  }
                }
              }
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.insert.idParameter
          context.global.idHeader = this.service.endpoints.insert.idHeader
        },
        teardown: function(context) {
          pong.util.collectionIdGenerator.resetId()
          delete context.global.idHeader
          delete context.global.idParameter
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'failInsertSchemaTest',
            description: 'Test POST of array with malformed object',
            setup: function() {
              pong.util.collectionIdGenerator.resetId()
              this.preInsertOperationSpy = 
                sinon.spy(this.parent.service.endpoints.insert, 'preInsertOperation')
            },
            teardown: function() {
              this.preInsertOperationSpy.restore()
            },
            reqSpec: function(context) {
              return {
                url: '/insert',
                method: 'POST',
                body: [{foo: 'bar'}, {bar: 'baz'}, {foo: 'bur'}]
              }
            },
            resSpec: {
              statusCode: 400,
            }
          },
          {
            name: 'successInsertSchemaTest',
            description: 'Test POST of array with well formed objects',
            setup: function() {
              pong.util.collectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/insert',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insert: {$args: 0}
                  })
                },
                body: [{foo: 'bar'}, {bar: '666'}, {baz: '666'}]
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepEqual(
                  headers[context.global.idHeader],
                  ejson.stringify(['0', '1', '2']))
                assert.deepEqual(
                  headers.location,
                  url.format(
                    {pathname: '/insert', query: {[context.global.idParameter]: ['0', '1', '2']}}))
              },
              body: function(body, context) {
                assert.deepEqual(body, [
                  {[context.global.idParameter]: 0, foo: 'bar'},
                  {[context.global.idParameter]: 1, bar: '666'},
                  {[context.global.idParameter]: 2, baz: '666'}
                ])
              }
            }
          },
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'doesNotReturnInsertedObjectsConfigInsertTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            insert: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {insert: true},
              insertConfig: {
                returnsInsertedObject: false
              }
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.insert.idParameter
          context.global.idHeader = this.service.endpoints.insert.idHeader
        },
        teardown: function(context) {
          pong.util.collectionIdGenerator.resetId()
          delete context.global.idHeader
          delete context.global.idParameter
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'InsertSinglObjectInArrayTest',
            description: 'Test POST of array with single object',
            setup: function() {
              pong.util.collectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/insert',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insert: {$args: 0}
                  })
                },
                body: [{foo: 'bar'}]
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepEqual(
                  headers[context.global.idHeader],
                  ejson.stringify(['0']))
                assert.deepEqual(
                  headers.location,
                  url.format({pathname: '/insert', query: {[context.global.idParameter]: '0'}}))
              },
              body: function(body, context) {
                debugger
              }
            }
          },
          {
            name: 'InsertMultipleObjectsTest',
            description: 'Test POST of array with multiple objects',
            setup: function() {
              pong.util.collectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/insert',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insert: {$args: 0}
                  })
                },
                body: [{foo: 'bar'}, {bar: 'baz'}, {baz: 'yaz'}]
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepEqual(
                  headers[context.global.idHeader],
                  ejson.stringify(['0', '1', '2']))
                assert.deepEqual(
                  headers.location,
                  url.format(
                    {pathname: '/insert', query: {[context.global.idParameter]: ['0', '1', '2']}}))
              },
              body: function(body, context) {
                debugger
              }
            }
          },
        ]
      })
    ],
  })
})

