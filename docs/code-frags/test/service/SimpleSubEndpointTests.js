var assert = require('assert')
var path = require('path')

var _ = require('lodash')

var core = require('@carbon-io/carbon-core')

var __ = core.fibers.__(module)
var _o = core.bond._o(module)
var o = core.atom.o(module)
var testtube = core.testtube

var carbond = require('../../../..')

__(function() {
  module.exports = o.main({
    _type: carbond.test.ServiceTest,
    name: 'SimpleSubEndpointTests',
    service: _o('../../standalone-examples/ServiceSimpleSubEndpointExample'),
    _mongoFixtures: {
      db: path.join(path.dirname(module.filename), 
                    '..', 
                    'fixtures', 
                    'SimpleSubEndpointTestsDB.json')
    },
    tests: [
      {
        reqSpec: {
          method: 'GET',
          url: '/users'
        },
        resSpec: {
          statusCode: 200,
          body: function(val) {
            assert(_.isArray(val))
            assert.equal(val.length, 2)
          }
        }
      },
      {
        reqSpec: {
          method: 'GET',
          url: '/users/0'
        },
        resSpec: {
          statusCode: 200,
          body: function(val) {
            assert(!_.isArray(val))
            assert(_.isObjectLike(val))
            assert.equal(val.firstName, 'foo')
            assert.equal(val.lastName, 'bar')
          }
        }
      },
      {
        reqSpec: {
          method: 'DELETE',
          url: '/users/0'
        },
        resSpec: {
          statusCode: 200,
          body: function(val) {
            assert(_.isNil(val))
          }
        }
      }
    ]
  })
})


