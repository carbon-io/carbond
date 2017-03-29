var oo = require('@carbon-io/carbon-core').atom.oo(module);

/*****************************************************************************i
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
  }
})

