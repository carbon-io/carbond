var oo = require('@carbon-io/carbon-core').atom.oo(module);

/******************************************************************************
 * @class UpdateConfig
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
    this.updateSchema = undefined
    // An example request body
    this.example = undefined
  }
})

