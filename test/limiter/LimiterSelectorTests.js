var assert = require('assert')

var o  = require('atom').o(module)
var testtube = require('test-tube')

var limiterSelectors = require('../../lib/security/LimiterSelector')

module.exports = o({
  _type: testtube.Test,
  name: 'LimiterSelectorTests',
  description: 'LimiterSelector interface tests',
  tests: [
    o({
      _type: testtube.Test,
      name: 'TestInstantiate',
      description: 'Test instantiation fails',
      doTest: function() {
        assert.throws(function() {
          var limiterSelector = o({_type: limiterSelectors.LimiterSelector})
        }, Error)
      }
    }),
  ]
})
