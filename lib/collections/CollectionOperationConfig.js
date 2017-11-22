var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module);
var o = require('@carbon-io/carbon-core').atom.o(module);
var oo = require('@carbon-io/carbon-core').atom.oo(module);

/***************************************************************************************************
 * @class CollectionOperationConfig
 */
module.exports = oo({

  /*****************************************************************************
   * @constructs CollectionOperationConfig
   * @description The base class for all collection configs
   * @memberof carbond.collections
   */
  _C: function() {

    /***************************************************************************
     * @property {string} [description] -- A brief description of the operation used by the
     *                                     documentation generator
     */
    this.description = undefined

    /***************************************************************************
     * @property {boolean} [noDocument=false] -- Exclude the operation from "docgen" API
     *                                           documentation
     */
    this.noDocument = false

    /***************************************************************************
     * @property {boolean} [allowUnauthenticated=false] -- Allow unauthenticated requests to
     *                                                     the operation
     */
    this.allowUnauthenticated = false

    /***************************************************************************
     * @property {string} idParameter -- The collection object id property name. Note, this
     *                                    is configured on the top level
     *                                    {@link carbond.collections.Collection} and set on the
     *                                    configure during initialzation.
     * @readonly
     */
    this.idParameter = undefined

    /***************************************************************************
     * @property {object.<string, carbond.OperationParameter>} parameters
     * @description Operation specific parameters (e.g., "skip", "limit"). These will be passed down
     *              to the operation handlers via the ``options`` parameter if they are not explicitly
     *              passed via another leading parameter (e.g., "id" and "update" for
     *              {@link carbond.collections.Collection.updateObject}).
     * @readonly
     */
    this.parameters = {}

    /***************************************************************************
     * @property {object.<string, *>} options
     * @description Any additional options that should be added to options passed down to a handler.
     */
    this.options = undefined

    /***************************************************************************
     * @property {Object.<string, carbond.OperationResponse>} responses
     * @description Add custom responses for an operation. Note, this will override all default
     *              responses.
     */
    this.responses = {}

    /***************************************************************************
     * @property {carbond.Endpoint} endpoint -- The parent endpoint/collection that this
     *                                          configuration is a member of
     * @readonly
     */
    this.endpoint = null
  },

  /*****************************************************************************
   * _init
   */
  _init: function() {
    this._initializeParameters()
  },

  /*****************************************************************************
   * _initializeParameters
   */
  _initializeParameters: function() {
    var parameters = this.parameters
    if (!_.isNil(this.additionalParameters)) {
      parameters = _.assignIn(parameters, this.additionalParameters)
    }
    // Bind to proper class if needed and set name on object
    var OperationParameter = _o('../OperationParameter')
    for (var parameterName in parameters) {
      var parameter = parameters[parameterName]
      if (!(parameter instanceof OperationParameter)) {
        parameter = o(parameter, OperationParameter)
        parameters[parameterName] = parameter // set it back
      }
      parameter.name = parameterName
    }
  },

  /*****************************************************************************
   * _unrequireIdPropertyFromSchema
   */
  _unrequireIdPropertyFromSchema: function(schema) {
    var _schema = schema.type === 'array' ? schema.items : schema

    if (!_.isNil(_schema.properties) && _schema.properties[this.idParameter]) {
      _schema = _.clone(_schema)
      if (_schema.required) {
        _schema.required = _.difference(_schema.required, [this.idParameter])
        if (_.isEmpty(_schema.required)) {
          delete _schema.required
        }
      }

      if (_schema.additionalProperties) {
        delete _schema.additionalProperties
      }

      if (schema.type === 'array') {
        schema = _.clone(schema)
        schema.items = _schema
      } else {
        schema = _schema
      }
    }

    return schema
  }
})

