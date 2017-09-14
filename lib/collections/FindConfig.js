var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module);

var CollectionOperationConfig = require('./CollectionOperationConfig')

var STRINGS = {
  idParameterDefinition: {
    description: 'Id query parameter'
  },
  paginationParameters: {
    page: {
      description: 'The page to navigate to (skip/limit are derived from this)'
    }
  },
  parameters: {
    skip: {
      description: 'The number of objects to skip when iterating pages'
    },
    limit: {
      description: 'The maximum number of objects for a given page'
    }
  }
}

/***************************************************************************************************
 * @class FindConfig
 */
var FindConfig = oo({
  /*****************************************************************************
   * _type
   */
  _type: CollectionOperationConfig,

  /*****************************************************************************
   * @constructs FindConfig
   * @description The find operation config
   * @memberof carbond.collections
   * @extends carbond.collections.CollectionOperationConfig
   */
  _C: function() {
    // XXX: add validation to check supportsIdQuery if bulk insert is configured

    /***************************************************************************
     * @property {boolean} supportsHead -- Support the HEAD operation
     */
    this.supportsHead = true

    /***************************************************************************
     * @property {boolean} supportsIdQuery -- Support id queries (id query
     *                                        parameter)
     */
    this.supportsIdQuery = true

    /***************************************************************************
     * @property {boolean} idParameterDefinition
     * @description The id parameter definition (will use
     *              {@link carbond.collections.Collection.idParameter} as name). This will be
     *              merged into {@link carbond.collections.FindConfig.parameters} if configured
     *              to support id queries.
     */
    this.idParameterDefinition = {
      description: STRINGS.idParameterDefinition.description,
      schema: {
        type: 'string'
      },
      location: 'query',
      required: false,
    }

    /***************************************************************************
     * @property {boolean} supportsSkipAndLimit -- Support skip and limit
     */
    this.supportsSkipAndLimit = false

    /***************************************************************************
     * @property {boolean} supportsPagination -- Support pagination (note, if true, overrides
     *                                           ``supportsPagination``)
     */
    this.supportsPagination = false

    /***************************************************************************
     * @property {boolean} pageSize -- The page size
     */
    this.pageSize = 50

    /***************************************************************************
     * @property {number} maxPageSize -- If set, then the "limit" parameter will be restricted
     *                                   to min(limit, maxPageSize)
     */
    this.maxPageSize = undefined

    /***************************************************************************
     * @property {object.<string, carbond.OperationParameter>} paginationParameters
     * @description Parameters used to support pagination. If pagination is supported, these
     *              parameters will be merged into
     *              {@link carbond.collections.FindConfig.parameters}
     * @property {carbond.OperationParameter} paginationParameters.page
     * @description The "page" parameter definition
     */
    this.paginationParameters = {
      page: {
        description: STRINGS.paginationParameters.page.description,
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

    /***************************************************************************
     * @property {object.<string, carbond.OperationParameter>} skipAndLimitParameters
     * @description Parameters used to support skip and limit. If skip and limit are supported,
     *              these parameters will be merged into
     *              {@link carbond.collections.FindConfig.parameters}
     * @property {carbond.OperationParameter} skipAndLimitParameters.skip
     * @description The "skip" parameter definition
     * @property {carbond.OperationParameter} skipAndLimitParameters.limit
     * @description The "limit" parameter definition
     */
    this.skipAndLimitParameters = {
      skip: {
        description: STRINGS.parameters.skip.description,
        schema: {
          type: 'number',
          multipleOf: 1,
          minimum: 0
        },
        location: 'query',
        required: false
      },
      limit: {
        description: STRINGS.parameters.limit.description,
        schema: {
          type: 'number',
          multipleOf: 1,
          minimum: 0
        },
        location: 'query',
        required: false
      }
    }
  },

  /*****************************************************************************
   * _init
   */
  _init: function() {
    if (this.supportsPagination) {
      this.parameters = _.assignIn(_.clone(this.paginationParameters), this.parameters)
      // supportsPagination implies supportsSkipAndLimit
      this.supportsSkipAndLimit = true
    }
    if (this.supportsPagination || this.supportsSkipAndLimit) {
      this.parameters = _.assignIn(_.clone(this.skipAndLimitParameters), this.parameters)
    }
    // call after merging parameters for initialization
    CollectionOperationConfig.prototype._init.call(this)
  },

  /*****************************************************************************
   * @method addIdQueryParameter
   * @description Merge {@link carbond.collections.FindConfig.idParameterDefinition} into
   *              {@link carbond.collections.FindConfig.parameters}
   * @returns {undefined}
   */
  addIdQueryParameter: function() {
    this.parameters = _.assignIn(this.parameters, {
      [this.idParameter]: this.idParameterDefinition
    })
  }
})

FindConfig._STRINGS = STRINGS

module.exports = FindConfig

