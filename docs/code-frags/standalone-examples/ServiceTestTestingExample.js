var carbon = require('carbon-io')
var __ = carbon.fibers.__(module)
var _o = carbon.bond._o(module)
var carbond = carbon.carbond
var o  = carbon.atom.o(module)

__(function() {
  module.exports = o.main({
    _type: carbond.test.ServiceTest,
    name: 'HelloWorldServiceTest',
    service: _o('./HelloWorldService'), // path to your Service
    tests: [
      {
        reqSpec: {
          method: 'GET',
          url: '/hello',
        },
        resSpec: {
          statusCode: 200,
          body: {
            msg: 'Hello World!',
          },
        },
      },
      {
        reqSpec: {
          method: 'POST',
          url: '/hello',
          body: {
            msg: 'Hello World!',
          },
        },
        resSpec: {
          statusCode: 200,
          body: {
            msg: 'Hello World!',
          },
        },
      },
    ],
  })
})

