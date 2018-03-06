var __ = require('@carbon-io/carbon-core').fibers.__(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)
var o  = require('@carbon-io/carbon-core').atom.o(module)
var tt = require('@carbon-io/carbon-core').testtube

__(function() {
  var serviceTests = o.main({
    _type: tt.Test,
    name: 'ServiceTests',
    description: 'Services tests',
    tests: [
      _o('./ErrorHandlingTests'),
      _o('./ParameterParsingTests'),
    ],
  })

  module.exports = serviceTests
})

