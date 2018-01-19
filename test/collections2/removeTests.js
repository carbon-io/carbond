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
 * remove tests
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
    name: 'RemoveTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'DefaultConfigRemoveTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            remove: o({
              _type: pong.Collection,
              enabled: {remove: true}
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameterName = this.service.endpoints.remove.idParameterName
        },
        teardown: function(context) {
          delete context.global.idParameterName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'RemoveTest',
            description: 'Test DELETE',
            reqSpec: {
              url: '/remove',
              method: 'DELETE',
              headers: {
                'x-pong': ejson.stringify({
                  remove: 666
                })
              }
            },
            resSpec: {
              statusCode: 200,
              body: {n: 666}
            }
          },
          {
            name: 'RemoveHandlerReturnInvalidCountTest',
            description: 'Test remove handler returns invalid count',
            setup: function() {
              this.postRemoveOperationSpy =
                sinon.spy(this.parent.service.endpoints.remove, 'postRemoveOperation')
              this.removeSpy = sinon.spy(this.parent.service.endpoints.remove, 'remove')
            },
            teardown: function() {
              try {
                assert(this.removeSpy.called)
                assert(this.postRemoveOperationSpy.threw())
              } finally {
                this.removeSpy.restore()
                this.postRemoveOperationSpy.restore()
              }
            },
            reqSpec: {
              url: '/remove',
              method: 'DELETE',
              headers: {
                'x-pong': ejson.stringify({
                  remove: -1
                })
              }
            },
            resSpec: {
              statusCode: 500
            }
          },
          {
            name: 'RemoveHandlerReturnArrayTest',
            description: 'Test remove handler returns array',
            setup: function() {
              this.postRemoveOperationSpy =
                sinon.spy(this.parent.service.endpoints.remove, 'postRemoveOperation')
              this.removeSpy = sinon.spy(this.parent.service.endpoints.remove, 'remove')
            },
            teardown: function() {
              try {
                assert(this.removeSpy.called)
                assert(this.postRemoveOperationSpy.threw())
              } finally {
                this.removeSpy.restore()
                this.postRemoveOperationSpy.restore()
              }
            },
            reqSpec: function(context) {
              return {
                url: '/remove',
                method: 'DELETE',
                headers: {
                  'x-pong': ejson.stringify({
                    remove: [{[context.global.idParameterName]: '0', foo: 'bar'}]
                  })
                }
              }
            },
            resSpec: {
              statusCode: 500
            }
          },
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'ReturnsRemovedObjectsRemoveTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            remove: o({
              _type: pong.Collection,
              enabled: {remove: true},
              removeConfig: {
                returnsRemovedObjects: true
              }
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameterName = this.service.endpoints.remove.idParameterName
        },
        teardown: function(context) {
          delete context.global.idParameterName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'RemoveTest',
            description: 'Test DELETE',
            reqSpec: function(context) {
              return {
                url: '/remove',
                method: 'DELETE',
                headers: {
                  'x-pong': ejson.stringify({
                    remove: [
                      {[context.global.idParameterName]: '0', foo: 'bar'},
                      {[context.global.idParameterName]: '1', bar: 'baz'},
                      {[context.global.idParameterName]: '2', baz: 'yaz'}
                    ]
                  })
                }
              }
            },
            resSpec: {
              statusCode: 200,
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
            name: 'RemoveHandlerReturnObjectsTest',
            description: 'Test remove handler returns invalid count when objects expected',
            setup: function() {
              this.postRemoveOperationSpy =
                sinon.spy(this.parent.service.endpoints.remove, 'postRemoveOperation')
              this.removeSpy = sinon.spy(this.parent.service.endpoints.remove, 'remove')
            },
            teardown: function() {
              try {
                assert(this.removeSpy.called)
                assert(this.postRemoveOperationSpy.threw())
              } finally {
                this.removeSpy.restore()
                this.postRemoveOperationSpy.restore()
              }
            },
            reqSpec: {
              url: '/remove',
              method: 'DELETE',
              headers: {
                'x-pong': ejson.stringify({
                  remove: 1
                })
              }
            },
            resSpec: {
              statusCode: 500
            }
          },
          {
            name: 'RemoveHandlerReturnObjectTest',
            description: 'Test remove handler returns objects',
            setup: function() {
              this.postRemoveOperationSpy =
                sinon.spy(this.parent.service.endpoints.remove, 'postRemoveOperation')
              this.removeSpy = sinon.spy(this.parent.service.endpoints.remove, 'remove')
            },
            teardown: function() {
              try {
                assert(this.removeSpy.called)
                assert(this.postRemoveOperationSpy.threw())
              } finally {
                this.removeSpy.restore()
                this.postRemoveOperationSpy.restore()
              }
            },
            reqSpec: function(context) {
              return {
                url: '/remove',
                method: 'DELETE',
                headers: {
                  'x-pong': ejson.stringify({
                    remove: {[context.global.idParameterName]: '0', foo: 'bar'}
                  })
                }
              }
            },
            resSpec: {
              statusCode: 500
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
            remove: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {remove: true},
              removeConfig: {
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
        tests: [
          o({
            _type: testtube.Test,
            name: 'RemoveConfigCustomParameterInitializationTest',
            doTest: function(context) {
              let removeOperation = this.parent.service.endpoints.remove.delete
              assert.deepEqual(removeOperation.parameters, {
                foo: {
                  name: 'foo',
                  location: 'header',
                  description: undefined,
                  schema: {type: 'number', minimum: 0, multipleOf: 2},
                  required: false,
                  default: undefined
                },
              })
            }
          }),
          {
            name: 'RemoveConfigCustomParameterPassedViaOptionsFailTest',
            setup: function(context) {
              context.local.removeSpy = sinon.spy(this.parent.service.endpoints.remove, 'remove')
            },
            teardown: function(context) {
              assert.equal(context.local.removeSpy.called, false)
              context.local.removeSpy.restore()
            },
            reqSpec: function(context) {
              return {
                url: '/remove',
                method: 'DELETE',
                headers: {
                  'x-pong': ejson.stringify({
                    remove: 1
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
            name: 'RemoveConfigCustomParameterPassedViaOptionsSuccessTest',
            setup: function(context) {
              context.local.removeSpy = sinon.spy(this.parent.service.endpoints.remove, 'remove')
            },
            teardown: function(context) {
              assert.equal(context.local.removeSpy.firstCall.args[0].foo, 4)
              context.local.removeSpy.restore()
            },
            reqSpec: function(context) {
              return {
                url: '/remove',
                method: 'DELETE',
                headers: {
                  'x-pong': ejson.stringify({
                    remove: 1
                  }),
                  foo: 4
                },
              }
            },
            resSpec: {
              statusCode: 200
            }
          }
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'HookAndHandlerContextTests',
        service: o({
          _type: carbond.Service,
          endpoints: {
            remove: o({
              _type: carbond.collections.Collection,
              enabled: {remove: true},
              preRemoveOperation: function(config, req, res, context) {
                context.preRemoveOperation = 1
                return carbond.collections.Collection.prototype.preRemoveOperation.apply(this, arguments)
              },
              preRemove: function(options, context) {
                context.preRemove = 1
                return carbond.collections.Collection.prototype.preRemove.apply(this, arguments)
              },
              remove: function(options, context) {
                context.remove = 1
                return 1
              },
              postRemove: function(result, options, context) {
                context.postRemove = 1
                return carbond.collections.Collection.prototype.postRemove.apply(this, arguments)
              },
              postRemoveOperation: function(result, config, req, res, context) {
                context.postRemoveOperation = 1
                res.set('context', ejson.stringify(context))
                return carbond.collections.Collection.prototype.postRemoveOperation.apply(this, arguments)
              }
            })
          }
        }),
        tests: [
          {
            reqSpec: {
              url: '/remove',
              method: 'DELETE'
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert.deepEqual(ejson.parse(headers.context), {
                  preRemoveOperation: 1,
                  preRemove: 1,
                  remove: 1,
                  postRemove: 1,
                  postRemoveOperation: 1
                })
              }
            }
          }
        ]
      })
    ]
  })
})

