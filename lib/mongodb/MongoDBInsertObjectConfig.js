var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var InsertObjectConfig = require('../collections/InsertObjectConfig')

/***************************************************************************************************
 * @class MongoDBInsertObjectConfig
 */
module.exports = oo(_.assignIn({
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
}, _o('./MongoDBCollectionOperationConfig')))

