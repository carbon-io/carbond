var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var UpdateConfig = require('../collections/UpdateConfig')

/***************************************************************************************************
 * @class MongoDBUpdateConfig
 */
module.exports = oo(_.assignIn({
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

    // XXX: supportsQuery?

    /***************************************************************************
     * @property {object.<string, carbond.OperationParameter>} parameters
     * @description Update operation specific parameters
     * @extends carbond.collections.UpdateConfig.parameters
     * @property {carbond.OperationParameter} parameters.query
     * @description The "query" parameter definition. Note, "query" here refers to
     *              a MongoDB query and not the query string component of the URL.
     * @property {carbond.OperationParameter} parameters.update
     * @description The "update" parameter definition
     */
    this.parameters = _.assignIn(this.parameters, {
      query: {
        description: 'Query spec (JSON)',
        schema: this.defaultQuerySchema,
        location: 'query',
        required: false,
        default: {}
      },
      update: {
        description: 'Update spec (JSON)',
        location: 'body',
        schema: {
          type: 'object',
          patternProperties: {
            '^\\$.+': {type: 'object'}
          },
          additionalProperties: false
        },
        required: true
      }
    })
  }
}, _o('./MongoDBCollectionOperationConfig')))

