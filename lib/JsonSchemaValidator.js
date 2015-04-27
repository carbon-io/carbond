var ZSchema = require("z-schema")

var o = require('atom').o(module);
var oo = require('atom').oo(module);

/******************************************************************************
 * @class JsonSchemaValidator
 */
module.exports = oo({

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.validateEjson = true
  },
  
  /**********************************************************************
   * validate
   */       
  validate: function(json, schema) {
    var options = {}
    var validator = new ZSchema(options)

    if (this.validateEjson) {
      schema = this._expandEjsonSchema(schema)
    }
    
    var result = {}
    result.valid = validator.validate(json, schema)
    if (!result.valid) {
      result.error = validator.getLastError()
    }

    return result
  },

  /**********************************************************************
   * _expandEjsonSchema
   */       
  _expandEjsonSchema: function(schema) {
    return schema // XXX
  }
  
})

