var _o = require('@carbon-io/carbon-core').bond._o(module)
var o  = require('@carbon-io/carbon-core').atom.o(module).main
var testtube = require('@carbon-io/carbon-core').testtube

module.exports = o({
  _type: testtube.Test,
  name: 'MongoDBTests',
  description: 'MongoDB tests',
  setup: function() { },
  teardown: function() { },
  tests: [
    _o('./MongoDBCollectionTests')
  ]
})



