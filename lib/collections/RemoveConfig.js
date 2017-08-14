var oo = require('@carbon-io/carbon-core').atom.oo(module);

/***************************************************************************************************
 * @class RemoveConfig
 */
module.exports = oo({

  /*****************************************************************************
   * _type
   */
  _type: './CollectionOperationConfig',

  /*****************************************************************************
   * @constructs RemoveConfig
   * @description The remove operation config
   * @memberof carbond.collections
   * @extends carbond.collections.CollectionOperationConfig
   */
  _C: function() {
    /***************************************************************************
     * @property {boolean} [returnsRemovedObjects=false]
     * @description Whether or not the HTTP layer returns objects removed
     */
    this.returnsRemovedObjects = false
  }
})

