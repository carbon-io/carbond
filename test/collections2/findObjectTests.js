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
 * findObject tests
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
    name: 'findObjectTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'defaultConfigFindObjectTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            findObject: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {findObject: true}
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameterName = this.service.endpoints.findObject.idParameterName
        },
        teardown: function(context) {
          delete context.global.idParameterName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'HeadTest',
            description: 'Test HEAD method',
            reqSpec: function(context) {
              return {
                url: '/findObject/0',
                method: 'HEAD',
                headers: {
                  'x-pong': ejson.stringify({
                    findObject: {[context.global.idParameterName]: '0', foo: 'bar'}
                  })
                }
              }
            },
            resSpec: {
              statusCode: 200,
              body: undefined
            }
          },
          {
            name: 'FindObjectReturnArrayValidationErrorTest',
            description: 'Test validation on find return value',
            reqSpec: function(context) {
              return {
                url: '/findObject/0',
                method: 'GET',
                headers: {
                  'x-pong': ejson.stringify({
                    findObject: [{[context.global.idParameterName]: '0', foo: 'bar'}]
                  })
                }
              }
            },
            resSpec: {
              statusCode: 500
            }
          },
          {
            name: 'FindObjectTest',
            description: 'Test findObject',
            reqSpec: function(context) {
              return {
                url: '/findObject/0',
                method: 'GET',
                headers: {
                  'x-pong': ejson.stringify({
                    findObject: {[context.global.idParameterName]: '0', foo: 'bar'}
                  })
                }
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(body, context) {
                assert.deepStrictEqual(body, {[context.global.idParameterName]: '0', foo: 'bar'})
              }
            }
          },
          {
            name: 'FindObjectNotFoundTest',
            description: 'Test findObject for non-existent',
            reqSpec: function(context) {
              return {
                url: '/findObject/666',
                method: 'GET',
                headers: {
                  'x-pong': ejson.stringify({
                    findObject: null
                  })
                }
              }
            },
            resSpec: {
              statusCode: 404
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
            findObject: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {findObject: true},
              findObjectConfig: {
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
          context.global.idParameterName = this.service.endpoints.findObject.idParameterName
        },
        teardown: function(context) {
          delete context.global.idParameterName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          o({
            _type: testtube.Test,
            name: 'FindObjectConfigCustomParameterInitializationTest',
            doTest: function(context) {
              let findObjectOperation = 
                this.parent.service.endpoints.findObject.endpoints[`:${context.global.idParameterName}`].get
              assert.deepEqual(findObjectOperation.parameters, {
                foo: {
                  name: 'foo',
                  location: 'header',
                  description: undefined,
                  schema: {type: 'number', minimum: 0, multipleOf: 2},
                  required: false,
                  default: undefined
                }
              })
            }
          }),
          {
            name: 'FindObjectConfigCustomParameterPassedViaOptionsFailTest',
            setup: function(context) {
              context.local.findObjectSpy = sinon.spy(this.parent.service.endpoints.findObject, 'findObject')
            },
            teardown: function(context) {
              assert.equal(context.local.findObjectSpy.called, false)
              context.local.findObjectSpy.restore()
            },
            reqSpec: function(context) {
              return {
                url: '/findObject/0',
                method: 'GET',
                headers: {
                  'x-pong': ejson.stringify({
                    findObject: {[context.global.idParameterName]: '0', foo: 'bar'}
                  }),
                  foo: 3
                }
              }
            },
            resSpec: {
              statusCode: 400
            }
          },
          {
            name: 'FindObjectConfigCustomParameterPassedViaOptionsSuccessTest',
            setup: function(context) {
              context.local.findObjectSpy = sinon.spy(this.parent.service.endpoints.findObject, 'findObject')
            },
            teardown: function(context) {
              assert.equal(context.local.findObjectSpy.firstCall.args[1].foo, 4)
              context.local.findObjectSpy.restore()
            },
            reqSpec: function(context) {
              return {
                url: '/findObject/0',
                method: 'GET',
                headers: {
                  'x-pong': ejson.stringify({
                    findObject: {[context.global.idParameterName]: '0', foo: 'bar'}
                  }),
                  foo: 4
                }
              }
            },
            resSpec: {
              statusCode: 200
            }
          }
        ]
      })
    ]
  })
})



