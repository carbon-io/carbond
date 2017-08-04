var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var UpdateObjectConfig = require('../collections/UpdateObjectConfig')

module.exports = oo(_.assignIn({
  /***************************************************************************
   * _type
   */
  _type: UpdateObjectConfig,

  /***************************************************************************
   * _C
   */
  _C: function() {
    /*************************************************************************
     * @property {boolean} returnsUpsertedObject -- This is not supported in
     *                                              MongoDBCollection
     */
    Object.defineProperty(this, 'returnsUpsertedObject', {
      configurable: false,
      writable: false,
      value: false
    })

    /*************************************************************************
     * @property {object} parameters -- XXX
     */
    this.parameters = _.assignIn(this.parameters, {
      update: {
        description: 'Update spec (JSON)',
        location: 'body',
        schema: {
          type: 'object'
        },
        required: true
      }
    })
  }
}, _o('./MongoDBCollectionOperationConfig')))

