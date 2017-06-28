var cluster = require('cluster')
var EventEmitter = require('events')
var http = require('http')
var https = require('https')
var os = require('os')
var path = require('path')
var url = require('url')
var util = require('util')

var bodyParser = require('body-parser')
var bunyan = require('bunyan')
var cors = require('cors')
var express = require('express')
var enableDestroy = require('server-destroy')

var _ = require('lodash')

var mongodbUri = require('mongodb-uri')

var core = require('@carbon-io/carbon-core')
var EJSON = core.ejson
var HttpErrors = core.HttpErrors
var ObjectId = core.leafnode.mongodb.ObjectId
var _o = core.bond._o(module)
var connect = core.leafnode.connect
var fibers = core.fibers
var logging = core.logging
var o  = core.atom.o(module)
var oo  = core.atom.oo(module)

var __ = fibers.__(module)

DEFAULT_ENV = _o('env:NODE_ENV') || 'production'

/******************************************************************************
 * @class Service
 */
var Service = oo({

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
    this.verbosity = 'warn' // suppress info logging

    var generator = _o('./docgen/StaticDocumentation').createGenerator(
      options['gen-static-docs'].flavor,
      this,
      options['gen-static-docs'].includeUndocumented)

    if (options['gen-static-docs']['show-options']) {
      generator._showOptions()
    } else {
      // initialize endpoints (needed for descriptor generation)
      // XXX should we need to know this level of detail on what to initialize?
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
      help: 'verbosity level (trace | debug | info | warn | error | fatal)',
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
          help: 'fork NUM cluster nodes (default is "0" to fork a worker for each CPU)'
        },
        'exitOnClusterWorkerExit': {
          full: 'exit-on-cluster-worker-exit',
          property: true,
          flag: true,
          help: 'if this flag is set, the master will exit if a work dies, otherwise ' +
                'a warning will be logged'
        },
        'swagger': {
          flag: true,
          property: true,
          help: 'mount swagger endpoints'
        },
        'enableBusyLimiter': {
          full: 'enable-busy-limiter',
          flag: true,
          property: true,
          help: 'send 503 responses when the node process becomes too "busy"'
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
        },
        'env': {
          metavar: 'MODE',
          property: true,
          default: DEFAULT_ENV,
          help: 'set the mode in which your server will run, e.g., ' +
                '"production" or "development" (note: this will default '+
                ' to the value of NODE_ENV environment variable if ' +
                'present)'
        },
        'gracefulShutdown': {
          full: 'graceful-shutdown',
          metavar: '[true/false]',
          property: true,
          choices: ['yes', 'no', 'y', 'n', true, false, 1, 0],
          transform: function(val) {
            switch(val) {
              case 'yes':
              case 'y':
              case true:
              case 1:
                return true
                break
              default:
                // pass    
            }
            return false
          },
          help: 'wait for all connections to terminate before exiting (note: if ' +
                '"--env=production" this will default to "true", unless ' +
                'explicitly specified, and "false" otherwise)  [' +
                DEFAULT_ENV === 'production' + ']'
        },
        'serverSocketTimeout': {
          full: 'server-socket-timeout',
          metavar: 'MSECS',
          default: 120000,
          property: true,
          help: 'set the socket timeout for all incoming connections',
          callback: function(timeout) {
            if (parseInt(timeout) != timeout || timeout < 0) {
              return "server-timeout must be a positive integer"
            }
          }
        }
      }
    },
    'gen-static-docs': {
      command: true,
      help: 'generate docs for the api',
      processEnvironmentVariables: false,
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
        includeUndocumented: {
          full: "include-undocumented",
          flag: true,
          help: "Ignore all 'noDocument' flags"
        },
        'show-options': {
          flag: true,
          help: 'show generator specific options'
        }
      }
    },
  },

  _stopHandler: function(err) {
    this.logInfo("bye")
    if (err) {
      this.logError(err)
      process.exit(1)
    } else {
      process.exit(0) // XXX 0 or 1?
    }
  },

  signalHandlers: {
    'SIGHUP SIGINT SIGQUIT SIGABRT SIGTERM': function(signal) {
      var self = this
      if (cluster.isMaster) {
        self.logDebug('Caught signal ' + signal)
        var exitCode = 0
        try {
          self.stop(_.bind(self._stopHandler, self))
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
    this.errorHandlingMiddleware = []
    this.publicDirectories = {}
    this.corsEnabled = true
    this._stopping = false
    this._stopped = false

    // events
    this._eventEmitter = new EventEmitter()
    this._eventEmitter.setMaxListeners(128) // XXX: make this configurable

    // ssl
    this.sslOptions = o({ _type: './SslOptions' })

    this.parameterParser = o({ _type: "./ParameterParser" })

    // swagger / docs
    this.generateOptionsMethodsInDocs = false
    this.defaultDocgenOptions = {
      "github-flavored-markdown": {},
      "api-blueprint": {},
      "aglio": {}
    }

    // logging
    this._swaggerDescriptorGenerator = o({_type: './SwaggerDescriptorGenerator'})

    // cluster
    this.cluster = false
    this.numClusterWorkers = undefined
    this._workers = undefined

    // limiters
    this.busyLimiter = undefined
    this.defaultBusyLimiterClass = _o('./limiter/TooBusyLimiter')
    this.limiter = undefined

    // fibers
    this.fiberPoolSize = fibers.getFiberPoolSize()

    // mode
    this.env = DEFAULT_ENV

    // socket timeout/destruction
    this.gracefulShutdown = DEFAULT_ENV === 'production'
    this.serverSocketTimeout = undefined
  },

  /**********************************************************************
   * _init
   */
  _init: function() {
    _o('./Endpoint').prototype._init.call(this) // XXX come back
    this._configureLogger()
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
   * maskSecret
   */
  maskSecret: function(str) {
    // XXX: if in dev, this should return the str, else, return mask
    return '****'
  },

  /**********************************************************************
   * logger
   */
  logger: o({
    _type: core.logging.Logger,
    parent: 'carbon-io.carbond',
    config: {
      name: module,
      level: 'INFO'
    }
  }),
  
  /**********************************************************************
   * _configureLogger
   */
  _configureLogger: function(verbosity) {
    var self = this
    
    var clusterId = undefined
    if (self.cluster) {
      if (cluster.isMaster) {
        clusterId = ' <master> '
      } else {
        clusterId = ' <worker ' + cluster.worker.id + '> '
      }
    }
    var template = undefined
    if (_.isString(clusterId)) {
      template = '[{{{time}}}]{{{clusterId}}}{{{hostname}}}:{{{name}}}:{{{level}}}: {{{msg}}}\n'
    } else {
      template = '[{{{time}}}] {{{hostname}}}:{{{name}}}:{{{level}}}: {{{msg}}}\n'
    }
    verbosity = _.isNil(verbosity) ? this.verbosity : verbosity
    var config =  {
      level: verbosity,
      streams: [
        o({
          _type: logging.streams.Template,
          template: template
        })
      ]
    }
    if (_.isString(clusterId)) {
      config.clusterId = clusterId
    }
    logging.configure({
      'carbon-io.carbond.*': config
    })
  },

  /**********************************************************************
   * logTrace
   */
  logTrace: function() {
    this.logger.trace.apply(this.logger, arguments)
  },

  /**********************************************************************
   * logDebug
   */
  logDebug: function() {
    this.logger.debug.apply(this.logger, arguments)
  },

  /**********************************************************************
   * logInfo
   */
  logInfo: function() {
    this.logger.info.apply(this.logger, arguments)
  },

  /**********************************************************************
   * logWarning
   */
  logWarning: function() {
    this.logger.warn.apply(this.logger, arguments)
  },

  /**********************************************************************
   * logError
   */
  logError: function() {
    this.logger.error.apply(this.logger, arguments)
  },

  /**********************************************************************
   * logFatal
   */
  logFatal: function() {
    this.logger.fatal.apply(this.logger, arguments)
  },
  
  /**********************************************************************
   * @method on
   *
   * Register an event callback. 
   *
   * @param {String} event - [choices: "start", "stop"]
   * @param {Function} listener - callback to fire when `event` occurs
   */
  on: function(event, listener) {
    return this._eventEmitter.on(event, listener)
  },
  
  /**********************************************************************
   * @method once
   *
   * Register an event callback that executes once. 
   *
   * @param {String} event - the event type [choices: "start", "stop"]
   * @param {Function} listener - callback to fire when `event` occurs
   */
  once: function(event, listener) {
    return this._eventEmitter.once(event, listener)
  },

  /**********************************************************************
   * @method removeAllListeners
   *
   * Remove all listeners. If `event` is passed, remove all events for
   * that specific event (or events).
   *
   * @param {String} [event...] - the event type [choices: "start", "stop"]
   */
  removeAllListeners: function() {
    return this._eventEmitter.removeAllListeners.apply(
      this._eventEmitter, arguments)
  },

  /**********************************************************************
   * @method removeListener
   *
   * Remove a specific listener for a particular event.
   *
   * @param {String} [event..] - the event type [choices: "start", "stop"]
   * @param {Function} listener - callback to fire when `event` occurs
   */
  removeListener: function(event, listener) {
    return this._eventEmitter.removeListener(event, listener)
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

    self._configureLogger()

    self.logInfo('Service starting...')
    self.logDebug('Environment:', JSON.stringify(process.env))
    self.logDebug('Private environment:', JSON.stringify(process.__carbonenv)) // XXX

    if (self.fiberPoolSize != fibers.getFiberPoolSize()) {
      self.logDebug(`Setting fiber pool size to ${self.fiberPoolSize}`) // XXX
      fibers.setFiberPoolSize(self.fiberPoolSize)
    }

    this.gracefulShutdown =  _.get(options, 'start-server', {}).gracefulShutdown || this.env === 'production'
    
    var initAndListen = function() {
      // initialize http server
      self._initializeHttpServer()

      // initialize top-level fiber for request chain -- self should be first in the middleware chain
      self._initializeFiberMiddleware()

      // initialize authenticator
      self._initializeAuthenticator()

      // XXX: initialize limiter
      // self._initializeLimiter()

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

      // Call doStart
      if (self.doStart.length === 2) { // no cb but cb expected
        self.sync.doStart(options)
      } else if (self.doStart.length < 2) { // no cb and none expected
        self.doStart(options)
      }

      // initialize error handling middleware last
      self._initializeErrorHandlingMiddleware()

      self.sync._listen()

      // emit start event
      self._eventEmitter.emit('start')
    }

    try {
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
          cluster.on('message', function(msg) {
            self.logDebug('Got message: ' + JSON.stringify(msg))
            switch (msg.type) {
              case 'error':
                switch (msg.msg) {
                  case 'initAndListen':
                    if (!(msg.id in self._workers)) {
                      self.logError('Received initAndListen error from unknown worker: ' + msg.id)
                      return
                    }
                    self.logDebug('Number of workers: ' + self._workers.length)
                    delete self._workers[msg.id]
                    if (_.keys(self._workers).length === 0) {
                      self.logDebug('All workers dead, stopping.')
                      return self.stop(_.bind(self._stopHandler, self))
                    }
                    break
                  default:
                    self.logError('Received unknown error message: ' + msg.msg)
                    break
                }
                break
              default:
                self.logError('Received unknown message type: ' + msg.type)
                break
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
    } catch (e) {
      self.logError(e.message)
      if (self.cluster && cluster.isWorker) {
        process.send({'type': 'error', 'msg': 'initAndListen', 'id': cluster.worker.id})
      }
      self.stop()
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
      throw new Error('Service cannot listen on undefined port: ' + self.port)
    }

    // If listening on non-priv port switch user now
    if (self.port >= 1024) {
      self._ensureProcessUser()
    }

    var listeningHandler = function() {
      // Switch the process user (may have been done already)
      self._ensureProcessUser()

      if (self.cluster) {
        self.logInfo('Service worker ' + cluster.worker.id + ' started')
      } else {
        self.logInfo('Service listening on port ' + self.port + ' (mode: "' + self.env + '")')
        self.logInfo('Service started')
      }

      if (cb) {
        cb()
      }
    }

    var retryCount = 0

    // FIXME
    // retry on EADDRINUSE
    self._server.on('error', function(e) {
      if (retryCount++ < 3 && e.code === 'EADDRINUSE') {
        self.logError('caught EADDRINUSE for ' + self.serviceName + '. retrying...')
        setTimeout(function() {
          self._server.listen(self.port, self.hostname, listeningHandler)
        }, 1000)
      } else {
        cb(e)
      }
    })

    // enable server destroy if desired
    if (!self.gracefulShutdown) {
      this.logInfo('enabling destroy')
      enableDestroy(self._server)
    }

    // Listen
    self._server.listen(self.port, self.hostname, listeningHandler)
  },

  /**********************************************************************
   * _initializeSecureConnectionHandler
   */
  _initializeSecureConnectionHandler: function() {
    // If client cert validation is required, check authorization of the cleartextStream.
    // In order to log unauthorized attempts, it must be done this way instead of the
    // rejectUnauthorized option when creating the https.Server

    // XXX: how do we use "rejectUnauthorized" and log at the same time?

    var self = this
    if (self.sslOptions.serverCertPath && self.sslOptions.requestCert) {
      self._server.on('secureConnection', function (tlsSocket) {
        if (!tlsSocket.authorized) {
          self.logWarning(util.format("Secure connection not authorized: %j", {
            address: tlsSocket.address(),
            remoteAddress: tlsSocket.remoteAddress,
            remotePort: tlsSocket.remotePort,
            authorizationError: tlsSocket.authorizationError
          }))
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

    if (cluster.isMaster || !(self._stopping || self._stopped)) {
      self._stopping = true

      // emit stop event
      self._eventEmitter.emit('stop')

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
        try {
          if (!self.gracefulShutdown) {
            self.logInfo('destroying')
            self._server.sync.destroy()
          } else {
            self._server.sync.close()
          }
        } catch (e) {
          if (e.message != 'Not running') {
            throw e
          }
          // ignore
        }
        self.logInfo("Service closing database connections")
        try {
          self._closeDatabaseConnections()
        } catch (e) {
          // ignore
        }
      }

      self.logInfo("Service stopped")

      self._stopped = true
      self._stopping = false
    }
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

    var logAuthenticate = function(user) {
      self.logDebug("Service._authenticate(): User: " + JSON.stringify(user))
    }

    try {
      // authenticate!
      // check if authenticator is async
      if (this.authenticator.authenticate.length === 2) {
        this.authenticator.authenticate(req, function(e, user) {
          if (!e) {
            req.user = user
            logAuthenticate(user)
          } 
          return next(e)
        })
      } else {
        req.user = this.authenticator.authenticate(req)
        logAuthenticate(req.user)
      }

    } catch (e) {
      return next(e)
    }

    return next()
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
        var connection = connect(uri)
        connection._connectionUri = uri
        return connection
      } catch(e) {
        throw new Error("Could not connect to " +
                        self._secureMongoUriString(uri) +
                        " - Reason: " + e.message)
      }
    }

    // initialize dbs
    if (this.dbUri) {
      this.db = makeConnection(this.dbUri)
    }

    // initialize dbs
    if (this.dbUris) {
      this.dbs = {}
      for (var dbname in this.dbUris) {
        this.dbs[dbname] = makeConnection(this.dbUris[dbname])
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
        db.close()
        self.logInfo("Service closing connection to db: " +
                     self._secureMongoUriString(db._connectionUri))
      } catch(e) {
        self.logInfo("Could not close connection to db: " +
                     self._secureMongoUriString(db._connectionUri))
        throw new Error("Could not connect db: " + e.message)
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
   * _initializeBusyLimiter
   */
  _initializeBusyLimiter: function(app) {
    if (!this.enableBusyLimiter) return

    if (_.isUndefined(this.busyLimiter)) {
      this.busyLimiter = o({
        _type: this.defaultBusyLimiterClass
      })
    }

    if (_.isObjectLike(this.busyLimiter) && !(this.busyLimiter instanceof _o('./limiter/Limiter'))) {
      if (!('_type' in this.busyLimiter)) {
        this.busyLimiter._type = this.defaultBusyLimiterClass
      }
      this.busyLimiter = o(this.busyLimiter)
    }
    this.busyLimiter.initialize(this, this)
    app.use(this.busyLimiter.process.bind(this.busyLimiter))
  },

  /**********************************************************************
   * _initializeHttpServer
   */
  _initializeHttpServer: function() {
    var app = express()
    var server = undefined

    // set express to run in the appropriate mode
    app.set('env', this.env)

    // Make sslOptions to SslOptions obj if needed
    var SslOptions = _o('./SslOptions')
    if (!(this.sslOptions instanceof SslOptions)) {
      this.sslOptions = o(this.sslOptions, SslOptions)
    }

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

    // set server timeout
    server.setTimeout(this.serverSocketTimeout)

    // Set maxSockets to be larger than the default of 5
    http.globalAgent.maxSockets = Infinity

    // Disable x-powered-by
    app.disable('x-powered-by') // XXX maybe later add carbon.io ?

    // Annotate incoming requests with the time at which they are received
    app.use(function(req, res, next) {
      req.timestamp = Date.now()
      return next()
    })

    // NOTE: {@link Limiter#preAuth} is ignored in this case
    this._initializeBusyLimiter(app)

    app.use(bodyParser.json()) // XXX We will probably not want this back now that we do EJSON parameter love
    app.use(bodyParser.urlencoded({ extended: true }))
    // XXX maybe do this after auth?

    this._expressApp = app
    this._server = server
  },

  /**********************************************************************
   * @method _initializeLimiter
   *
   * @protected
   *
   * @param {Limiter) [limiter=this.limiter] - limiter to initialize
   * @param {Service|Endpoint|Operation} [node=this] - the node to initialize this limiter with
   *
   * @returns {Limiter}
   *
   * @throws TypeError
   */
  _initializeLimiter: function(limiter, node) {
    if (!_.isUndefined(limiter)) {
      node = arguments.length < 2 ? this : node
      limiter = arguments.length < 1 ? this.limiter : limiter
      // @todo allow for cascading lazy instantiation
      /*
      if (_.isObjectLike(limiter) && !(limiter instanceof Limiter)) {
        if (!('_type' in limiter)) {
          throw new TypeError('cannot initialize untyped limiter')
        }
      }
      */
      limiter.initialize(this, node)
    }

    return limiter
  },

  /**********************************************************************
   * _initializeMiddleware
   */
  _initializeMiddleware: function() {
    var self = this

    if (this.middleware) {
      this.middleware.forEach(function(f) {
        if (!typeof(f) === 'function') {
          throw new Error("Middleware must be a function. Got: " + f)
        }
        if (f.length != 3) {
          throw new Error("Middleware functions must take 3 arguments " +
                          "(i.e., 'function(req, res, next)'). Got: " + 
                          f.toString())
        }
        self._expressApp.use(f)
      })
    }
  },

  /**********************************************************************
   * _initializeErrorHandlingMiddleware
   */
  _initializeErrorHandlingMiddleware: function() {
    var self = this

    // user defined error handlers
    if (this.errorHandlingMiddleware) {
      this.errorHandlingMiddleware.forEach(function(f) {
        if (!typeof(f) === 'function') {
          throw new Error("Error-handling middleware must be a function. " +
                          "Got: " + f)
        }
        if (f.length != 4) {
          throw new Error("Error-handling middleware functions must take " +
                          "4 arguments (i.e., 'function(err, req, res, " +
                          "next)'). Got: " + f.toString())
        }
        self._expressApp.use(f)
      })
    }
    
    // if in development mode, 
    if (this.env != 'development') {
      // top-level error handler
      this._expressApp.use(function(err, req, res, next) {
        if (res.headersSent) {
          // if the response has already been started, then delegate to the
          // default express error handler
          return next(err)
        }
        self._handleError(err, res)
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
          next(e)
        }
      }, function() {/* detach */})
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
  _initializeCORSMiddleware: function(endpoint) {
    var self = this
    var mw = function(req, res, next) { return next() }

    if (this.corsEnabled) {
      var optionsFn = function(req, cb) {
        var options = {
          origin: '*',
          methods: _.map(
            endpoint.supportedMethods(), function(method) { return method.toUpperCase() }),
          allowHeaders: [ // XXX: these should be customizable at the endpoint level
            'Authorization',
            'Location',
            'Content-Length',
            'X-Requested-With',
            'Content-Type'
          ],
          exposedHeaders: [ // XXX: these should be customizable at the operation level
            'Location'
          ],
          preflightContinue: true // allow customization of OPTIONS response
        }
        if (self.authenticator) {
          var authHeaders = self.authenticator.getAuthenticationHeaders()
          if (authHeaders) {
            options.allowHeaders = options.allowHeaders.concat(authHeaders)
          }
        }
        return cb(null, options)
      }
      mw = cors(optionsFn)
    }

    return mw
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
      app.get(adminRoot + "/swagger/service-spec", function (req, res, next) {
        var descriptor = {}
        try {
          descriptor = self._swaggerDescriptorGenerator.generateSwaggerDescriptor(self, req) // XXX every time?
          return res.send(descriptor)
        } catch (e) {
          return next(e)
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
    this._initializeLimiter(endpoint.limiter, endpoint)
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

    // build argument list (XXX: should _authenticate be moved into the wrapper?)
    var args = [path, this._authenticate.bind(this), wrapper]

    // insert endpoint and operation limiters if appropriate
    // @todo: revisit. should be inserting endpoint level limiters/authenticators using app.all
    //        instead of inserting before each operation
    // @todo: allow multiple limiters (outside of limiter chain) for pre/post auth mixing
    var spliceIdx = 1
    var endpointLimiter = endpoint.limiter
    var operationLimiter = this._initializeLimiter(operation.limiter, operation)
    if (!_.isUndefined(endpointLimiter)) {
      if (!endpointLimiter.preAuth) {
        args.splice(spliceIdx + 1, 0, endpointLimiter.process.bind(endpointLimiter))
        if (!_.isUndefined(operationLimiter) && !operationLimiter.preAuth) {
          // ensure operation limiter comes after endpoint limiter if they are both preAuth
          spliceIdx += 2
        }
      } else {
        args.splice(spliceIdx, 0, endpointLimiter.process.bind(endpointLimiter))
        if (!_.isUndefined(operationLimiter) && operationLimiter.preAuth) {
          // ensure operation limiter comes after endpoint limiter if they are both postAuth
          spliceIdx += 1
        }
      }
    }
    if (!_.isUndefined(operationLimiter)) {
      args.splice(spliceIdx, 0, operationLimiter.process.bind(operationLimiter))
    }
    args.splice(args.length - 2, 0, this._initializeCORSMiddleware(endpoint))

    // create the express route
    app[method].apply(app, args)
  },

  /**********************************************************************
   * _makeOperationWrapper
   */
  _makeOperationWrapper: function(operation, endpoint, method) {
    var self = this

    var wrapper = function(req, res, next) {
      // First process and validate the parameters. Do this before authorization in
      // case authorization needs to look at formally defined request 'parameters'.
      try {
        self.logInfo("HTTP Request: " + req.method + " " + operation.getSanitizedUrl(req))

        // It is important that this comes before we check self._isOperationAuthorized
        // since acls may need to examine parameters.
        self.parameterParser.processParameters(req, operation.getAllParameters())

        // Check authorization
        if (!self._isOperationAuthorized(req.user, endpoint, method, req)) {
          var err = new self.errors.Forbidden("User does not have permission to perform operation")
          return next(err)
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
                    if(response.schema.type === "array" && _.isArray(output)) {
                      // find the first invalid result
                      var itemSchema = response.schema.items
                      _.find(output, function(o) {
                        var r = EJSON.validate(o, itemSchema)
                        if(!r.valid) {
                          throw new self.errors.InternalServerError("Output did not validate against: "+
                            r.error +
                            " | Expected: "+
                            EJSON.stringify(itemSchema)+
                            " | Actual: "+
                            EJSON.stringify(o))
                        }
                      })
                    } else {
                      throw new self.errors.InternalServerError("Output did not validate against: "+
                        validationResult.error +
                        " | Expected: "+
                        EJSON.stringify(response.schema)+
                        " | Actual: "+
                        EJSON.stringify(output))
                    }
                  }
                }
              } else {
                self.logWarning("Cannot find response definition for " + endpoint.path + " for status code: " + res.statusCode)
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
        return next(e)
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
})

module.exports = Service

