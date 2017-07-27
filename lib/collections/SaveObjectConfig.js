var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

/******************************************************************************
 * @class SaveObjectConfig
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
    this.saveObjectSchema = undefined
    this.returnsSavedObject = true
    // An example request body
    this.example = undefined
    this.parameters = _.assignIn(this.parameters, {
      body: {
        description: 'Object to save',
        location: 'body',
        required: true,
        schema: undefined
      }
    })
  }
})
