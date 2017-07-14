var url = require('url')

var _ = require('lodash')

var o = require('@carbon-io/carbon-core').atom.o(module);
var oo = require('@carbon-io/carbon-core').atom.oo(module);
var _o = require('@carbon-io/carbon-core').bond._o(module);

/***************************************************************************************************
 * @class Operation
 */
module.exports = oo({

  /*****************************************************************************
   * @constructor _C
   */
  _C: function() {
    this.description = undefined
    this.parameters = {}
    this._allParameters = undefined // cache of all parameters including inherited parameters
    this._name = undefined
    this.responses = []
    this.validateOutput = true
    this.endpoint = undefined
    this.limiter = undefined
  },

  /*****************************************************************************
   * @method _init
   */
  _init: function() {
    this._initializeParameters()
    this._initializeResponses()
  },

  /*****************************************************************************
   * name
   */
  name: {
    $property: {
      get: function() {
        return this._name
      },
      set: function(val) {
        this._name = val
      }
    }
  },

  /*****************************************************************************
   * getService
   */
  getService: function() {
    return this.endpoint.getService()
  },

  /*****************************************************************************
   * @method getAllParameters
   *
   * @description Gets all parameters defined for this Operation which
   *              includes all parameters inherited from this.endpoint
   */
  getAllParameters: function() {
    if (this._allParameters) {
      return this._allParameters
    }

    // First gather all Endpoint parameters, post-order walk
    var allEndpointParameters = function(endpoint, all) {
      if (endpoint) {
        all = _.extend(
          allEndpointParameters(endpoint.parent, all),
          endpoint.parameters || {})
      }
      return all
    }

    // Cache result
    this._allParameters =
      allEndpointParameters(this.endpoint, this.parameters || {})

    return this._allParameters
  },

  /*****************************************************************************
   * @method _initializeParameters
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

  /*****************************************************************************
   * @method _initializeResponses
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

  /*****************************************************************************
   * @method getSanitizedURL
   *
   * XXX: revisit and add "sanitized" methods for other attributes
   *
   * @param {http.ClientRequest} req - the current request
   *
   * @returns {string} - the sanitized URL
   */
  getSanitizedUrl: function(req) {
    var parsed = url.parse(req.originalUrl)
    delete parsed.query
    delete parsed.search
    return url.format(parsed)
  },

  /*****************************************************************************
   * @method service
   */
  service: function(req, res) {},

})

