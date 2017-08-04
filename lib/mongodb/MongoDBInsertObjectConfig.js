var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var InsertObjectConfig = require('../collections/InsertObjectConfig')

module.exports = oo(_.assignIn({
  /***************************************************************************
   * _type
   */
  _type: InsertObjectConfig,
  // XXX: add options for insertOne
}, _o('./MongoDBCollectionOperationConfig')))

