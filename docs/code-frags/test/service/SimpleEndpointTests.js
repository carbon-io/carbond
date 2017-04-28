var core = require('@carbon-io/carbon-core')

var __ = core.fibers.__(module)
var _o = core.bond._o(module)
var o = core.atom.o(module)
var testtube = core.testtube

var carbond = require('../../../..')

__(function() {
  module.exports = o.main({
    _type: carbond.test.ServiceTest,
    name: 'SimpleEndpointTests',
    service: _o('../../standalone-examples/ServiceSimpleEndpointExample'),
    tests: [
      {
        reqSpec: {
          method: 'GET',
          url: '/hello'
        },
        resSpec: {
          statusCode: 200,
          body: {
            msg: 'Hello World!'
          }
        }
      },
      {
        reqSpec: {
          method: 'POST',
          url: '/hello',
          body: {msg: 'foo bar baz'}
        },
        resSpec: {
          statusCode: 200,
          body: {
            msg: 'Hello World! foo bar baz'
          }
        }
      }
    ]
  })
})


