var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var RemoveConfig = require('../collections/RemoveConfig')

var STRINGS = {
  queryParameter: {
    query: {
      description: 'Query spec (JSON)'
    }
  }
}

/***************************************************************************************************
 * @class MongoDBRemoveConfig
 */
var MongoDBRemoveConfig = oo({
  /***************************************************************************
   * _type
   */
  _type: RemoveConfig,

  /***************************************************************************
   * @constructs MongoDBRemoveConfig
   * @description The MongoDB remove operation config
   * @memberof carbond.mongodb
   * @extends carbond.collections.RemoveConfig
   * @mixes carbond.mongodb.MongoDBCollectionOperationConfig
   */
  _C: function() {
    // XXX: supportsQuery?

    /***************************************************************************
     * @property {boolean} [supportsQuery=true]
     * @description Whether or not the query parameter is supported. Note, "query" here refers to
     *              a MongoDB query and not the query string component of the URL.
     */
    this.supportsQuery = true

    /***************************************************************************
     * @property {object.<string, carbond.OperationParameter>} queryParameter
     * @description The query parameter definitions. If queries are
     *              supported, this parameter will be merged into
     *              {@link carbond.mongodb.MongoDBRemoveConfig.parameters}.
     * @property {carbond.OperationParameter} queryParameter.query
     * @description The "query" parameter definition
     */
    this.queryParameter = {
      query: {
        description: STRINGS.queryParameter.query.description,
        schema: {type: 'object'},
        location: 'query',
        required: false,
        default: {}
      }
    }
  },

  _init: function() {
    if (this.supportsQuery) {
      this.parameters = _.assignIn(this.parameters, this.queryParameter)
    }
    RemoveConfig.prototype._init.call(this)
  }
})

MongoDBRemoveConfig._STRINGS = STRINGS

module.exports = MongoDBRemoveConfig
