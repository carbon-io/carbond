var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var RemoveConfig = require('../collections/RemoveConfig')

module.exports = oo(_.assignIn({
  /***************************************************************************
   * _type
   */
  _type: RemoveConfig,

  /***************************************************************************
   * _C
   */
  _C: function() {
    // XXX: supportsQuery?

    /***************************************************************************
     * @property {object.<string, carbond.OperationParameter>} parameters
     * @description Remove operation specific parameters
     * @extends carbond.collections.RemoveConfig.parameters
     * @property {carbond.OperationParameter} parameters.query
     * @description The "query" parameter definition. Note, "query" here refers to
     *              a MongoDB query and not the query string component of the URL.
     */
    this.parameters = _.assignIn(this.parameters, {
      query: {
        description: 'Query spec (JSON)',
        schema: this.defaultQuerySchema,
        location: 'query',
        required: false,
        default: {}
      }
    })
  }
}, _o('./MongoDBCollectionOperationConfig')))


