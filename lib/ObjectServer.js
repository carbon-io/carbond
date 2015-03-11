var maker = require('maker')
var o = maker.o(module)
var oo = maker.oo(module)
var _o = maker._o(module)
var __ = maker.__(module)

var EJSON = require('mongodb-extended-json');
var express = require('express')
var fs = require('fs')
var path = require('path')
var url = require('url')
var connect = require('leafnode').connect
var mongodb = require('mongodb').MongoClient
var bunyan = require('bunyan')
var path = require('path')


/******************************************************************************
 * @class ObjectServer
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */  
  _type: './Endpoint',

  /**********************************************************************
   * _main
   */        
  _main: function(options) { 
    var self = this
    this.start()
  },

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.port = 3000
    this.description = "This is an API service created with the ObjectServer"
    this.path = ''
    this.dbUri = null
    this.dbUris = {}
    this.db = null
    this.dbs = {}
    this.endpoints = {}
    this.authenticator = null
    // XXX probably wrong - not yet documented. Look at https://github.com/swagger-api/swagger-ui section on CORS
    this.corsEnabled = true 
    this.generateOptionsMethodsInDocs = false
    this._expressApp = null
    this._log = null
    this._loggerConf = {
      name: 'ObjectServer'
    }
    this._swaggerDescriptorGenerator = o({_type: './SwaggerDescriptorGenerator'})
  },

  /**********************************************************************
   * _init
   *
   * Initializes all of the internal state of this ObjectServer, but does
   * not bind to a port (start() does that). 
   */        
  _init: function() { 
    // initialize dbs
    this._initializeDatabaseConnections()
  },

  /**********************************************************************
   * errors XXX we should really be subclassing Error (which apparently is not trivial to do correctly)
   */        
  errors: {
    BadRequest: function(msg) {
      return {
        code: 400,
        description: "BadRequest",
        message: msg
      }
    },
    Forbidden: function(msg) {
      return {
        code: 403,
        description: "Forbidden",
        message: msg
      }
    },
    InternalServerError: function(msg) {
      return {
        code: 500,
        description: "Internal Server Error",
        message: msg
      }
    }
  },

  /**********************************************************************
   * serviceName
   */        
  serviceName: { 
    // get the service name from the file basename
    "$property": {
      get: function() {
        var result = "ObjectServer"
        if (require.main.exports === this) {
          var filename = path.basename(require.main.filename)
          result = filename.slice(0, filename.indexOf('.'))
        } else {
          result = "ObjectServer"
        }
        return result
      }
    }
  },

  /**********************************************************************
   * log
   */        
  log: {
    $property: {
      get: function() {
        if (!this._log) {
          this._log = this._createLogger()
        }
        return this._log
      }
    }
  },
  
  /**********************************************************************
   * start
   */        
  start: function() { 
    this.log.info("ObjectServer starting...")
    
    // initialize express
    this._initializeExpress()    
    
    // initialize top-level fiber for request chain -- this should be first in the middleware chain
    this._initializeFiberMiddleware()
    
    // initialize CORS middleware
    this._initializeCORSMiddleware()

    // initialize authenticator
    this._initializeAuthenticator()

    this._initializeStaticRoutes()

    // initialize tree of endpoint starting at this
    this._initializeEndpoint(this, this.path)
    
    this._expressApp.listen(this.port)
    this.log.info("ObjectServer listening on port " + this.port)
    this.log.info("ObjectServer running")
  },
    
  /**********************************************************************
   * stop
   */        
  stop: function() {
    // XXX what should we do here? Close db connections and unlisten?
    // Maybe in start() reg a signal handler?
  },    

  /**********************************************************************
   * _initializeDatabaseConnections
   */
  _initializeDatabaseConnections: function() { 
    // initialize dbs
    if (this.dbUri) {
        this.log.info("Initializing connection to db: " + this.dbUri)
        this.db = connect(this.dbUri)
    }

    // initialize dbs
    if (this.dbUris) {
      this.dbs = {}
      for (var dbname in this.dbUris) {
        this.log.info("Initializing connection to db: " + this.dbUris[dbname])
        this.dbs[dbname] = connect(this.dbUris[dbname])
      }
    }
  },

  /**********************************************************************
   * _initializeExpress
   */
  _initializeExpress: function() {
    this._expressApp = express.createServer()

    // better than using bodyParser -- more secure to not allow file uploads
    // XXX why does this not work then?
    // app.use(express.json())
    // app.use(express.urlencoded())
    // microservice may be doing some of this
    this._expressApp.use(express.bodyParser()) // XXX do we only want json() and urlencoded()
    // XXX maybe do this after auth?
  },

  /**********************************************************************
   * _initializeFiberMiddleware
   */
  _initializeFiberMiddleware: function() {
    var self = this
    this._expressApp.use(function(req, res, next) {
      // spawn new fiber
      __(function() {
        try {
          req.objectserver = self
          next()
        } catch (e) {
          console.error(e.stack) // XXX this may not be correct to just log here
        }
      })
    })
  },

  /**********************************************************************
   * _initializeAuthenticator
   */
  _initializeAuthenticator: function() {
    var self = this

    if (self.authenticator) {
      self.authenticator.initialize(self)

      self._expressApp.use(function(req, res, next) {
        var user
        var wasErrorDuringAuth = false

        // never auth options requests
        if (req.method.toLowerCase() === "options") {
          next()
          return
        }

        try {
          user = self.authenticator.authenticate(req)
        } catch (e) {
          wasErrorDuringAuth = true
          if (!e.code) { // XXX better check ?
            e = self.errors.InternalServerError(e.message)
          }
          res.status(e.code).send(e)
        }
        
        if (!wasErrorDuringAuth) {
          if (user) {
            req.user = user
            next() 
          } else {
            // XXX I don't think this should be a 401 but not positive
            var e = self.errors.Forbidden("Could not authenticate user")
            res.status(e.code).send(e)
          }
        }
      })
    }
  },

  /**********************************************************************
   * _initializeCORSMiddleware
   */
  _initializeCORSMiddleware: function() {
    var self = this
    this._expressApp.use(function(req, res, next) {
      if (self.corsEnabled) {
        // XXX should be able to do this only on options requests (and therefore in Endpoint.options)
        // but Swagger won't work unless we do this on every method
        res.header("Access-Control-Allow-Origin", "*")        
      }
      next()
    })
  },

  /**********************************************************************
   * _initializeStaticRoutes
   */
  _initializeStaticRoutes: function() {
    var app = this._expressApp

    // static routes XXX TODO may change
    app.use("/apidoc", express.static(__dirname + "/../www/apidoc"))
    app.use("/swagger-ui", express.static(__dirname + "/../node_modules/swagger-ui/dist"))
    
    // swagger descriptor endpoint
    var self = this
    app.get("/api-docs", function(req, res) {
      res.send(self._swaggerDescriptorGenerator.generateSwaggerDescriptor(self))
    })
  },
   
  /**********************************************************************
   * _initializeEndpoint
   */
  _initializeEndpoint: function(endpoint, path) {
    endpoint.path = path
    endpoint.objectserver = this
    // define endpoints for this node
    this._defineExpressRoutesForEndpoint(this._expressApp, endpoint)

    // recurse
    this._initializeEndpoints(endpoint.endpoints, path)
  },

  /**********************************************************************
   * _initializeEndpoints
   */
  _initializeEndpoints: function(endpoints, path) {
    path = path || this.path
    if (endpoints) {
      for (var endpointPath in endpoints) {
        this._initializeEndpoint(endpoints[endpointPath], path + "/" + endpointPath)
      }
    }
  },
  
  /**********************************************************************
   * _defineExpressRoutesForEndpoint
   */        
  _defineExpressRoutesForEndpoint: function(app, endpoint) {
    var self = this
    endpoint.ALL_METHODS.forEach(function(method) {
      var operation = endpoint[method]
      if (operation) {
        self._defineExpressRouteForOperation(app, method, endpoint, operation)
      }
    })
  },

  /**********************************************************************
   * _defineExpressRouteForOperation
   */        
  _defineExpressRouteForOperation: function(app, method, endpoint, operation) {
    var f
    if (typeof(operation) === 'function') {
      f = operation.bind(endpoint)
    } else if (typeof(operation) === 'object') {

      // make into proper Operation object if needed
      var Operation = _o('./Operation')
      if (!(operation instanceof Operation)) {
        // make into instance of Operation 
        operation = o(operation, null, Operation)
      }

      if (operation.service) { // check not strictly needed
        // lexical convenience
        operation.objectserver = this
        operation.endpoint = endpoint
        
        f = function(req, res) { 
          return operation.service(req, res)
        }
      }
    } else {
      throw Error("Operation must be a function or an object. Got unexpected value: " + operation)
    }

    if (f) {
      // wrap to handle sync / asyc styles and exceptions
      var wrapper = this._makeOperationWrapper(f, endpoint, method)
      var path = endpoint.path || ''
      if (path === '') {
        path = '/'
      }
      app[method](path, wrapper)
    }
  },

  /**********************************************************************
   * _makeOperationWrapper
   */
  _makeOperationWrapper: function(operation, endpoint, method) {
    var self = this
    var wrapper = function(req, res) {
      try {
        if (self._isOperationAuthorized(req.user, endpoint, method)) {
          var result = operation(req, res)
          if (result !== undefined) {
            result = self._sanitize(result, req.user, method !== 'get', endpoint.sanitizeMode === 'filter')
            res.send(EJSON.inflate(result))
          } 
        } else {
          var err = self.errors.Forbidden("User does not have permission to perform operation")
          res.status(err.code).send(err)
        }
      } catch (e) {
        // XXX check that it is right kind of error object
        //          self.log.info(JSON.stringify(e)) // XXX TOTALLY LAME (should not log anyway but leaving to show you)
        if (e.stack) {
          self.log.error(e.stack)
          console.log(e.stack)
        }
        res.status(e.code).send(e)
      }
    }
    
    return wrapper
  },

  /**********************************************************************
   * _saninitze 
   *
   * Processes values such that if there exist objects with acls that deny
   * read access, they will be forbidden or sanitized appropriately 
   *
   * If the value is an array of Objects, and there exists an Object
   * in the array that has an __acl__ that denies read access, a 403 will
   * be returned, unless this.filterArrayValues is true, in which case
   * such objects will be removed from the result array
   *
   * If the value is an Object, and has an __acl__ that denies read
   * access a 403 will be returned unless filterSingleValue is true (used by insert for example). XXX?
   * 
   * If the value is an Object or array of Objects, all Objects returned 
   * will have properties denied by an __acl__ removed such that the Objects
   * returned are santized of any properties the user does not have permission
   * to read
   */
  _sanitize: function(value, user, filterSingleValue, filterArrays) {
    var result = this._doSanitize(value, user, filterArrays)
    if (typeof(value) === 'object' && result === undefined) {
      if (!filterSingleValue) {
        throw self.objectserver.errors.Forbidden("User unauthorized to see value")
      }
    }

    return result
  },

  /**********************************************************************
   * _doSanitize
   */
  _doSanitize: function(value, user, filterArrays) {
    if (!value) {
      return value
    }
    
    var result = value
    if (value.constructor === Array) {
      result = this._doSanitizeArray(value, user, filterArrays)
    } else if (typeof(value) === 'object') {
      result = this._doSanitizeObject(value, user, filterArrays)
    }
    
    return result
  },

  /**********************************************************************
   * _doSanitizeArray
   */
  _doSanitizeArray: function(arr, user, filterArrays) {
    var result = []
    var processedElem

    var self = this
    arr.forEach(function(elem) {
      if (typeof(elem) === 'object') {
        processedElem = self._doSanitize(elem, user, filterArrays) // recurse
        if (!processedElem) { // was filtered out
          if (!filterArrays) { // if not filtering then reject entirely
            throw self.objectserver.errors.Forbidden("User not authorized to see value")
          }
        } else {
          result.push(processedElem)
        }
      } else {
        result.push(self._doSanitize(elem, user, filterArrays)) // otherwise recurse for prims and array
      }
    })

    return result
  },

  /**********************************************************************
   * _doSanitizeObject
   */
  _doSanitizeObject: function(obj, user) {
    var result = obj

    var acl
    var aclDatum = obj.__acl__
    if (aclDatum) {
      acl = o(aclDatum, null, './security/ObjectAcl')
      acl.object = obj

      if (!acl.hasPermission(user, 'read')) {
        result = undefined
        // XXX later this is more nuanced to sanitize
      }
    }

    return result
  },

  /**********************************************************************
   * _isOperationAuthorized
   *
   * Endpoint ACLs are used here to gate access to operations 
   *
   */
  _isOperationAuthorized: function(user, endpoint, method) {
    // if no authenticator then authorization is disabled // XXX positive about this?
    if (!this.authenticator) {
      return true
    }

    // Never access control options requests
    if (method.toLowerCase() === "options") {
      return true
    }

    // if user is null, deny authorization
    if (!user) {
      return false
    }

    // the root user bypasses all security
    if (this.authenticator.isRootUser(user)) {
      return true
    }

    var acl = endpoint.acl
    if (!acl) { // if no acl on endpoint we authorize
      return true
    }

    var result = false
    try {
      result = acl.hasPermission(user, method)
    } catch (e) {
      this.log.warn(e.stack)
    }

    return result
  },

  /**********************************************************************
   * _createLogger
   */
  _createLogger: function() {
    var loggerConf = this._loggerConf

    // add custom pretty logger to stdout
    var levels = {}
    levels[bunyan.FATAL] = 'INFO'
    levels[bunyan.ERROR] = 'ERROR'
    levels[bunyan.WARN]  = 'WARN'
    levels[bunyan.INFO]  = 'INFO'
    levels[bunyan.DEBUG] = 'DEBUG'
    levels[bunyan.TRACE] = 'TRACE'

    loggerConf.streams = loggerConf.streams || []
    loggerConf.streams.push({
      type: "raw",
      stream: {
        write: function(rec) {
          console.log('[%s] %s: %s', rec.time, levels[rec.level], rec.msg)
        }
      }
    }) 
    return bunyan.createLogger(loggerConf)    
  }
  
})
