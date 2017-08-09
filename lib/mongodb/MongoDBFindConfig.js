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
     * @property {boolean} supportsQuery -- XXX
     */
    this.supportsQuery = true

    /*************************************************************************
     * @property {object} querySchema -- XXX
     */
    this.querySchema = this.defaultQuerySchema

    /*************************************************************************
     * @property {object} queryParameter -- XXX
     */
    this.queryParameter = {
      query: {
        description: 'Query spec (JSON)',
        schema: undefined,
        location: 'query',
        required: false,
        default: {}
      }
    }

    /*************************************************************************
     * @property {object} parameters -- XXX
     */
    this.parameters = _.assignIn(this.parameters, {
      sort: {
        description: 'Sort spec (JSON)',
        location: 'query',
        schema: {
          type: 'object'
        },
        required: false
      },
      projection: {
        description: 'Projection spec (JSON)',
        location: 'query',
        schema: {
          type: 'object'
        },
        required: false
      }
    })
  },

  _init: function() {
    if (this.supportsQuery) {
      this.queryParameter.query.schema = this.querySchema
      this.parameters = _.assignIn(this.parameters, this.queryParameter)
    }
    FindConfig.prototype._init.call(this)
  }
}, _o('./MongoDBCollectionOperationConfig')))
