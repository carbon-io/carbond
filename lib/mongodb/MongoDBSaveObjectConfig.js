var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var SaveObjectConfig = require('../collections/SaveObjectConfig')

/***************************************************************************************************
 * @class MongoDBSaveObjectConfig
 */
module.exports = oo(_.assignIn({
  /***************************************************************************
   * _type
   */
  _type: SaveObjectConfig,

  /*****************************************************************************
   * @constructs MongoDBSaveObjectConfig
   * @description The MongoDB save object operation config
   * @memberof carbond.mongodb
   * @extends carbond.collections.SaveObjectConfig
   * @mixes carbond.mongodb.MongoDBCollectionOperationConfig
   */
  _C: function() { }
}, _o('./MongoDBCollectionOperationConfig')))

