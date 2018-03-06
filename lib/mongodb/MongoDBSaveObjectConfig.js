var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var SaveObjectConfig = require('../collections/SaveObjectConfig')

var STRINGS = {}

/***************************************************************************************************
 * @class MongoDBSaveObjectConfig
 */
var MongoDBSaveObjectConfig = oo({
  /***************************************************************************
   * _type
   */
  _type: SaveObjectConfig,
  _ctorName: 'MongoDBSaveObjectConfig',

  /*****************************************************************************
   * @constructs MongoDBSaveObjectConfig
   * @description The MongoDB save object operation config
   * @memberof carbond.mongodb
   * @extends carbond.collections.SaveObjectConfig
   * @mixes carbond.mongodb.MongoDBCollectionOperationConfig
   */
  _C: function() {

    /***************************************************************************
     * @property {object.<string, *>} driverOptions
     * @description Options to be passed to the mongodb driver (XXX: link to leafnode docs)
     * @default {}
     */
    this.driverOptions = {}
  },
})

Object.defineProperty(MongoDBSaveObjectConfig, '_STRINGS', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: STRINGS,
})

module.exports = MongoDBSaveObjectConfig
