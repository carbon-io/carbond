var o  = require('atom').o(module)
var oo  = require('atom').oo(module)
var _o = require('bond')._o(module)
var __ = require('fiber').__(module)

var fs = require('fs')
var path = require('path')
var url = require('url')
var bunyan = require('bunyan')

var https = require('https')
var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')

var connect = require('leafnode').connect
var mongodb = require('mongodb').MongoClient
var EJSON = require('mongodb-extended-json')


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
    this.logDebug("ObjectServer._main")
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
    // core
    this.port = 8888
    this.description = "This is an API service created with the ObjectServer"
    this.verbosity = 'info', // one of (trace | debug | info | warn | error | fatal)
    this.path = ''
    this.processUser = undefined

    // db config
    this.dbUri = undefined
    this.dbUris = {}
    this.db = undefined
    this.dbs = {}
    
    // endpoints
    this.endpoints = {}

    // authenticator
    this.authenticator = undefined

    // server and express
    this._server = undefined
    this._expressApp = undefined
    // XXX probably wrong - not yet documented. Look at https://github.com/swagger-api/swagger-ui section on CORS
    this.corsEnabled = true 

    // ssl
    this.sslOptions = {
      serverCertPath: undefined,
      trustedCertsPaths: [],
      serverKeyPath: undefined,
      serverKeyPassword: undefined,
      requireClienCerts: false
    },

    // swagger / docs
    this.generateOptionsMethodsInDocs = false

    // logging
    this._bunyanLog = undefined
    this._loggerConf = { name: 'ObjectServer' }
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
   * errors 
   */     
  errors: _o('./HttpErrors'),

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
   * logDebug
   */       
  logDebug: function(obj) {
    this._log.debug(obj)
  },

  /**********************************************************************
   * logInfo
   */       
  logInfo: function(obj) {
    this._log.info(obj)
  },

  /**********************************************************************
   * logWarning
   */       
  logWarning: function(obj) {
    this._log.warn(obj)
  },

  /**********************************************************************
   * logError
   */       
  logError: function(obj) {
    this._log.error(obj)
  },

  /**********************************************************************
   * logFatal
   */       
  logFatal: function(obj) {
    this._log.fatal(obj)
  },

  /**********************************************************************
   * log
   */        
  _log: {
    $property: {
      get: function() {
        if (!this._bunyanLog) {
          this._bunyanLog = this._createLogger()
        }
        return this._bunyanLog
      }
    }
  },
  
  /**********************************************************************
   * start
   */        
  start: function() { 
    var self = this

    self.logInfo("ObjectServer starting...")
    
    // initialize dbs
    self._initializeDatabaseConnections()

    // initialize http server
    self._initializeHttpServer()    
    
    // initialize top-level fiber for request chain -- self should be first in the middleware chain
    self._initializeFiberMiddleware()

    // initialize CORS middleware
    self._initializeCORSMiddleware() // XXX always?

    // initialize authenticator
    self._initializeAuthenticator()

    // initialize tree of endpoints starting at this
    self._initializeEndpoint(self, self.path)

    // static pages
    self._initializeStaticRoutes() // put this last - you don't want to hit the fs on each req

    self._expressApp.listen(self.port, function() {
      // if configured, switch the process user
      if (self.processUser) {
        try {
          process.setuid(self.processUser)
          self.logInfo("ObjectServer setting process user to: " + self.processUser)
        } catch (e) {
          self.logFatal("ObjectServer failed to set process user to: " + self.processUser + ", exiting")
          process.exit(0)
        }
        if (process.getuid() == 0) {
          self.logFatal("ObjectServer should not be running as root, exiting");
          process.exit(0)
        }
      }

      self.logInfo("ObjectServer listening on port " + self.port)
      self.logInfo("ObjectServer started")
      // XXX should we take a call back to start() or should we try to sync?
    }) 
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
      this.handleError(e, res, true)
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
        this.logInfo("Initializing connection to db: " + this.dbUri)
        this.db = connect(this.dbUri)
    }

    // initialize dbs
    if (this.dbUris) {
      this.dbs = {}
      for (var dbname in this.dbUris) {
        this.logInfo("Initializing connection to db: " + this.dbUris[dbname])
        this.dbs[dbname] = connect(this.dbUris[dbname])
      }
    }
  },

  /**********************************************************************
   * _initializeHttpServer
   */
  _initializeHttpServer: function() {
    var app = express()
    var server
    
    // http or https?
    if (this.sslOptions && this.sslOptions.serverCertPath) {
      var httpsOptions = this._makeHttpsOptions()
      server = https.createServer(httpsOptions, app)
      this.logInfo("ObjectServer creating https server")
    } else {
      server = http.createServer(app)
      this.logInfo("ObjectServer creating http server")
    }

    // disable x-powered-by 
    app.disable('x-powered-by') // XXX maybe later add carbon.io ?

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    // XXX maybe do this after auth?

    this._expressApp = app
    this._server = server
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
          this._handleError(e, res)
        }
      })
    })
  },

  /**********************************************************************
   * _handleError
   */
  _handleError: function(err, res, shouldLog) {
    //          self.log.info(JSON.stringify(e)) // XXX TOTALLY LAME (should not log anyway but leaving to show you)
    if (shouldLog) {
      if (err.stack) {
        console.log(err.stack)
      } else {
        console.log(err)
      }
    }

    if (res) {
      var responseOutput = err
      if (err instanceof this.errors.HttpError) {
        responseOutput = {
          code: err.code,
          description: err.description,
          message: err.message
        }
      }
      res.status(err.code || 500).send(responseOutput)
    }
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
      res.send(self._swaggerDescriptorGenerator.generateSwaggerDescriptor(self)) // XXX every time?
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
        operation = o(operation, Operation)
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
          var err = new self.errors.Forbidden("User does not have permission to perform operation")
          self._handleError(err, res)
        }
      } catch (e) {
        self._handleError(e, res, true)
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
      throw new this.errors.Forbidden(e.message)
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
      this.logWarning(e.stack)
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
  },

  /**********************************************************************
   * _makeHttpsOptions
   */
  _makeHttpsOptions: function() {
    var result = {}
    
    var options = this.sslOptions
    if (options) {
      console.log(options)
      result.key = fs.readFileSync(options.serverKeyPath),
      result.cert = fs.readFileSync(options.serverCertPath),
      result.ca = this._loadCertificates(options.trustedCertsPaths),
      result.requestCert = options.requireClienCerts,
      result.secureProtocol = 'TLSv1_method'
      // XXX rejectUnauthorized or do it how microservice does it? 

      if (options.serverKeyPassword) {
        result.passphrase = options.serverKeyPassword
        delete this.sslOptions.serverKeyPassword // XXX how does this help exactly?
      }
    }

    return result
  },

  /**********************************************************************
   * _loadCertificates
   */
  _loadCertificates: function(spec) {
    var self = this
    if (Array.isArray(spec)) {
      return spec.reduce(function (result, element) {
        return result.concat(self._loadCertificates(element))
      }, [])
    } else if (fs.statSync(spec).isDirectory()) {
      // Be sure to load only files and symlinks, don't recurse down directories
      return self._loadCertificates(
        fs.readdirSync(spec).map(function (f) {
          return path.join(spec, f)
        }).filter(function (f) {
          return fs.statSync(f).isFile()
        })
      )
    } else {
      return fs.readFileSync(spec)
    }
  }
  
})
