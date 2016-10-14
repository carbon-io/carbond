var oo = require('carbon-core').atom.oo(module);

/******************************************************************************
 * @class RemoveConfig
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */
  _type: './CollectionOperationConfig',

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.supportsQuery = false
    this.querySchema = undefined
  },
  
})

