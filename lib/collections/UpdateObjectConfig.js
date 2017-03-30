var oo = require('@carbon-io/carbon-core').atom.oo(module);

/******************************************************************************
 * @class UpdateObjectConfig
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
    this.updateSchema = undefined
    // XXX -- removeme
    this.returnsUpdatedObject = undefined
    this.returnsOriginalObject = undefined
    // XXX -- /removeme
  },
  
})

