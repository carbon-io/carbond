var o  = require('atom').o(module)
var oo  = require('atom').oo(module)
var _o = require('bond')._o(module)
var __ = require('fiber').__(module)

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
    this.log.debug("ObjectServer._main")
    this.start()
  },

 /**********************************************************************
   * cmdargs 
   */        
  cmdargs: { // values are nomnom definitions
    'port': {
      abbr: "p",
      metavar: "PORT",
      property: true,
      help: "port"
    },
    'verbosity': {
      abbr: "v",
      metavar: "VERBOSITY",
      property: true,
      help: "verbosity level (trace | debug | info | warn | error | fatal)"
    },
    'root-secret-key': {
      metavar: "ROOT_SECRET_KEY",
      help: "root secret key",
      // XXX need to attach to some property
    }
  },

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.port = 8888
    this.description = "This is an API service created with the ObjectServer"
    this.verbosity = 'info', // one of (trace | debug | info | warn | error | fatal)
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
    
    // initialize dbs
    this._initializeDatabaseConnections()

    // initialize express
    this._initializeExpress()    
    
    // initialize top-level fiber for request chain -- this should be first in the middleware chain
    this._initializeFiberMiddleware()

    // initialize CORS middleware
    this._initializeCORSMiddleware() // XXX always?

    // initialize authenticator
    this._initializeAuthenticator()

    // initialize tree of endpoints starting at this
    this._initializeEndpoint(this, this.path)

    // static pages
    this._initializeStaticRoutes() // put this last - you don't want to hit the fs on each req

    this._expressApp.listen(this.port) // XXX cb?
    this.log.info("ObjectServer listening on port " + this.port)
    this.log.info("ObjectServer started")
  },
    
  /**********************************************************************
   * stop
   */        
  stop: function() {
    // XXX what should we do here? Close db connections and unlisten?
    // Maybe in start() reg a signal handler?
  },    

  /**********************************************************************
   * _authenticate
   */
  _authenticate: function(req, res, next) {
    var user

    // never auth options requests
    if (req.method.toLowerCase() === "options") {
      next()
      return
    }

    if (!this.authenticator) {
      next()
      return
    }

    try {
      user = this.authenticator.authenticate(req)
    } catch (e) {
      // XXX
      if (e.stack) {
        console.log(e.stack)
      }
      if (!e.code) { // XXX better check ?
        e = this.errors.InternalServerError(e.message)
      }
      res.status(e.code).send(e)
      return
    }

    req.user = user
    next() 
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
    if (this.authenticator) {
      this.authenticator.initialize(this)
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
      // setup path
      var path = endpoint.path || ''
      if (path === '') {
        path = '/'
      }

      // make wrapper fn
      var wrapper = this._makeOperationWrapper(f, endpoint, method)

      // create the express route
      app[method](path,
                  this._authenticate.bind(this), 
                  wrapper)
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
            if (!endpoint.sanitizesOutput) {
              // sanitize the result which will remove any objects and fields the user does
              // not have permission to see
              // XXX            result = self._sanitize(result, req.user, method !== 'get', endpoint.sanitizeMode === 'filter') 
              result = self._sanitize(result, req.user, method !== 'get', true) 
            }
            // send the result 
            res.send(EJSON.inflate(result))
          } else {
            // assume resonse written to 
            // XXX can we tell more directly if response has been written to?
          } 
        } else {
          var err = self.errors.Forbidden("User does not have permission to perform operation")
          res.status(err.code).send(err)
        }
      } catch (e) {
        // XXX check that it is right kind of error object
        //          self.log.info(JSON.stringify(e)) // XXX TOTALLY LAME (should not log anyway but leaving to show you)
        // XXX clean all this up
        if (e.stack) {
          self.log.error(e.stack)
          console.log(e.stack)
        }
        res.status(e.code || 500).send(e)
      }
    }
    
    return wrapper
  },

  /**********************************************************************
   * _sanitize
   */
  _sanitize: function(value, user, filterSingleValue, filterArrays) {
    try {
      return _o('./security/ObjectAcl').sanitize(value, user, filterSingleValue, filterArrays)
    } catch (e) { // XXX should this be 500? Do we want exception to mean forbidden?
//      console.log(e.stack) // XXX this is not really ok -- need to know which type exception
      throw this.errors.Forbidden(e.message)
    }
  },

  /**********************************************************************
   * _isOperationAuthorized
   *
   * Endpoint ACLs are used here to gate access to operations 
   *
   */
  _isOperationAuthorized: function(user, endpoint, method) {
    // If no authenticator then authorization is disabled // XXX positive about this?
    if (!this.authenticator) {
      return true
    }

    // Never access control options requests
    if (method.toLowerCase() === "options") {
      return true
    }

    // Check for endpoint that allows this method unauthenticated access
    if (endpoint.allowUnauthenticated && endpoint.allowUnauthenticated.indexOf(method.toLowerCase()) !== -1) {
      return true
    }

    // If user is null / undefined / false, deny authorization
    if (!user) {
      return false
    }

    // The root user bypasses all security
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
    levels[bunyan.FATAL] = 'FATAL'
    levels[bunyan.ERROR] = 'ERROR'
    levels[bunyan.WARN]  = 'WARN'
    levels[bunyan.INFO]  = 'INFO'
    levels[bunyan.DEBUG] = 'DEBUG'
    levels[bunyan.TRACE] = 'TRACE'

    var OutStream = {
      write: function(rec) {
        if (rec.level === bunyan.INFO || rec.level === bunyan.WARN) {
          console.log('[%s]  %s: %s', rec.time, levels[rec.level], rec.msg)
        } else {
          console.log('[%s] %s: %s', rec.time, levels[rec.level], rec.msg)
        }
      }
    }

    loggerConf.streams = loggerConf.streams || []
    loggerConf.streams.push({
      type: "raw",
      level: this.verbosity,
      stream: OutStream
    }) 
    return bunyan.createLogger(loggerConf)    
  }
  
})
