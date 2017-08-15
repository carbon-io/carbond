var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

var STRINGS = {
  parameters: {
    body: {
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
     * @property {boolean} [supportsInsert=true]
     * @description Whether of not the client is allowed to create objects in the collection
     *              using the PUT method (i.e., is the client allowed to control the ID of a
     *              newly created object)
     */
    this.supportsInsert = true
    /***************************************************************************
     * @property {boolean} [returnsSavedObject=true]
     * @description Whether or not the HTTP layer returns the object saved in the response
     */
    this.returnsSavedObject = true
    /***************************************************************************
     * @property {object} [example]
     * @description An example response body used for documentation
     */
    this.example = undefined
    /***************************************************************************
     * @property {object.<string, carbond.OperationParameter>} parameters
     * @description Add "save" specific parameters
     * @property {carbond.OperationParameter} parameters.body
     * @description The body parameter definition
     * @extends carbond.collections.CollectionOperationConfig.parameters
     */
    this.parameters = _.assignIn(this.parameters, {
      body: {
        description: STRINGS.parameters.body.description,
        location: 'body',
        required: true,
        schema: undefined
      }
    })
  }
})

SaveObjectConfig._STRINGS = STRINGS

module.exports = SaveObjectConfig
