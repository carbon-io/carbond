var mockery = require('mockery')

var core = require('@carbon-io/carbon-core')
var __ = core.fibers.__(module)
var _o = core.bond._o(module)
var o = core.atom.o(module)
var testtube = core.testtube

carbonioMock = {
  fibers: core.fibers,
  atom: core.atom,
  bond: core.bond,
  testtube: core.testtube,
  HttpErrors: core.HttpErrors,
  carbond: require('../../..')
}

/**************************************************************************
 * Code fragments tests
 */
__(function() {
  module.exports = o.main({

    /**********************************************************************
     * _type
     */
    _type: testtube.Test,

    /**********************************************************************
     * name
     */
    name: "CarbondCodeFragsTestSuite",

    /**********************************************************************
     * tests
     */
    tests: {
      $property: {
        get: function() {
          try {
            mockery.registerMock('carbon-io', carbonioMock)
            mockery.enable({
              warnOnUnregistered: false,
              warnOnReplace: false
            })
            return [
              _o('./limiter'),
              _o('./service'),
              _o('../hello-world/test')
            ]
          } finally {
            mockery.disable()
            mockery.deregisterMock('carbon-io')
          }
        }
      }
    }
  })
})

