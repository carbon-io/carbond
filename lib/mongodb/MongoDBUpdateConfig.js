var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var UpdateConfig = require('../collections/UpdateConfig')

var STRINGS = {
  queryParameter: {
    query: {
      description: 'Query spec (JSON)'
    }
  }
}

/***************************************************************************************************
 * @class MongoDBUpdateConfig
 */
var MongoDBUpdateConfig = oo({
  /***************************************************************************
   * _type
   */
  _type: UpdateConfig,

  /***************************************************************************
   * @constructs MongoDBUpdateConfig
   * @description The MongoDB update operation config
   * @memberof carbond.mongodb
   * @extends carbond.collections.UpdateConfig
   * @mixes carbond.mongodb.MongoDBCollectionOperationConfig
   */
  _C: function() {
    /*************************************************************************
     * @property {boolean} returnsUpsertedObjects -- This is not supported in
     *                                               MongoDBCollection
     * @overrides carbond.collections.UpdateConfig.returnsUpsertedObjects
     */
    Object.defineProperty(this, 'returnsUpsertedObjects', {
      configurable: false,
      writable: false,
      value: false
    })

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
     *              {@link carbond.mongodb.MongoDBUpdateConfig.parameters}.
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
     * @property {object.<string, *>} driverOptions
     * @description Options to be passed to the mongodb driver (XXX: link to leafnode docs)
     * @default {}
     */
    this.driverOptions = {}
  },

  _init: function() {
    if (this.supportsQuery) {
      this.parameters = _.assignIn(this.parameters, this.queryParameter)
    }
    UpdateConfig.prototype._init.call(this)
  }
})

MongoDBUpdateConfig._STRINGS = STRINGS

module.exports = MongoDBUpdateConfig
