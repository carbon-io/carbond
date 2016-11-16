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
    this.returnsUpdatedObject = undefined
    this.returnsOriginalObject = undefined
  },
  
})

