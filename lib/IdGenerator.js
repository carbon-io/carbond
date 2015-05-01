var o = require('atom').o(module);
var oo = require('atom').oo(module);
var _o = require('bond')._o(module);

/******************************************************************************
 * @class IdGenerator
 */
module.exports = oo({
  
  /**********************************************************************
   * generateId
   */     
  generateId: function() {
    throw new Error("Must subclass")
  }
  
})

