var express = require('express')
var Microservice = require('microservice').Microservice;
var fs = require('fs')
var path = require('path')
var url = require('url')
var connect = require('leafnode').connect
var mongodb = require('mongodb').MongoClient
var maker = require('maker')
var bunyan = require('bunyan')
var path = require('path')
var o = maker.o(module)
var oo = maker.oo(module)
var _o = maker._o(module)
var __ = maker.__

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
    this.corsEnabled = true // XXX probably wrong
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

    var self = this // XXX self no longer needed   
    // initialize dbs
    self._initializeDatabaseConnections()
    
    // initialize express
    self._initializeExpress()    
    
    // initialize top-level fiber for request chain -- this should be first in the middleware chain
    self._initializeFiberMiddleware()
    
    // initialize authenticator
    self._initializeAuthenticator()
    
    // initialize CORS middleware
    self._initializeCORSMiddleware()
      
    self._initializeStaticRoutes()

    // initialize endpoints
    self._initializeEndpoints(self.endpoints)
    
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
    }
    
    self._expressApp.use(function(req, res, next) {
      if (self.authenticator && req.remoteUser) { // XXX move self.authenticator check outside and dont create middleware if false
        var user = self.authenticator.findUserByUsername(req.remoteUser)
        if (user) {
          req.user = user
        } // XXX reject properly
      }
      next()
    })
  },

  /**********************************************************************
   * _initializeCORSMiddleware
   */
  _initializeCORSMiddleware: function() {
    var self = this
    this._expressApp.use(function(req, res, next) {
      if (self.corsEnabled) {
        // XXX needs review
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        res.header('Access-Control-Allow-Headers', 'Authorization, Content-Length, X-Requested-With, Content-Type')
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
    } else {
      if (endpoint[method].service) {
        // lexical convenience
        operation.objectserver = this
        operation.endpoint = endpoint
        
        f = function(req, res) { 
          return operation.service(req, res)
        }
      }
    }

    if (f) {
      // wrap to handle sync / asyc styles and exceptions
      var self = this
      var wrapper = function(req, res) {
        try {
          var result = f(req, res)
          if (result !== undefined) {
            res.send(result)
          } 
        } catch (e) {
          // XXX check that it is right kind of error object
//          self.log.info(JSON.stringify(e)) // XXX TOTALLY LAME (should not log anyway but leaving to show you)
          res.status(e.code).send(e)
        }
      }
      
      app[method](endpoint.path, wrapper)
    }
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
