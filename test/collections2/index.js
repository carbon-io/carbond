var __ = require('@carbon-io/carbon-core').fibers.__(module)
var o = require('@carbon-io/carbon-core').atom.o(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)
var testtube = require('@carbon-io/carbon-core').testtube

/**************************************************************************
 * Collection tests
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
    name: 'CollectionTests',

    /**********************************************************************
     * tests
     */
    tests: [
      _o('./insertTests'),
      _o('./insertConfigTests'),
      _o('./insertObjectTests'),
      _o('./findTests'),
      _o('./findObjectTests'),
      _o('./saveTests'),
      _o('./saveObjectTests'),
      _o('./updateTests'),
      _o('./updateObjectTests'),
      _o('./removeTests'),
      _o('./removeObjectTests'),
    ],
  })
})


