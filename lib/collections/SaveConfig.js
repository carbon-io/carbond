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
   * _C
   */
  _C: function() {
    var self = this
    this.saveSchema = undefined
    this.returnsSavedObjects = true
    // An example request body
    this.example = undefined
    // XXX: no need for maxBulkSave since no Location header
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

