var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

var STRINGS = {
  parameters: {
    objects: {
      description: 'Object(s) to insert'
    }
  }
}

/***************************************************************************************************
 * @class InsertConfig
 */
var InsertConfig = oo({

  /*****************************************************************************
   * _type
   */
  _type: './CollectionOperationConfig',
  _ctorName: 'InsertConfig',

  /*****************************************************************************
   * @constructs InsertConfig
   * @description The insert operation config
   * @memberof carbond.collections
   * @extends carbond.collections.CollectionOperationConfig
   */
  _C: function() {
    var self = this
    /***************************************************************************
     * @property {object} [schema]
     * @description The schema used to validate the request body. If this is
     *              undefined, the collection level schema (adapted for arrays)
     *              will be used. Note, {@link
     *              carbond.collections.InsertConfig.parameters.objects.schema}
     *              takes precedence.
     */
    this.schema = undefined

    /***************************************************************************
     * @property {boolean} [returnsInsertedObjects=true]
     * @description Whether or not the HTTP layer returns the objects inserted
     *              in the response
     */
    this.returnsInsertedObjects = true

    // XXX: add maxBulkInsertObjects to protect against overflow in Location header

    /***************************************************************************
     * @property {object.<string, carbond.OperationParameter>} parameters
     * @description Add "insert" specific parameters
     * @property {carbond.OperationParameter} parameters.objects
     * @description The body parameter definition
     * @extends carbond.collections.CollectionOperationConfig.parameters
     */
    this.parameters = _.assignIn(this.parameters, {
      objects: {
        description: STRINGS.parameters.objects.description,
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

Object.defineProperty(InsertConfig, '_STRINGS', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: STRINGS
})

module.exports = InsertConfig
