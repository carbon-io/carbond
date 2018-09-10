var assert = require('assert')

var _ = require('lodash')
var sinon = require('sinon')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var HttpErrors = require('@carbon-io/carbon-core').HttpErrors
var o  = require('@carbon-io/carbon-core').atom.o(module).main
var testtube = require('@carbon-io/carbon-core').testtube

var Service = require('../../lib/Service')
var Limiter = require('../../lib/limiter/Limiter')

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
          var limiter = o({_type: Limiter})
        }, Error)
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestSendUnavailable',
      description: 'Test `sendUnavailable`',
      setup: function () {
        sinon.stub(Limiter.prototype, '_C').callsFake(function() {})
      },
      teardown: function () {
        Limiter.prototype._C.restore()
      },
      doTest: function () {
        var _handleErrorSpy = sinon.spy()
        var resSpy = sinon.spy()
        resSpy.append = sinon.spy()
        var limiter = o({_type: Limiter})
        limiter.initialize({_handleError: _handleErrorSpy}, undefined)
        limiter.sendUnavailable(resSpy)
        assert(_handleErrorSpy.called)
        assert.equal(_handleErrorSpy.args[0].length, 2)
        assert(_handleErrorSpy.args[0][0] instanceof HttpErrors.ServiceUnavailable)
        assert(_handleErrorSpy.args[0][1] === resSpy)
        assert(resSpy.append.args[0][0] === 'Retry-After')
        assert(resSpy.append.args[0][1] === '60')
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestLogRejections',
      description: 'Test logRejections',

      logWarningSpy: sinon.spy(),

      setup: function () {
        sinon.stub(Limiter.prototype, '_C').callsFake(function() {})
        sinon.stub(Service.prototype, 'logWarning').callsFake(this.logWarningSpy)
      },
      teardown: function () {
        Service.prototype.logWarning.restore()
        Limiter.prototype._C.restore()
      },
      doTest: function() {
        const _handleErrorSpy = sinon.spy()
        const service = o({ _type: Service, _handleError: _handleErrorSpy})

        // Do not log rejected requests
        let resSpy = sinon.spy()
        resSpy.append = sinon.spy()

        let limiter = o({ _type: Limiter }) // logRejections: false
        limiter.initialize(service, service)
        limiter.sendUnavailable(resSpy)

        assert(!this.logWarningSpy.called)

        // Log rejected requests
        resSpy = sinon.spy()
        resSpy.append = sinon.spy()

        limiter = o({ _type: Limiter, logRejections: true })
        limiter.initialize(service, service)
        limiter.sendUnavailable(resSpy)

        assert(this.logWarningSpy.called)

      }
    })
  ]
})
