var o = require('@carbon-io/carbon-core').atom.o(module)

/***************************************************************************************************
 * @mixin MongoDBCollectionOperationConfig
 * @description MongoDB collection operation mixin
 */
module.exports = {
  defaultQuerySchema: {
    type: 'object'
  },
  defaultUpdateSchema: {
    type: 'object'
  }
}
