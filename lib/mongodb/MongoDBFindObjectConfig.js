var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var FindObjectConfig = require('../collections/FindObjectConfig')

/***************************************************************************************************
 * @class MongoDBFindObjectConfig
 */
var MongoDBFindObjectConfig = oo(_.assignIn({
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
  _C: function() { }
}, _o('./MongoDBCollectionOperationConfig')))
