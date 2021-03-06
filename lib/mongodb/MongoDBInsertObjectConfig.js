var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var InsertObjectConfig = require('../collections/InsertObjectConfig')

var STRINGS = {}

/***************************************************************************************************
 * @class MongoDBInsertObjectConfig
 */
var MongoDBInsertObjectConfig = oo({
  /***************************************************************************
   * _type
   */
  _type: InsertObjectConfig,
  _ctorName: 'MongoDBInsertObjectConfig',

  /*****************************************************************************
   * @constructs MongoDBInsertObjectConfig
   * @description The MongoDB insert object operation config
   * @memberof carbond.mongodb
   * @extends carbond.collections.InsertObjectConfig
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

Object.defineProperty(MongoDBInsertObjectConfig, '_STRINGS', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: STRINGS
})

module.exports = MongoDBInsertObjectConfig

