var assert = require('assert')

var sinon = require('sinon')

var core = require('@carbon-io/carbon-core')

var __ = core.fibers.__(module)
var _o = core.bond._o(module)
var o = core.atom.o(module)

var carbond = require('../../../..')

__(function() {
  module.exports = o.main({
    _type: carbond.test.ServiceTest,
    name: 'LoggingTests',
    service: _o('../../standalone-examples/ServiceLoggingExample'),
    setup: function() {
      carbond.test.ServiceTest.prototype.setup.call(this)
      this.infoSpy = sinon.spy(this.service, 'logInfo')
      this.errorSpy = sinon.spy(this.service, 'logError')
    },
    teardown: function() {
      this.infoSpy.restore()
      this.errorSpy.restore()
      carbond.test.ServiceTest.prototype.teardown.call(this)
    },
    tests: [
      {
        teardown: function() {
          try {
            assert(this.parent.infoSpy.called)
            assert(!this.parent.errorSpy.called)
          } finally {
            this.parent.infoSpy.reset()
            this.parent.errorSpy.reset()
          }
        },
        reqSpec: {
          method: 'GET',
          url: '/hello',
        },
        resSpec: {
          statusCode: 200,
          body: {
            msg: 'Hello World!',
          },
        },
      },
      {
        teardown: function() {
          try {
            assert(this.parent.infoSpy.called)
            assert(this.parent.errorSpy.called)
          } finally {
            this.parent.infoSpy.reset()
            this.parent.errorSpy.reset()
          }
        },
        reqSpec: {
          method: 'GET',
          url: '/hello',
          parameters: {
            error: true,
          },
        },
        resSpec: {
          statusCode: 200,
          body: {
            msg: 'Hello World!',
          },
        },
      },
    ],
  })
})


