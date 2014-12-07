require('fibers');
var util = require('./util')
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

/******************************************************************************
 * @class ObjectServer
 */
module.exports = oo({

  /**********************************************************************
   * port
   */        
  port: 3000,

  /**********************************************************************
   * description
   */        
  description: "This is an API service created with the ObjectServer",
    
  /**********************************************************************
   * apiRootPath
   */       
  apiRootPath: "",

  /**********************************************************************
   * authenticator
   */        
  authenticator: null,

  /**********************************************************************
   * endpoints
   */        
  endpoints: {},

  /**********************************************************************
   * corsEnabled
   */        
  corsEnabled: true, // XXX probably wrong

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
   * generateOptionsMethodsInDocs
   */        
  generateOptionsMethodsInDocs: false,

  /**********************************************************************
   * _logger
   */        
  _logger: {
    name: 'ObjectServer',
//    stream: process.stderr  XXX uncommenting this causes stack overflow?! is it the maker clone? yes it is -- need cycle det
  },

  /**********************************************************************
   * log
   */        
  _log: null,
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
   * _expressApp
   */        
  _expressApp: null,

  /**********************************************************************
   * dbUri
   */        
  dbUris: null,

  /**********************************************************************
   * dbUris
   */        
  dbUris: {},

  /**********************************************************************
   * db
   */        
  db : null,

  /**********************************************************************
   * dbs
   */        
  dbs : {},
  
  /**********************************************************************
   * _swaggerDescriptorGenerator
   */        
  _swaggerDescriptorGenerator: o({_type: './SwaggerDescriptorGenerator'}),
  
  /**********************************************************************
   * start
   */        
  start : function(options, cb) {
    this.log.info("ObjectServer initializing", options)

    var self = this
    
    // initialize dbs
    this._initializeDatabaseConnections()

    // initialize express
    this._initializeExpress()    
    var app = this._expressApp
    
    // initialize top-level fiber for request chain -- this should be first in the middleware chain
    this._initializeFiberMiddleware()
    
    // initialize authenticator
    this._initializeAuthenticator()
    
    // initialize CORS middleware
    this._initializeCORSMiddleware()
    
    this._initializeStaticRoutes()
        
    // XXX final middleware component for errors?
      
    // initialize endpoints
    self._initializeEndpoints(self.endpoints)
    
    app.listen(this.port)
    this.log.info("Listening on port " + this.port)

    if (cb) {
      cb() // XXX revisit this
    }
  },
    
  /**********************************************************************
   * stop
   */        
  stop : function(cb) {
    if (cb) {
      cb()
    }
  },    

  /**********************************************************************
   * _init
   */        
  _init : function(options) { 
    var self = this
    this.start(options, function() {
      self.log.info("ObjectServer running")
    })
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

    // ------
    // better than using bodyParser -- more secure to not allow file uploads
    // XXX why does this not work then?
    // app.use(express.json())
    // app.use(express.urlencoded())
    // microservice may be doing some of this
    this._expressApp.use(express.bodyParser()) // XXX do we only want json() and urlencoded()
    // XXX maybe do this after auth?


    /* for when we use microservice
    var microservice = new Microservice({ port: this.port })
    this._microservice = microservice 
    this._expressApp = microservice.listener
    
    // initialize db connection
    microservice.beforeStart(function (cb) {
      mongodb.connect(self.dburi, { server: { auto_reconnect: true } }, function (err, db) {
        self.db = db;
        if (err) {
          // XXX                    cb(err)
          cb()
        } else {
          console.log("connected to", self.dbUri)
          cb()
        }
      })
    })
    
    microservice.afterStop(function (cb) {
      self.db.close()
      cb()
    })
    */
  },

  /**********************************************************************
   * _initializeFiberMiddleware
   */
  _initializeFiberMiddleware: function() {
    var self = this
    this._expressApp.use(function(req, res, next) {
      util.spawn(function() {
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
      if (self.authenticator && req.remoteUser) {
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
  _initializeEndpoints: function(endpoints, apiRootPath) {
    apiRootPath = apiRootPath || this.apiRootPath
    if (endpoints) {
      for (var path in endpoints) {
        this._initializeEndpoint(endpoints[path], apiRootPath + "/" + path)
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
    endpoint._allMethods.forEach(function(method) {
      var m = endpoint[method]
      if (m) {
        var f
        if (typeof(m) === 'function') {
          f = function(req, res) {
            endpoint[method](req, res, endpoint)
          }
        } else {
          if (endpoint[method].service) {
            // lexical convenience
            endpoint[method].objectserver = self // XXX should this be done / handled elsewhere?
            endpoint[method].endpoint = endpoint // XXX should this be done / handled elsewhere?

            f = function(req, res) { // XXX should add top-level exception handling here
              endpoint[method].service(req, res, endpoint)
            }
          }
        }
        if (f) {
          app[method](endpoint.path, f)
        }
      }
    })
  },

  /**********************************************************************
   * _createLogger
   */
  _createLogger: function() {
    var loggerConf = this._logger

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
