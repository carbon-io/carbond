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
   * @constructs Operation
   * @description Operation class description
   * @memberof carbond
   */
  _C: function() {
    /***************************************************************************
     * @property {string} description -- xxx
     */
    this.description = undefined

    /***************************************************************************
     * @property {xxx} parameters -- xxx
     */
    this.parameters = {}

    /***************************************************************************
     * @property {xxx} _allParameters -- xxx
     */
    this._allParameters = undefined // cache of all parameters including inherited parameters

    /***************************************************************************
     * @property {xxx} _name -- xxx
     */
    this._name = undefined

    /***************************************************************************
     * @property {object} responses -- xxx
     */
    this.responses = []

    /***************************************************************************
     * @property {boolean} [validateOutput=true] -- xxx
     */
    this.validateOutput = true

    /***************************************************************************
     * @property {carbond.Endpoint} endpoint -- xxx
     */
    this.endpoint = undefined

    /****************************************************************************
     * @property {xxx} limiter -- xxx
     */
    this.limiter = undefined
  },
  
  /*****************************************************************************
   * @method _init
   * @description _init description
   * @returns {undefined} -- undefined
   */     
  _init: function() {
    this._initializeParameters()
    this._initializeResponses()
  },

  /*****************************************************************************
   * @property {string} name -- xxx
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
   * @method getService
   * @description getService description
   * @returns {carbond.Service} -- xxx
   */
  getService: function() {
    return this.endpoint.getService()
  },
  
  /*****************************************************************************
   * @method getAllParameters
   * @description Gets all parameters defined for this {@link carbond.Operation}
   *              which includes all parameters inherited from this.endpoint
   * @returns {xxx} -- xxx
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

  /*****************************************************************************
   * @method _initializeParameters
   * @description _initializeParameters
   * @returns {undefined} -- undefined
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
   * @description _initializeResponses description
   * @returns {undefined} -- undefined
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
   * getSanitizedURL XXX: revisit and add "sanitized" methods for other attributes
   * @method getSanitizedURL
   * @param {http.ClientRequest} req -- the current request
   * @returns {string} -- the sanitized URL
   */
  getSanitizedUrl: function(req) {
    var parsed = url.parse(req.originalUrl)
    delete parsed.query
    delete parsed.search
    return url.format(parsed)
  },

  /*****************************************************************************
   * service
   * @method service
   * @param {xxx} req -- xxx
   * @param {xxx} res -- xxx
   * @returns {undefined} -- undefined
   */       
  service: function(req, res) {},
  
})

