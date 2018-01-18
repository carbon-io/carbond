var oo = require('@carbon-io/carbon-core').atom.oo(module);

/***************************************************************************************************
 * @class OperationResponse
 */
module.exports = oo({
  _ctorName: 'OperationResponse',

  /*****************************************************************************
   * @constructs OperationResponse
   * @description Describes what an HTTP response should look like along with some
   *              metadata to be used when generating static documentation
   * @memberof carbond
   */
  _C: function() {
    /***************************************************************************
     * @property {number} [statusCode=200] -- The status code for a response
     */
    this.statusCode = 200

    /***************************************************************************
     * @property {string?} description -- A brief description of the response that
     *                                    will be included generated static
     *                                    documentation
     */
    this.description = undefined

    /***************************************************************************
     * @property {Object?} schema -- A valid JSON schema that describes HTTP response
     *                               body. This will be used to validate responses
     *                               returned by operations.
     */
    this.schema = undefined

    /***************************************************************************
     * @property {Array.<xxx>} headers -- xxx
     * @todo Is this used anywhere?
     * @ignore
     */
    this.headers = []
  }
})

