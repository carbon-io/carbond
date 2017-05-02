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
    name: 'SimpleEndpointAsyncOperationTests',
    service: _o('../../standalone-examples/ServiceSimpleEndpointOperationExample'),
    _mongoFixtures: {
      db: path.join(path.dirname(module.filename), 
                    '..', 
                    'fixtures', 
                    'SimpleEndpointOperationTestsDB.json')
    },
    tests: [
      {
        reqSpec: {
          method: 'GET',
          url: '/hello1'
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
          method: 'GET',
          url: '/hello2',
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
          method: 'GET',
          url: '/hello3'
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
          method: 'GET',
          url: '/hello4',
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
          method: 'GET',
          url: '/hello5',
          parameters: {
            message: 'foo'
          }
        },
        resSpec: {
          statusCode: 200,
          body: {
            msg: 'Hello World! foo'
          }
        }
      },
      {
        reqSpec: {
          method: 'POST',
          url: '/zipcodes',
          body: {
            _id: 94110,
            state: 'California'
          }
        },
        resSpec: {
          statusCode: 200
        }
      }
    ]
  })
})
