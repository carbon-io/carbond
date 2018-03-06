var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var UpdateConfig = require('../collections/UpdateConfig')

var STRINGS = {
  queryParameter: {
    query: {
      description: 'Query spec (JSON)',
    },
  },
}

/***************************************************************************************************
 * @class MongoDBUpdateConfig
 */
var MongoDBUpdateConfig = oo({
  /***************************************************************************
   * _type
   */
  _type: UpdateConfig,
  _ctorName: 'MongoDBUpdateConfig',

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
      value: false,
    })

    /***************************************************************************
     * @property {boolean} [supportsQuery=true]
     * @description Whether or not the query parameter is supported. Note, "query" here refers to
     *              a MongoDB query and not the query string component of the URL.
     */
    this.supportsQuery = true

    /***************************************************************************
     * @property {object.<string, carbond.OperationParameter>} parameters
     * @description Update operation specific parameters
     * @property {carbond.OperationParameter} queryParameter.query
     * @description The "query" parameter definition (will be omitted if {@link
     *              carbond.collections.MongoDBFindConfig.supportsQuery} is
     *              ``false``)
     * @extends carbond.collections.FindConfig.parameters
     */
    this.parameters = _.assignIn(this.parameters, {
      query: {
        description: STRINGS.queryParameter.query.description,
        schema: {type: 'object'},
        location: 'query',
        required: false,
        default: {},
      },
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
    UpdateConfig.prototype._init.call(this)
  },
})

Object.defineProperty(MongoDBUpdateConfig, '_STRINGS', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: STRINGS,
})

module.exports = MongoDBUpdateConfig
