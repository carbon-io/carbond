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
          context.global.idParameterName = this.service.endpoints.insertObject.idParameterName
          context.global.idHeaderName = this.service.endpoints.insertObject.idHeaderName
        },
        teardown: function(context) {
          pong.util.collectionIdGenerator.resetId()
          delete context.global.idHeaderName
          delete context.global.idParameterName
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
                  headers[context.global.idHeaderName],
                  ejson.stringify('0'))
                assert.deepStrictEqual(headers.location, '/insertObject/0')
              },
              body: function(body, context) {
                assert.deepStrictEqual(body, {
                  [context.global.idParameterName]: '0',
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
                body: {[context.global.idParameterName]: '0', foo: 'bar'}
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
              },
            }),
            insertObject1: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {insertObject: true},
              insertObjectConfig: {
                '$parameters.object.schema': {
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
              },
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameterName = this.service.endpoints.insertObject.idParameterName
          context.global.idHeaderName = this.service.endpoints.insertObject.idHeaderName
        },
        teardown: function(context) {
          pong.util.collectionIdGenerator.resetId()
          delete context.global.idHeaderName
          delete context.global.idParameterName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'FailInsertObjectSchemaTest',
            description: 'Test POST of malformed object',
            setup: function(context) {
              pong.util.collectionIdGenerator.resetId()
            },
            reqSpec: {
              url: '/insertObject',
              method: 'POST',
              body: {bar: 'baz'}
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
                  headers[context.global.idHeaderName],
                  ejson.stringify('0'))
                assert.deepStrictEqual(
                  headers.location, this.reqSpec.url + '/0')
              },
              body: function(body, context) {
                assert.deepStrictEqual(body, {
                  [context.global.idParameterName]: '0', foo: 'bar'
                })
              }
            }
          },
          {
            name: 'FailInsertObject1SchemaTest',
            description: 'Test POST of malformed object',
            setup: function(context) {
              pong.util.collectionIdGenerator.resetId()
              this.history = context.httpHistory
            },
            reqSpec: function() {
              return _.assign(
                _.clone(this.history.getReqSpec('FailInsertObjectSchemaTest')),
                {url: '/insertObject1'})
            },
            resSpec: {
              $property: {get: function() {return this.history.getResSpec('FailInsertObjectSchemaTest')}}
            }
          },
          {
            name: 'SuccessInsertObject1SchemaTest',
            description: 'Test POST with well formed object',
            setup: function(context) {
              pong.util.collectionIdGenerator.resetId()
              this.history = context.httpHistory
            },
            reqSpec: function() {
              return _.assign(
                _.clone(this.history.getReqSpec('SuccessInsertObjectSchemaTest')),
                {url: '/insertObject1'})
            },
            resSpec: {
              $property: {get: function() {return this.history.getResSpec('SuccessInsertObjectSchemaTest')}}
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
          context.global.idParameterName = this.service.endpoints.insertObject.idParameterName
          context.global.idHeaderName = this.service.endpoints.insertObject.idHeaderName
        },
        teardown: function(context) {
          pong.util.collectionIdGenerator.resetId()
          delete context.global.idHeaderName
          delete context.global.idParameterName
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
                  headers[context.global.idHeaderName],
                  ejson.stringify('0'))
                assert.deepStrictEqual(
                  headers.location, '/insertObject/0')
              },
              body: undefined
            }
          }
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'CustomConfigParameterTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            insertObject: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {insertObject: true},
              insertObjectConfig: {
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
          context.global.idParameterName = this.service.endpoints.insertObject.idParameterName
          context.global.idHeaderName = this.service.endpoints.insertObject.idHeaderName
        },
        teardown: function(context) {
          pong.util.collectionIdGenerator.resetId()
          delete context.global.idHeaderName
          delete context.global.idParameterName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          o({
            _type: testtube.Test,
            name: 'InsertObjectConfigCustomParameterInitializationTest',
            doTest: function(context) {
              let insertObjectOperation = this.parent.service.endpoints.insertObject.post
              assert.deepEqual(insertObjectOperation.parameters, {
                object: {
                  name: 'object',
                  location: 'body',
                  description: carbond.collections.InsertObjectConfig._STRINGS.parameters.object.description,
                  schema: {
                    type: 'object',
                    properties: {
                      _id: {
                        type: 'string'
                      }
                    }
                  },
                  required: true,
                  default: undefined
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
            name: 'InsertObjectConfigCustomParameterPassedViaOptionsFailTest',
            setup: function(context) {
              pong.util.collectionIdGenerator.resetId()
              context.local.insertObjectSpy = sinon.spy(this.parent.service.endpoints.insertObject, 'insertObject')
            },
            teardown: function(context) {
              assert.equal(context.local.insertObjectSpy.called, false)
              context.local.insertObjectSpy.restore()
            },
            reqSpec: function(context) {
              return {
                url: '/insertObject',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insertObject: {$args: 0}
                  }),
                  foo: 3
                },
                body: {foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 400
            }
          },
          {
            name: 'InsertObjectConfigCustomParameterPassedViaOptionsSuccessTest',
            setup: function(context) {
              pong.util.collectionIdGenerator.resetId()
              context.local.insertObjectSpy = sinon.spy(this.parent.service.endpoints.insertObject, 'insertObject')
            },
            teardown: function(context) {
              assert.equal(context.local.insertObjectSpy.firstCall.args[1].foo, 4)
              context.local.insertObjectSpy.restore()
            },
            reqSpec: function(context) {
              return {
                url: '/insertObject',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insertObject: {$args: 0}
                  }),
                  foo: 4
                },
                body: {foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 201
            }
          },
        ]
      })
    ]
  })
})

