var o  = require('atom').o(module)
var oo  = require('atom').oo(module)
var _o = require('bond')._o(module)
var fibers = require('@carbon-io/fibers')
var __ = fibers.__(module)

var os = require('os')
var path = require('path')
var url = require('url')
var bunyan = require('bunyan')

var cluster = require('cluster')
var https = require('https')
var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')

var connect = require('leafnode').connect
var HttpErrors = require('http-errors')
var mongodbUri = require('mongodb-uri')
var ObjectId = require('leafnode').mongodb.ObjectId
var EJSON = require('ejson')
var _ = require('lodash')


/******************************************************************************
 * @class Service
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */
  _type: './Endpoint',

  /**********************************************************************
   * commands
   */
  _startServer: function(options) {
    this.logDebug("Service._startServer")

    // start
    this.start(options)
  },

  _genStaticDocs: function(options) {
    this.logDebug("Service._genStaticDocs")

    var generator = _o('./docgen/StaticDocumentation').createGenerator(options['gen-static-docs'].flavor, this)

    if (options['gen-static-docs']['show-options']) {
      generator._showOptions()
    } else {
      // initialize endpoints (needed for descriptor generation)
      this._initializeHttpServer()
      this._initializeEndpoint(this, this.path, null, [])

      generator.generateDocs(options['gen-static-docs'].out, options['gen-static-docs'].option)
    }

    process.exit(0)
  },

  /**********************************************************************
   * _main
   */
  _main: {
    'start-server': function(options) {
      this._startServer(options)
    },
    'gen-static-docs': function(options) {
      this._genStaticDocs(options)
    },
  },

  /**********************************************************************
   * cmdargs
   */
  cmdargs: { // values are nomnom definitions
    'verbosity': {
      abbr: 'v',
      metavar: 'VERBOSITY',
      property: true,
      choices: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
      help: 'verbosity level (trace | debug | info | warn | error | fatal)'
    },
    'start-server': {
      command: true,
      default: true,
      help: 'start the api server',
      cmdargs: {
        'port': {
          abbr: 'p',
          metavar: 'PORT',
          property: true,
          help: 'port'
        },
        'hostname': {
          abbr: 'n',
          default: '0.0.0.0',   // XXX: this should probably be 127.0.0.1
          metavar: 'HOSTNAME',
          property: true,
          help: 'the hostname to bind'
        },
        'dbUri': {
          abbr: 'd',
          metavar: 'DB_URI',
          property: true,
          help: 'MongoDB connection string'
        },
        'cluster': {
          flag: true,
          property: true,
          help: 'use node cluster'
        },
        'numClusterWorkers': {
          full: 'num-cluster-workers',
          metavar: 'NUM',
          property: true,
          default: 0,
          help: 'fork NUM cluster nodes (default is to fork a worker for each CPU)'
        },
        'exitOnClusterWorkerExit': {
          full: 'exit-on-cluster-worker-exit',
          property: true,
          flag: true,
          help: 'if this flag is set, the master will exit if a work dies, otherwise a warning will be logged'
        },
        'swagger': {
          flag: true,
          property: true,
          help: 'mount swagger endpoints'
        },
        'fiberPoolSize': {
          full: 'fiber-pool-size',
          metavar: 'SIZE',
          property: true,
          default: fibers.getFiberPoolSize(),
          help: 'set the fiber pool size',
          callback: function(fiberPoolSize) {
            fiberPoolSize = parseInt(fiberPoolSize)
            if (!_.isInteger(fiberPoolSize)) {
              return 'fiber-pool-size must be an integer'
            } else if (fiberPoolSize <= 0) {
              return 'fiber-pool-size must be greater than 0'
            }
          }
        }
      }
    },
    'gen-static-docs': {
      command: true,
      help: 'generate docs for the api',
      cmdargs: {
        flavor: {
          default: 'github-flavored-markdown',
          choices: ['github-flavored-markdown', 'api-blueprint', 'aglio'],
          metavar: 'FLAVOR',
          help: 'choose your flavor (github-flavored-markdown | api-blueprint | aglio)'
        },
        out: {
          metavar: 'PATH',
          help: 'path to write static docs to (directory for multiple pages ' +
                '(default: api-docs) and file for single page (default: README.md))'
        },
        // XXX: not too happy with this. need to decide how best to represent flavor specific options
        option: {
          metavar: 'OPTION',
          abbr: 'o',
          list: true,
          help: 'set generator specific options (format is: option[:value](,option[:value])*, can be specified multiple times)'
        },
        'show-options': {
          flag: true,
          help: 'show generatore specific options'
        }
      }
    },
  },

  signalHandlers: {
    'SIGHUP SIGINT SIGQUIT SIGABRT SIGTERM': function(signal) {
      var self = this
      if (cluster.isMaster) {
        self.logDebug('Caught signal ' + signal)
        var exitCode = 0
        try {
          self.stop(function(err) {
            self.logInfo("bye")
            if (err) {
              self.logError(err)
              process.exit(1)
            } else {
              process.exit(0) // XXX 0 or 1?
            }
          })
        } catch (e) {
          self.logError(e)
          process.exit(1)
        }
      } else {
        var self = this
        self.logDebug('Ignoring signal ' + signal)
      }
    }
  },

  /**********************************************************************
   * _C
   */
  _C: function() {
    // cmdargs
    this.cmdargs = {}

    // core
    this.hostname = '0.0.0.0' // XXX: this should probably be 127.0.0.1
    this.port = 8888
    this.description = "This is a Service"
    this.verbosity = 'info', // one of (trace | debug | info | warn | error | fatal)
    this.path = ''
    this.processUser = undefined

    // Mount points
    this.apiRoot = undefined
    this.adminRoot = "/service-admin"

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
    this.middleware = []
    this.publicDirectories = {}
    this.corsEnabled = true
    this._stopping = false

    // ssl
    this.sslOptions = o({ _type: './SslOptions' })

    this.parameterParser = o({ _type: "./ParameterParser" })

    // swagger / docs
    this.generateOptionsMethodsInDocs = false

    // logging
    this._bunyanLog = undefined
    this._loggerConf = { name: 'Service' }
    this._swaggerDescriptorGenerator = o({_type: './SwaggerDescriptorGenerator'})

    // cluster
    this.cluster = false
    this.numClusterWorkers = undefined
    this._workers = undefined

    // fibers
    this.fiberPoolSize = fibers.getFiberPoolSize()
  },

  /**********************************************************************
   * _init
   */
  _init: function() {
    _o('./Endpoint').prototype._init.call(this) // XXX come back
    this._initializeCmdargs()
    this._initializeMainDispatcher()
  },

  /**********************************************************************
   * _initializeCmdargs
   */
  _initializeCmdargs: function() {
    // extend cmdargs with default cmdargs
    if (!this.cmdargs) {
      this.cmdargs = {}
    }
    _.extend(this.cmdargs, this.constructor.prototype.cmdargs) // XXX is this the wrong direction for extend? 
  },

  /**********************************************************************
   * _initializeMainDispatcher
   */
  _initializeMainDispatcher: function() {
    // extend _main with default _main
    if (!this._main) {
      this._main = {}
    }
    _.extend(this._main, this.constructor.prototype._main)
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
        var result = "Service"
        // XXX this doesn't seem to work when assigning module.exports within
        //     the function passed to the "__" operator
        if (require.main.exports === this) {
          var filename = path.basename(require.main.filename)
          result = filename.slice(0, filename.indexOf('.'))
        } else {
          result = "Service"
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
  start: function(options, cb) {
    var self = this

    // If cb supplied run in fiber and then call callback. If no cb supplied assume
    // we are in a fiber
    if (cb) {
      __(function() {
        try {
          self.start(options)
          cb()
        } catch (e) {
          cb(e)
        }
      })
      return
    }

    self.logInfo("Service starting...")
    self.logDebug("Environment: " + JSON.stringify(process.env))
    self.logDebug("Private environment: " + JSON.stringify(process.__carbonenv)) // XXX

    if (self.fiberPoolSize != fibers.getFiberPoolSize()) {
      self.logDebug(`Setting fiber pool size to ${self.fiberPoolSize}`) // XXX
      fibers.setFiberPoolSize(self.fiberPoolSize)
    }

    var initAndListen = function() {
      // initialize http server
      self._initializeHttpServer()

      // initialize top-level fiber for request chain -- self should be first in the middleware chain
      self._initializeFiberMiddleware()

      // initialize CORS middleware
      self._initializeCORSMiddleware() // XXX always?

      // initialize authenticator
      self._initializeAuthenticator()

      // initialize middleware (Service.middleware). XXX Not sure if this is right spot (behind Authenticator)
      self._initializeMiddleware()

      // initialize tree of endpoints starting at this
      self._initializeEndpoint(self, self.path, null, [])

      // static pages
      self._initializeStaticRoutes() // put this last - you don't want to hit the fs on each req

      // initialize secure connection handler
      self._initializeSecureConnectionHandler()

      // initialize dbs
      self._initializeDatabaseConnections()

      // Call doStart and _listen
      if (self.doStart.length === 2) { // no cb but cb expected
        self.sync.doStart(options)
      } else if (self.doStart.length < 2) { // no cb and none expected
        self.doStart(options)
      }
      self.sync._listen()
    }

    if (self.cluster) {
      if (cluster.isMaster) {
        self._workers = {}
        var numWorkers = self.numClusterWorkers === 0 ? os.cpus().length : self.numClusterWorkers
        for (var i = 0; i < numWorkers; i++) {
          var worker = cluster.fork()
          self._workers[worker.id] = worker
        }
        self.logInfo('Service started')
        var isListening = false
        cluster.on('listening', function (worker, addrInfo) {
          if (!isListening) {
            // only log once (event sent for each call to listen in a child)
            self.logInfo('Service listening on ' + addrInfo.port)
            isListening = true
          }
        })
        cluster.on('exit', function (worker, code, signal) {
          if (!self._stopping && self.exitOnClusterWorkerExit) {
            self.logFatal('Service worker ' + worker.id + ' exited unexpectedly, stopping server...')
            self.stop(function (err) {
              if (err) {
                self.logError('Error encountered on stop: ' + err)
              }
              process.exit(1)
            })
          } else {
            if (self._stopping) {
              self.logInfo('Service worker ' + worker.id + ' exited')
            } else {
              self.logError('Service worker ' + worker.id + ' exited unexpectedly, ignoring...')
            }
          }
        })
      } else {
        process.on('message', function(msg) {
          if (msg === 'shutdown') {
            self.logDebug('Got shutdown message')
            self.stop(function (err) {
              if (err) {
                self.logError('Encountered an error: ' + err)
                process.exit(1)
              }
              self.logDebug('Shutdown successfully')
              process.exit(0)
            })
          }
        })
        initAndListen()
      }
    } else {
      initAndListen()
    }
  },

  /**********************************************************************
   * doStart
   */
  doStart: function(options) {},

  /**********************************************************************
   * _listen
   */
  _listen: function(cb) {
    var self = this

    if (!self.port) {
      throw new Error("Service cannot listen on undefined port: " + self.port)
    }

    // If listening on non-priv port switch user now
    if (self.port >= 1024) {
      self._ensureProcessUser()
    }

    // Listen
    self._server.listen(self.port, self.hostname, function() {
      // Switch the process user (may have been done already)
      self._ensureProcessUser()

      if (self.cluster) {
        self.logInfo("Service worker " + cluster.worker.id + " started")
      } else {
        self.logInfo("Service listening on port " + self.port)
        self.logInfo("Service started")
      }

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
      self._server.on('secureConnection', function (tlsSocket) {
        if (!tlsSocket.authorized) {
          self.logWarning("Secure connection not authorized: %j", {
            address: tlsSocket.address(),
            remoteAddress: tlsSocket.remoteAddress,
            remotePort: tlsSocket.remotePort,
            authorizationError: tlsSocket.authorizationError
          })
          tlsSocket.destroy()
        }
      })
    }
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
          this.logInfo("Service switching process user to: " + this.processUser)
        }
      } catch (e) {
        this.logFatal("Service failed to switch process user to: " + this.processUser + ", exiting")
        process.exit(1)
      }
      if (process.getuid() == 0) {
        this.logFatal("Service should not be running as root, exiting. Consider setting " +
                      "the 'processUser' of this Service to a non-root user")
        process.exit(1)
      }
    }
  },

  /**********************************************************************
   * stop
   */
  stop: function(cb) {
    var self = this

    self._stopping = true

    // If cb supplied run in fiber and then call callback. If no cb supplied assume
    // we are in a fiber
    if (cb) {
      __(function() {
        try {
          self.stop()
          cb()
        } catch (e) {
          cb(e)
        }
      })
      return
    }

    self.logInfo("Service stopping...")
    if (self.doStop.length === 1) { // no cb but cb expected
      self.sync.doStop()
    } else if (self.doStop.length < 1) { // no cb and none expected
      self.doStop()
    }

    if (self.cluster && cluster.isMaster) {
      var waitForWorkerExit = function(id, cb) {
        var timeout = setTimeout(function() {
          self.logDebug('Worker ' + id + ' failed to disconnect, killing!')
          cluster.workers[id].kill()
          cb()
        }, 2000)
        cluster.workers[id].on('disconnect', function() {
          self.logDebug('Worker ' + id + ' disconnected, clearing timeout')
          clearTimeout(timeout)
          cb()
        })
        self.logDebug('Sending worker ' + id + ' the signal to shutdown...')
        cluster.workers[id].send('shutdown')
        self.logDebug('Sending worker ' + id + ' the signal to disconnect...')
        cluster.workers[id].disconnect()
        self.logDebug('Waiting for worker ' + id + ' to disconnect...')
      }
      self.logInfo("Service master shutting down workers...")
      for (var id in cluster.workers) {
        if (cluster.workers[id].isDead()) {
          continue
        }
        waitForWorkerExit.sync(id)
        self.logDebug('Worker ' + id + ' exited')
      }
    }
    
    if (!self.cluster || cluster.isWorker) {
      self.logInfo("Service stopping HTTP server")
      self._server.sync.close()
      self.logInfo("Service closing database connections")
      self._closeDatabaseConnections()
    }

    self.logInfo("Service stopped")
  },

  /**********************************************************************
   * doStop
   */
  doStop: function() {},

  /**********************************************************************
   * _authenticate
   */
  _authenticate: function(req, res, next) {
    this.logDebug("Service._authenticate()")

    var self = this
    var user
    // Never auth options requests
    if (req.method.toLowerCase() === "options") {
      this.logDebug("Service._authenticate(): OPTIONS request")
      next()
      return
    }

    if (!this.authenticator) {
      this.logDebug("Service._authenticate(): No authenticator defined")
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
        this.logDebug("Service._authenticate(): User: " + JSON.stringify(user))
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
      self.logInfo("Service initializing connection to db: " +
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
   * _closeDatabaseConnections
   */
  _closeDatabaseConnections: function() {
    var self = this
    var closeConnection = function(db) {
      try {
        self.db.close()
      } catch(e) {
        throw new Error("Could not connect close db: " + e.message)
      }
    }

    // close db
    if (this.db) {
      closeConnection(this.db)
    }

    // close dbs
    if (this.dbs) {
      _.mapValues(this.dbs, function(db) {
        closeConnection(db)
      })
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
    if (this.sslOptions && this.sslOptions.isEnabled()) {
      var httpsOptions = this.sslOptions.asHttpsOptions()
      server = https.createServer(httpsOptions, app)
      this.logInfo("Service creating https server")
    } else {
      server = http.createServer(app)
      this.logInfo("Service creating http server")
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
   * _initializeMiddleware
   */
  _initializeMiddleware: function() {
    var self = this

    if (this.middleware) {
      this.middleware.forEach(function(f) {
        if (!typeof(f) === 'function') {
          throw new Error("Middleware must be functions. Got: " + f)
        }
        self._expressApp.use(f)
      })
    }
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
          req.service = self
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

    // Mount publicDirectories
    if (this.publicDirectories) {
      _.forIn(this.publicDirectories, function(path, mount) {
        if (mount) {
          if (mount[0] !== '/') {
            mount = '/' + mount
          }
          app.use(mount, express.static(path))
        }
      })
    }

    // Mount our swagger directories
    if (this.swagger) {
      this.logInfo('Service mounting swagger endpoints')
      var adminRoot = this.adminRoot || ""
      app.use(adminRoot + "/swagger/app",
        express.static(__dirname + "/../public/admin/swagger-app"))
      app.use(adminRoot + "/swagger/client-resources",
        express.static(__dirname + "/../public/admin/swagger-ui/dist"))

      // Swagger descriptor endpoint
      var self = this
      app.get(adminRoot + "/swagger/service-spec", function (req, res) {
        var descriptor = {}
        try {
          descriptor = self._swaggerDescriptorGenerator.generateSwaggerDescriptor(self, req) // XXX every time?
          res.send(descriptor)
        } catch (e) {
          self._handleError(e, res)
        }
      })
    }
  },

  /**********************************************************************
   * _initializeEndpoint
   */
  _initializeEndpoint: function(endpoint, path, parent, parentEndpointsPath) {
    endpoint.path = path
    endpoint.parent = parent
    endpoint.service = this

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
    if (!operation.service) { 
      throw new Error("No service method on operation object")
    }

    // setup path
    var path = endpoint.path || '/'
    var apiRoot = this.apiRoot
    if (apiRoot) {
      if (path === '/') {
        path = apiRoot
      } else {
        path = apiRoot + path
      }
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
        self.parameterParser.processParameters(req, operation.getAllParameters())

        // Check authorization
        if (!self._isOperationAuthorized(req.user, endpoint, method, req)) {
          var err = new self.errors.Forbidden("User does not have permission to perform operation")
          self._handleError(err, res)
          return
        }

        // Wrap response.json to validate in case where result is written to response
        if (operation.responses) {
          var f = res.json.bind(res)
          res.json = function(body) {
            var output = EJSON.serialize(body)
            if (res.statusCode < 400) { // If not error, validate response
              var response = _.find(operation.responses, function(r) { return r.statusCode === res.statusCode })
              if (response) {
                if (self.validateOutput && endpoint.validateOutput && operation.validateOutput) {
                  // Service and Endpoint and Operation must agree to validate output (any can veto). 
                  var validationResult = EJSON.validate(output, response.schema)
                  if (!validationResult.valid) {
                    throw new self.errors.InternalServerError("Output did not validate against schema: " + 
                                                              EJSON.stringify(output) + " Schema: " + 
                                                              EJSON.stringify(response.schema))
                  }
                }
              }
            }
            return f(output)
          }
        }

        var result = operation.service(req, res)
        self.logDebug("operation.service returned: " + JSON.stringify(result))
        if (result !== undefined) {
          if (!endpoint.sanitizesOutput) {
            // Sanitize the result which will remove any objects and fields the user does
            // not have permission to see.
            //            result = self._sanitize(result, req.user, method !== 'get', true, endpoint.dataAcl)
          }

          // Send the result. EJSON serialization will happen via the res.json wrapper
          // This line will be reached if result is null which will properly result in the response
          // being closed and sent (i.e. res.send(null) which is the same as res.end())
          res.send(result)
          return
        } else {
          // Result is undefined. Here we must assume response has been written to 
          // or *will be* written to by async callback 
        }
      } catch (e) {
        self._handleError(e, res)
        return
      }
    }

    return wrapper
  },

  /**********************************************************************
   * _sanitize
   */
  _sanitize: function(value, user, filterSingleValue, filterArrays, acl) {
    this.logDebug("Service._sanitize(): Pre-sanitize: " + EJSON.stringify(value))
    try {
      var result = _o('./security/ObjectAcl').sanitize(value, user, filterSingleValue, filterArrays, acl)
      this.logDebug("Service._sanitize(): Post-sanitize: " + EJSON.stringify(result))
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
    this.logDebug("Service._isOperationAuthorized(): " +
                  method + " " +
                  endpoint.path + " " +
                  EJSON.stringify(user))

    // If no authenticator then authorization is disabled // XXX positive about this?
    if (!this.authenticator) {
      this.logDebug("Service._isOperationAuthorized(): true - No Authenticator defined")
      return true
    }

    // Never access control options requests
    if (method.toLowerCase() === "options") {
      this.logDebug("Service._isOperationAuthorized(): true - OPTIONS request")
      return true
    }

    // Check for endpoint that allows this method unauthenticated access
    if (endpoint.allowUnauthenticated && endpoint.allowUnauthenticated.indexOf(method.toLowerCase()) !== -1) {
      this.logDebug("Service._isOperationAuthorized(): true - Unauthenticaed access allowed")
      return true
    }

    // If user is null / undefined / false, deny authorization
    if (!user) {
      this.logDebug("Service._isOperationAuthorized(): false - No user")
      return false
    }

    // The root user bypasses all security
    if (this.authenticator.isRootUser(user)) {
      this.logDebug("Service._isOperationAuthorized(): true - Root user")
      return true
    }

    var result = false
    try {
      result = endpoint.isOperationAuthorized(method, user, req)
    } catch (e) {
      this.logWarning(e.stack)
    }

    this.logDebug("Service._isOperationAuthorized(): " + result)
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

    // XXX should this be stderr by default?
    var OutStream = {
      write: function(rec) {
        var clusterId = ' '
        if (self.cluster) {
          if (cluster.isMaster) {
            clusterId = ' <master> '
          } else {
            clusterId = ' <worker ' + cluster.worker.id + '> '
          }
        }
        var isString = typeof(rec.object) === 'string'
        if (rec.level === bunyan.INFO || rec.level === bunyan.WARN) {
          if (isString) {
            console.error('[%s]%s%s: %s', rec.time, clusterId, levels[rec.level], rec.object)
          } else {
            console.error('[%s]%s%s: %j', rec.time, clusterId, levels[rec.level], rec.object)
          }
        } else {
          if (isString) {
            console.error('[%s]%s%s: %s', rec.time, clusterId, levels[rec.level], rec.object)
          } else {
            console.error('[%s]%s%s: %j', rec.time, clusterId, levels[rec.level], rec.object)
          }
          if (self.verbosity === 'trace') {
            if (rec.object) {
              console.error("** TRACE **")
              console.error(rec.object)
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
  },
})
