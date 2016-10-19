var oo = require('@carbon-io/carbon-core').atom.oo(module);

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

