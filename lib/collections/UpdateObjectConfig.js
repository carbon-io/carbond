var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

var STRINGS = {
  upsertParameter: {
    upsert: {
      description: 'Enable upsert'
    }
  },
  parameters: {
    update: {
      description: 'The update spec'
    }
  }
}

/******************************************************************************
 * @class UpdateObjectConfig
 */
var UpdateObjectConfig = oo({

  /**********************************************************************
   * _type
   */
  _type: './CollectionOperationConfig',

  /**********************************************************************
   * @constructs UpdateObjectConfig
   * @description The update object operation config
   * @memberof carbond.collections
   * @extends carbond.collections.CollectionOperationConfig
   */
  _C: function() {
    /***************************************************************************
     * @property {object} [updateObjectSchema]
     * @description The schema used to validate the request body. No validation will be performed
     *              if this is left undefined.
     */
    this.updateObjectSchema = undefined
    /***************************************************************************
     * @property {boolean} [supportsUpsert=false]
     * @description Whether of not the client is allowed to create objects in the collection
     *              using the PATCH method
     */
    this.supportsUpsert = false
    /***************************************************************************
     * @property {boolean} [returnsUpsertedObject=false]
     * @description Whether or not the HTTP layer returns the object created via an upsert
     */
    this.returnsUpsertedObject = false
    /***************************************************************************
     * @property {object} [example]
     * @description An example response body used for documentation
     */
    this.example = undefined
    /***************************************************************************
     * @property {object.<string, carbond.OperationParameter>} upsertParameter
     * @description Parameter used to indicate an upsert should be attempted. If upserts are
     *              supported, this parameter will be merged into
     *              {@link carbond.collections.UpdateConfig.parameters}
     * @property {carbond.OperationParameter} upsertParameter.upsert
     * @description The "upsert" parameter definition
     */
    this.upsertParameter = {
      upsert: {
        description: STRINGS.upsertParameter.upsert.description,
        location: 'query',
        schema: {
          oneOf: [
            {type: 'boolean', default: false},
            {
              type: 'number',
              maximum: 1,
              minimum: 0,
              multipleOf: 1
            }
          ]
        },
        required: false,
        default: false
      }
    }
    /***************************************************************************
     * @property {object.<string, carbond.OperationParameter>} parameters
     * @description Add "update" specific parameters
     * @property {carbond.OperationParameter} parameters.update
     * @description The update parameter definition
     * @extends carbond.collections.CollectionOperationConfig.parameters
     */
    this.parameters = _.assignIn(this.parameters, {
      update: {
        description: STRINGS.parameters.update.description,
        location: 'body',
        required: true,
        schema: undefined
      }
    })
  },

  /**********************************************************************
   * _init
   */
  _init: function() {
    if (this.supportsUpsert) {
      this.parameters = _.assignIn(this.parameters, this.upsertParameter)
    }
  }
})

UpdateObjectConfig._STRINGS = STRINGS

module.exports = UpdateObjectConfig

