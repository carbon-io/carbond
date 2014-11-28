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
   * basePath
   */        
  basePath: "",

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
   * _logger
   */        
  _logger: {
    name: 'ObjectServer',
//    stream: process.stderr  XXX uncommenting this causes stack overflow?! is it the maker clone? yes it is
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
   * _microservice
   */        
  _microservice: null,

  /**********************************************************************
   * _expressApp
   */        
  _expressApp: null,

  /**********************************************************************
   * mongodbURI
   */        
  mongodbURI: null,

  /**********************************************************************
   * _db
   */        
  _db : null,
  
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
    
    // initialize db
    this._initializeDatabaseConnection()

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

    cb() // XXX revisit this
  },
    
  /**********************************************************************
   * stop
   */        
  stop : function(cb) {
    cb()
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
   * _initializeDatabaseConnection
   */
  _initializeDatabaseConnection: function() { 
    // initialize db connection
    if (this.mongodbURI) { // XXX maybe make this lazy by making _db property getter
      this.log.info("Initializing connection to db: " + this.mongodbURI)
      this._db = connect(this.mongodbURI)
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
      mongodb.connect(self.mongodbURI, { server: { auto_reconnect: true } }, function (err, db) {
        self._db = db;
        if (err) {
          // XXX                    cb(err)
          cb()
        } else {
          console.log("connected to", self.mongodbURI)
          cb()
        }
      })
    })
    
    microservice.afterStop(function (cb) {
      self._db.close()
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
      console.log("Request user: " + req.user) 
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
    app.get("/api-docs", function(req, res) {
      res.send(self._swaggerDescriptorGenerator.generateSwaggerDescriptor(self))
    })
  },
   
  /**********************************************************************
   * _initializeEndpoints
   */
  _initializeEndpoints: function(endpoints, basePath) {
    basePath = basePath || this.basePath
    if (endpoints) {
      for (var path in endpoints) {
        this._initializeEndpoint(endpoints[path], basePath + "/" + path)
      }
    }
  },
  
  /**********************************************************************
   * _initializeEndpoint
   */
  _initializeEndpoint: function(endpoint, path) {
    endpoint.path = path
    endpoint._objectserver = this
    // define endpoints for this node
    this._defineExpressRoutesForEndpoint(this._expressApp, endpoint)

    // recurse
    this._initializeEndpoints(endpoint.endpoints, path)
  },
  
  /**********************************************************************
   * _defineExpressRoutesForEndpoint
   */        
  _defineExpressRoutesForEndpoint: function(app, endpoint) {
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
