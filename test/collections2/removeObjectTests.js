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
 * removeObject tests
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
    name: 'RemoveObjectTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'DefaultConfigRemoveObjectTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            removeObject: o({
              _type: pong.Collection,
              enabled: {removeObject: true},
            }),
          },
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameterName = this.service.endpoints.removeObject.idParameterName
        },
        teardown: function(context) {
          delete context.global.idParameterName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'RemoveObjectTest',
            description: 'Test DELETE',
            reqSpec: {
              url: '/removeObject/0',
              method: 'DELETE',
              headers: {
                'x-pong': ejson.stringify({
                  removeObject: 1,
                }),
              },
            },
            resSpec: {
              statusCode: 200,
              body: {n: 1},
            },
          },
          {
            name: 'RemoveObjectHandlerReturnInvalidCountTest',
            description: 'Test removeObject handler returns invalid count',
            setup: function() {
              this.postRemoveObjectOperationSpy =
                sinon.spy(this.parent.service.endpoints.removeObject, 'postRemoveObjectOperation')
              this.removeObjectSpy = sinon.spy(this.parent.service.endpoints.removeObject, 'removeObject')
            },
            teardown: function() {
              try {
                assert(this.removeObjectSpy.called)
                assert(this.postRemoveObjectOperationSpy.threw())
              } finally {
                this.removeObjectSpy.restore()
                this.postRemoveObjectOperationSpy.restore()
              }
            },
            reqSpec: {
              url: '/removeObject/0',
              method: 'DELETE',
              headers: {
                'x-pong': ejson.stringify({
                  removeObject: 2,
                }),
              },
            },
            resSpec: {
              statusCode: 500,
            },
          },
          {
            name: 'RemoveObjectHandlerReturnArrayTest',
            description: 'Test removeObject handler returns array',
            setup: function() {
              this.postRemoveObjectOperationSpy =
                sinon.spy(this.parent.service.endpoints.removeObject, 'postRemoveObjectOperation')
              this.removeObjectSpy = sinon.spy(this.parent.service.endpoints.removeObject, 'removeObject')
            },
            teardown: function() {
              try {
                assert(this.removeObjectSpy.called)
                assert(this.postRemoveObjectOperationSpy.threw())
              } finally {
                this.removeObjectSpy.restore()
                this.postRemoveObjectOperationSpy.restore()
              }
            },
            reqSpec: function(context) {
              return {
                url: '/removeObject/0',
                method: 'DELETE',
                headers: {
                  'x-pong': ejson.stringify({
                    removeObject: {[context.global.idParameterName]: '0', foo: 'bar'},
                  }),
                },
              }
            },
            resSpec: {
              statusCode: 500,
            },
          },
        ],
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'ReturnsRemovedObjectRemoveObjectTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            removeObject: o({
              _type: pong.Collection,
              enabled: {removeObject: true},
              removeObjectConfig: {
                returnsRemovedObject: true,
              },
            }),
          },
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameterName = this.service.endpoints.removeObject.idParameterName
        },
        teardown: function(context) {
          delete context.global.idParameterName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'RemoveObjectTest',
            description: 'Test DELETE',
            reqSpec: function(context) {
              return {
                url: '/removeObject/0',
                method: 'DELETE',
                headers: {
                  'x-pong': ejson.stringify({
                    removeObject: {[context.global.idParameterName]: '0', foo: 'bar'},
                  }),
                },
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(body, context) {
                assert.deepStrictEqual(body, {[context.global.idParameterName]: '0', foo: 'bar'})
              },
            },
          },
          {
            name: 'RemoveObjectHandlerReturnObjectsTest',
            description: 'Test removeObject handler returns invalid count when objects expected',
            setup: function() {
              this.postRemoveObjectOperationSpy =
                sinon.spy(this.parent.service.endpoints.removeObject, 'postRemoveObjectOperation')
              this.removeObjectSpy = sinon.spy(this.parent.service.endpoints.removeObject, 'removeObject')
            },
            teardown: function() {
              try {
                assert(this.removeObjectSpy.called)
                assert(this.postRemoveObjectOperationSpy.threw())
              } finally {
                this.removeObjectSpy.restore()
                this.postRemoveObjectOperationSpy.restore()
              }
            },
            reqSpec: {
              url: '/removeObject/0',
              method: 'DELETE',
              headers: {
                'x-pong': ejson.stringify({
                  removeObject: 1,
                }),
              },
            },
            resSpec: {
              statusCode: 500,
            },
          },
          {
            name: 'RemoveObjectHandlerReturnObjectTest',
            description: 'Test removeObject handler returns an array',
            setup: function() {
              this.postRemoveObjectOperationSpy =
                sinon.spy(this.parent.service.endpoints.removeObject, 'postRemoveObjectOperation')
              this.removeObjectSpy = sinon.spy(this.parent.service.endpoints.removeObject, 'removeObject')
            },
            teardown: function() {
              try {
                assert(this.removeObjectSpy.called)
                assert(this.postRemoveObjectOperationSpy.threw())
              } finally {
                this.removeObjectSpy.restore()
                this.postRemoveObjectOperationSpy.restore()
              }
            },
            reqSpec: function(context) {
              return {
                url: '/removeObject/0',
                method: 'DELETE',
                headers: {
                  'x-pong': ejson.stringify({
                    removeObject: [{[context.global.idParameterName]: '0', foo: 'bar'}],
                  }),
                },
              }
            },
            resSpec: {
              statusCode: 500,
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
            removeObject: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {removeObject: true},
              removeObjectConfig: {
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
          context.global.idParameterName = this.service.endpoints.removeObject.idParameterName
        },
        teardown: function(context) {
          delete context.global.idParameterName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          o({
            _type: testtube.Test,
            name: 'RemoveObjectConfigCustomParameterInitializationTest',
            doTest: function(context) {
              let removeObjectOperation =
                this.parent.service.endpoints.removeObject.endpoints[`:${context.global.idParameterName}`].delete
              assert.deepEqual(removeObjectOperation.parameters, {
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
            name: 'RemoveObjectConfigCustomParameterPassedViaOptionsFailTest',
            setup: function(context) {
              context.local.removeObjectSpy = sinon.spy(this.parent.service.endpoints.removeObject, 'removeObject')
            },
            teardown: function(context) {
              assert.equal(context.local.removeObjectSpy.called, false)
              context.local.removeObjectSpy.restore()
            },
            reqSpec: function(context) {
              return {
                url: '/removeObject/0',
                method: 'DELETE',
                headers: {
                  'x-pong': ejson.stringify({
                    removeObject: 1,
                  }),
                  foo: 3,
                },
              }
            },
            resSpec: {
              statusCode: 400,
            },
          },
          {
            name: 'RemoveObjectConfigCustomParameterPassedViaOptionsSuccessTest',
            setup: function(context) {
              context.local.removeObjectSpy = sinon.spy(this.parent.service.endpoints.removeObject, 'removeObject')
            },
            teardown: function(context) {
              assert.equal(context.local.removeObjectSpy.firstCall.args[1].foo, 4)
              context.local.removeObjectSpy.restore()
            },
            reqSpec: function(context) {
              return {
                url: '/removeObject/0',
                method: 'DELETE',
                headers: {
                  'x-pong': ejson.stringify({
                    removeObject: 1,
                  }),
                  foo: 4,
                },
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
            removeObject: o({
              _type: carbond.collections.Collection,
              enabled: {removeObject: true},
              preRemoveObjectOperation: function(config, req, res, context) {
                context.preRemoveObjectOperation = 1
                return carbond.collections.Collection.prototype.preRemoveObjectOperation.apply(this, arguments)
              },
              preRemoveObject: function(id, options, context) {
                context.preRemoveObject = 1
                return carbond.collections.Collection.prototype.preRemoveObject.apply(this, arguments)
              },
              removeObject: function(id, options, context) {
                context.removeObject = 1
                return 1
              },
              postRemoveObject: function(result, id, options, context) {
                context.postRemoveObject = 1
                return carbond.collections.Collection.prototype.postRemoveObject.apply(this, arguments)
              },
              postRemoveObjectOperation: function(result, config, req, res, context) {
                context.postRemoveObjectOperation = 1
                res.set('context', ejson.stringify(context))
                return carbond.collections.Collection.prototype.postRemoveObjectOperation.apply(this, arguments)
              },
            }),
          },
        }),
        tests: [
          {
            reqSpec: {
              url: '/removeObject/0',
              method: 'DELETE',
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert.deepEqual(ejson.parse(headers.context), {
                  preRemoveObjectOperation: 1,
                  preRemoveObject: 1,
                  removeObject: 1,
                  postRemoveObject: 1,
                  postRemoveObjectOperation: 1,
                })
              },
            },
          },
        ],
      }),
    ],
  })
})

