var _ = require('lodash')

var oo = require('carbon-core').atom.oo(module)

/******************************************************************************
 * @class InsertConfig
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
    this.insertSchema = undefined
  }
})

