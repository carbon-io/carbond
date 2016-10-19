var assert = require('assert')

var _ = require('lodash')
var sinon = require('sinon')

var o  = require('@carbon-io/carbon-core').atom.o(module)
var oo  = require('@carbon-io/carbon-core').atom.oo(module)
var testtube = require('@carbon-io/carbon-core').testtube

var Endpoint = require('../../lib/Endpoint')
var limiterPolicies = require('../../lib/security/LimiterPolicy')
var Operation = require('../../lib/Operation')
var Service = require('../../lib/Service')

module.exports = o({
  _type: testtube.Test,
  name: 'LimiterPolicyTests',
  description: 'LimiterPolicy tests',
  LimiterPolicy_: oo({
    _type: limiterPolicies.LimiterPolicy
  }),
  setup: function() {
    var self = this
    this.tests.forEach(function(test) {
      test.parent = self
    })
    sinon.stub(Endpoint.prototype, '_init')
    sinon.stub(Operation.prototype, '_init')
    sinon.stub(Service.prototype, '_init')
  },
  teardown: function() {
    Endpoint.prototype._init.restore()
    Operation.prototype._init.restore()
    Service.prototype._init.restore()
  },
  Policy: function(node, sharedState) {
    var limiterPolicy = o({
      _type: this.LimiterPolicy_,
      sharedState: _.isUndefined(sharedState) ? false : sharedState
    })
    limiterPolicy.initialize({}, node)
    return limiterPolicy
  },
  tests: [
    o({
      _type: testtube.Test,
      name: 'TestInstantiation',
      description: 'Test instantiation',
      doTest: function() {
        assert.throws(function() {
          var limiterPolicy = o({
            _type: limiterPolicies.LimiterPolicy
          })
        }, Error)
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestStateKey',
      description: 'Test stateKey property',
      doTest: function() {
        // shared state

        var node = o({_type: Service})
        var policy = this.parent.Policy(node, true)
        assert.equal(policy.stateKey, limiterPolicies.LimiterPolicy.SHARED_STATE_KEY)

        // double instantiation
        assert.throws(function() {
          policy.initialize({}, node)
        }, Error)

        // service level
        node = o({_type: Service})
        policy = this.parent.Policy(node)
        assert.equal(policy.stateKey, 'service')

        // operation level
        node = o({
          _type: Operation,
          endpoint: {
            path: '/foo'
          },
          name: 'GET'
        })
        policy = this.parent.Policy(node)
        assert.equal(policy.stateKey, '/foo::GET')

        // endpoint level
        node = o({
          _type: Endpoint,
          path: '/foo'
        })
        policy = this.parent.Policy(node)
        assert.equal(policy.stateKey, '/foo::ALL')

        // node validation
        policy = this.parent.Policy({})
        assert.throws(function() {
          var key = policy.stateKey
        }, TypeError)
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestStateKey',
      description: 'Test initializeState',
      doTest: function() {
        var node = o({_type: Service})
        var policy = this.parent.Policy(node)
        var state = policy.initializeState()

        // state should be an instance of LimiterPolicyState
        assert(state instanceof limiterPolicies.LimiterPolicyState)
        // we should get a different instance back on initialization
        assert.notEqual(policy.initializeState(), state)
        // non shared state policies should throw assertion error if a state instance is passed in
        assert.throws(function() {
          policy.initializeState(state)
        }, Error)

        policy = this.parent.Policy(node, true)
        state = o({_type: limiterPolicies.LimiterPolicyState})

        // shared state policies should return the state that was passed in
        assert.equal(policy.initializeState(state), state)
      }
    }),
  ]
})
