var oo = require('@carbon-io/carbon-core').atom.oo(module);

/******************************************************************************
 * @class SaveObjectConfig
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
    this.saveSchema = undefined
    // An example request body
    this.example = undefined
  }
})

