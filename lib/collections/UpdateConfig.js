var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

/******************************************************************************
 * @class UpdateConfig
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
    this.updateSchema = undefined
    this.supportsUpsert = false
    this.returnsUpsertedObjects = false
    // An example request body
    this.example = undefined
    this.upsertParameter = {
      upsert: {
        description: 'Enable upsert',
        location: 'query',
        schema: {
          oneOf: [
            {type: 'boolean', default: false},
            {
              type: 'number',
              maximum: 1,
              minimum: 0,
              multipleOf: 1,
            }
          ]
        },
        required: false,
        default: false
      }
    }
    this.parameters = _.assignIn(this.parameters, {
      update: {
        description: 'The update spec',
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

