var path = require('path')

var core = require('@carbon-io/carbon-core')

var __ = core.fibers.__(module)
var _o = core.bond._o(module)
var o = core.atom.o(module)
var testtube = core.testtube

var carbond = require('../../../..')

__(function() {
  module.exports = o.main({
    _type: testtube.Test,
    name: 'SimpleAuthenticationTests',
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        service: _o(
          '../../standalone-examples/ServiceSimpleAuthenticationExample').Service1,
        tests: [
          {
            reqSpec: {
              method: 'GET',
              url: '/hello',
              parameters: {
                username: 'skroob'
              }
            },
            resSpec: {
              statusCode: 200,
              body: {
                msg: 'Hello pres@skroob.com!'
              }
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/hello',
              parameters: {
                username: 'yogurt'
              }
            },
            resSpec: {
              statusCode: 401
            }
          }
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        service: _o(
          '../../standalone-examples/ServiceSimpleAuthenticationExample').Service2,
        _mongoFixtures: {
          db: path.join(path.dirname(module.filename), 
                        '..', 
                        'fixtures', 
                        'SimpleAuthenticationDB.json')
        },
        tests: [
          {
            reqSpec: {
              method: 'GET',
              url: '/hello',
              headers: {
                Authorization: 'Basic ' + 
                               Buffer.from('skroob:12345', 
                                           'ascii').toString('base64')
              }
            },
            resSpec: {
              statusCode: 200,
              body: {
                msg: 'Hello pres@skroob.com!'
              }
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/hello',
              headers: {
                Authorization: 'Basic ' + 
                               Buffer.from('yogurt:shwartz', 
                                           'ascii').toString('base64')
              }
            },
            resSpec: {
              statusCode: 401
            }
          }
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        service: _o(
          '../../standalone-examples/ServiceSimpleAuthenticationExample').Service3,
        _mongoFixtures: {
          db: path.join(path.dirname(module.filename), 
                        '..', 
                        'fixtures', 
                        'SimpleAuthenticationDB.json')
        },
        tests: [
          {
            reqSpec: {
              method: 'GET',
              url: '/hello',
              headers: {
                API_KEY: '12345'
              }
            },
            resSpec: {
              statusCode: 200,
              body: {
                msg: 'Hello pres@skroob.com!'
              }
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/hello',
              headers: {
                API_KEY: '964878'
              }
            },
            resSpec: {
              statusCode: 401
            }
          }
        ]
      })
    ]
  })
})

