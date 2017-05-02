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
    name: 'SingleDBConnectionTests',
    service: _o('../../standalone-examples/ServiceSingleDBConnectionExample'),
    _mongoFixtures: {
      db: path.join(path.dirname(module.filename), 
                    '..', 
                    'fixtures', 
                    'SingleDBConnectionTestsDB.json')
    },
    tests: [
      {
        reqSpec: {
          method: 'GET',
          url: '/hello'
        },
        resSpec: {
          statusCode: 200,
          body: function(val) {
            assert(_.isArray(val))
            assert.equal(val.length, 1)
            assert.equal(val[0].text, 'foo bar')
          }
        }
      }
    ]
  })
})

