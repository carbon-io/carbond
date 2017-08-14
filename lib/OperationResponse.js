var oo = require('@carbon-io/carbon-core').atom.oo(module);

/***************************************************************************************************
 * @class OperationResponse
 */
module.exports = oo({

  /*****************************************************************************
   * @constructs OperationResponse
   * @description OperationResponse class description
   * @memberof carbond
   */
  _C: function() {
    /***************************************************************************
     * @property {number} [statusCode=200] -- xxx
     */
    this.statusCode = 200

    /***************************************************************************
     * @property {string} description -- xxx
     */
    this.description = undefined

    /***************************************************************************
     * @property {xxx} schema -- xxx
     */
    this.schema = undefined

    /***************************************************************************
     * @property {xxx} headers -- xxx
     */
    this.headers = []
  }
})

