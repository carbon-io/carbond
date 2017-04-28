var assert = require('assert')

var sinon = require('sinon')

var core = require('@carbon-io/carbon-core')

var __ = core.fibers.__(module)
var _o = core.bond._o(module)
var o = core.atom.o(module)
var testtube = core.testtube

var carbond = require('../../../..')

__(function() {
  module.exports = o.main({
    _type: carbond.test.ServiceTest,
    name: 'SimpleTests',
    service: _o('../../standalone-examples/ServiceSimpleExample'),
    tests: [
      {
        setup: function() {
          this.consoleSpy = sinon.spy(console, 'log')
        },
        teardown: function() {
          try {
            assert(this.consoleSpy.callCount, 1)
          } finally {
            this.consoleSpy.restore()
          }
        },
        reqSpec: {
          method: 'GET',
          url: '/hello'
        },
        resSpec: {
          statusCode: 200,
          body: {
            msg: "Hello World!"
          }
        }
      }
    ]
  })
})

