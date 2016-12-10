var _ = require('lodash')

var o  = require('@carbon-io/carbon-core').atom.o(module).main
var oo  = require('@carbon-io/carbon-core').atom.oo(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)
var testtube = require('@carbon-io/carbon-core').testtube

var TooBusyLimiterExample = _.cloneDeep(require('../../TooBusyLimiterExample'))

_.assign(TooBusyLimiterExample, {
    hostname: '127.0.0.1',
    port: 8888,
    enableBusyLimiter: true
  })

/**************************************************************************
 * TooBusyLimiterExampleTests
 */
module.exports = o({

  /**********************************************************************
   * _type
   */
  _type: _o('../../../../lib/test/ServiceTest'),

  /**********************************************************************
   * name
   */
  name: 'TooBusyLimiterExample tests',

  /**********************************************************************
   * service
   */
  service: o(TooBusyLimiterExample),

  /**********************************************************************
   * tests
   */
  tests: [
    {
      reqSpec: {
        url: '/foo',
        method: 'GET'
      },
      resSpec: {
        statusCode: 200
      }
    }
  ]
})

