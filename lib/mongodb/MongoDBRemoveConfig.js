var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var RemoveConfig = require('../collections/RemoveConfig')

module.exports = oo(_.assignIn({
  /***************************************************************************
   * _type
   */
  _type: RemoveConfig,

  /***************************************************************************
   * _C
   */
  _C: function() {
    /*************************************************************************
     * @property {object} parameters -- XXX
     */
    this.parameters = _.assignIn(this.parameters, {
      query: {
        description: 'Query spec (JSON)',
        schema: this.defaultQuerySchema,
        location: 'query',
        required: false,
        default: {}
      }
    })
  }
}, _o('./MongoDBCollectionOperationConfig')))


