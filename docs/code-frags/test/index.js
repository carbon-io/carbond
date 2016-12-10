var o  = require('@carbon-io/carbon-core').atom.o(module).main
var _o = require('@carbon-io/carbon-core').bond._o(module)
var testtube = require('@carbon-io/carbon-core').testtube

/**************************************************************************
 * Code fragments tests
 */
module.exports = o({

  /**********************************************************************
   * _type
   */
  _type: testtube.Test,

  /**********************************************************************
   * name
   */
  name: "Carbond code fragments tests",

  /**********************************************************************
   * tests
   */
  tests: [
    _o('./limiter')
  ]
})

