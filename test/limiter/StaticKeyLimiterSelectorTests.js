var assert = require('assert')

var o  = require('@carbon-io/carbon-core').atom.o(module)
var testtube = require('@carbon-io/carbon-core').testtube

var limiterSelectors = require('../../lib/limiter/LimiterSelector')

module.exports = o({
  _type: testtube.Test,
  name: 'StaticKeyLimiterSelectorTests',
  description: 'StaticKeyLimiterSelector tests',
  setup: function() { },
  teardown: function() { },
  tests: [
    o({
      _type: testtube.Test,
      name: 'TestStaticKeyValidation',
      description: 'Test staticKey property validation',
      doTest: function() {
        [null, undefined, {foo: 'bar'}, function () {var foo = 'bar'}].forEach(function(val) {
          assert.throws(function() {
            o({_type: limiterSelectors.StaticKeyLimiterSelector, staticKey: val})
          }, TypeError)
        })
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestHash',
      description: 'Test hash',
      doTest: function() {
        var s1 = o({_type: limiterSelectors.StaticKeyLimiterSelector, staticKey: 'foo'})
        var s2 = o({_type: limiterSelectors.StaticKeyLimiterSelector, staticKey: 'bar'})
        assert(s1.hash === s1.hash)
        assert(s1.hash != s2.hash)
        assert(s2.hash === s2.hash)
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestKeyFn',
      description: 'Test key function',
      doTest: function () {
        var s1 = o({_type: limiterSelectors.StaticKeyLimiterSelector, staticKey: 'foo'})
        var s2 = o({_type: limiterSelectors.StaticKeyLimiterSelector, staticKey: 'bar'})
        assert.equal(s1.key(), 'foo')
        assert.equal(s2.key(), 'bar')
      }
    })
  ]
})
