var _ = require('lodash')

var oo = require('carbon-core').atom.oo(module);

/******************************************************************************
 * @class FindConfig
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
    this.supportsQuery = true
    this.querySchema = undefined
  }
})

