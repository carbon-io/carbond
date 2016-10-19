var assert = require('assert')

var _ = require('lodash')
var sinon = require('sinon')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var HttpErrors = require('@carbon-io/carbon-core').HttpErrors
var o  = require('@carbon-io/carbon-core').atom.o(module)
var testtube = require('@carbon-io/carbon-core').testtube

var limiters = require('../../lib/security/Limiter')

module.exports = o({
  _type: testtube.Test,
  name: 'LimiterTests',
  description: 'Limiter interface tests',
  tests: [
    o({
      _type: testtube.Test,
      name: 'TestInstantiate',
      description: 'Test instantiate',
      doTest: function () {
        assert.throws(function() {
          var limiter = o({_type: limiters.Limiter})
        }, Error)
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestSendUnavailable',
      description: 'Test `sendUnavailable`',
      setup: function () {
        sinon.stub(limiters.Limiter.prototype, '_C', function() {})
      },
      teardown: function () {
        limiters.Limiter.prototype._C.restore()
      },
      doTest: function () {
        var _handleErrorSpy = sinon.spy()
        var resSpy = sinon.spy()
        resSpy.append = sinon.spy()
        var limiter = o({_type: limiters.Limiter})
        limiter.initialize({_handleError: _handleErrorSpy}, undefined)
        limiter.sendUnavailable(resSpy, 60)
        assert(_handleErrorSpy.called)
        assert.equal(_handleErrorSpy.args[0].length, 2)
        assert(_handleErrorSpy.args[0][0] instanceof HttpErrors.ServiceUnavailable)
        assert(_handleErrorSpy.args[0][1] === resSpy)
        assert(resSpy.append.args[0][0] === 'Retry-After')
        assert(resSpy.append.args[0][1] === '60')
      }
    }),
  ]
})
