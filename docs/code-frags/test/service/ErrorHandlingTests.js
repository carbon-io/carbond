var path = require('path')

var core = require('@carbon-io/carbon-core')

var __ = core.fibers.__(module)
var _o = core.bond._o(module)
var o = core.atom.o(module)
var testtube = core.testtube

var carbond = require('../../../..')

__(function() {
  module.exports = o.main({
    _type: carbond.test.ServiceTest,
    name: 'ErrorHandlingTests',
    service: _o('../../standalone-examples/ServiceErrorHandlingExample'),
    tests: [
      {
        reqSpec: {
          method: 'POST',
          url: '/hello',
          body: {
            hello: 'world',
          },
        },
        resSpec: {
          statusCode: 200,
          body: {
            msg: 'Hello World! {"hello":"world"}',
          },
        },
      },
      {
        reqSpec: {
          method: 'POST',
          url: '/hello',
        },
        resSpec: {
          statusCode: 400,
          body: {
            code: 400,
            description: 'Bad Request',
            message: 'Must supply a body',
          },
        },
      },
      {
        reqSpec: {
          method: 'POST',
          url: '/goodbye',
          body: {
            goodbye: 'world',
          },
        },
        resSpec: {
          statusCode: 200,
          body: {
            msg: 'Goodbye World! {"goodbye":"world"}',
          },
        },
      },
      {
        reqSpec: {
          method: 'POST',
          url: '/goodbye',
        },
        resSpec: {
          statusCode: 400,
          body: {
            code: 400,
            description: 'Bad Request',
            message: 'Must supply a body',
          },
        },
      },
    ],
  })
})

