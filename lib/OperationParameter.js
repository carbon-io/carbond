var o = require('atom').o(module);
var oo = require('atom').oo(module);

/******************************************************************************
 * @class OperationParameter
 */
module.exports = oo({

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.name = undefined, 
    this.description = undefined,
    this.location = undefined, // "query", "header", "path", "formData"? or "body" // XXX or should we call this "in"? location?
    this.schema = undefined,
    this.required = false
    this.default = null
  },
    
  /**********************************************************************
   * extractParameterValueFromRequest
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

