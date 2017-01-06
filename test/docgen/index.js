var _o = require('@carbon-io/carbon-core').bond._o(module)
var o  = require('@carbon-io/carbon-core').atom.o(module)
var testtube = require('@carbon-io/carbon-core').testtube

module.exports = o({
  _type: testtube.Test,
  name: 'DocgenTests',
  description: 'docgen tests',
  setup: function() { },
  teardown: function() { },
  tests: [
    _o('./ghfmdTests')
  ]
})


