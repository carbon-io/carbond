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
  _ctorName: 'MongoDBRemoveObjectConfig',

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
      value: false,
    })

    /***************************************************************************
     * @property {object.<string, *>} driverOptions
     * @description Options to be passed to the mongodb driver (XXX: link to leafnode docs)
     * @default {}
     */
    this.driverOptions = {}
  },
})

Object.defineProperty(MongoDBRemoveObjectConfig, '_STRINGS', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: STRINGS,
})

module.exports = MongoDBRemoveObjectConfig

