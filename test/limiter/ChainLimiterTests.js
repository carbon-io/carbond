var assert = require('assert')

var _ = require('lodash')
var sinon = require('sinon')

var o  = require('@carbon-io/carbon-core').atom.o(module).main
var testtube = require('@carbon-io/carbon-core').testtube

var limiters = {
  FunctionLimiter: require('../../lib/limiter/FunctionLimiter'),
  ChainLimiter: require('../../lib/limiter/ChainLimiter')
}
var Service = require('../../lib/Service')

module.exports = o({
  _type: testtube.Test,
  name: 'ChainLimiterTests',
  description: 'ChainLimiter tests',
  setup: function() {
    var self = this
    this.tests.forEach(function(test) {
      test.parent = self
    })
    sinon.stub(Service.prototype, '_init')
    this.service = o({_type: Service})
  },
  teardown: function() {
    Service.prototype._init.restore()
  },
  buildLimiter: function(visits) {
    visits = _.isUndefined(visits) ? 1 : visits
    return o({
      _type: limiters.FunctionLimiter,
      _fn: function(req, res, next) {
        if (!('visits' in this.state)) {
          this.state.visits = 0
        }
        if (this.state.visits === visits) {
          return this.sendUnavailable(res, next)
        }
        this.state.visits += 1
        return next()
      }
    })
  },
  tests: [
    o({
      _type: testtube.Test,
      name: 'TestInitialize',
      description: 'Test initialize method',
      doTest: function() {
        var self = this
        var limiters_ = [
          this.parent.buildLimiter(),
          this.parent.buildLimiter(),
          this.parent.buildLimiter()
        ]
        limiters_.forEach(function(limiter) {
          sinon.spy(limiter, 'initialize')
        })
        var limiterChain = o({
          _type: limiters.ChainLimiter,
          limiters: limiters_
        })
        limiterChain.initialize(this.parent.service, this.parent.service)
        limiters_.forEach(function(limiter) {
          assert(limiter.initialize.called)
          assert.equal(limiter.service, self.parent.service)
          assert.equal(limiter.node, self.parent.service)
        })
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestChainLimiter',
      description: 'Test ChainLimiter',
      doTest: function() {
        var self = this
        var limiters_ = [
          this.parent.buildLimiter(3),
          this.parent.buildLimiter(2),
          this.parent.buildLimiter(1)
        ]
        limiters_.forEach(function(limiter) {
          sinon.stub(limiter, 'sendUnavailable', function() { })
        })
        var limiterChain = o({
          _type: limiters.ChainLimiter,
          limiters: limiters_
        })
        limiterChain.initialize(this.parent.service, this.parent.service)

        var next = sinon.spy()

        var reset = function() {
          next.reset()
          limiters_.forEach(function(limiter) {
            limiter.sendUnavailable.reset()
          })
        }

        // req passes through
        limiterChain.process({}, {}, next)
        assert(next.called)
        assert.equal(0, next.firstCall.args.length)
        limiters_.forEach(function(limiter) {
          assert(!limiter.sendUnavailable.called)
        })
        reset()

        // req rejected by last limiter in chain
        limiterChain.process({}, {}, next)
        assert(!next.called)
        assert(!limiters_[0].sendUnavailable.called)
        assert(!limiters_[1].sendUnavailable.called)
        assert(limiters_[2].sendUnavailable.called)
        reset()

        // req rejected by second limiter in chain
        limiterChain.process({}, {}, next)
        assert(!next.called)
        assert(!limiters_[0].sendUnavailable.called)
        assert(limiters_[1].sendUnavailable.called)
        assert(!limiters_[2].sendUnavailable.called)
        reset()

        // req rejected by first limiter in chain
        limiterChain.process({}, {}, next)
        assert(!next.called)
        assert(limiters_[0].sendUnavailable.called)
        assert(!limiters_[1].sendUnavailable.called)
        assert(!limiters_[2].sendUnavailable.called)
        reset()

        sinon.stub(limiters_[0], 'process', function(req, res, next) {
          next(new Error('foo'))
        })
        limiterChain.process({}, {}, next)
        assert(next.called)
        assert.equal(next.firstCall.args.length, 1)
        assert(next.firstCall.args[0] instanceof Error)
        assert(!limiters_[0].sendUnavailable.called)
        assert(!limiters_[1].sendUnavailable.called)
        assert(!limiters_[2].sendUnavailable.called)
        reset()
        limiters_[0].process.restore()
      }
    }),
  ]
})
