var assert = require('assert')
var path = require('path')

var carbon = require('carbon-io')

var __ = carbon.fibers.__(module)
var _o = carbon.bond._o(module)
var carbond = carbon.carbond
var ejson = carbon.ejson
var o = carbon.atom.o(module)
var testtube = carbon.testtube

__(function() {
  module.exports = o.main({
    _type: carbond.test.ServiceTest,
    name: 'HelloServiceTests',
    description: 'HelloService tests.',
    service: _o('../lib/HelloService'),
    _mongoFixtures: {
      db: path.join(path.dirname(module.filename), 'fixtures', 'db.json')
    },
    tests: [
      // endpoints
      {
        reqSpec: {
          url: '/feedback',
          method: 'GET'
        },
        resSpec: {
          statusCode: 200,
          body: function(val) {
            assert.equal(val.length, 1)
            assert.equal(val[0]._id.toString(), '000000000000000000000000')
          }
        }
      }
    ]
  })
})

