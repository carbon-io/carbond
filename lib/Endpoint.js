var o = require('@carbon-io/carbon-core').atom.o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)

//-----------------------------------------------------------------------------
/*
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
module.exports = oo({
  /**
   * @lends carbond_Endpoint
   */
  
  //---------------------------------------------------------------------
  /**
   * @property {Array} ALL_METHODS -- A list of all supported HTTP methods
   * @readonly
   * @static
   */
  ALL_METHODS: ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'],

  //---------------------------------------------------------------------
  /**
   * Endpoint constructor
   * @constructs carbond_Endpoint
   */
  _C: function() {
    /**
     * @property {string} path -- The URI path for this endpoint
     * @instance
     * @readonly
     */
    this.path = '' // Can be URI pattern (e.g.: "widgets/:id")
    /**
     * @property {string} description -- A short description of this endpoint (will end up in generated docs)
     * @instance
     * @readonly
     */
    this.description = undefined
    /**
     * @property {carbond.Endpoint} parent -- The parent endpoint (e.g. "/foo" would be the parent of "/foo/bar")
     * @readonly
     */
    this.parent = null
    /**
     * @property {object} parameters -- An object containing 
     *                                  [OperationParameter]{@link carbond.OperationParameter}s that apply
     *                                  to every [Operation]{@link carbond.Operation} that this endpoint
     *                                  implements (e.g., these operation parameters will be merged into
     *                                  any operation parameters specified by the operations themselves.
     * @instance
     * @readonly
     */
    this.parameters = {} // Endpoint-wide parameter definitions that apply to all operations
    /**
     * @property {carbond.Service} service -- The root service object
     * @instance
     * @readonly
     */
    this.service = null
    /**
     * @property {carbond.security.Acl} acl -- The acl for this endpoint
     * @instance
     * @readonly
     */
    this.acl = null // XXX add to docs
    /**
     * @property {carbond.security.Acl} dataAcl -- The data acl for this endpoint (not implemented)
     * @instance
     * @readonly
     * XXX: what's the status here?
     */
    this.dataAcl = null
    /**
     * @property {boolean} sanitizeOutput -- Sanitize data returned operations on this endpoint (not implemented)
     * @instance
     * @readonly
     * XXX: what's the status here?
     */
    this.sanitizesOutput = false
    /**
     * @property {boolean} sanitizeMode -- Mode by which result data is results are sanitized (not implemented)
     * @instance
     * @readonly
     * XXX: what's the status here?
     */
    this.sanitizeMode = 'strict' // 'strict' or 'filter' (XXX add to docs)
    /**
     * @property {Array} allowUnauthenticated -- A white list of HTTP methods for which authentication will not
     *                                           gate access to this endpoint (e.g., OPTIONS)
     * @instance
     * @readonly
     */
    this.allowUnauthenticated = null // can be [] of methods
    /**
     * @property {boolean} validateOutput -- Validate that output matches a response schema if present
     * @instance
     * @readonly
     */
    this.validateOutput = true
    /**
     * @property {object} endpoints -- An object whose keys are the path component for a child endpoint and
     *                                 whose values are endpoint objects implementing the logic for those
     *                                 subpaths
     * @instance
     * @readonly
     */
    this.endpoints = {}
  },

  //---------------------------------------------------------------------
  /*
   * _init
   */
  _init: function() {
    this._initializeParameters()
    this._initializeOperations()
  },

  //---------------------------------------------------------------------
  /*
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

  //---------------------------------------------------------------------
  /*
   * _initializeOperations
   */
  _initializeOperations: function() {
    var self = this
    this.ALL_METHODS.forEach(function(method) {
      if (self[method]) {
        self._initializeOperation(method)
      }
    })
  },

  //---------------------------------------------------------------------
  /*
   * _initializeOperation
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

  //---------------------------------------------------------------------
  /**
   * Retrieve all [Operation]{@link carbond.Operation}s implemented on this endpoint
   * @method operations
   * @memberof carbond_Endpoint
   * @instance
   * @returns {Array} -- A list containing all implemented 
   *                                        [Operation]{@link carbond.Operation}s
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

  //---------------------------------------------------------------------
  /**
   * Retrieve a particular [Operation]{@link carbond.Operation} implemented on this endpoint
   * @method getOperation
   * @memberof carbond_Endpoint
   * @instance
   * @param {string} method -- The operation (HTTP method)
   * @returns {object} -- The [Operation]{@link carbond.Operation} if it exists, otherwise "undefined"
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

  //---------------------------------------------------------------------
  /**
   * Check if an operation is allowed for the current user
   * @method isOperationAuthorized
   * @memberof carbond_Endpoint
   * @instance
   * @param {string} method - The operation (HTTP method)
   * @param {object} user - The user object as populated by the 
   *                        [Authenticator]{@link carbond.security.Authenticator}
   * @param {object} req - The current request object
   * @returns {boolean} -- "true" if the operation is allowed for the current user
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

  //---------------------------------------------------------------------
  /**
   * Retrieve the names (HTTP method names) for all implemented operations
   * @method supportedMethods
   * @memberof carbond_Endpoint
   * @instance
   * @returns {Array} -- A list of supported operations (HTTP method names)
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

  //---------------------------------------------------------------------
  /**
   * Get the root [Service]{@link carbond.Service} instance
   * @method getService
   * @memberof carbond_Endpoint
   * @instance
   * @returns {carbond.Service} -- The root [Service]{@link carbond.Service} instance
   */
  getService: function() {
    return this.service
  },

  //---------------------------------------------------------------------
  /**
   * Default HTTP OPTIONS implementation
   * @method options
   * @memberof carbond_Endpoint
   * @instance
   * @param {object} req -- The current request object
   * @param {object} res -- The current response object
   */
  options: function(req, res) {
    // CORS bits are handled in Service._initializeCorsMiddleware
    res.status(204).end()
  },

  //---------------------------------------------------------------------
  /*
   * _computeFullEndpointAcl
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

  //---------------------------------------------------------------------
  /*
   * _aclAndBelow
   *
   * Combines an ACL from a parent endpoint with one from its child.  If the parent ACL has no selfAndBelow configured,
   * only the child ACL is used.  If selfAndBelow is true, the user must have the same permission on the parent to
   * access the child.  If selfAndBelow is the name of a permission (e.g. 'get'), the user must have that permission
   * on the parent in order to access the child.  If selfAndBelow is a function, it will be invoked with the user,
   * permission name, and environment as arguments just like the regular permission functions in order to determine
   * access.  Assuming the user has access to the parent as defined above, the child ACL will then be evaluated.
   * If there is no child ACL, the user is granted permission by default.
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

})

