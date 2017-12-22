var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var SaveConfig = require('../collections/SaveConfig')

var STRINGS = {}

/***************************************************************************************************
 * @class MongoDBSaveConfig
 */
var MongoDBSaveConfig = oo({
  /***************************************************************************
   * _type
   */
  _type: SaveConfig,

  /*****************************************************************************
   * @constructs MongoDBSaveConfig
   * @description The MongoDB save operation config
   * @memberof carbond.mongodb
   * @extends carbond.collections.SaveConfig
   * @mixes carbond.mongodb.MongoDBCollectionOperationConfig
   */
  _C: function() {

    /***************************************************************************
     * @property {object.<string, *>} driverOptions
     * @description Options to be passed to the mongodb driver (XXX: link to leafnode docs)
     * @default {}
     */
    this.driverOptions = {}
  }
})

Object.defineProperty(MongoDBSaveConfig, '_STRINGS', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: STRINGS
})

module.exports = MongoDBSaveConfig
