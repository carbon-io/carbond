var assert = require('assert')

var _ = require('lodash')

var o  = require('@carbon-io/carbon-core').atom.o(module)
var testtube = require('@carbon-io/carbon-core').testtube

var limiterPolicies = require('../../lib/security/LimiterPolicy')

module.exports = o({
  _type: testtube.Test,
  name: 'LimiterPolicyStateTests',
  description: 'LimiterPolicyState tests',
  setup: function() { },
  teardown: function() { },
  tests: [
    o({
      _type: testtube.Test,
      name: 'TestVisit',
      description: 'Test visit method',
      setup: function() { },
      teardown: function() { },
      doTest: function() {
        var state = o({_type: limiterPolicies.LimiterPolicyState})

        // validation

        assert.throws(function() {
          state.visit({}, 1, 1)
        }, TypeError)
        assert.throws(function() {
          state.visit({}, 'foo', 'bar')
        }, TypeError)

        // test retention
        var timestamps = [0, 10, 20, 30]
        timestamps.forEach(function(ts) {
          state.visit({}, 'foo', ts)
        })
        var timestamps_ = _.sortBy(state._state.foo.toArray())
        assert.deepEqual(timestamps_, timestamps)
        state.reset()

        // test selector switching

        var ts = 0
        var selectors = ['foo', 'bar', 'baz']
        selectors.forEach(function(selector) {
          state.visit({}, selector, ts)
          ts += 10
        })
        assert.deepEqual(_.sortBy(_.keys(state._state)), _.sortBy(selectors))
        var ts = 0
        selectors.forEach(function(selector) {
          assert.equal(1, state._state[selector].size())
          assert.equal(ts, state._state[selector].pop())
          ts += 10
        })
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestVisits',
      description: 'Test visits method',
      doTest: function() {
        var state = o({_type: limiterPolicies.LimiterPolicyState})
        var timestamps = [0, 1, 2, 3, 4, 5]
        var selectors = ['foo', 'bar', 'baz']
        selectors.forEach(function(selector) {
          assert.equal(state.visits(selector), 0)
          timestamps.forEach(function(ts) {
            state.visit({}, selector, ts)
          })
        })
        selectors.forEach(function(selector) {
          assert.equal(state.visits(selector), 6)
        })
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestPurge',
      description: 'Test purge method',
      doTest: function() {
        var state = o({_type: limiterPolicies.LimiterPolicyState})
        var timestamps = [0, 1, 2, 3, 4, 5]
        var selectors = ['foo', 'bar', 'baz']

        // test purge doesn't barf when state selector doesn't exist
        assert.doesNotThrow(function() {
          state.purge(3, 'foo')
        }, TypeError)
        selectors.forEach(function(selector) {
          timestamps.forEach(function(ts) {
            state.visit({}, selector, ts)
          })
        })
        var numPurged = state.purge(2, 'foo')
        assert.equal(numPurged, 3)
        assert.deepEqual(_.sortBy(state._state.foo.toArray()), [3, 4, 5])
        assert.deepEqual(_.sortBy(state._state.bar.toArray()), timestamps)
        assert.deepEqual(_.sortBy(state._state.baz.toArray()), timestamps)
        numPurged = state.purge(2)
        assert.equal(numPurged, 6)
        assert.deepEqual(_.sortBy(state._state.foo.toArray()), [3, 4, 5])
        assert.deepEqual(_.sortBy(state._state.bar.toArray()), [3, 4, 5])
        assert.deepEqual(_.sortBy(state._state.baz.toArray()), [3, 4, 5])
        numPurged = state.purge(function(val) {
          return val < 4
        })
        assert.equal(numPurged, 3)
        assert.deepEqual(_.sortBy(state._state.foo.toArray()), [4, 5])
        assert.deepEqual(_.sortBy(state._state.bar.toArray()), [4, 5])
        assert.deepEqual(_.sortBy(state._state.baz.toArray()), [4, 5])
        numPurged = state.purge(5)
        assert.equal(numPurged, 6)
        assert.equal(_.keys(state._state).length, 0)
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestReset',
      description: 'Test reset method',
      doTest: function() {
        var state = o({_type: limiterPolicies.LimiterPolicyState})
        state.visit({}, 'foo', 1)
        state.visit({}, 'bar', 1)
        assert.equal(_.keys(state._state).length, 2)
        state.reset()
        assert.equal(_.keys(state._state).length, 0)
      }
    }),
  ]
})
