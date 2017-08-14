var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

/******************************************************************************
 * @class SaveConfig
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */
  _type: './CollectionOperationConfig',

  /**********************************************************************
   * @constructs SaveConfig
   * @description The save operation config
   * @memberof carbond.collections
   * @extends carbond.collections.CollectionOperationConfig
   */
  _C: function() {
    // NOTE: there is no "supportsInsert" here because replacing the collection
    //       will always be an "update"

    /***************************************************************************
     * @property {object} [saveSchema]
     * @description The schema used to validate the request body. If this is undefined, the
     *              collection level schema (adapted for arrays) will be used.
     */
    this.saveSchema = undefined
    /***************************************************************************
     * @property {boolean} [returnsSavedObjects=true]
     * @description Whether or not the HTTP layer returns the objects saved in the response
     */
    this.returnsSavedObjects = true
    /***************************************************************************
     * @property {object} [example]
     * @description An example response body used for documentation
     */
    this.example = undefined

    // XXX: no need for maxBulkSave since no Location header

    /***************************************************************************
     * @property {object.<string, carbond.OperationParameter>} parameters
     * @description Add "save" specific parameters
     * @property {carbond.OperationParameter} parameters.body
     * @description The body parameter definition
     * @extends carbond.collections.CollectionOperationConfig.parameters
     */
    this.parameters = _.assignIn(this.parameters, {
      body: {
        description: 'Object(s) to save',
        location: 'body',
        required: true,
        schema: undefined
      }
    })
  }
})

