var oo = require('@carbon-io/carbon-core').atom.oo(module);

/******************************************************************************
 * @class RemoveObjectConfig
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
    this.returnsRemovedObject = false
  }
})

