var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var FindObjectConfig = require('../collections/FindObjectConfig')

var STRINGS = {}

/***************************************************************************************************
 * @class MongoDBFindObjectConfig
 */
var MongoDBFindObjectConfig = oo({
  /***************************************************************************
   * _type
   */
  _type: FindObjectConfig,

  /*****************************************************************************
   * @constructs MongoDBFindObjectConfig
   * @description The MongoDB find object operation config
   * @memberof carbond.mongodb
   * @extends carbond.collections.FindObjectConfig
   * @mixes carbond.mongodb.MongoDBCollectionOperationConfig
   */
  _C: function() {

    /***************************************************************************
     * @property {object.<string>, *} driverOptions
     * @description Options to be passed to the mongodb driver (XXX: link to leafnode docs)
     * @default {}
     */
    this.driverOptions = {}
  }
})

MongoDBFindObjectConfig._STRINGS = STRINGS

module.exports = MongoDBFindObjectConfig

