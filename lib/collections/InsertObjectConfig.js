var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

/******************************************************************************
 * @class InsertConfig
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */
  _type: './CollectionOperationConfig',

  /**********************************************************************
   * _C
   */
  _C: function() {
    var self = this
    this.insertSchema = undefined
    this.returnsInsertedObject = true
    // An example request body
    this.example = undefined
    this.parameters = _.assignIn(this.parameters, {
      'body' : {
        description: 'Object to insert',
        location: 'body',
        required: true,
        _schema: undefined,
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

