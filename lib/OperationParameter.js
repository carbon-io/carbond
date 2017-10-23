var oo = require('@carbon-io/carbon-core').atom.oo(module);

/***************************************************************************************************
 * @class OperationParameter
 */
module.exports = oo({

  /*****************************************************************************
   * @constructs OperationParameter
   * @description Describes an HTTP parameter. Parameter types include: path
   *              parameters (e.g., "_id" in "/foo/bar/:_id"), query parameters
   *              (e.g., "baz" in "/foo/bar?baz=true"), HTTP header parameters,
   *              and HTTP body parameters.
   * @memberof carbond
   */
  _C: function() {

    // -----------------------------
    // Computed read-only properties
    // -----------------------------

    /*****************************************************************************
     * @property {string} name -- The operation parameter name
     * @readonly
     */
    this.name = undefined

    // -----------------------
    // Configurable properties
    // -----------------------

    /***************************************************************************
     * @property {string} [description] -- A brief description of this parameter
     *                                     This will be displayed in any generated
     *                                     documentation.
     */
    this.description = undefined

    /***************************************************************************
     * @property {string} location
     * @description The location of the parameter in an incoming request [choices:
     *              "query", "header", "path", "body]
     */
    this.location = undefined  // "query", "header", "path", "formData"? or "body"

    /***************************************************************************
     * @property {Object?} [schema] -- A JSON schema used to validate the
     *                                 incoming parameter
     */
    this.schema = undefined

    /***************************************************************************
     * @property {boolean} [required=false] -- Flag determining whether the
     *                                         parameter is required
     */
    this.required = false

    /***************************************************************************
     * @property {*} [default] -- A default value for the parameter if it is not
     *                            present in the incoming request
     */
    this.default = undefined // XXX should be undefined?

  },

  _frozenProperties: [
    'name'
  ],

  /*****************************************************************************
   * @method extractParameterValueFromRequest
   * @description Retrieves the parameter value from a request, returning the
   *              default value if it does not exist and a default value is
   *              defined. Note, values returned from this method are not
   *              parsed.
   * @param {carbond.Request} req -- The incoming request object
   * @returns {*}
   */
  extractParameterValueFromRequest: function(req) {
    if (!this.name) {
      throw new Error("Incomplete parameter definition. No name specified for parameter definition " + this)
    }

    var result = undefined
    if (this.location === "query") {
      result = req.query[this.name]
    } else if (this.location === "path") {
      result = req.params[this.name]
    } else if (this.location === "header") {
      result = req.header[this.name]
    } else if (this.location === "body") {
      result = req.body
    } else { // XXX formData?
      throw new Error("Unrecognized location value specified for parameter '" + this.name + "': " + this.location)
    }

    // Parameters that come in as an empty string should look like undefined
    if (result === '') {
      result = undefined
    }

    if (!result && this.default) {
      result = this.default
    }

    return result
  }
})

