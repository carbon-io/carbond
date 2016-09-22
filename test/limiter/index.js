var _o = require('bond')._o(module)
var o  = require('atom').o(module)
var testtube = require('test-tube')

module.exports = o({
  _type: testtube.Test,
  name: 'LimiterFrameworkTests',
  description: 'Limiter framework tests',
  setup: function() { },
  teardown: function() { },
  tests: [
    _o('./LimiterTests'),
    _o('./LimiterSelectorTests'),
    _o('./StaticKeyLimiterSelectorTests'),
    _o('./ReqPropertyLimiterSelectorTests'),
    _o('./FunctionLimiterTests'),
    _o('./LimiterPolicyStateTests'),
    _o('./LimiterPolicyTests'),
    _o('./WindowLimiterPolicyTests'),
    _o('./PolicyLimiterTests'),
    _o('./ChainLimiterTests'),
    _o('./ServiceIntegrationTests')
  ]
})

