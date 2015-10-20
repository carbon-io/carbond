var o = require('atom').o(module);
var oo = require('atom').oo(module);
var _o = require('bond')._o(module);
var _ = require('lodash')

/******************************************************************************
 * @class Operation
 */
module.exports = oo({

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.parameters = {}
    this._allParameters = null // cache of all parameters including inherited parameters
    this.responseSchema = undefined
    this.errorResponses = undefined
    this.objectserver = null
    this.endpoint = null
  },
  
  /**********************************************************************
   * _init
   */     
  _init: function() {
    this._initializeParameters()
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
   * service
   */       
  service: function(req, res) {
  },
  
})

