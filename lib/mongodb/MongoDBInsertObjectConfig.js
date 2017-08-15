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
  // XXX: add options for insertOne

  /*****************************************************************************
   * @constructs MongoDBInsertObjectConfig
   * @description The MongoDB insert object operation config
   * @memberof carbond.mongodb
   * @extends carbond.collections.InsertObjectConfig
   * @mixes carbond.mongodb.MongoDBCollectionOperationConfig
   */
  _C: function() { }
})

MongoDBInsertObjectConfig._STRINGS = STRINGS

module.exports = MongoDBInsertObjectConfig

