var carbon = require('carbon-io')

var __ = carbon.fibers.__(module)
var _o = carbon.bond._o(module)
var o = carbon.atom.o(module)
var testtube = carbon.testtube

__(function() {
  module.exports = o.main({
    _type: testtube.Test,
    name: 'HelloServiceTestSuite',
    description: 'HelloService test suite.',
    tests: [
      _o('./HelloServiceTest')
    ]
  })
})

