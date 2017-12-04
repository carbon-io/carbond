var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var o = require('@carbon-io/carbon-core').atom.o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var CollectionOperationConfig = require('./CollectionOperationConfig')

var STRINGS = {
  parameters: {
    page: {
      description: 'The page to navigate to (skip/limit are derived from this)'
    },
    pageSize: {
      description: 'The page size used for pagination (skip/limit are derived from this and page)'
    },
    skip: {
      description: 'The number of objects to skip when iterating pages'
    },
    limit: {
      description: 'The maximum number of objects for a given page'
    },
    idParameterDefinition: {
      description: 'Id query parameter'
    }
  }
}

var TMP_ID_QUERY_PARAMETER_NAME = '__FindConfig_idQuery'

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
     * @property {boolean} supportsIdQuery -- Support id queries (id query
     *                                        parameter)
     */
    this.supportsIdQuery = true

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
     * @property {object.<string, carbond.OperationParameter>} parameters
     * @description Add "find" specific parameters
     * @property {carbond.OperationParameter} parameters.page
     * @description The "page" parameter definition (will be omitted if {@link
     *              carbond.collections.FindConfig.supportsPagination} is ``false``)
     * @property {carbond.OperationParameter} parameters.pageSize
     * @description The "pageSize" parameter definition (will be omitted if {@link
     *              carbond.collections.FindConfig.supportsPagination} is ``false``)
     * @property {carbond.OperationParameter} parameters.skip
     * @description The "skip" parameter definition (will be omitted if {@link
     *              carbond.collections.FindConfig.supportsSkipAndLimit} is ``false``)
     * @property {carbond.OperationParameter} parameters.limit
     * @description The "limit" parameter definition (will be omitted if {@link
     *              carbond.collections.FindConfig.supportsSkipAndLimit} is ``false``)
     * @property {carbond.OperationParameter} <this.idParameter>
     * @description The id query parameter (will use
     *              {@link carbond.collections.Collection.idParameter} as name)
     *              (will be omitted if {@link
     *              carbond.collections.FindConfig.supportsIdQuery} is ``false``)
     * @extends carbond.collections.CollectionOperationConfig.parameters
     *
     * @todo revisit how the id query parameter name is documented here
     */
    this.parameters = _.assignIn(this.parameters, {
      page: {
        description: STRINGS.parameters.page.description,
        schema: {
          type: 'number',
          multipleOf: 1,
          minimum: 0
        },
        location: 'query',
        required: false,
        default: 0
      },
      pageSize: {
        description: STRINGS.parameters.pageSize.description,
        schema: {
          type: 'number',
          multipleOf: 1,
          minimum: 0
        },
        location: 'query',
        required: false
      },
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
      },
      [TMP_ID_QUERY_PARAMETER_NAME]: {
        description: STRINGS.parameters.idParameterDefinition.description,
        schema: {
          oneOf: [
            {type: 'string'},
            {
              type: 'array',
              items: {type: 'string'}
            }
          ]
        },
        location: 'query',
        required: false
      }
    })

    // XXX: would rather wrap this config in a Proxy object to accomplish the same thing
    //      but it doesn't seem there is a good way to do that

    // set up a private instance property to track the actual value of idParameter as a
    // data descriptor
    Object.defineProperty(this, '__FindConfig_idParameter', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: this.idParameter
    })

    // redefine idParameter using an accessor descriptor and side effect the parameters
    // object as a result of assignment
    Object.defineProperty(this, 'idParameter', {
      configurable: true,
      enumerable: true,
      get: () => this.__FindConfig_idParameter,
      set: (value) => {
        this.__FindConfig_idParameter = value
        this._fixIdQueryParameter()
      }
    })
  },

  /*****************************************************************************
   * _init
   */
  _init: function() {
    if (!this.supportsPagination) {
      delete this.parameters.page
      delete this.parameters.pageSize
    } else {
      // supportsPagination implies supportsSkipAndLimit
      this.supportsSkipAndLimit = true
    }
    if (!this.supportsSkipAndLimit) {
      delete this.parameters.skip
      delete this.parameters.limit
    }
    if (!this.supportsIdQuery) {
      delete this.parameters[TMP_ID_QUERY_PARAMETER_NAME]
    }
    // call after merging parameters for initialization
    CollectionOperationConfig.prototype._init.call(this)
  },

  /*****************************************************************************
   * @method _fixIdQueryParameter
   * @description If TMP_ID_QUERY_PARAMETER_NAME is in
   *              {@link carbond.collections.FindConfig.parameters}, then rename
   *              it to be the current value of
   *              {@link carbond.collections.FindConfig.idParameter}
   * @returns {undefined}
   */
  _fixIdQueryParameter: function() {
    let idQueryParameter = this.parameters[TMP_ID_QUERY_PARAMETER_NAME]
    if (!_.isNil(idQueryParameter)) {
      delete this.parameters[TMP_ID_QUERY_PARAMETER_NAME]
      // reinitialize with correct name
      this.parameters[this.idParameter] = o(
        _.assign({}, idQueryParameter, {name: this.idParameter}),
        _o('../OperationParameter'))
    }
  }
})

Object.defineProperty(FindConfig, '_STRINGS', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: STRINGS
})

module.exports = FindConfig

