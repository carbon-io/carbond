var core = require('@carbon-io/carbon-core')

var __ = core.fibers.__(module)
var _o = core.bond._o(module)
var o = core.atom.o(module)

var carbond = require('../../../..')

__(function() {
  module.exports = o.main({
    _type: carbond.test.ServiceTest,
    name: 'SimpleEndpointServiceReferenceTests',
    service: _o('../../standalone-examples/ServiceSimpleEndpointServiceReferenceExample'),
    tests: [
      {
        reqSpec: {
          method: 'GET',
          url: '/status',
        },
        resSpec: {
          statusCode: 200,
          body: {
            running: true,
            msg: 'Up and running on port: 8888',
          },
        },
      },
    ],
  })
})



