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
   * options
   */       
  options: function(req, res) {
    var self = this

    // build methods string
    var methods = this.supportedMethods()
    // XXX why we doing upper?
    var methodsString = methods.map(function(m) { return m.toUpperCase() }, methods).join(',')

    // set Allow header
    res.header("Allow", methodsString)

    // set CORS headers
    if (this.service.corsEnabled) {
      var allowHeaders = ['Authorization', 'Content-Length', 'X-Requested-With', 'Content-Type'] // XXX review these
      if (this.service.authenticator) {
        var authHeaders = this.service.authenticator.getAuthenticationHeaders()
        if (authHeaders) {
          allowHeaders = allowHeaders.concat(authHeaders)
        }
      }
      var allowHeadersString = allowHeaders.join(',') 

      res.header("Access-Control-Allow-Origin", "*") // XXX for some reason we also need this on every method
      res.header("Access-Control-Allow-Methods", methodsString)
      res.header('Access-Control-Allow-Headers', allowHeadersString)
    }

    // respond
    res.status(200).end()
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
      if (parentAcl) {
        acl = this._aclAndBelow(parentAcl, acl)
      }
    }

    return acl
  },

  /**********************************************************************
   * _aclAndBelow
   *
   * Combines two ACLs into one where the permission is allowed if the user has 'get' access on the first (parent) ACL
   * and the second (child) either doesn't exist or permits the action.
   */
  _aclAndBelow: function(parentAcl, childAcl) {
    return o({
      _type: parentAcl.constructor,
      hasPermission: function(user, permission, env) {
        return parentAcl.hasPermission(user, 'get', env) && (!childAcl || childAcl.hasPermission(user, permission, env))
      }
    })
  }

})

