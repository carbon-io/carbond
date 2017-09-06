var oo = require('@carbon-io/carbon-core').atom.oo(module);

/***************************************************************************************************
 * @class OperationParameter
 */
module.exports = oo({

  /*****************************************************************************
   * @constructs OperationParameter
   * @description OperationParameter class description
   * @memberof carbond
   */
  _C: function() {
    /***************************************************************************
     * @property {string} name -- xxx 
     */
    this.name = undefined

    /***************************************************************************
     * @property {string} description -- xxx
     */
    this.description = undefined

    /***************************************************************************
     * @property {string} location -- xxx 
     */
    this.location = undefined  // "query", "header", "path", "formData" or "body"

    /***************************************************************************
     * @property {xxx} schema -- xxx
     */
    this.schema = undefined

    /***************************************************************************
     * @property {boolean} [required=false] -- xxx
     */
    this.required = false

    /***************************************************************************
     * @property {xxx} default -- xxx
     */
    this.default = undefined // XXX should be undefined?

  },
    
  /*****************************************************************************
   * @method extractParameterValueFromRequest
   * @description extractParameterValueFromRequest description
   * @param {xxx} req -- xxx
   * @returns {xxx} -- xxx
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
    } else if (this.location === "formData") {
      result = req.body && req.body[this.name]
    } else {
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

