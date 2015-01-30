var o = require('maker').o(module);
var oo = require('maker').oo(module);

/******************************************************************************
 * @class Operation
 */
module.exports = oo({

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.params = {}
    this.objectserver = null
    this.endpoint = null
  },
  
  /**********************************************************************
   * service
   */       
  service: function(req, res) {
  },
  
})

