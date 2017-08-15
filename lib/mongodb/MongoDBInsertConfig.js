var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var InsertConfig = require('../collections/InsertConfig')

var STRINGS = {}

/***************************************************************************************************
 * @class MongoDBInsertConfig
 */
var MongoDBInsertConfig = oo({
  /*****************************************************************************
   * _type
   */
  _type: InsertConfig,

  /*****************************************************************************
   * @constructs MongoDBInsertConfig
   * @description The MongoDB insert operation config
   * @memberof carbond.mongodb
   * @extends carbond.collections.InsertConfig
   * @mixes carbond.mongodb.MongoDBCollectionOperationConfig
   */
  _C: function() { }
})

MongoDBInsertConfig._STRINGS = STRINGS

module.exports = MongoDBInsertConfig
