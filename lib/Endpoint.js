var o = require('@carbon-io/carbon-core').atom.o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)

/******************************************************************************
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

  /**********************************************************************
   * ALL_METHODS
   */
  ALL_METHODS: ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'],

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.path = '' // Can be URI pattern (e.g.: "widgets/:id")
    this.description = undefined
    this.parent = null
    this.parameters = {} // Endpoint-wide parameter definitions that apply to all operations
    this.service = null
    this.acl = null // XXX add to docs
    this.dataAcl = null
    this.sanitizesOutput = false
    this.sanitizeMode = 'strict' // 'strict' or 'filter' (XXX add to docs)
    this.allowUnauthenticated = null // can be [] of methods
    this.validateOutput = true
    this.endpoints = {}
    this.noDocument = false
  },

  /**********************************************************************
   * _init
   */
  _init: function() {
    this._initializeParameters()
    this._initializeOperations()
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

  /**********************************************************************
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

  /**********************************************************************
   * operations()
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

  /**********************************************************************
   * getOperation
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

  /**********************************************************************
   * isOperationAuthorized
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

  /**********************************************************************
   * supportedMethods
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

  /**********************************************************************
   * getService
   */
  getService: function() {
    return this.service
  },

  /**********************************************************************
   * options
   */
  options: function(req, res) {
    // CORS bits are handled in Service._initializeCorsMiddleware
    res.status(204).end()
  },

  /**********************************************************************
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

  /**********************************************************************
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

