var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var FindConfig = require('../collections/FindConfig')

/***************************************************************************************************
 * @class MongoDBFindConfig
 */
module.exports = oo(_.assignIn({
  /*****************************************************************************
   * _type
   */
  _type: FindConfig,

  /*****************************************************************************
   * @constructs MongoDBFindConfig
   * @description The MongoDB find operation config
   * @memberof carbond.mongodb
   * @extends carbond.collections.FindConfig
   * @mixes carbond.mongodb.MongoDBCollectionOperationConfig
   */
  _C: function() {
    /***************************************************************************
     * @property {boolean} [supportsQuery=true]
     * @description Whether or not the query parameter is supported. Note, "query" here refers to
     *              a MongoDB query and not the query string component of the URL.
     */
    this.supportsQuery = true

    /***************************************************************************
     * @property {object} [querySchema=carbond.mongodb.MongoDBCollectionOperationConfig.defaultQuerySchema]
     * @description The schema used to validate the query
     */
    this.querySchema = this.defaultQuerySchema

    /***************************************************************************
     * @property {object.<string, carbond.OperationParameter>} queryParameter
     * @description The query parameter definitions. If queries are
     *              supported, this parameter will be merged into
     *              {@link carbond.mongodb.MongoDBFindConfig.parameters}.
     * @property {carbond.OperationParameter} queryParameter.query
     * @description The "query" parameter definition
     */
    this.queryParameter = {
      query: {
        description: 'Query spec (JSON)',
        schema: undefined,
        location: 'query',
        required: false,
        default: {}
      }
    }

    /***************************************************************************
     * @property {object.<string, carbond.OperationParameter>} parameters
     * @description Find operation specific parameters
     * @extends carbond.collections.FindConfig.parameters
     * @property {carbond.OperationParameter} parameters.sort
     * @description The "sort" parameter definition
     * @property {carbond.OperationParameter} parameters.projection
     * @description The "projection" parameter definition
     */
    this.parameters = _.assignIn(this.parameters, {
      sort: {
        description: 'Sort spec (JSON)',
        location: 'query',
        schema: {
          type: 'object'
        },
        required: false
      },
      projection: {
        description: 'Projection spec (JSON)',
        location: 'query',
        schema: {
          type: 'object'
        },
        required: false
      }
    })
  },

  _init: function() {
    if (this.supportsQuery) {
      this.queryParameter.query.schema = this.querySchema
      this.parameters = _.assignIn(this.parameters, this.queryParameter)
    }
    FindConfig.prototype._init.call(this)
  }
}, _o('./MongoDBCollectionOperationConfig')))
