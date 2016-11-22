var assert = require('assert')

var o  = require('@carbon-io/carbon-core').atom.o(module)
var testtube = require('@carbon-io/carbon-core').testtube

var limiterSelectors = require('../../lib/limiter/LimiterSelector')

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
