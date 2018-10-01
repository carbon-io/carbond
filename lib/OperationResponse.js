var  _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)

/***************************************************************************************************
 * @class OperationResponse
 */
module.exports = oo(_.mixin({
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

    this.redact = undefined
  },

  extractBodyFromResponse: function(res) {
    let result = res.sent.body

    if (this.redact) {
      switch (typeof this.redact) {
        case 'boolean':
          result = '[redacted]'
          break;
        case 'function':
          result = this.redact(result)
          break;
        case 'object':
          result = this._redactObject(JSON.parse(JSON.stringify(result)), this.redact)
        default:
          break;
      }
    }

    return result
  }
}, _o('./util/mixins/Redacter')))

