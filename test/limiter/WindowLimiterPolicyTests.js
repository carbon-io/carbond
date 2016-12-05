var assert = require('assert')

var sinon = require('sinon')

var o  = require('@carbon-io/carbon-core').atom.o(module)
var testtube = require('@carbon-io/carbon-core').testtube

var WindowLimiterPolicy = require('../../lib/limiter/WindowLimiterPolicy')

module.exports = o({
  _type: testtube.Test,
  name: 'WindowLimiterPolicyTests',
  description: 'WindowLimiterPolicy tests',
  tests: [
    o({
      _type: testtube.Test,
      name: 'TestValidation',
      description: 'Test validation',
      doTest: function() {
        var vals = ['foo', -1, {}]
        vals.forEach(function(val) {
          assert.throws(function() {
            o({
              _type: WindowLimiterPolicy,
              window: val
            })
          }, TypeError)
        })
        vals.forEach(function(val) {
          assert.throws(function() {
            o({
              _type: WindowLimiterPolicy,
              reqLimit: val
            })
          }, TypeError)
        })
        assert.doesNotThrow(function() {
          o({
            _type: WindowLimiterPolicy,
            window: 10000,
            reqLimit: 10
          })
        }, TypeError)
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestValidation',
      description: 'Test validation',
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
        var policy = o({
          _type: WindowLimiterPolicy,
          window: 1000,
          reqLimit: 1
        })
        policy.initializeState()
        assert(policy.allow(undefined, undefined, 'foo'))
        assert(!policy.allow(undefined, undefined, 'foo'))
        assert(policy.allow(undefined, undefined, 'foo'))
        assert(!policy.allow(undefined, undefined, 'foo'))
        assert(!policy.allow(undefined, undefined, 'foo'))
        assert(policy.allow(undefined, undefined, 'foo'))
      }
    })
  ]
})
