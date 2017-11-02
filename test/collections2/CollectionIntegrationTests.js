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
    name: 'CollectionIntegrationTests',
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
                additionalParameters: {
                  bar: {
                    location: 'header',
                    schema: {
                      type: 'string',
                    },
                    required: false
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
    ]
  })
})

