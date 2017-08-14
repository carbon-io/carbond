var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var SaveConfig = require('../collections/SaveConfig')

/***************************************************************************************************
 * @class MongoDBSaveConfig
 */
module.exports = oo(_.assignIn({
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
  _C: function() { }
}, _o('./MongoDBCollectionOperationConfig')))

