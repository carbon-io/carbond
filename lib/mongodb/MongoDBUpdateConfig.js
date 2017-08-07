var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var UpdateConfig = require('../collections/UpdateConfig')

module.exports = oo(_.assignIn({
  /***************************************************************************
   * _type
   */
  _type: UpdateConfig,

  /***************************************************************************
   * _C
   */
  _C: function() {
    /*************************************************************************
     * @property {boolean} returnsUpsertedObjects -- This is not supported in
     *                                               MongoDBCollection
     */
    Object.defineProperty(this, 'returnsUpsertedObjects', {
      configurable: false,
      writable: false,
      value: false
    })

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
      },
      update: {
        description: 'Update spec (JSON)',
        location: 'body',
        schema: {
          type: 'object',
          patternProperties: {
            '^\\$.+': {type: 'object'}
          },
          additionalProperties: false
        },
        required: true
      }
    })
  }
}, _o('./MongoDBCollectionOperationConfig')))

