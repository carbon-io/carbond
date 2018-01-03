var url = require('url')
var util = require('util')

var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module);
var o = require('@carbon-io/carbon-core').atom.o(module);
var oo = require('@carbon-io/carbon-core').atom.oo(module);

var OperationInitError = require('./util/errors').OperationInitError
var mixins = _o('./util/mixins')

/***************************************************************************************************
 * @class Operation
 */
var Operation = oo(mixins.multimixin({

  /*****************************************************************************
   * @constructs Operation
   * @description Handles HTTP requests for a specific method (e.g., "GET") to
   *              a specific {@link carbond.Endpoint} by assigning to a property
   *              on the endpoint that corresponds to that HTTP method (e.g.
   *              {@link carbond.Endpoint.get}). This can be instantiated
   *              explicitly in the context of an {@link carbond.Endpoint} or
   *              implicitly if just a handler method is provided. In the latter
   *              case, the operation object will be built and instantiated for
   *              you.
   *
   * @memberof carbond
   */
  _C: function() {

    // -----------------------------
    // Computed read-only properties
    // -----------------------------

    /***************************************************************************
     * @property {xxx} _allParameters -- xxx
     */
    this._allParameters = undefined // cache of all parameters including inherited parameters

    /*****************************************************************************
     * @property {string} name -- The operation name (i.e., HTTP method)
     * @readonly
     */
    this.name = undefined

    /***************************************************************************
     * @property {carbond.Endpoint} endpoint -- xxx
     */
    this.endpoint = undefined

    // -----------------------
    // Configurable properties
    // -----------------------

    /****************************************************************************
     * @property {string} [description] -- A brief description of what this operation
     *                                     does. This will be displayed in any
     *                                     generated documentation.
     */
    this.description = undefined

    /***************************************************************************
     * @property {Object.<string, carbond.OperationParameter>} [parameters={}]
     * @description Any parameters that are specific to this operation (as
     *              opposed to those defined on the parent endpoint)
     */
    this.parameters = {}

    /***************************************************************************
     * @property {Object.<string, carbond.OperationResponse>} [responses={}]
     * @description Response definitions for this operation. These will be used
     *              for validation purposes as well as generated static
     *              documentation.
     */
    this.responses = {}

    /***************************************************************************
     * @property {boolean} [validateOutput=true]
     * @description Flag determining whether responses are validated using the
     *              definitions in {@link carbond.Operation.responses}. Note, the
     *              top-level {@link carbond.Service} and the
     *              {@link carbond.Operation} being invoked also have this property,
     *              and, if any are false, output will *not* be validated.
     */
    this.validateOutput = true

    /****************************************************************************
     * @property {carbond.limiter.Limiter} limiter
     * @description Operation specific rate limiter
     * @todo enable this when limiter documentation is cemented
     * @ignore
     */
    this.limiter = undefined
  },

  /*****************************************************************************
   * @method _init
   * @description Performs all operation initialization
   * @returns {undefined}
   */
  _init: function() {
    try {
      this._initializeParameters()
      this._initializeResponses()
    } catch (e) {
      if (!_.isNil(this.endpoint)) {
        this.getService().logError(e)
      }
      this.setSanityCheckError(new OperationInitError(e, this, this.path))
    }
  },

  /*****************************************************************************
   * @property {string} path
   * @description The URI path that routes to this operation. This is built service
   *              initialization and will overwrite any value specified on
   *              instantiation.
   * @readonly
   */
  path: {
    $property: {
      get: function() {
        return _.isNil(this.endpoint) ? '' : this.endpoint.path
      }
    }
  },

  /*****************************************************************************
   * @method getService
   * @description Returns the root {@link carbond.Service} instance
   * @returns {carbond.Service}
   */
  getService: function() {
    return this.endpoint.getService()
  },

  /*****************************************************************************
   * @method getAllParameters
   * @description Gets all parameters defined for this {@link carbond.Operation}
   *              which includes all parameters inherited from this.endpoint
   * @returns {Object.<string, carbond.OperationParameter>}
   */
  getAllParameters: function() {
    if (this._allParameters) {
      return this._allParameters
    }

    // First gather all Endpoint parameters, post-order walk
    var allEndpointParameters = function(endpoint, all) {
      if (!_.isNil(endpoint)) {
        all = _.assignIn(
          _.clone(allEndpointParameters(endpoint.parent, endpoint.parameters)),
          all || {})
      }
      return all
    }

    // Cache result
    this._allParameters =
      allEndpointParameters(this.endpoint, this.parameters || {})

    return this._allParameters
  },

  /*****************************************************************************
   * @method _initializeResponses
   * @description Initializes all responses. If response is not an instance of
   *              {@link carbond.OperationResponse}, it will be instantiated as
   *              such.
   * @returns {undefined}
   */
  _initializeResponses: function() {
    for (var statusCode in this.responses) {
      var OperationResponse = _o('./OperationResponse')
      if (!(this.responses[statusCode] instanceof OperationResponse)) {
        if (_.isPlainObject(this.responses[statusCode])) {
          this.responses[statusCode] = o(this.responses[statusCode], OperationResponse)
        } else {
          throw new Error(
            'Malformed response spec. ' + JSON.stringify(this.responses[statusCode]))
        }
      }
    }
  },

  /*****************************************************************************
   * @method getSanitizedURL
   * @description Returns a new URL with the query string portion removed
   * @param {http.ClientRequest} req -- the current request
   * @returns {string} -- the sanitized URL
   */
  getSanitizedUrl: function(req) {
    var parsed = url.parse(req.originalUrl)
    // ensure url.format does not build the query string
    delete parsed.query
    delete parsed.search
    return url.format(parsed)
  },

  /*****************************************************************************
   * @method handle
   * @description Handles incoming requests, generating the appropriate response.
   *              Responses can be sent by the handler itself or this can be
   *              delegated to the service. If an object is returned, it will be
   *              serialized (and validated if configured to do so) and sent as
   *              the body of the response. If ``null`` is returned, it will end
   *              the response. If ``undefined`` is returned, it will be the
   *              responsibility of the handler to end the response. If the
   *              response status code is something other than ``204``, it should
   *              be set by the handler. Additionally, custom headers should be
   *              set on the response object before returning. To respond with
   *              an error (status code > 400), an instance of {@link
   *              httperrors.HttpError} can be thrown.
   *
   * @param {carbond.Request} req -- The current request object
   * @param {carbond.Response} res -- The response object
   * @returns {Object|null|undefined}
   * @throws {httperrors.HttpError}
   * @deprecated Use ``handle`` instead
   */
  handle: function(req, res) {
    throw new Error('Implement me')
  },

  /*****************************************************************************
   * @method service
   * @description Alias for {@link carbond.Operation.handle}
   * @param {carbond.Request} req -- The current request object
   * @param {carbond.Response} res -- The response object
   * @returns {Object|null|undefined}
   * @throws {httperrors.HttpError}
   * @deprecated Use ``handle`` instead
   */
  service: {
    $property: {
      get: function() {
        return util.deprecate(this.handle, 'Use "handle" instead of "service"')
      },
      set: function(handler) {
        this.handle = handler
      }
    }
  },
}, mixins.OperationParametersInitializer, mixins.SanityCheck))

module.exports = Operation

