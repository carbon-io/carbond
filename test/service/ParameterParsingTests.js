var assert = require('assert')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var o  = require('@carbon-io/carbon-core').atom.o(module).main
var tt = require('@carbon-io/carbon-core').testtube

var carbond = require('../../')

var parameterParsingTests = o({
  _type: carbond.test.ServiceTest,
  name: 'ParameterParsingTests',
  description: 'Parameter parsing tests',
  service: o({
    _type: _o('../../lib/Service'),
    dbUri: _o('../Config').MONGODB_URI,
    endpoints: {
      foo: o({
        _type: carbond.Endpoint,
        get: {
          description: 'Foo',
          parameters: {
            bar: {
              description: 'Bar',
              location: 'query',
              required: true,
              schema: {type: 'string'}
            }
          },
          service: function(req) {
            var col = this.getService().db.getCollection('foo')
            col.insert({bar: req.parameters.bar})
            return col.findOne({bar: req.parameters.bar})
          }
        }
      })
    }
  }),
  tests: [
    {
      reqSpec: {
        method: 'GET',
        url: '/foo',
        parameters: {
          bar: '{"baz": "yaz"}'
        }
      },
      resSpec: {
        statusCode: 200,
        body: function(body) {
          assert.equal(body.bar, '{"baz": "yaz"}')
        }
      }
    }
  ]
})

module.exports = parameterParsingTests


