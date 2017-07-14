var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var FindObjectConfig = require('../collections/FindObjectConfig')

var MongoDBFindObjectConfig = oo(_.assignIn({
  /***************************************************************************
   * _type
   */
  _type: FindObjectConfig
}, _o('./MongoDBCollectionOperationConfig')))
