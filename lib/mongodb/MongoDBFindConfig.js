var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var FindConfig = require('../collections/FindConfig')

var STRINGS = {
  queryParameter: {
    query: {
      description: 'Query spec (JSON)'
    }
  },
  parameters: {
    sort: {
      description: 'Sort spec (JSON)'
    },
    projection: {
      description: 'Projection spec (JSON)'
    }
  },

}

/***************************************************************************************************
 * @class MongoDBFindConfig
 */
var MongoDBFindConfig = oo({
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
     * @property {boolean} supportsSkipAndLimit -- Support skip and limit
     * @override
     */
    this.supportsSkipAndLimit = true

    /***************************************************************************
     * @property {boolean} supportsPagination -- Support pagination
     * @override
     */
    this.supportsPagination = true

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
     *              {@link carbond.mongodb.MongoDBFindConfig.parameters}.
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

    /***************************************************************************
     * @property {object.<string>, carbond.OperationParameter>} parameters
     * @description Find operation specific parameters
     * @extends carbond.collections.FindConfig.parameters
     * @property {carbond.OperationParameter} parameters.sort
     * @description The "sort" parameter definition
     * @property {carbond.OperationParameter} parameters.projection
     * @description The "projection" parameter definition
     */
    this.parameters = _.assignIn(this.parameters, {
      sort: {
        description: STRINGS.parameters.sort.description,
        location: 'query',
        schema: {
          type: 'object'
        },
        required: false
      },
      projection: {
        description: STRINGS.parameters.projection.description,
        location: 'query',
        schema: {
          type: 'object',
          additionalProperties: {
            type: 'number',
            minimum: 0,
            maximum: 1,
            multipleOf: 1
          }
        },
        required: false
      }
    })

    /***************************************************************************
     * @property {object.<string>, *} driverOptions
     * @description Options to be passed to the mongodb driver (XXX: link to leafnode docs)
     * @default {}
     */
    this.driverOptions = {}
  },

  _init: function() {
    if (this.supportsQuery) {
      this.parameters = _.assignIn(this.parameters, this.queryParameter)
    }
    FindConfig.prototype._init.call(this)
  }
})

MongoDBFindConfig._STRINGS = STRINGS

module.exports = MongoDBFindConfig

