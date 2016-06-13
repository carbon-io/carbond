var o = require('atom').o(module);
var oo = require('atom').oo(module);

/******************************************************************************
 * @class OperationResponse
 */
module.exports = oo({

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.statusCode = 200
    this.description = undefined
    this.schema = undefined
    this.headers = []
  }
    
})

