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
 * integration tests
 */
__(function() {
  module.exports = o.main({
    _type: testtube.Test,
    name: 'CollectionTests',
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'CollectionLevelParameterTests',
        service: o({
          _type: carbond.Service,
          endpoints: {
            foo: o({
              _type: carbond.collections.Collection,
              enabled: {
                find: true,
                insert: true
              },
              idParameter: 'foo',
              idPathParameter: 'foo',
              schema: {
                type: 'object',
                properties: {
                  foo: {
                    type: 'string'
                  }
                },
                required: ['foo']
              },
              parameters: {
                bar: {
                  location: 'header',
                  schema: {
                    type: 'number',
                    minimum: 0
                  },
                  required: true
                }
              },
              findConfig: {
                parameters: {
                  $merge: {
                    bar: {
                      location: 'header',
                      schema: {
                        type: 'string',
                      },
                      required: false
                    }
                  }
                }
              },
              find: function(options) {
                return [{foo: '0', options: options}]
              },
              insert: function(objects, options) {
                var id = 0
                return _.map(objects, function(object) {
                  return _.assign(_.clone(object), {options: options, foo: (++id).toString()})
                })
              }
            })
          }
        }),
        tests: [
          {
            name: 'OptionalOperationParameterOverridesRequiredCollectionParameterNotPresentTest',
            reqSpec: {
              url: '/foo',
              method: 'GET'
            },
            resSpec: {
              statusCode: 200,
              body: [{
                foo: '0',
                options: {
                  foo: undefined,   // present because of the ID query parameter on colllection
                  bar: undefined
                }
              }]
            }
          },
          {
            name: 'OperationParameterSchemaOverridesRequiredCollectionParameterPresentValidTest',
            reqSpec: {
              url: '/foo',
              method: 'GET',
              headers: {
                bar: 0              // gets parsed as a string
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(body) {
                assert.deepStrictEqual(body, [{
                  foo: '0',
                  options: {
                    foo: undefined,
                    bar: '0'
                  }
                }])
              }
            }
          },
          {
            name: 'RequiredCollectionParameterNotPresentTest',
            reqSpec: {
              url: '/foo',
              method: 'POST',
              body: [{}]
            },
            resSpec: {
              statusCode: 400
            }
          },
          {
            name: 'RequiredCollectionParameterPresentInvalidTest',
            reqSpec: {
              url: '/foo',
              method: 'POST',
              headers: {
                bar: 'foo'
              },
              body: [{}]
            },
            resSpec: {
              statusCode: 400,
            }
          },
          {
            name: 'RequiredCollectionParameterPresentValidTest',
            reqSpec: {
              url: '/foo',
              method: 'POST',
              headers: {
                bar: 0
              },
              body: [{}]
            },
            resSpec: {
              statusCode: 201,
              body: function(body) {
                assert.deepStrictEqual(body, [{
                  foo: '1',
                  options: {
                    bar: 0
                  }
                }])
              }
            }
          },
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'CollectionConfigResponseMutationTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            foo: o({
              _type: pong.Collection,
              enabled: {
                '*': true
              },
              idGenerator: pong.util.collectionIdGenerator,
              idParameter: '_id',
              schema: {
                type: 'object',
                properties: {
                  _id: {type: 'string'},
                  foo: {type: 'string'},
                  bar: {type: 'string'},
                  baz: {type: 'string'}
                },
                required: ['_id', 'foo', 'bar', 'baz'],
                additionalProperties: false
              },
              insertConfig: {
                responses: {
                  '$201.schema.items.required': ['_id', 'foo', 'bar'],
                  // XXX: add when $delete merged into atom
                  // '$201.schema.items.properties': {
                  //   $delete: 'baz'
                  // },
                  '$400.description': 'Whoopsie-daisy!'
                }
              },
              insertObjectConfig: {
                responses: {
                  '201': {
                    statusCode: 201,
                    description: 'foo bar baz',
                    schema: {
                      type: 'object',
                      properties: {
                        _id: {type: 'string'}
                      },
                      required: ['_id'],
                      additionalProperties: false
                    },
                    headers: ['Location', this.idHeader]
                  }
                }
              },
              findConfig: {
                results: {
                  '$200.headers[0]': 'foo'
                }
              },
              postFindOperation: function(result, config, req, res) {
                result = pong.Collection.prototype.postFindOperation.apply(this, arguments)
                res.append('foo', 'bar')
                return result
              }
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.foo.idParameter
        },
        teardown: function(context) {
          delete context.global.idParameter
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'Insert201UnrequireBazSuccessTest',
            reqSpec: function(context) {
              return {
                url: '/foo',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insert: [{
                      [context.global.idParameter]: '0',
                      foo: 'bar',
                      bar: 'baz'
                    }]
                  })
                },
                body: [{foo: 'bar', bar: 'baz', baz: 'yaz'}]
              }
            },
            resSpec: {
              statusCode: 201,
              body: function(body, context) {
                assert.deepEqual(body, [{
                  [context.global.idParameter]: '0',
                  foo: 'bar',
                  bar: 'baz'
                }])
              }
            }
          },
          {
            name: 'Insert201UnrequireBazFailAdditionalParameterTest',
            reqSpec: function(context) {
              return {
                url: '/foo',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insert: [{
                      [context.global.idParameter]: '0',
                      foo: 'bar',
                      bar: 'baz',
                      barf: 666
                    }]
                  })
                },
                body: [{foo: 'bar', bar: 'baz', baz: 'yaz'}]
              }
            },
            resSpec: {
              statusCode: 500,
              body: function(body) {
                assert.ok(body.message.match(/^Output did not validate against: .+/))
              }
            }
          },
          {
            name: 'Insert201UnrequireBazFailDeletedParameterTest',
            setup: function() {
              throw new testtube.errors.SkipTestError('Implement when $delete merged into atom')
            },
            reqSpec: function(context) {
              return {
                url: '/foo',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insert: [{
                      [context.global.idParameter]: '0',
                      foo: 'bar',
                      bar: 'baz',
                      baz: 'yaz'
                    }]
                  })
                },
                body: [{foo: 'bar', bar: 'baz', baz: 'yaz'}]
              }
            },
            resSpec: {
              statusCode: 500,
              body: function(body) {
                assert.ok(body.message.match(/^Output did not validate against: .+/))
              }
            }
          },
          {
            name: 'InsertObject201OverrideSuccessTest',
            reqSpec: function(context) {
              return {
                url: '/foo',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insertObject: {[context.global.idParameter]: '0'}
                  })
                },
                body: {foo: 'bar', bar: 'baz', baz: 'yaz'}
              }
            },
            resSpec: {
              statusCode: 201,
              body: function(body, context) {
                assert.deepEqual(body, {[context.global.idParameter]: '0'})
              }
            }
          },
          {
            name: 'InsertObject201OverrideFailTest',
            reqSpec: function(context) {
              return {
                url: '/foo',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insertObject: {
                      [context.global.idParameter]: '0',
                      foo: 'bar',
                      bar: 'baz',
                      baz: 'yaz'
                    }
                  })
                },
                body: {foo: 'bar', bar: 'baz', baz: 'yaz'}
              }
            },
            resSpec: {
              statusCode: 500,
              body: function(body) {
                assert.ok(body.message.match(/^Output did not validate against: .+/))
              }
            }
          },
          {
            name: 'Find201OverrideSuccessTest',
            reqSpec: function(context) {
              return {
                url: '/foo',
                method: 'GET',
                headers: {
                  'x-pong': ejson.stringify({
                    find: [{
                      [context.global.idParameter]: '0',
                      foo: 'bar',
                      bar: 'baz',
                      baz: 'yaz'
                    }]
                  })
                }
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert.equal(headers['foo'], 'bar')
              }
            }
          }
        ]
      })
    ]
  })
})

