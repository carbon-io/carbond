var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

var STRINGS = {
  parameters: {
    body: {
      description: 'Object to insert'
    }
  }
}

/***************************************************************************************************
 * @class InsertObjectConfig
 */
var InsertObjectConfig = oo({

  /*****************************************************************************
   * _type
   */
  _type: './CollectionOperationConfig',

  /*****************************************************************************
   * @constructs InsertObjectConfig
   * @description The insert object operation config
   * @memberof carbond.collections
   * @extends carbond.collections.CollectionOperationConfig
   */
  _C: function() {
    var self = this
    /***************************************************************************
     * @property {object} [insertObjectSchema]
     * @description The schema used to validate the request body. If this is undefined, the
     *              collection level schema will be used.
     */
    this.insertObjectSchema = undefined
    /***************************************************************************
     * @property {boolean} [returnsInsertedObject=true]
     * @description Whether or not the HTTP layer returns the object inserted in the response
     */
    this.returnsInsertedObject = true
    /***************************************************************************
     * @property {object} [example]
     * @description An example successful response body (201) used for documentation
     */
    this.example = undefined
    /***************************************************************************
     * @property {object.<string, carbond.OperationParameter>} parameters
     * @description Add "insert" specific parameters
     * @property {carbond.OperationParameter} parameters.body
     * @description The body parameter definition
     * @extends carbond.collections.CollectionOperationConfig.parameters
     */
    this.parameters = _.assignIn(this.parameters, {
      body: {
        description: STRINGS.parameters.body.description,
        location: 'body',
        required: true,
        _schema: {
          $property: {
            enumerable: false,
            writable: true
          }
        },
        schema: {
          $property: {
            set: function(schema) {
              this._schema = self._unrequireIdPropertyFromSchema(schema)
            },
            get: function(schema) {
              return this._schema
            }
          }
        }
      }
    })
  }
})

InsertObjectConfig._STRINGS = STRINGS

module.exports = InsertObjectConfig
