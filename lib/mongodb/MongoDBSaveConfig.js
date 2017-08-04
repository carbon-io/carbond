var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var SaveConfig = require('../collections/SaveConfig')

module.exports = oo(_.assignIn({
  /***************************************************************************
   * _type
   */
  _type: SaveConfig
}, _o('./MongoDBCollectionOperationConfig')))

