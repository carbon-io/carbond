var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var UpdateObjectConfig = require('../collections/UpdateObjectConfig')

var STRINGS = {
  parameters: {
    update: {
      description: 'Update spec (JSON)',
    },
  },
}

/***************************************************************************************************
 * @class MongoDBUpdateConfig
 */
var MongoDBUpdateObjectConfig = oo({
  /***************************************************************************
   * _type
   */
  _type: UpdateObjectConfig,
  _ctorName: 'MongoDBUpdateObjectConfig',

  /***************************************************************************
   * @constructs MongoDBUpdateObjectConfig
   * @description The MongoDB update object operation config
   * @memberof carbond.mongodb
   * @extends carbond.collections.UpdateObjectConfig
   * @mixes carbond.mongodb.MongoDBCollectionOperationConfig
   */
  _C: function() {
    /*************************************************************************
     * @property {boolean} returnsUpsertedObject -- This is not supported in
     *                                              MongoDBCollection
     * @overrides carbond.collections.UpdateObjectConfig.returnsUpsertedObject
     */
    Object.defineProperty(this, 'returnsUpsertedObject', {
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

Object.defineProperty(MongoDBUpdateObjectConfig, '_STRINGS', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: STRINGS,
})

module.exports = MongoDBUpdateObjectConfig

