var core = require('@carbon-io/carbon-core')
var __ = core.fibers.__(module)
var _o = core.bond._o(module)
var o = core.atom.o(module)
var testtube = core.testtube

/**************************************************************************
 * Code fragments service tests
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
    name: "ServiceCodeFragsTestSuite",

    /**********************************************************************
     * tests
     */
    tests: [
      _o('./SingleDBConnectionTests'),
      _o('./SimpleEndpointTests'),
      _o('./SimpleEndpointServiceReferenceTests'),
      _o('./SimpleSubEndpointTests'),
      _o('./SimpleEndpointsTests'),
      _o('./SimpleTests'),
      _o('./AsyncProgrammaticServiceStartTests'),
      _o('./SyncProgrammaticServiceStartTests'),
      _o('./MultipleDBConnectionTests'),
    ]
  })
})

