var __ = require('@carbon-io/carbon-core').fibers.__(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)
var o  = require('@carbon-io/carbon-core').atom.o(module)
var testtube = require('@carbon-io/carbon-core').testtube

__(function() {
  module.exports = o.main({
    _type: testtube.Test,
    name: 'CollectionsTests',
    description: 'Collection tests',
    setup: function() { },
    teardown: function() { },
    tests: [
      _o('./BasicCollectionTests'),
      // _o('./AdvancedCollectionTests')
    ]
  })
})
