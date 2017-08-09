var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module);
var o = require('@carbon-io/carbon-core').atom.o(module);
var oo = require('@carbon-io/carbon-core').atom.oo(module);

/***************************************************************************************************
 * @class CollectionOperationConfig
 */
module.exports = oo({

  /*****************************************************************************
   * _C
   */
  _C: function() {
    this.description = undefined
    this.noDocument = false
    this.allowUnauthenticated = false
    this.idParameter = undefined
    this.parameters = {}
    this.additionalParameters = undefined
    this.responses = []
    this.endpoint = null
    this.options = {}
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

    if (_schema.properties[this.idParameter]) {
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

