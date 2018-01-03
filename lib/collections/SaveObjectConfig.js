var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

var STRINGS = {
  parameters: {
    object: {
      description: 'Object to save'
    }
  }
}

/******************************************************************************
 * @class SaveObjectConfig
 */
var SaveObjectConfig = oo({

  /**********************************************************************
   * _type
   */
  _type: './CollectionOperationConfig',

  /**********************************************************************
   * @constructs SaveObjectConfig
   * @description The save object operation config
   * @memberof carbond.collections
   * @extends carbond.collections.CollectionOperationConfig
   */
  _C: function() {
    /***************************************************************************
     * @property {object} [saveObjectSchema]
     * @description The schema used to validate the request body. If this is undefined, the
     *              collection level schema will be used.
     */
    this.saveObjectSchema = undefined

    /***************************************************************************
     * @property {boolean} [supportsUpsert=true]
     * @description Whether of not the client is allowed to create objects in the collection
     *              using the PUT method (i.e., is the client allowed to control the ID of a
     *              newly created object)
     */
    this.supportsUpsert = true

    /***************************************************************************
     * @property {boolean} [returnsSavedObject=true]
     * @description Whether or not the HTTP layer returns the object saved in the response
     */
    this.returnsSavedObject = true

    /***************************************************************************
     * @property {object.<string, carbond.OperationParameter>} parameters
     * @description Add "save" specific parameters
     * @property {carbond.OperationParameter} parameters.object
     * @description The object parameter definition
     * @extends carbond.collections.CollectionOperationConfig.parameters
     */
    this.parameters = _.assignIn(this.parameters, {
      object: {
        description: STRINGS.parameters.object.description,
        location: 'body',
        required: true,
        schema: undefined
      }
    })
  }
})

Object.defineProperty(SaveObjectConfig, '_STRINGS', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: STRINGS
})

module.exports = SaveObjectConfig
