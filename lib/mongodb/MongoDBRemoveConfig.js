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
    /*************************************************************************
     * @property {boolean} returnsRemovedObjects -- This is not supported in
     *                                              MongoDBCollection
     * @overrides carbond.collections.RemoveConfig.returnsRemovedObjects
     */
    Object.defineProperty(this, 'returnsRemovedObjects', {
      configurable: false,
      writable: false,
      value: false
    })

    // XXX: supportsQuery?

    /***************************************************************************
     * @property {boolean} [supportsQuery=true]
     * @description Whether or not the query parameter is supported. Note, "query" here refers to
     *              a MongoDB query and not the query string component of the URL.
     */
    this.supportsQuery = true

    /***************************************************************************
     * @property {object.<string, carbond.OperationParameter>} parameters
     * @description Remove operation specific parameters
     * @property {carbond.OperationParameter} queryParameter.query
     * @description The "query" parameter definition (will be omitted if {@link
     *              carbond.collections.MongoDBRemoveConfig.supportsQuery} is
     *              ``false``)
     * @extends carbond.collections.RemoveConfig.parameters
     */
    this.parameters = _.assignIn(this.parameters, {
      query: {
        description: STRINGS.queryParameter.query.description,
        schema: {type: 'object'},
        location: 'query',
        required: false,
        default: {}
      }
    })

    /***************************************************************************
     * @property {object.<string, *>} driverOptions
     * @description Options to be passed to the mongodb driver (XXX: link to leafnode docs)
     * @default {}
     */
    this.driverOptions = {}
  },

  _init: function() {
    if (!this.supportsQuery) {
      delete this.parameters.query
    }
    RemoveConfig.prototype._init.call(this)
  }
})

Object.defineProperty(MongoDBRemoveConfig, '_STRINGS', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: STRINGS
})

module.exports = MongoDBRemoveConfig
