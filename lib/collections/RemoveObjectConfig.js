var oo = require('@carbon-io/carbon-core').atom.oo(module);

var STRINGS = {}

/******************************************************************************
 * @class RemoveObjectConfig
 */
var RemoveObjectConfig = oo({

  /**********************************************************************
   * _type
   */
  _type: './CollectionOperationConfig',

  /**********************************************************************
   * @constructs RemoveObjectConfig
   * @description The remove object operation config
   * @memberof carbond.collections
   * @extends carbond.collections.CollectionOperationConfig
   */
  _C: function() {
    /***************************************************************************
     * @property {boolean} [returnsRemovedObject=false]
     * @description Whether or not the HTTP layer returns the removed object
     */
    this.returnsRemovedObject = false
  }
})

RemoveObjectConfig._STRINGS = STRINGS

module.exports = RemoveObjectConfig
