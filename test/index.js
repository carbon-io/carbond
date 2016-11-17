var o  = require('@carbon-io/carbon-core').atom.o(module).main
var _o = require('@carbon-io/carbon-core').bond._o(module)
var testtube = require('@carbon-io/carbon-core').testtube

/**************************************************************************
 * All tests
 */
module.exports = o({

  /**********************************************************************
   * _type
   */
  _type: testtube.Test,

  /**********************************************************************
   * name
   */
  name: "Carbond tests",

  /**********************************************************************
   * tests
   */
  tests: [
    _o('./AclTests'),
    _o('./AuthenticatorTests'),
    _o('./BasicCollectionTests'),
    _o('./BasicEndpointTests'),
    _o('./HasherTests'),
    _o('./IdGeneratorTests'),
    _o('./MongoDBCollectionTests'),
    _o('./ParameterParsingTests'),
    _o('./StartStopTests'),
    _o('./SslTests')
  ],
})
