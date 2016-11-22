var assert = require('assert')

var _ = require('lodash')
var sinon = require('sinon')

var o  = require('@carbon-io/carbon-core').atom.o(module)
var testtube = require('@carbon-io/carbon-core').testtube

var Endpoint = require('../../lib/Endpoint')
var limiters = require('../../lib/limiter/Limiter')
var limiterPolicies = require('../../lib/limiter/LimiterPolicy')
var limiterSelectors = require('../../lib/limiter/LimiterSelector')
var Operation = require('../../lib/Operation')
var Service = require('../../lib/Service')

module.exports = o({
  _type: testtube.Test,
  name: 'PolicyLimiterTests',
  description: 'PolicyLimiter tests',
  setup: function() {
    var self = this
    this.tests.forEach(function(test) {
      test.parent = self
    })
    sinon.stub(Service.prototype, '_init')
  },
  teardown: function() {
    Service.prototype._init.restore()
  },
  tests: [
    o({
      _type: testtube.Test,
      name: 'TestValidation',
      description: 'Test validation',
      doTest: function() {
        var selectors = ['a', 1, {}]
        selectors.forEach(function(selector) {
          assert.throws(function() {
            o({
              _type: limiters.PolicyLimiter,
              selector: selector,
              policy: o({_type: limiterPolicies.WindowLimiterPolicy})
            })
          }, TypeError)
        })
        var policies = ['a', 1, {}]
        policies.forEach(function(policy) {
          assert.throws(function() {
            o({
              _type: limiters.PolicyLimiter,
              selector: o({_type: limiterSelectors.StaticKeyLimiterSelector}),
              policy: policy
            })
          }, TypeError)
        })
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestInitialize',
      description: 'Test initialize method',
      doTest: function() {
        var service = o({_type: Service})
        var limiter = o({
          _type: limiters.PolicyLimiter,
          selector: o({
            _type: limiterSelectors.StaticKeyLimiterSelector,
            staticKey: 'foo'
          }),
          policy: o({_type: limiterPolicies.WindowLimiterPolicy})
        })
        limiter.initialize(service, service)
        assert.equal(_.keys(limiters.PolicyLimiter._state).length, 1)
        assert('service' in limiters.PolicyLimiter._state)
        assert.equal(_.keys(limiters.PolicyLimiter._state.service).length, 1)
        assert('foo' in limiters.PolicyLimiter._state.service)
        var endpoint = o({
          _type: Endpoint,
          path: '/bar'
        })
        var limiter1 = o({
          _type: limiters.PolicyLimiter,
          selector: o({
            _type: limiterSelectors.StaticKeyLimiterSelector,
            staticKey: 'foo'
          }),
          policy: o({_type: limiterPolicies.WindowLimiterPolicy})
        })
        limiter1.initialize(service, endpoint)
        assert.equal(_.keys(limiters.PolicyLimiter._state).length, 2)
        assert('/bar::ALL' in limiters.PolicyLimiter._state)
        assert.equal(_.keys(limiters.PolicyLimiter._state['/bar::ALL']).length, 1)
        assert('foo' in limiters.PolicyLimiter._state['/bar::ALL'])
        var operation = o({
          _type: Operation,
          endpoint: ({
            _type: Endpoint,
            path: '/baz'
          }),
          name: 'GET'
        })
        var limiter2 = o({
          _type: limiters.PolicyLimiter,
          selector: o({
            _type: limiterSelectors.StaticKeyLimiterSelector,
            staticKey: 'foo'
          }),
          policy: o({_type: limiterPolicies.WindowLimiterPolicy})
        })
        limiter2.initialize(service, operation)
        assert.equal(_.keys(limiters.PolicyLimiter._state).length, 3)
        assert('/baz::GET' in limiters.PolicyLimiter._state)
        assert.equal(_.keys(limiters.PolicyLimiter._state['/baz::GET']).length, 1)
        assert('foo' in limiters.PolicyLimiter._state['/baz::GET'])
        var limiter3 = o({
          _type: limiters.PolicyLimiter,
          selector: o({
            _type: limiterSelectors.StaticKeyLimiterSelector,
            key: 'foo'
          }),
          policy: o({_type: limiterPolicies.WindowLimiterPolicy})
        })
        assert.throws(function () {
          limiter3.initialize(service, {})
        }, TypeError)
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestPolicyLimiter',
      description: 'Test PolicyLimiter',
      setup: function() {
        var results = [
          0,    // allow
          500,  // reject
          1000, // allow
          1500, // reject
          1900, // reject
          2000  // allow
        ]
        sinon.stub(Date, 'now', function() {
          return results.shift()
        })
      },
      teardown: function() {
        Date.now.restore()
      },
      doTest: function() {
        var limiter = o({
          _type: limiters.PolicyLimiter,
          selector: o({_type: limiterSelectors.StaticKeyLimiterSelector}),
          policy: o({
            _type: limiterPolicies.WindowLimiterPolicy,
            window: 1000,
            reqLimit: 1
          })
        })
        sinon.stub(limiter, 'sendUnavailable', function() {})
        var nextSpy = sinon.spy()
        var service = o({_type: Service})
        limiter.initialize(service, service)
        for (var i = 0; i < 6; i++) {
          limiter.process({}, {}, nextSpy)
        }
        assert.equal(limiter.sendUnavailable.callCount, 3)
        assert.equal(nextSpy.callCount, 3)
      }
    })
  ]
})
