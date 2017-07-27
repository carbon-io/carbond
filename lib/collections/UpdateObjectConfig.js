var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

/******************************************************************************
 * @class UpdateObjectConfig
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
    this.updateObjectSchema = undefined
    // An example request body
    this.example = undefined
    this.parameters = _.assignIn(this.parameters, {
      body: {
        description: 'The update spec',
        location: 'body',
        required: true,
        schema: undefined
      }
    })
  }
})

