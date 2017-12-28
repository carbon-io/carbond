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
    name: 'InsertTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'DefaultConfigInsertTests',
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
          context.global.idParameterName = this.service.endpoints.insert.idParameterName
          context.global.idHeader = this.service.endpoints.insert.idHeader
        },
        teardown: function(context) {
          pong.util.collectionIdGenerator.resetId()
          delete context.global.idHeader
          delete context.global.idParameterName
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
                assert.deepStrictEqual(
                  headers[context.global.idHeader],
                  ejson.stringify(['0']))
                assert.deepStrictEqual(
                  headers.location,
                  url.format({pathname: '/insert', query: {[context.global.idParameterName]: '0'}}))
              },
              body: function(body, context) {
                assert.deepStrictEqual(body, [{
                  [context.global.idParameterName]: '0',
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
                assert.deepStrictEqual(
                  headers[context.global.idHeader],
                  ejson.stringify(['0', '1', '2']))
                assert.deepStrictEqual(
                  headers.location,
                  url.format(
                    {pathname: '/insert', query: {[context.global.idParameterName]: ['0', '1', '2']}}))
              },
              body: function(body, context) {
                assert.deepStrictEqual(body, [
                  {[context.global.idParameterName]: '0', foo: 'bar'},
                  {[context.global.idParameterName]: '1', bar: 'baz'},
                  {[context.global.idParameterName]: '2', baz: 'yaz'}
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
                body: [{[context.global.idParameterName]: '0', foo: 'bar'}]
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
                  {[context.global.idParameterName]: '0', foo: 'bar'},
                  {[context.global.idParameterName]: '1', bar: 'baz'},
                  {[context.global.idParameterName]: '2', baz: 'yaz'}
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
        name: 'CustomSchemaConfigInsertTests',
        description: 'Test custom insert schema',
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
                  patternProperties: {
                    '^\\d+$': {type: 'string'}
                  },
                  additionalProperties: false
                }
              }
            }),
            insert1: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {insert: true},
              insertConfig: {
                '$parameters.objects.schema': {
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
          context.global.idParameterName = this.service.endpoints.insert.idParameterName
          context.global.idHeader = this.service.endpoints.insert.idHeader
        },
        teardown: function(context) {
          pong.util.collectionIdGenerator.resetId()
          delete context.global.idHeader
          delete context.global.idParameterName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'FailInsertSchemaTest',
            description: 'Test POST of array with malformed object',
            setup: function() {
              pong.util.collectionIdGenerator.resetId()
            },
            reqSpec: {
              url: '/insert',
              method: 'POST',
              body: [{foo: 'bar'}, {bar: 'baz'}, {foo: 'bur'}]
            },
            resSpec: {
              statusCode: 400,
            }
          },
          {
            name: 'SuccessInsertSchemaTest',
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
                body: [{foo: 'bar'}, {'666': 'bar'}, {'777': 'baz'}]
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepStrictEqual(
                  headers[context.global.idHeader],
                  ejson.stringify(['0', '1', '2']))
                assert.deepStrictEqual(
                  headers.location,
                  url.format(
                    {pathname: this.reqSpec.url, query: {[context.global.idParameterName]: ['0', '1', '2']}}))
              },
              body: function(body, context) {
                assert.deepStrictEqual(body, [
                  {[context.global.idParameterName]: '0', foo: 'bar'},
                  {[context.global.idParameterName]: '1', '666': 'bar'},
                  {[context.global.idParameterName]: '2', '777': 'baz'}
                ])
              }
            }
          },
          {
            name: 'FailInsert1SchemaTest',
            description: 'Test POST of array with malformed object',
            setup: function(context) {
              pong.util.collectionIdGenerator.resetId()
              this.history = context.httpHistory
            },
            reqSpec: function() {
              return _.assign(_.clone(this.history.getReqSpec('FailInsertSchemaTest')),
                              {url: '/insert1'})
            },
            resSpec: {
              $property: {get: function() {return this.history.getResSpec('FailInsertSchemaTest')}}
            }
          },
          {
            name: 'SuccessInsert1SchemaTest',
            description: 'Test POST of array with well formed objects',
            setup: function(context) {
              pong.util.collectionIdGenerator.resetId()
              this.history = context.httpHistory
            },
            reqSpec: function(context) {
              return _.assign(_.clone(this.history.getReqSpec('SuccessInsertSchemaTest')),
                              {url: '/insert1'})
            },
            resSpec: {
              $property: {get: function() {return this.history.getResSpec('SuccessInsertSchemaTest')}}
            }
          },
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'DoesNotReturnInsertedObjectsConfigInsertTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            insert: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {insert: true},
              insertConfig: {
                returnsInsertedObjects: false
              }
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameterName = this.service.endpoints.insert.idParameterName
          context.global.idHeader = this.service.endpoints.insert.idHeader
        },
        teardown: function(context) {
          pong.util.collectionIdGenerator.resetId()
          delete context.global.idHeader
          delete context.global.idParameterName
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
                assert.deepStrictEqual(
                  headers[context.global.idHeader],
                  ejson.stringify(['0']))
                assert.deepStrictEqual(
                  headers.location,
                  url.format({pathname: '/insert', query: {[context.global.idParameterName]: '0'}}))
              },
              body: undefined
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
                assert.deepStrictEqual(
                  headers[context.global.idHeader],
                  ejson.stringify(['0', '1', '2']))
                assert.deepStrictEqual(
                  headers.location,
                  url.format(
                    {pathname: '/insert', query: {[context.global.idParameterName]: ['0', '1', '2']}}))
              },
              body: undefined
            }
          },
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'CustomConfigParameterTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            insert: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {insert: true},
              insertConfig: {
                parameters: {
                  $merge: {
                    foo: {
                      location: 'header',
                      schema: {
                        type: 'number',
                        minimum: 0,
                        multipleOf: 2
                      }
                    }
                  }
                }
              }
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameterName = this.service.endpoints.insert.idParameterName
          context.global.idHeader = this.service.endpoints.insert.idHeader
        },
        teardown: function(context) {
          pong.util.collectionIdGenerator.resetId()
          delete context.global.idHeader
          delete context.global.idParameterName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          o({
            _type: testtube.Test,
            name: 'InsertConfigCustomParameterInitializationTest',
            doTest: function() {
              let insertOperation = this.parent.service.endpoints.insert.post
              assert.deepEqual(insertOperation.parameters, {
                objects: {
                  name: 'objects',
                  description: carbond.collections.InsertConfig._STRINGS.parameters.objects.description,
                  location: 'body',
                  schema: {
                    type: 'array',
                    items: {type: 'object', properties: {_id: {type: 'string'}}}
                  },
                  required: true,
                  default: undefined,
                },
                foo: {
                  name: 'foo',
                  description: undefined,
                  location: 'header',
                  schema: {type: 'number', minimum: 0, multipleOf: 2},
                  required: false,
                  default: undefined
                }
              })
            }
          }),
          {
            name: 'InsertConfigCustomParameterPassedViaOptionsFailTest',
            setup: function(context) {
              pong.util.collectionIdGenerator.resetId()
              context.local.insertSpy = sinon.spy(this.parent.service.endpoints.insert, 'insert')
            },
            teardown: function(context) {
              assert.equal(context.local.insertSpy.called, false)
              context.local.insertSpy.restore()
            },
            reqSpec: function(context) {
              return {
                url: '/insert',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insert: {$args: 0}
                  }),
                  foo: 3
                },
                body: [{foo: 'bar'}]
              }
            },
            resSpec: {
              statusCode: 400
            }
          },
          {
            name: 'InsertConfigCustomParameterPassedViaOptionsSuccessTest',
            setup: function(context) {
              pong.util.collectionIdGenerator.resetId()
              context.local.insertSpy = sinon.spy(this.parent.service.endpoints.insert, 'insert')
            },
            teardown: function(context) {
              assert.equal(context.local.insertSpy.firstCall.args[1].foo, 4)
              context.local.insertSpy.restore()
            },
            reqSpec: function(context) {
              return {
                url: '/insert',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insert: {$args: 0}
                  }),
                  foo: 4
                },
                body: [{foo: 'bar'}]
              }
            },
            resSpec: {
              statusCode: 201
            }
          },
        ]
      })
    ],
  })
})

