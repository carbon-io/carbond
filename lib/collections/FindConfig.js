var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module);

var CollectionOperationConfig = require('./CollectionOperationConfig')

module.exports = oo({
  /***************************************************************************
   * _type
   */
  _type: CollectionOperationConfig,

  /***************************************************************************
   * _C
   */
  _C: function() {
    /*************************************************************************
     * @property {boolean} supportsIdQuery -- Support id queries (id query
     *                                        parameter)
     */
    this.supportsIdQuery = true

    /*************************************************************************
     * @property {boolean} idParameterDefinition -- The id parameter definition
     *                                              (will use Collection#idParameter
     *                                              as name)
     */
    this.idParameterDefinition = {
      description: 'Id query parameter',
      schema: {
        type: 'string'
      },
      location: 'query',
      required: false,
    }

    /*************************************************************************
     * @property {boolean} supportsPagination -- Support pagination
     */
    this.supportsPagination = true

    /*************************************************************************
     * @property {boolean} pageSize -- The page size
     */
    this.pageSize = 50

    /*************************************************************************
     * @property {number} maxPageSize -- If set, then limit will be restricted
     *                                   to min(limit, maxPageSize)
     */
    this.maxPageSize = undefined

    /*************************************************************************
     * @property {object} paginationParameters -- Parameters used for pagination
     */
    this.paginationParameters = {
      page: {
        description: 'The page to navigate to (skip/limit are derived from this)',
        schema: {
          type: 'number',
          multipleOf: 1,
          minimum: 0
        },
        location: 'query',
        required: false,
        default: 0
      }
    }

    /*************************************************************************
     * @property {object} parameters -- Parameters used to iterate over results
     */
    this.parameters = _.assignIn(this.parameters, {
      skip: {
        description: 'The number of objects to skip when iterating pages',
        schema: {
          type: 'number',
          multipleOf: 1,
          minimum: 0
        },
        location: 'query',
        required: false
      },
      limit: {
        description: 'The maximum number of objects for a given page',
        schema: {
          type: 'number',
          multipleOf: 1,
          minimum: 0
        },
        location: 'query',
        required: false
      }
    })
  },

  /***************************************************************************
   * _init
   */
  _init: function() {
    if (this.supportsPagination) {
      this.parameters = _.assignIn(_.clone(this.paginationParameters), this.parameters)
    }
    // call after merging parameters for initialization
    CollectionOperationConfig.prototype._init.call(this)
  },

  /***************************************************************************
   * addIdQueryParameter
   */
  addIdQueryParameter: function() {
    this.parameters = _.assignIn(this.parameters, {
      [this.idParameter]: this.idParameterDefinition
    })
  }
})

