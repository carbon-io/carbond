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
          context.global.idParameter = this.service.endpoints.remove.idParameter
        },
        teardown: function(context) {
          delete context.global.idParameter
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
                    remove: [{[context.global.idParameter]: '0', foo: 'bar'}]
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
          context.global.idParameter = this.service.endpoints.remove.idParameter
        },
        teardown: function(context) {
          delete context.global.idParameter
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
                      {[context.global.idParameter]: '0', foo: 'bar'},
                      {[context.global.idParameter]: '1', bar: 'baz'},
                      {[context.global.idParameter]: '2', baz: 'yaz'}
                    ]
                  })
                }
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
                    remove: {[context.global.idParameter]: '0', foo: 'bar'}
                  })
                }
              }
            },
            resSpec: {
              statusCode: 500
            }
          },
        ]
      })
    ]
  })
})

