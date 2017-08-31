var __ = require('@carbon-io/carbon-core').fibers.__(module)
var o = require('@carbon-io/carbon-core').atom.o(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)
var testtube = require('@carbon-io/carbon-core').testtube

var carbond = require('../..')

/**************************************************************************
 * insert config tests
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
    name: 'insertConfigTests',

    /**********************************************************************
     * tests
     */
    tests: [
    ],
  })
})


