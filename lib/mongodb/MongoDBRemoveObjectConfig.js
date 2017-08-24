var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var RemoveObjectConfig = require('../collections/RemoveObjectConfig')

var STRINGS = {}

/***************************************************************************************************
 * @class MongoDBRemoveObjectConfig
 */
var MongoDBRemoveObjectConfig = oo({
  /***************************************************************************
   * _type
   */
  _type: RemoveObjectConfig,

  /*****************************************************************************
   * @constructs MongoDBRemoveObjectConfig
   * @description The MongoDB remove object operation config
   * @memberof carbond.mongodb
   * @extends carbond.collections.RemoveObjectConfig
   * @mixes carbond.mongodb.MongoDBCollectionOperationConfig
   */
  _C: function() {
    /*************************************************************************
     * @property {boolean} returnsRemovedObject -- This is not supported in
     *                                             MongoDBCollection
     * @overrides carbond.collections.RemoveObjectConfig.returnsRemovedObject
     */
    Object.defineProperty(this, 'returnsRemovedObject', {
      configurable: false,
      writable: false,
      value: false
    })
  }
})

MongoDBRemoveObjectConfig._STRINGS = STRINGS

module.exports = MongoDBRemoveObjectConfig

