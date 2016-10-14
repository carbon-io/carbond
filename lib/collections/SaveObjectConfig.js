var oo = require('carbon-core').atom.oo(module);

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
  }
})

