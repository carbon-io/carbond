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
var HttpErrors = require('http-errors')
var mongodbUri = require('mongodb-uri')
var ObjectId = require('leafnode').BSON.ObjectID
var EJSON = require('mongodb-extended-json')
var _ = require('underscore')

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

    // Register signal handlers 
    this._registerSignalHandlers()

    // start
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
    'dbUri': {
      abbr: "u",
      metavar: "DB_URI",
      property: true,
      help: "MongoDB connection string"
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
    // cmdargs
    this.cmdargs = {}

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
    this.sslOptions = o({ _type: './SslOptions' })

    // json schema
    this.jsonSchemaValidator = o({ _type: "./JsonSchemaValidator" })

    // swagger / docs
    this.generateOptionsMethodsInDocs = false

    // logging
    this._bunyanLog = undefined
    this._loggerConf = { name: 'ObjectServer' }
    this._swaggerDescriptorGenerator = o({_type: './SwaggerDescriptorGenerator'})
  },

  /**********************************************************************
   * _init
   */        
  _init: function() { 
    _o('./Endpoint').prototype._init.call(this) // XXX come back
    this._initializeCmdargs()
  },

  /**********************************************************************
   * _initializeCmdargs 
   */     
  _initializeCmdargs: function() {
    // extend cmdargs with default cmdargs
    if (!this.cmdargs) {
      this.cmdargs = {}
    }
    _.extend(this.cmdargs, this.constructor.prototype.cmdargs)
  },

  /**********************************************************************
   * errors 
   */     
  errors: HttpErrors,

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
   * logTrace
   */       
  logTrace: function(obj) {
    this._log.trace({ object: obj })
  },

  /**********************************************************************
   * logDebug
   */       
  logDebug: function(obj) {
    this._log.debug({ object: obj })
  },

  /**********************************************************************
   * logInfo
   */       
  logInfo: function(obj) {
    this._log.info({ object: obj })
  },

  /**********************************************************************
   * logWarning
   */       
  logWarning: function(obj) {
    this._log.warn({ object: obj })
  },

  /**********************************************************************
   * logError
   */       
  logError: function(obj) {
    this._log.error({ object: obj })
  },

  /**********************************************************************
   * logFatal
   */       
  logFatal: function(obj) {
    this._log.fatal({ object: obj })
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
  start: function(cb) { 
    var self = this
    self.logInfo("ObjectServer starting...")
    self.logDebug("Environment: " + JSON.stringify(process.env))
    self.logDebug("Private environment: " + JSON.stringify(process.__carbonenv)) // XXX

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
    self._initializeEndpoint(self, self.path, null, [])

    // static pages
    self._initializeStaticRoutes() // put this last - you don't want to hit the fs on each req

    // initialize secure connection handler
    self._initializeSecureConnectionHandler()
    
    // Call doStart. If doStart does not want a callback then we will call cb
    if (this.doStart.length === 0) {
      this.doStart()
      // listen
      self._listen(cb)
    } else {
      // Only pass cb if doStart wants it
      this.doStart(function() {
        // listen
        self._listen(cb)
      })
    }

  },

  /**********************************************************************
   * doStart
   */      
  doStart: function(cb) {
    if (cb) {
      cb()
    }
  },

  /**********************************************************************
   * _listen
   */      
  _listen: function(cb) {
    var self = this

    if (!self.port) {
      throw new Error("ObjectServer cannot listen on undefined port: " + self.port)
    }
    
    // If listening on non-priv port switch user now
    if (self.port >= 1024) {
      self._ensureProcessUser()
    }

    // Listen
    self._server.listen(self.port, function() {
      self.logInfo("ObjectServer listening on port " + self.port)

      // Switch the process user (may have been done already)
      self._ensureProcessUser()
      
      self.logInfo("ObjectServer started")
      
      if (cb) {
        cb() 
      }
    }) 
  },

  /**********************************************************************
   * _initializeSecureConnectionHandler
   */      
  _initializeSecureConnectionHandler: function() {
    // If client cert validation is required, check authorization of the cleartextStream.
    // In order to log unauthorized attempts, it must be done this way instead of the
    // rejectUnauthorized option when creating the https.Server
    var self = this
    if (self.sslOptions.serverCertPath && self.sslOptions.requestCert) {
      self._server.on('secureConnection', function (cleartextStream, encryptedStream) {
        if (!cleartextStream.authorized) {
          self.logWarning("Secure connection not authorized: %j", {
            address: cleartextStream.address(),
            remoteAddress: cleartextStream.remoteAddress,
            remotePort: cleartextStream.remotePort,
            authorizationError: cleartextStream.authorizationError
          })
          
          cleartextStream.socket.destroy();
        }
      })
    }
  },

  /**********************************************************************
   * _registerSignalHandlers
   */      
  _registerSignalHandlers: function() {
    var self = this
    var signals = ["SIGHUP", "SIGINT", "SIGQUIT", "SIGABRT", "SIGTERM"] // XXX is this the right set?
    var handler = function() {
      var exitCode = 0
      try {
        self.stop(function(err) {
          self.logInfo("bye")
          if (err) {
            self.logError(e) 
            process.exit(1)
          } else {
            process.exit(0) // XXX 0 or 1?
          }
        })
      } catch (e) {
        self.logError(e) 
        process.exit(1)
      }
    }
                
    signals.forEach(function(signal) {
      process.on(signal, handler)
    })
  },

  /**********************************************************************
   * _ensureProcessUser
   */      
  _ensureProcessUser: function() {
    // if configured, switch the process user
    if (this.processUser) {
      try {
        var oldid = process.getuid()
        process.setuid(this.processUser)
        if (oldid !== process.getuid()) { // only log if it really changes
          this.logInfo("ObjectServer switching process user to: " + this.processUser)
        }
      } catch (e) {
        this.logFatal("ObjectServer failed to switch process user to: " + this.processUser + ", exiting")               
        process.exit(1)
      }
      if (process.getuid() == 0) {
        this.logFatal("ObjectServer should not be running as root, exiting. Consider setting " + 
                      "the 'processUser' of this ObjectServer to a non-root user")
        process.exit(1)
      }
    }
  },

  /**********************************************************************
   * stop
   */        
  stop: function(cb) {
    this.logInfo("ObjectServer stopping...")
    // XXX what should we do here? Close db connections and unlisten?
    // start should reg sig handler to call stop

    // Call doStop. If doStop does not want a callback then we will call cb
    if (this.doStop.length === 0) {
      this.doStop()
      if (cb) {
        cb()
      }   
    } else {
      // only pass cb if doStop wants it
      this.doStop(cb)
    }
  },    

  /**********************************************************************
   * doStop
   */
  doStop: function(cb) {
    if (cb) {
      cb()
    }
  },

  /**********************************************************************
   * _authenticate
   */
  _authenticate: function(req, res, next) {
    this.logDebug("ObjectServer._authenticate()")

    var self = this
    var user
    // Never auth options requests
    if (req.method.toLowerCase() === "options") {
      this.logDebug("ObjectServer._authenticate(): OPTIONS request")
      next()
      return
    }

    if (!this.authenticator) {
      this.logDebug("ObjectServer._authenticate(): No authenticator defined")
      next()
      return
    }

    try {
      // authenticate!
      // check if authenticator is async
      if (this.authenticator.authenticate.length === 2) {
        this.authenticator.authenticate(req, function(e, user) {
          if (e) {
            self._handleError(e, res)
          } else {
            req.user = user
            next()
          }
        })

        return
      } else {
        user = this.authenticator.authenticate(req)
        this.logDebug("ObjectServer._authenticate(): User: " + JSON.stringify(user))
      }

    } catch (e) {
      this._handleError(e, res)
      return
    }

    req.user = user
    next() 
  },

  /**********************************************************************
   * _initializeDatabaseConnections
   */
  _initializeDatabaseConnections: function() { 
    var self = this
    var makeConnection = function(uri) {
      self.logInfo("ObjectServer initializing connection to db: " + 
                   self._secureMongoUriString(uri))
      try {
        self.db = connect(uri)
      } catch(e) {
        throw new Error("Could not connect to " + 
                        self._secureMongoUriString(uri) + 
                        " - Reason: " + e.message)
      }
    }

    // initialize dbs
    if (this.dbUri) {
      makeConnection(this.dbUri)
    }
    
    // initialize dbs
    if (this.dbUris) {
      this.dbs = {}
      for (var dbname in this.dbUris) {
        makeConnection(this.dbUris[dbname])
      }
    }
  },

  /**********************************************************************
   * _initializeHttpServer
   */
  _initializeHttpServer: function() {
    var app = express()
    var server

    // Make sslOptions to SslOptions obj if needed
    var SslOptions = _o('./SslOptions')
    if (!(this.sslOptions instanceof SslOptions)) {
      this.sslOptions = o(this.sslOptions, SslOptions)
    }
    
    this.logTrace(this.sslOptions) // mostly an example of logTrace
    this.logDebug("SslOptions: " + JSON.stringify(this.sslOptions))

    // http or https?
    if (this.sslOptions && this.sslOptions.serverCertPath) {
      var httpsOptions = this.sslOptions.asHttpsOptions()
      server = https.createServer(httpsOptions, app)
      this.logInfo("ObjectServer creating https server")
    } else {
      server = http.createServer(app)
      this.logInfo("ObjectServer creating http server")
    }

    // Set maxSockets to be larger than the default of 5
    http.globalAgent.maxSockets = Infinity

    // Disable x-powered-by 
    app.disable('x-powered-by') // XXX maybe later add carbon.io ?

    app.use(bodyParser.json()) // XXX We will probably not want this back now that we do EJSON parameter love
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
  _handleError: function(err, res) {
    //          self.log.info(JSON.stringify(e)) // XXX TOTALLY LAME (should not log anyway but leaving to show you)
    if (err instanceof this.errors.HttpError) {
      if (res) {
        var responseOutput = {
          code: err.code,
          description: err.description,
          message: err.message
        }

        if (err.code == 500) {
          this.logError(err.stack)
        }

        res.status(err.code || 500).send(responseOutput)        
      }
    } else {
      if (err.stack) {
        this.logError(err.stack)
      } else {
        this.logError(err)
      }

      // also send anonymous InternalServiceError
      res.status(500).send(new this.errors.InternalServerError("Unspecified internal error. Please contact " +
                                                                "your administrator. More details in logs."))
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
      var descriptor = {}
      try {
        descriptor = self._swaggerDescriptorGenerator.generateSwaggerDescriptor(self) // XXX every time?
      } catch (e) {
        this._handleError(e, res)
      }
      res.send(descriptor)
    })
  },
   
  /**********************************************************************
   * _initializeEndpoint
   */
  _initializeEndpoint: function(endpoint, path, parent, parentEndpointsPath) {
    endpoint.path = path
    endpoint.parent = parent
    endpoint.objectserver = this
    // define endpoints for this node
    this._defineExpressRoutesForEndpoint(this._expressApp, endpoint, parentEndpointsPath)

    // recurse
    this._initializeEndpoints(endpoint.endpoints, path, endpoint, parentEndpointsPath.concat(endpoint))
  },

  /**********************************************************************
   * _initializeEndpoints
   */
  _initializeEndpoints: function(endpoints, path, parent, parentEndpointsPath) {
    path = path || this.path
    if (endpoints) {
      for (var endpointPath in endpoints) {
        this._initializeEndpoint(endpoints[endpointPath], 
                                 path + "/" + endpointPath,
                                 parent,
                                 parentEndpointsPath)
                                 
      }
    }
  },
  
  /**********************************************************************
   * _defineExpressRoutesForEndpoint
   */        
  _defineExpressRoutesForEndpoint: function(app, endpoint, parentEndpointsPath) {
    var self = this
    endpoint.supportedMethods().forEach(function(method) {
      self._defineExpressRouteForOperation(app, method, endpoint, endpoint[method], parentEndpointsPath)
    })
  },

  /**********************************************************************
   * _defineExpressRouteForOperation
   */        
  _defineExpressRouteForOperation: function(app, method, endpoint, operation, parentEndpointsPath) {
    if (!operation.service) { // XXX leave this for now
      console.log("ERROR ***** this should not happen contact will")
      console.log(method)
      console.log(typeof(operation))
      return
    }

    operation.objectserver = this // XXX this the right place to do this?
    // setup path
    var path = endpoint.path || ''
    if (path === '') {
      path = '/'
    }

    // make wrapper fn
    var wrapper = this._makeOperationWrapper(operation, endpoint, method, parentEndpointsPath)
    
    // create the express route
    app[method](path,
                this._authenticate.bind(this),  // should we move this into op wrapper?
                wrapper)
  },

  /**********************************************************************
   * _makeOperationWrapper
   */
  _makeOperationWrapper: function(operation, endpoint, method) {
    var self = this

    var wrapper = function(req, res) {
      // First process and validate the parameters. Do this before authorization in 
      // case authorization needs to look at formally defined request 'parameters'.
      try {
        self.logInfo("HTTP Request: " + req.method + " " + req.originalUrl)

        // It is important that this comes before we check self._isOperationAuthorized
        // since acls may need to examine parameters.
        self._processAndValidateParameters(req, operation, endpoint)
        
        // Check authorization
        if (!self._isOperationAuthorized(req.user, endpoint, method, req)) {
          var err = new self.errors.Forbidden("User does not have permission to perform operation")
          self._handleError(err, res)
          return
        }

        var result = operation.service(req, res)
        if (result !== undefined) {
          if (!endpoint.sanitizesOutput) {
            // Sanitize the result which will remove any objects and fields the user does
            // not have permission to see.
            result = self._sanitize(result, req.user, method !== 'get', true, endpoint.dataAcl) 
          }
          // Send the result.
          res.send(EJSON.inflate(result))
          return
        } else {
          // No return value case.
          var operationArity = endpoint[method].length
          // If fn just takes request assume void function called without error and return 200
          if (operationArity === 1) {
            res.status(200)
            return
          } 
          // Else assume response will be written to.
        }         
      } catch (e) {
        self._handleError(e, res)
        return 
      }
    }
    
    return wrapper
  },

  /**********************************************************************
   * _processAndValidateParameters
   */
  _processAndValidateParameters: function(req, operation, endpoint) {
    // set the parameters property on the request object, initialized to empty
    req.parameters = {}
    
    var parameterDefinitions = operation.getAllParameters()
    this.logDebug("Parameter definitions for operation: " + JSON.stringify(parameterDefinitions))
    for (var parameterName in parameterDefinitions) {
      this._processAndValidateParameter(req, parameterDefinitions[parameterName])
      this.logDebug("ObjectServer._processAndValidateParameters(): Value of final parameter '" + parameterName +
                    "' is: " + EJSON.stringify(req.parameters[parameterName]))
    }
  },

  /**********************************************************************
   * _processAndValidateParameter
   */
  _processAndValidateParameter: function(req, parameterDefinition) {
    var name = parameterDefinition.name
    var rawValue = undefined
    try {
      rawValue = parameterDefinition.extractParameterValueFromRequest(req)
      this.logDebug("ObjectServer._processAndValidateParameter(): Extracting raw value of '" +
                    name + "': " + JSON.stringify(rawValue))
    } catch (e) {
      throw new this.errors.InternalServerError(e.message)
    }

    if (rawValue === undefined) {
      if (parameterDefinition.required) {
        throw new this.errors.BadRequest("Missing required parameter '" + name + "'")
      } 

      var value = rawValue
      if (schema) { // indicates we wanted conversion to JSON so make null
        value = null
      }
      
      req.parameters[name] = value
      return
    }

    var schema = parameterDefinition.schema
    if (schema) {
      this.logDebug("ObjectServer._processAndValidateParameter(): Schema for '" + 
                    name + 
                    "' is: " + 
                    EJSON.stringify(schema))

      // Specifying a schema is saying you want the parameter parsed as EJSON
      var value = undefined
      try {
        if (parameterDefinition.location === "body") { 
          // This means body parser was used and it is already JSON
          // Attempts to not use the body parser did not work out. Everything
          // comes back as {}
          value = EJSON.deflate(rawValue) // XXX deflate can silently fail here (ex bad $date)
        } else {
          if (typeof(rawValue) === 'string') {
            rawValue = rawValue.trim()
            if (schema.type === 'ObjectId') {
              if (rawValue[0] !== '{') {
                if (ObjectId.isValid(rawValue)) {
                  value = new ObjectId(rawValue)
                } 
              } else {
                value = EJSON.parse(rawValue)
              }
            } else if (schema.type === 'string') { 
              // Be forgiving of unquoted strings. 
              // (1) If schema defines parameter as a string and the value 
              // is a string without quotes, auto-wrap. Otherwise just EJSON parse
              // ** note this converts numbers to strings. XXX do we want this?
              var n = rawValue.length - 1
              if (rawValue[0] !== "'" && rawValue[0] !== '"' && rawValue[n] !== "'" && rawValue[n] !== '"') {
                // unquoted string
                value = EJSON.parse('"' + rawValue + '"')
              } else {
                // Parse arbitrary EJSON
                value = EJSON.parse(rawValue)
              }
            } else {
              var numberRegex = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/
              // (2) Regardless of type if looks like unquoted string then let it be, otherwise parse
              if (rawValue !== "true" && rawValue !== "false" && rawValue !== "null" && rawValue !== "undefined" &&
                  rawValue[0] !== '.' && rawValue[0] !== '"' && rawValue[0] !== "'" && rawValue[0] !== "{" &&
                  rawValue[0] !== "[" && !numberRegex.test(rawValue)) 
              {
                // unquoted string
                value = EJSON.parse('"' + rawValue + '"')
              } else {
                // Parse arbitrary EJSON
                value = EJSON.parse(rawValue)
              }
            }
          } else { // not a string, so it came from a default configured on the OperationParameter
            value = rawValue
          }
        }
      } catch (pe) {
        throw new this.errors.BadRequest("Parsing failed for parameter '" + name + "'. Reason: " + 
                                         pe.message)
      }

      // Validate the schema with the JSON Schema validator
      var schemaValidator = this.jsonSchemaValidator
      var validationResult = schemaValidator.validate(EJSON.inflate(value), schema)
      if (!validationResult.valid) {
        throw new this.errors.BadRequest("Validation failed for parameter '" + name + "'. Reason: " + 
                                         validationResult.error + ". Schema: " +
                                         EJSON.stringify(schema) + ". Value: " +
                                         EJSON.stringify(rawValue))
      }

      req.parameters[name] = value
    } else {
      req.parameters[name] = rawValue 
    }
  },

  /**********************************************************************
   * _sanitize
   */
  _sanitize: function(value, user, filterSingleValue, filterArrays, acl) {
    this.logDebug("ObjectServer._sanitize(): Pre-sanitize: " + EJSON.stringify(value))
    try {
      var result = _o('./security/ObjectAcl').sanitize(value, user, filterSingleValue, filterArrays, acl)
      this.logDebug("ObjectServer._sanitize(): Post-sanitize: " + EJSON.stringify(result))
      return result
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
  _isOperationAuthorized: function(user, endpoint, method, req) {
    this.logDebug("ObjectServer._isOperationAuthorized(): " + 
                  method + " " + 
                  endpoint.path + " " + 
                  EJSON.stringify(user))

    // If no authenticator then authorization is disabled // XXX positive about this?
    if (!this.authenticator) {
      this.logDebug("ObjectServer._isOperationAuthorized(): true - No Authenticator defined")
      return true
    }

    // Never access control options requests
    if (method.toLowerCase() === "options") {
      this.logDebug("ObjectServer._isOperationAuthorized(): true - OPTIONS request")
      return true
    }

    // Check for endpoint that allows this method unauthenticated access
    if (endpoint.allowUnauthenticated && endpoint.allowUnauthenticated.indexOf(method.toLowerCase()) !== -1) {
      this.logDebug("ObjectServer._isOperationAuthorized(): true - Unauthenticaed access allowed")
      return true
    }

    // If user is null / undefined / false, deny authorization
    if (!user) {
      this.logDebug("ObjectServer._isOperationAuthorized(): false - No user")
      return false
    }

    // The root user bypasses all security
    if (this.authenticator.isRootUser(user)) {
      this.logDebug("ObjectServer._isOperationAuthorized(): true - Root user")
      return true
    }

    var result = false
    try {
      result = endpoint.isOperationAuthorized(method, user, req)
    } catch (e) {
      this.logWarning(e.stack)
    } 

    this.logDebug("ObjectServer._isOperationAuthorized(): " + result)
    return result
  },

  /**********************************************************************
   * _secureMongoUriString
   */
  _secureMongoUriString: function(uri) {
    var obj = mongodbUri.parse(uri)
    obj.username = "xxx"
    obj.password = "yyy"
    return mongodbUri.format(obj)
  },

  /**********************************************************************
   * _createLogger
   */
  _createLogger: function() {
    var self = this
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
        var isString = typeof(rec.object) === 'string'
        if (rec.level === bunyan.INFO || rec.level === bunyan.WARN) {
          if (isString) {
            console.log('[%s]  %s: %s', rec.time, levels[rec.level], rec.object)
          } else {
            console.log('[%s]  %s: %j', rec.time, levels[rec.level], rec.object)
          }
        } else {
          if (isString) {
            console.log('[%s] %s: %s', rec.time, levels[rec.level], rec.object)
          } else {
            console.log('[%s] %s: %j', rec.time, levels[rec.level], rec.object)
          }
          if (self.verbosity === 'trace') {
            if (rec.object) {
              console.log("** TRACE **")
              console.log(rec.object)
            }
          }
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
