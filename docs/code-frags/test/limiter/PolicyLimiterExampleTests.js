var _ = require('lodash')

var __ = require('@carbon-io/carbon-core').fibers.__(module)
var o = require('@carbon-io/carbon-core').atom.o(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)

var PolicyLimiterExample =
  _.cloneDeep(require('../../standalone-examples/PolicyLimiterExample'))

_.assign(PolicyLimiterExample, {
  hostname: '127.0.0.1',
  port: 8888,
})

/**************************************************************************
 * TooBusyLimiterExampleTests
 */
__(function() {
  module.exports = o.main({

    /**********************************************************************
     * _type
     */
    _type: _o('../../../../lib/test/ServiceTest'),

    /**********************************************************************
     * name
     */
    name: 'PolicyLimiterExample tests',

    /**********************************************************************
     * service
     */
    service: o(PolicyLimiterExample),

    /**********************************************************************
     * tests
     */
    tests: [
      {
        reqSpec: {
          url: '/foo',
          method: 'GET',
        },
        resSpec: {
          statusCode: 200,
        },
      },
      {
        reqSpec: {
          url: '/foo',
          method: 'GET',
        },
        resSpec: {
          statusCode: 503,
        },
      },
      {
        reqSpec: {
          url: '/foo/bar',
          method: 'GET',
        },
        resSpec: {
          statusCode: 200,
        },
      },
      {
        reqSpec: {
          url: '/foo/bar',
          method: 'GET',
        },
        resSpec: {
          statusCode: 503,
        },
      },
      {
        reqSpec: {
          url: '/baz',
          method: 'GET',
        },
        resSpec: {
          statusCode: 200,
        },
      },
      {
        reqSpec: {
          url: '/baz',
          method: 'GET',
        },
        resSpec: {
          statusCode: 503,
        },
      },
    ],
  })
})
