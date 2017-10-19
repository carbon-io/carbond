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

/***************************************************************************************************
 * @description The default value for {@link prop:carbond.Service.env}. Note, while the default
 *              value for this constant is 'production', it can be overriden using the "NODE_ENV"
 *              environment variable.
 * @property {string} [DEFAULT_ENV='production']
 * @constant
 * @memberof carbond
 */
DEFAULT_ENV = _o('env:NODE_ENV') || 'production'

/***************************************************************************************************
 * Service
 */
var Service = oo({

  /*****************************************************************************
   * _type
   */
  _type: './Endpoint',

  /*****************************************************************************
   * @constructs Service
   * @description Service class description
   * @memberof carbond
   * @extends carbond.Endpoint
   */
  _C: function() {

    // -------
    // process
    // -------

    /***************************************************************************
     * @property {Object} [cmdargs] -- Additional command line argument definitions
     *                                 (will be merged into
     *                                 {@link carbond.Service.defaultCmdargs})
     * @default {}
     */
    this.cmdargs = {}

    /***************************************************************************
     * @property {string} [processUser=undefined]
     * @description If set, privileges will be dropped and the effective user for
     *              the process will be set to this
     */
    this.processUser = undefined

    /***************************************************************************
     * @property {string} [env={@link carbond.DEFAULT_ENV}
     * @description The mode that the service should run under. This affects the
     *              way errors are returned (e.g., a stack trace will be returned
     *              when a 500 is encountered if in "development" mode) and how
     *              shutdown occurs (e.g., open sockets will be severed immediately
     *              if in "development" mode rather than allowing them to time out).
     *              Currently, "development" and "production" modes are supported.
     */
    this.env = DEFAULT_ENV

    // -------
    // logging
    // -------

    /***************************************************************************
     * @property {string} [verbosity='info']
     * @description The level at which to log (possible values are 'trace', 'debug',
     *              'info', 'warn', 'error', 'fatal')
     */
    this.verbosity = 'info', // one of (trace | debug | info | warn | error | fatal)

    // ----
    // meta
    // ----

    /***************************************************************************
     * @property {string} [description='This is a Service']
     * @description A short description of this service
     */
    this.description = "This is a Service"

    // ------
    // routes
    // ------

    /***************************************************************************
     * @property {string} [path='']
     * @description Since {@link carbond.Service} is itself an
     *                    {@link carbond.Endpoint}, this can be used to set the URL
     *                    path component that the service endpoint is accessible at
     */
    this.path = ''

    /***************************************************************************
     * @property {string} [apiRoot=undefined]
     * @description The root component of the URL path component. This will be
     *              prepended to any routes that are yielded by the
     *              {@link carbond.Endpoint} tree.
     */
    this.apiRoot = undefined

    /***************************************************************************
     * @property {string} [adminRoot='/service-admin']
     * @description The "administrative" root URL path component (this is only
     *              enabled if the "swagger" command line option is present)
     */
    this.adminRoot = "/service-admin"

    // --------
    // database
    // --------

    /***************************************************************************
     * @property {string} dbUri
     * @description The database URI to connect to at startup (currently restricted
     *              to MongoDB)
     */
    this.dbUri = undefined

    /***************************************************************************
     * @property {Object<string, string>} dbUris
     * @description Database URIs to connect to at startup (currently restricted to
     *              MongoDB)
     */
    this.dbUris = {}

    /***************************************************************************
     * @property {Object} db
     * @description The connection object for {@link prop:carbond.Service.dbUri}
     */
    this.db = undefined

    /***************************************************************************
     * @property {Object<string, Object>} dbs
     * @description The connection objects for {@link prop:carbond.Service.dbUri}.
     *              The keys for this object will mirror those in
     *              {@link prop:carbond.Service.dbUri}, while the values will be
     *              the connection objects themselves.
     */
    this.dbs = {}

    // ---------
    // endpoints
    // ---------

    /***************************************************************************
     * @property {Object} [endpoints={}]
     * @description The endpoint tree. Note, keys in the endpoint tree will be used
     *              to construct routes to the various {@link carbond.Operation}s
     *              servicing requests for an individual {@link carbond.Endpoint}.
     */
    this.endpoints = {}

    // -------------
    // authenticator
    // -------------

    /***************************************************************************
     * @property {carbond.security.Authenticator} [authenticator=undefined]
     * @description The root authenticator. If present, all requests will be passed
     *              through the authenticator resulting in a 401 if authentication
     *              fails.
     */
    this.authenticator = undefined

    // ------------------
    // server and express
    // ------------------

    /***************************************************************************
     * @property {string} [hostname='127.0.0.1']
     * @description The address that this service should listen on
     */
    this.hostname = '127.0.0.1'

    /***************************************************************************
     * @property {number} [port=8888] -- The port that this service should bind
     */
    this.port = 8888

    /***************************************************************************
     * @property {carbond.SslOptions} [sslOptions=o({_type: './SslOptions'})]
     * @description SSL options to use if running HTTPS
     */
    this.sslOptions = o({_type: './SslOptions'})

    /***************************************************************************
     * @property {carbond.ParameterParser} [parameterParser=o({_type: './ParameterParser'})]
     * @description The parameter parser used to parse all incoming request
     *              parameters (i.e., query, header, body, and path). In most
     *              cases, the default parser should be sufficient.
     */
    this.parameterParser = o({_type: './ParameterParser'})

    /***************************************************************************
     * @property {http.Server|https.Server} _server
     * @description The Node http(s) server driving the underlying express app
     */
    this._server = undefined

    /***************************************************************************
     * @property {express.Application} _expressApp
     * @description The express Application driving the underlying carbond application
     */
    this._expressApp = undefined

    /***************************************************************************
     * @property {Function[]} [middleware=[]]
     * @description Middleware functions that will be executed via express before
     *              control is passed on to any {@link carbond.Operation}. Middleware
     *              function signatures should conform to ``fn(req, res, next)``.
     */
    this.middleware = []

    /***************************************************************************
     * @property {Function[]} [errorHandlingMiddleware=[]]
     * @description Middleware that will be invoked in the event that an error is
     *              thrown. Error-handling middleware function signatures should
     *              conform to ``fn(err, req, res, next)``.
     */
    this.errorHandlingMiddleware = []

    /***************************************************************************
     * @property {Object<string, string>} [publicDirectories={}]
     * @description Directories with static assets that should be exposed by the
     *              service. Keys are the URL paths under which these static assests
     *              should be served while values are the local filesystem paths
     *              at which the assets exist.
     */
    this.publicDirectories = {}

    /***************************************************************************
     * @property {boolean} [corsEnabled=true] -- Whether or not CORS is enabled
     */
    this.corsEnabled = true

    /***************************************************************************
     * @property {boolean} [_stopping=false]
     * @description Internal state used to negotiate service stop
     */
    this._stopping = false

    /***************************************************************************
     * @property {boolean} [_stopped=false]
     * @description Internal state used to negotiate service stop
     */
    this._stopped = false

    /***************************************************************************
     * @property {boolean} [gracefulShutdown=true]
     * @description Whether or not the service should gracefully shutdown when a
     *              stop is requested (i.e., whether or not open sockets should be
     *              allowed to timeout or severed immediately). The default for
     *              this is computed using {@link prop:carbond.DEFAULT_ENV}
     *              (e.g., ``DEFAULT_ENV === 'production'``).
     */
    this.gracefulShutdown = DEFAULT_ENV === 'production'

    /***************************************************************************
     * @property {number} [serverSocketTimeout=undefined]
     * @description The socket timeout for all incoming connections. Note, the
     *              system default is 2 minutes.
     */
    this.serverSocketTimeout = undefined

    // ------
    // events
    // ------

    /***************************************************************************
     * @property {EvenEmitter} _eventEmitter
     * @default Internal event emitter object used to notify components (if
     *          registerd) of service level events (e.g. "stopping")
     */
    this._eventEmitter = new EventEmitter()
    this._eventEmitter.setMaxListeners(128) // XXX: make this configurable

    // --------------
    // swagger / docs
    // --------------

    /***************************************************************************
     * @property {boolean} [generateOptionsMethodsInDocs=false]
     * @description Whether or not to include OPTIONS methods in static
     *              documentation
     */
    this.generateOptionsMethodsInDocs = false

    /***************************************************************************
     * @property {Object} [defaultDocgenOptions={...}]
     * @description Default options to be handed down to the documentation
     *              generator
     * @property {Object} [defaultDocgenOptions['github-flavored-markdown']={}]
     * @description Default options for the "github-flavored-markdown" documentation
     *              generator
     * @property {Object} [defaultDocgenOptions['api-blueprint']={}]
     * @description Default options for the "api-blueprint" documentation generator
     * @property {Object} [defaultDocgenOptions['aglio']={}]
     * @description Default options for the "aglio" documentation generator
     *
     */
    this.defaultDocgenOptions = {
      "github-flavored-markdown": {},
      "api-blueprint": {},
      "aglio": {}
    }

    /***************************************************************************
     * @property {Object} [_swaggerDescriptorGenerator=o({_type: './SwaggerDescriptorGenerator'})]
     * @description Internal generator for swagger API descriptor
     */
    this._swaggerDescriptorGenerator = o({_type: './SwaggerDescriptorGenerator'})

    // -------
    // cluster
    // -------

    /***************************************************************************
     * @property {boolean} [cluster=false] -- Whether or not to use Node's
     *                                        ``cluster`` module
     */
    this.cluster = false

    /***************************************************************************
     * @property {number} [numClusterWorkers=undefined]
     * @description The number of cluster workers to start. If left ``undefined``
     *              or set to ``0``, it will be set to the number of CPUs present.
     */
    this.numClusterWorkers = undefined

    /***************************************************************************
     * @property {Object} [_workers=undefined]
     * @description Internal property used to keep track of spawned cluster workers
     */
    this._workers = undefined

    // --------
    // limiters
    // --------

    // XXX do not include in class ref for the time being

    /***************************************************************************
     * @property {carbond.limiter.Limiter} busyLimiter
     * @default The root {@link carbond.limiter.Limiter}
     * @ignore
     */
    this.busyLimiter = undefined

    /***************************************************************************
     * @property {carbond.limiter.TooBusyLimiter} [defaultBusyLimiterClass=_o('./limiter/TooBusyLimiter')]
     * @description The default {@link carbond.limiter.Limiter} subclass to
     *              instantiate when busy limiting is enabled via the command line
     * @ignore
     */
    this.defaultBusyLimiterClass = _o('./limiter/TooBusyLimiter')

    /***************************************************************************
     * @property {carbond.limiter.Limiter} [limiter=undefined]
     * @description The limiter instance governing request rate limiting for the
     *              service
     * @ignore
     */
    this.limiter = undefined

    // ------
    // fibers
    // ------

    /***************************************************************************
     * @property {number} [fiberPoolSize=120]
     * @description Sets the pool size for the underlying ``fibers`` module. Note,
     *              a new fiber will be created and destroyed for every fiber created
     *              beyond the pool size. If this occurs regularly, it can lead to
     *              significant performance degradation. While the default should
     *              usually suffice, this parameter should be tuned according to the
     *              expected number of concurrent requests.
     */
    this.fiberPoolSize = fibers.getFiberPoolSize()
  },

  /*****************************************************************************
   * @method _init
   * @description Performs all service initialization
   * @returns {undefined}
   */
  _init: function() {
    _o('./Endpoint').prototype._init.call(this) // XXX come back
    this._configureLogger()
    this._initializeCmdargs()
    this._initializeMainDispatcher()
  },

  // -------------
  // CLI arguments
  // -------------

  /*****************************************************************************
   * @property {Object} [defaultCmdargs={...}]
   * @description The default command line arguments definition.
   *              {@link carbond.Service#cmdargs} can be used to extend the default
   *              set of command line arguments.
   */
  defaultCmdargs: {
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
                (DEFAULT_ENV === 'production') + ']'
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

  // ------------------------
  // CLI command entry points
  // ------------------------

  /*****************************************************************************
   * @method _startServer
   * @description Entry point the "start-server" command
   * @returns {undefined}
   */
  _startServer: function(options) {
    this.logDebug("Service._startServer")

    // start
    this.start(options)
  },

  /*****************************************************************************
   * @method _genStaticDocs
   * @description Entry point the "gen-static-docs" command
   * @returns {undefined}
   */
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

  /*****************************************************************************
   * @property {Object.<string, Function>} _main
   * @description Wires up CLI commands to their entry points. Note, this will be
   *              merged with any ``_main`` property defined on the instance to
   *              handle service custom commands.
   */
  _main: {
    'start-server': function(options) {
      this._startServer(options)
    },
    'gen-static-docs': function(options) {
      this._genStaticDocs(options)
    },
  },

  /*****************************************************************************
   * @method _stopHandler
   * @description Handle a stop event and exit with the appropriate exit code
   */
  _stopHandler: function(err) {
    this.logInfo("bye")
    if (err) {
      this.logError(err)
      process.exit(1)
    } else {
      process.exit(0)
    }
  },

  /*****************************************************************************
   * @property {Object.<string, Function>} [signalHandler={...}]
   * @description An object whose keys are signal names (e.g., "SIGINT") and whose
   *              values are functions invoked to handle the signal(s) corresponding
   *              to their aforementioned keys. Note, keys here can be a string of
   *              signal names delineated by spaces (e.g. "SIGINT SIGHUP"). In this
   *              case, the corresponding function will be called for any of the
   *              signals named in the key.
   */
  signalHandlers: {
    'SIGHUP SIGINT SIGQUIT SIGABRT SIGTERM': function(signal) {
      var self = this
      if (cluster.isMaster) {
        self.logDebug('Caught signal ' + signal)
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

  /*****************************************************************************
   * @method _initializeCmdargs
   * @description Internal method used to merge custom instance command line
   *              argument definitions with the default command line argument
   *              definitions.
   * @returns {undefined}
   */
  _initializeCmdargs: function() {
    this.cmdargs = _.assignIn(
      _.cloneDeep(this.constructor.prototype.defaultCmdargs),
      _.isNil(this.cmdargs) ? {} : this.cmdargs)
  },

  /*****************************************************************************
   * @method _initializeMainDispatcher
   * @description Internal method used to merge custom command handlers into
   *              {@link prop:carbond.Service._main} for dispatch
   * @returns {undefined}
   */
  _initializeMainDispatcher: function() {
    // extend _main with default _main
    if (!this._main) {
      this._main = {}
    }
    this._main = _.assignIn(_.cloneDeep(this.constructor.prototype._main), this._main)
  },

  /*****************************************************************************
   * @property {Object} [errors=HttpErrors]
   * @description A shortcut reference to the ``@carbon-io/http-errors`` module
   *              to be accessed using the service reference available throughout
   *              the ``carbond`` component hierarchy
   */
  errors: HttpErrors,

  /*****************************************************************************
   * @property {string} [serviceName=<basename>]
   * @description The default service name. This is derived from the basename.
   * @constant
   */
  serviceName: {
    // get the service name from the file basename
    "$property": {
      get: function() {
        var result = "Service"
        if (require.main.exports === this) {
          var filename = path.basename(require.main.filename)
          result = filename.slice(0, filename.indexOf('.'))
        }
        return result
      }
    }
  },

  /*****************************************************************************
   * @method maskSecret
   * @description maskSecret description
   * @param {string} str -- xxx
   * @return {string} -- xxx
   * @ignore
   */
  maskSecret: function(str) {
    // XXX: if in dev, this should return the str, else, return mask
    return '****'
  },

  /*****************************************************************************
   * @property {logging.Logger} [logger={...}]
   * @description The logger instance used by service log methods (e.g.
   *              {@link func:carbond.Service.logError})
   */
  logger: o({
    _type: core.logging.Logger,
    parent: 'carbon-io.carbond',
    config: {
      name: module,
      level: 'INFO'
    }
  }),

  /*****************************************************************************
   * @method _configureLogger
   * @description Internal method to configure the logger instance
   * @param {string} verbosity -- The verbosity level (one of "trace", "debug",
   *                              "info", "warn", "error", "fatal")
   * @returns {undefined}
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

  /*****************************************************************************
   * @method logTrace
   * @description Log a message at the "trace" level
   * @returns {undefined}
   */
  logTrace: function() {
    this.logger.trace.apply(this.logger, arguments)
  },

  /*****************************************************************************
   * @method logDebug
   * @description Log a message at the "debug" level
   * @returns {undefined}
   */
  logDebug: function() {
    this.logger.debug.apply(this.logger, arguments)
  },

  /*****************************************************************************
   * @method logInfo
   * @description Log a message at the "info" level
   * @returns {undefined}
   */
  logInfo: function() {
    this.logger.info.apply(this.logger, arguments)
  },

  /*****************************************************************************
   * @method logWarning
   * @description Log a message at the "warn" level
   * @returns {undefined}
   */
  logWarning: function() {
    this.logger.warn.apply(this.logger, arguments)
  },

  /*****************************************************************************
   * @method logError
   * @description Log a message at the "error" level
   * @returns {undefined}
   */
  logError: function() {
    this.logger.error.apply(this.logger, arguments)
  },

  /*****************************************************************************
   * @method logFatal
   * @description Log a message at the "fatal" level
   * @returns {undefined}
   */
  logFatal: function() {
    this.logger.fatal.apply(this.logger, arguments)
  },

  /*****************************************************************************
   * @method on
   * @description Register a service event callback
   * @param {String} event -- [choices: "start", "stop"]
   * @param {Function} listener -- Callback to fire when ``event`` occurs
   * @returns {EventEmitter}
   */
  on: function(event, listener) {
    return this._eventEmitter.on(event, listener)
  },

  /*****************************************************************************
   * @method once
   * @description Register a service event callback that executes once
   * @param {String} event -- the event type [choices: "start", "stop"]
   * @param {Function} listener -- callback to fire when ``event`` occurs
   * @returns {EventEmitter}
   */
  once: function(event, listener) {
    return this._eventEmitter.once(event, listener)
  },

  /*****************************************************************************
   * @method removeAllListeners
   * @description Remove all listeners. If ``event`` is passed, remove all listeners
   *              for that specific event (or events).
   * @param {...String} [event] -- the event type [choices: "start", "stop"]
   * @returns {EventEmitter}
   */
  removeAllListeners: function() {
    return this._eventEmitter.removeAllListeners.apply(
      this._eventEmitter, arguments)
  },

  /*****************************************************************************
   * @method removeListener
   * @description Remove a specific listener for a particular event.
   * @param {String} [event] -- the event type [choices: "start", "stop"]
   * @param {Function} listener -- callback to fire when ``event`` occurs
   * @returns {EventEmitter}
   */
  removeListener: function(event, listener) {
    return this._eventEmitter.removeListener(event, listener)
  },

  /*****************************************************************************
   * @method start
   * @description Initializes and starts the service
   * @param {Object} options -- Parsed command line options
   * @param {Function} cb -- Async callback (this can be omitted if calling from
   *                         within a Fiber)
   * @returns {undefined}
   * @throws {Error}
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
      self._initializeEndpoint(self, self.path, null)

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
      if (self.cluster && cluster.isWorker) {
        process.send({'type': 'error', 'msg': 'initAndListen', 'id': cluster.worker.id})
      }
      self.stop()
      throw e
    }
  },

  /*****************************************************************************
   * @method doStart
   * @abstract
   * @description Performs custom startup operations. This method will be called
   *              after initialization (e.g., database connections will be established
   *              and the endpoint tree will be built) but before the server's
   *              socket is bound. Override this method if your app requires further
   *              initialization.
   * @param {Object} options -- Parsed command line options
   * @returns {undefined}
   */
  doStart: function(options) {},

  /*****************************************************************************
   * @method _listen
   * @description Binds the server socket and drops privileges
   * @param {Function} cb -- Async callback
   * @returns {undefined}
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

  /*****************************************************************************
   * @method _initializeSecureConnectionHandler
   * @description Adds listener for 'secureConnection' event if HTTPS is used
   * @returns {undefined}
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

  /*****************************************************************************
   * @method _ensureProcessUser
   * @description Drops privileges if configured to do so
   * @returns {undefined}
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

  /*****************************************************************************
   * @method stop
   * @description Stops the service
   * @param {Function} [cb=undefined] -- Async callback (this can be omitted if
   *                                     calling from within a Fiber)
   * @returns {undefined}
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

  /*****************************************************************************
   * @method doStop
   * @abstract
   * @description Performs custom teardown operations. This method will be called
   *              first in the stop sequence.
   * @returns {undefined}
   */
  doStop: function() {},

  /*****************************************************************************
   * @method _authenticate
   * @description Authenticates an incoming request and sets ``user`` on the request
   *              object to be used by the underlying operation
   * @param {carbond.Endpoint} endpoint -- The endpoint that the request will be
   *                                       routed to if authenticated (note,
   *                                       ``allowUnauthenticated`` will be honored)
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Function} next -- Callback
   * @returns {undefined}
   */
  _authenticate: function(endpoint, req, res, next) {
    var self = this
    var user = undefined
    var method = undefined

    this.logDebug("Service._authenticate()")

    if (!this.authenticator) {
      this.logDebug("Service._authenticate(): No authenticator defined")
      next()
      return
    }

    method = req.method.toLowerCase()

    if (_.isArray(endpoint.allowUnauthenticated) && _.includes(endpoint.allowUnauthenticated, method)) {
      this.logDebug("Service._authenticate(): Unauthenticated access allowed for " +
                    method.toUpperCase() + " " + endpoint.path)
      next()
      return
    }

    // Never auth options requests
    if (method === "options") {
      this.logDebug("Service._authenticate(): OPTIONS request")
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

  /*****************************************************************************
   * @method _initializeDatabaseConnections
   * @description Initializes all database connection configured on ``dbUri`` and
   *              ``dbUris``
   * @returns {undefined}
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

 /******************************************************************************
   * @method _closeDatabaseConnections
   * @description Closes all database connections that were previously opened
   * @returns {undefined}
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

  /*****************************************************************************
   * @method _initializeBusyLimiter
   * @description Initializes the root limiter for the process. This limiter will
   *              start to send 503's when it notices that Node's event loop is
   *              falling behind.
   * @param {express.Application} app -- The underlying express application
   * @returns {undefined}
   */
  _initializeBusyLimiter: function(app) {
    if (!this.enableBusyLimiter) return

    if (_.isUndefined(this.busyLimiter)) {
      this.busyLimiter = o({
        _type: this.defaultBusyLimiterClass
      })
    }

    if (_.isObjectLike(this.busyLimiter) &&
        !(this.busyLimiter instanceof _o('./limiter/Limiter'))) {
      if (!('_type' in this.busyLimiter)) {
        this.busyLimiter._type = this.defaultBusyLimiterClass
      }
      this.busyLimiter = o(this.busyLimiter)
    }
    this.busyLimiter.initialize(this, this)
    app.use(this.busyLimiter.process.bind(this.busyLimiter))
  },

  /*****************************************************************************
   * @method _initializeHttpServer
   * @description Creates the express application and the underlying HTTP server,
   *              adding the application as a request listener
   * @returns {undefined}
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

  /*****************************************************************************
   * @method _initializeLimiter
   * @description
   * @param {carbond.limiter.Limiter) [limiter=this.limiter] -- limiter to initialize
   * @param {carbond.Service|carbond.Endpoint|carbond.Operation} [node=this] --
   *    the node to initialize this limiter with
   * @returns {carbond.limiter.Limiter} -- A limiter instance
   * @throws {TypeError}
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

  /*****************************************************************************
   * @method _initializeMiddleware
   * @description Validates and adds all custom middleware (note, middleware is
   *              is processed before endpoint operations)
   * @returns {undefined}
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

  /*****************************************************************************
   * @method _initializeErrorHandlingMiddleware
   * @description Validates and adds all custom error handling middleware (note,
   *              error handling middleware is processed last, but before express's
   *              default error handler or {@link func:carbond.Service._handleError})
   * @returns {undefined}
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

    // if not in development mode,
    if (this.env === 'development') {
      this._expressApp.use(function(err, req, res, next) {
        if (!res.headersSent && err instanceof self.errors.HttpError) {
          res.status(err.code)
        }
        return next(err, req, res)
      })
    } else {
      // top-level error handler
      this._expressApp.use(function(err, req, res, next) {
        if (res.headersSent) {
          // if the response has already been started, then delegate to the
          // default express error handler
          return next(err, req, res)
        }
        return self._handleError(err, res)
      })
    }
  },

  /*****************************************************************************
   * @method _initializeFiberMiddleware
   * @description Adds middleware at the head of the request handler chain that
   *              adds the service object to the request and wraps the call to the
   *              next handler in a Fiber
   * @returns {undefined}
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

  /*****************************************************************************
   * @method _handleError
   * @description Handles errors http errors thrown during request carbond request
   *              processing. This is the default carbon error handler and will
   *              only be used if not in "development" mode.
   * @param {httperrors.HttpError} err -- The error object
   * @param {carbond.Response} res -- The response object
   * @returns {undefined}
   */
  _handleError: function(err, res) {
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

  /*****************************************************************************
   * @method _initializeAuthenticator
   * @description Initializes the root authenticator
   * @returns {undefined}
   */
  _initializeAuthenticator: function() {
    if (this.authenticator) {
      this.authenticator.initialize(this)
    }
  },

  /*****************************************************************************
   * @method _initializeCORSMiddleware
   * @description Generates middleware for an individual endpoint that will enforce
   *              CORS
   * @param {carbond.Endpoint} endpoint -- The endpoint that the CORS middleware
   *                                       will gate access to
   * @returns {Function} -- Endpoint specific CORS middleware
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

  /*****************************************************************************
   * @method _initializeStaticRoutes
   * @description Initializes routes for static assets (e.g. {@link
   *              prop:carbond.Service.publicDirectory})
   * @returns {undefined}
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

  /*****************************************************************************
   * @method _initializeEndpoint
   * @description Initializes an individual endpoint (called recursively to initialize
   *              the tree of endpoints)
   * @param {carbond.Endpoint} endpoint -- An {@link carbond.Endpoint}
   * @param {string} path -- The URL path that routes to the endpoint
   * @param {?carbond.Endpoint} parent -- The parent endpoint in the endpoint tree
   *                                      (or ``null`` if endpoint is the service
   *                                      instance)
   * @returns {undefined}
   */
  _initializeEndpoint: function(endpoint, path, parent) {
    endpoint.path = path
    endpoint.parent = parent
    endpoint.service = this

    // define endpoints for this node
    this._defineExpressRoutesForEndpoint(this._expressApp, endpoint)

    // recurse
    this._initializeEndpoints(endpoint.endpoints, path, endpoint)
  },

  /*****************************************************************************
   * @method _initializeEndpoints
   * @description Initializes all child endpoints for an endpoint, if the exist
   *              (called recursively to initialize the tree of endpoints)
   * @param {Object.<string, carbond.Endpoint>} endpoints -- The child endpoints for parent
   * @param {string} path -- The URL path prefix for each endpoint
   * @param {carbond.Endpoint} parent -- The parent endpoint
   * @returns {undefined}
   */
  _initializeEndpoints: function(endpoints, path, parent) {
    path = path || this.path
    if (endpoints) {
      for (var endpointPath in endpoints) {
        this._initializeEndpoint(endpoints[endpointPath],
                                 path + "/" + endpointPath,
                                 parent)

      }
    }
  },

  /*****************************************************************************
   * @method _defineExpressRoutesForEndpoint
   * @description Defines routes for each of an endpoint's operations
   * @param {express.Application} app -- The underlying express application
   * @param {carbond.Endpoint} endpoint -- The endpoint whose operations we want
   *                                       to add routes for
   * @returns {undefined}
   */
  _defineExpressRoutesForEndpoint: function(app, endpoint) {
    var self = this
    this._initializeLimiter(endpoint.limiter, endpoint)
    endpoint.supportedMethods().forEach(function(method) {
      self._defineExpressRouteForOperation(app, method, endpoint, endpoint[method])
    })
  },

  /*****************************************************************************
   * @method _defineExpressRouteForOperation
   * @description Wires up endpoint operations to routes in express
   * @param {express.Application} app -- The express app
   * @param {string} method -- The HTTP method the route is for
   * @param {carbond.Endpoint} endpoint -- The endpoint that owns the operation
   * @param {carbond.Operation} operation -- The operation
   * @returns {undefined}
   */
  _defineExpressRouteForOperation: function(app, method, endpoint, operation) {
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
    var wrapper = this._makeOperationWrapper(operation, endpoint, method)

    // build argument list (XXX: should _authenticate be moved into the wrapper?)
    var args = [path, this._authenticate.bind(this, endpoint), wrapper]

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

  /*****************************************************************************
   * @method _makeOperationWrapper
   * @description Wraps the operation's handler with preamble and postamble that handles
   *              various things like parameter parsing, authorization, response
   *              validation, etc.
   * @param {carbond.Operation} operation -- The operation being wrapped
   * @param {carbond.Endpoint} endpoint -- The endpoint that owns the operation
   * @param {string} method -- The HTTP method that the operation handles
   * @returns {Function} -- A middleware function that that delegates request
   *                        handling to the operation
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
              var response = operation.responses[res.statusCode]
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
            // XXX: Sanitize the result which will remove any objects and fields the user does
            //      not have permission to see.
            //
            // result = self._sanitize(result, req.user, method !== 'get', true, endpoint.dataAcl)
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

  /*****************************************************************************
   * @method _sanitize
   * @todo FIXME
   * @description Sanitizes the response body. NOTE: this is intended to be used
   *              in the operation wrapper to sanitize the result of an operation
   *              but it is currently DISABLED.
   * @param {xxx} value -- xxx
   * @param {xxx} user -- xxx
   * @param {xxx} filterSingleValue -- xxx
   * @param {xxx} filterArrays -- xxx
   * @param {xxx} acl -- xxx
   * @returns {xxx} -- xxx
   */
  _sanitize: function(value, user, filterSingleValue, filterArrays, acl) {
    this.logDebug("Service._sanitize(): Pre-sanitize: " + EJSON.stringify(value))
    try {
      var result = _o('./security/ObjectAcl').sanitize(value, user, filterSingleValue, filterArrays, acl)
      this.logDebug("Service._sanitize(): Post-sanitize: " + EJSON.stringify(result))
      return result
    } catch (e) { // XXX should this be 500? Do we want exception to mean forbidden?
      // console.log(e.stack)
      // XXX this is not really ok -- need to know which type exception
      throw new this.errors.Forbidden(e.message)
    }
  },

  /*****************************************************************************
   * @method _isOperationAuthorized
   * @description Tests whether an operation is authorized or not (delegates ACL
   *              tests to the endpoint servicing the request)
   * @param {Object} user -- The user object as returned by the root authenticator
   * @param {carbond.Endpoint} endpoint -- The endpoint servicing the request
   * @param {string} method -- The HTTP method being handled
   * @param {carbond.Request} req -- The request object
   * @returns {boolean}
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
    if (endpoint.allowUnauthenticated && _.includes(endpoint.allowUnauthenticated, method.toLowerCase())) {
      this.logDebug("Service._isOperationAuthorized(): true - Unauthenticated access allowed")
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

  /*****************************************************************************
   * @method _secureMongoUriString
   * @description Mask the username and password of a MongoDB URI
   * @param {string} uri -- The MongoDB URI to sanitize
   * @returns {string}
   */
  _secureMongoUriString: function(uri) {
    var obj = mongodbUri.parse(uri)
    obj.username = "xxx"
    obj.password = "yyy"
    return mongodbUri.format(obj)
  },
})

module.exports = Service

