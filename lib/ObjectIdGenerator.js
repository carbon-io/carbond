var ObjectId = require('@carbon-io/carbon-core').leafnode.mongodb.ObjectId
var oo = require('@carbon-io/carbon-core').atom.oo(module)

/******************************************************************************
 * @class ObjectIdGenerator
 */
module.exports = oo({
  
  /**********************************************************************
   * _type
   */
  _type: './IdGenerator',

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.generateStrings = false
  },

  /**********************************************************************
   * generateId
   */     
  generateId: function() {
    var result = new ObjectId()
    if (this.generateStrings) {
      result = result.toString()
    }
   
    return result
  }
  
})

