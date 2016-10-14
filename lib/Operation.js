var _ = require('lodash')

var o = require('carbon-core').atom.o(module);
var oo = require('carbon-core').atom.oo(module);
var _o = require('carbon-core').bond._o(module);

/******************************************************************************
 * @class Operation
 */
module.exports = oo({

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.description = undefined
    this.parameters = {}
    this._allParameters = null // cache of all parameters including inherited parameters
    this.responses = []
    this.validateOutput = true
    this.endpoint = null
  },
  
  /**********************************************************************
   * _init
   */     
  _init: function() {
    this._initializeParameters()
    this._initializeResponses()
  },

  /**********************************************************************
   * getAllParameters
   * 
   * Gets all parameters defined for this Operation which includes 
   * all parameters inherited from this.enpoint
   */    
  getAllParameters: function() {
    if (this._allParamaters) {
      return this._allParamaters
    }

    // Otherwise compute result. 
    var result = {}
    // First gather all Endpoint parameters, post-order walk
    var allEndpointParameters = function(endpoint, all) {
      if (endpoint) {
        allEndpointParameters(endpoint.parent, all)
        _.extend(all, endpoint.parameters || {})
      }
    }
    allEndpointParameters(this.endpoint, result)
    // Next layer parameters defined on this Operation
    _.extend(result, this.parameters || {})

    // Cache result
    this._allParamaters = result

    return result
  },

  /**********************************************************************
   * _initializeParameters
   */       
  _initializeParameters: function() {
    var parameters = this.parameters
    // Bind to proper class if needed and set name on object
    var OperationParameter = _o('./OperationParameter')
    for (var parameterName in parameters) {
      var parameter = parameters[parameterName]
      if (!(parameter instanceof OperationParameter)) {
        parameter = o(parameter, OperationParameter)
        parameters[parameterName] = parameter // set it back
      }
      parameter.name = parameterName
    }
  },

  /**********************************************************************
   * _initializeResponses
   */       
  _initializeResponses: function() {
    this.responses = _.map(this.responses, function(response) {
      var OperationResponse = _o('./OperationResponse')
      if (response instanceof OperationResponse) {
        return response
      } else if (_.isPlainObject(response)) {
        return o(response, OperationResponse)
      } else {
        throw new Error("Malformed response spec. " + JSON.stringify(response))
      }
    })
  },

  /**********************************************************************
   * service
   */       
  service: function(req, res) {},
  
})

