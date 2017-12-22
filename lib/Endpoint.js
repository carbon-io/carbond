var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var o = require('@carbon-io/carbon-core').atom.o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

/***************************************************************************************************
 * @class Endpoint
 *
 *
 * Example:
 * {
 *   _type: 'datanode/Endpoint',
 *
 *   get: function(req, res) { ... },
 *   post: function(req, res) { ... }
 *   put: {
 *      parameters: { ...
 *      },
 *      ...
 *      service: function(req, res) { ... }
 *   }
 * }
 */
module.exports = oo(_.mixin({

  /*****************************************************************************
   * @property {object} ALL_METHODS -- A list of all HTTP methods recognized by
   *                                   carbond
   * @memberof carbond.Endpoint
   */
  ALL_METHODS: ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'],

  /*****************************************************************************
   * @constructs Endpoint
   * @description The Endpoint class is a core abstraction in carbond which models
   *              an API as a tree of Endpoint instances, each of which is responsible
   *              for defining how to handle a given request to a particular URI
   * @memberof carbond
   */
  _C: function() {

    // -----------------------------
    // Computed read-only properties
    // -----------------------------

    /***************************************************************************
     * @property {string} path -- The URI path that routes to this endpoint. This
     *                            is built during service initialization and will
     *                            overwrite any value specified on instantiation.
     * @readonly
     */
    this.path = '' // Can be URI pattern (e.g.: "widgets/:id")

    /***************************************************************************
     * @property {carbond.Endpoint} parent -- The parent endpoint for this
     *                                        endpoint in the endpoint tree
     * @readonly
     */
    this.parent = null

    /***************************************************************************
     * @property {carbond.Service} service
     * @description The root service object managing the endpoint tree. Getting
     *              a reference to this object is sometimes necessary or just
     *              convenient (i.e., HTTP error classes can be accessed via
     *              {@link prop:carbond.Service.errors}).
     * @deprecated Use {@link func:carbond.Endpoint.getService} instead
     * @readonly
     */
    this.service = null

    // -----------------------
    // Configurable properties
    // -----------------------

    /****************************************************************************
     * @property {string} [description] -- A brief description of what this endpoint
     *                                     does. This will be displayed in any
     *                                     generated documentation.
     */
    this.description = undefined

    /***************************************************************************
     * @property {Object.<string, carbond.OperationParameter>} parameters
     * @description Operation parameter definitions that apply to all operations
     *              supported by this endpoint. Note, these will be merged with
     *              any parameter definitions on the operations themselves and
     *              their parsed values will be passed to the handler via
     *              ``req.parameters[<parameter name>]``.
     */
    this.parameters = {} // Endpoint-wide parameter definitions that apply to
                         // all operations

    /***************************************************************************
     * @property {carbond.security.Acl} acl -- The access control list for this endpoint
     * @todo implement/document
     * @ignore
     */
    this.acl = null // XXX add to docs

    /***************************************************************************
     * @property {xxx} dataAcl -- xxx
     * @todo implement/document
     * @ignore
     */
    this.dataAcl = null

    /***************************************************************************
     * @property {boolean} [sanitizesOutput=false] -- xxx
     * @todo implement/document
     * @ignore
     */
    this.sanitizesOutput = false

    /***************************************************************************
     * @property {string} [sanitizeMode=strict] sanitizeMode -- xxx
     * @todo implement/document
     * @ignore
     */
    this.sanitizeMode = 'strict' // 'strict' or 'filter' (XXX add to docs)

    /***************************************************************************
     * @property {Array.<string>?} allowUnauthenticated
     * @description Skip authentication for the HTTP methods listed on this
     *              endpoint
     */
    this.allowUnauthenticated = null // can be [] of methods

    /***************************************************************************
     * @property {boolean} [validateOutput=true]
     * @description Controls whether or not response bodies are validated using
     *              the response {@link carbond.OperationResponse.schema} corresponding
     *              to the current response code
     */
    this.validateOutput = true

    /***************************************************************************
     * @property {Object.<string, carbond.Endpoint>} endpoints
     * @description The endpoints that sit below this endpoint in the tree. URL
     *              paths to each endpoint are built during a depth first traversal
     *              of the tree on initialization using the property names defined
     *              on this Object.
     */
    this.endpoints = {}

    /***************************************************************************
     * @property {boolean} [noDocument=false]
     * @description Controls whether documentation for this endpoint is included
     *              in generated static documentation
     */
    this.noDocument = false

  },

  /*****************************************************************************
   * @method _init
   * @description Initialization method called on instance creation
   * @returns {undefined}
   */
  _init: function() {
    this._initializeParameters()
    this._initializeOperations()
  },

  /*****************************************************************************
   * @property {Array.<string>} _frozenProperties
   * @description The list of properties to freeze after initialization
   * @readonly
   */
  _frozenProperties: [
    'path',
    'parent',
    'service'
  ],

  /*****************************************************************************
   * @method _initializeOperations
   * @description Initializes all operations defined on this endpoint
   * @returns {undefined}
   */
  _initializeOperations: function() {
    var self = this
    this.ALL_METHODS.forEach(function(method) {
      if (self[method]) {
        self._initializeOperation(method)
      }
    })
  },

  /*****************************************************************************
   * @method _initializeOperation
   * @description Initializes a single operation for the specified method. This
   *              method will instantiate the operation if it is not already an
   *              instance of {@link carbond.Operation}.
   * @property {string} method -- The HTTP method corresponding to the operation
   *                              to initialize
   * @returns {undefined}
   */
  _initializeOperation: function(method) {
    var self = this
    var Operation = _o('./Operation')
    var operation = this[method]

    if (typeof(operation) === 'function') {
      var opFn = operation // setting this to new variable is important for the closure
      operation = o({
        _type: Operation,
        service: function(req, res) {
          return opFn.call(self, req, res)
        }
      })
    } else if (typeof(operation) === 'object') {
      // make into proper Operation object if needed
      if (!(operation instanceof Operation)) {
        // make into instance of Operation
        operation = o(operation, Operation)
      }
    } else {
      throw Error("Operation must be a function or an object. Got unexpected value: " + operation)
    }

    // set it back
    this[method] = operation
    this[method].name = method

    // Lexical convenience
    operation.endpoint = this
  },

  /*****************************************************************************
   * @method operations
   * @description Gathers all operations defined on this endpoint
   * @returns {Array.<carbond.Operation>}
   */
  operations: function() {
    var result = []
    var self = this
    this.ALL_METHODS.forEach(function(method) {
      var m = self[method]
      if (m) {
        result.push(m)
      }
    })

    return result
  },

  /*****************************************************************************
   * @method getOperation
   * @description Retrieves the operation instance corresponding to the passed
   *              HTTP method
   * @param {string} method -- The HTTP method corresponding to the operation to
   *                            retrieve
   * @returns {carbond.Operation?}
   */
  getOperation: function(method) {
    // Important to check it is actually an HTTP method and not just
    // any method that might be on this object. Allowing access to anything
    // would be a security flaw.
    if (this.ALL_METHODS.indexOf(method.toLowerCase()) != -1) {
      return this[method]
    }

    return undefined
  },

  /*****************************************************************************
   * @method isOperationAuthorized
   * @description Tests whether an operation is authorized given a user (as
   *              returned by the root authenticator) and any {@link
   *              carbond.security.Acl} that may apply to this endpoint
   *
   * @param {string} method -- The HTTP method corresponding to the operation
   *                           that we are attempting to authorize
   * @param {Object} user -- The user object
   * @param {carbond.Request} req -- The request object
   * @returns {boolean} -- Whether of not the operation is authorized
   */
  isOperationAuthorized: function(method, user, req) {
    var acl = this._cachedFullEndpointAcl
    if (acl === undefined) {
      acl = this._computeFullEndpointAcl()
      this._cachedFullEndpointAcl = acl
    }

    if (!acl) { // if no ACL we authorize
      return true
    }

    return acl.hasPermission(user, method, { req: req })
  },

  /*****************************************************************************
   * @method supportedMethods
   * @description Returns a list of HTTP methods supported by this endpoint
   * @returns {Array.<string>}
   */
  supportedMethods: function() {
    var result = []
    var self = this
    this.ALL_METHODS.forEach(function(method) {
      if (self[method]) {
        result.push(method)
      }
    })

    return result
  },

  /*****************************************************************************
   * @method getService
   * @description Returns the root {@link carbond.Service} instance (note, this is
   *              preferred over accessing the ``service`` property itself)
   * @returns {carbond.Service}
   */
  getService: function() {
    return this.service
  },

  /*****************************************************************************
   * @method options
   * @description Implements the OPTIONS method handler
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {undefined}
   */
  options: function(req, res) {
    // CORS bits are handled in Service._initializeCorsMiddleware
    res.status(204).end()
  },

  /*****************************************************************************
   * @method _computeFullEndpointAcl
   * @descripton Walks back up the endpoint tree to the root and builds the
   *             aggregate ACL for this endpoint
   * @returns {carbond.security.Acl}
   */
  _computeFullEndpointAcl: function() {
    var endpoint = this
    var acl = endpoint.acl || null

    var parentAcl
    while (endpoint = endpoint.parent) {
      parentAcl = endpoint.acl
      if (parentAcl && parentAcl.selfAndBelow) {
        acl = this._aclAndBelow(parentAcl, acl)
      }
    }

    return acl
  },

  /*****************************************************************************
   * @method _aclAndBelow
   * @description Combines an ACL from a parent endpoint with one from its child.
   *              If the parent ACL has no selfAndBelow configured, only the child
   *              ACL is used.  If selfAndBelow is true, the user must have the
   *              same permission on the parent to access the child.  If
   *              selfAndBelow is the name of a permission (e.g. 'get'), the user
   *              must have that permission on the parent in order to access the
   *              child. If selfAndBelow is a function, it will be invoked with
   *              the user, permission name, and environment as arguments just
   *              like the regular permission functions in order to determine
   *              access.  Assuming the user has access to the parent as defined
   *              above, the child ACL will then be evaluated.  If there is no
   *              child ACL, the user is granted permission by default.
   * @param {carbond.security.Acl} parentAcl -- The parent endpoint's ACL
   * @param {carbond.security.Acl} childAcl -- The child endpoint's ACL
   * @returns {carbond.security.Acl} -- The aggregate ACL for this endpoint
   */
  _aclAndBelow: function(parentAcl, childAcl) {
    var self = this
    return o({
      _type: parentAcl.constructor,
      hasPermission: function(user, permission, env) {
        var selfAndBelowFn = self._selfAndBelowFn(parentAcl)
        return (!selfAndBelowFn || selfAndBelowFn(user, permission, env)) &&
          (!childAcl || childAcl.hasPermission(user, permission, env))
      }
    })
  },

  /*****************************************************************************
   * @method _selfAndBelowFn
   * @description Generates a single ``selfAndBelow`` function to be used by an
   *              ACL from the various ``selfAndBelow`` definition styles
   * @param {carbond.security.Acl} parentAcl -- The parent endpoint's ACL
   * @returns {Function?}
   */
  _selfAndBelowFn: function(parentAcl) {
    var selfAndBelow = parentAcl.selfAndBelow
    if(selfAndBelow) {
      if(typeof(selfAndBelow) === 'boolean') {
        return function(user, permission, env) { return parentAcl.hasPermission(user, permission, env) }
      } else if(typeof(selfAndBelow) === 'function') {
        return selfAndBelow
      } else if(selfAndBelow in parentAcl.permissionDefinitions) {
        return function(user, permission, env) { return parentAcl.hasPermission(user, selfAndBelow, env) }
      } else {
        throw Error("Unexpected value for selfAndBelow: "+JSON.stringify(parentAcl))
      }
    }
    return null
  }

}, _o('./util/mixins/OperationParametersInitializer')))

