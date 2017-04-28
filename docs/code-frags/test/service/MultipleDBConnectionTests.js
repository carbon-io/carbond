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
    name: 'MultipleDBConnectionTests',
    service: _o('../../standalone-examples/ServiceMultipleDBConnectionExample'),
    suppressServiceLogging: false,
    /*
    _mongoFixtures: {
      main: {
        dbUri: "mongodb://localhost:27017/mydb",
        fixturePath: path.join(path.dirname(module.filename), 
                               '..', 
                               'fixtures', 
                               'MultipleDbConnectionTestsDB.json')
      },
      reporting: {
        dbUri: "mongodb://localhost:27017/reporting",
        fixturePath: path.join(path.dirname(module.filename), 
                               '..', 
                               'fixtures', 
                               'MultipleDbConnectionTestsDB.json')
      }
    },
    */
    tests: [
      {
        reqSpec: {
          method: 'GET',
          url: '/messages'
        },
        resSpec: {
          statusCode: 200,
          body: function(val) {
            assert(_.isArray(val))
            assert.equal(val.length, 1)
            assert.equal(val[0].foo, 'bar')
            assert.equal(val[0]._id.toString(), '000000000000000000000000')
          }
        }
      },
      {
        reqSpec: {
          method: 'GET',
          url: '/dashboards'
        },
        resSpec: {
          statusCode: 200,
          body: function(val) {
            assert(_.isArray(val))
            assert.equal(val.length, 1)
            assert.equal(val[0].foo, 'bar')
            assert.equal(val[0]._id.toString(), '000000000000000000000001')
          }
        }
      }
    ]
  })
})
