var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var FindConfig = require('../collections/FindConfig')

module.exports = oo(_.assignIn({
  /***************************************************************************
   * _type
   */
  _type: FindConfig,

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
      },
      sort: {
        description: 'Sort spec (JSON)',
        location: 'query',
        schema: { type: 'object'},
        required: false
      },
      projection: {
        description: 'Projection spec (JSON)',
        location: 'query',
        schema: { type: 'object' },
        required: false
      }
    })
  }
}, _o('./MongoDBCollectionOperationConfig')))
