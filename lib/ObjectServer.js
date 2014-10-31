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
  start : function() {
    this._init(); // XXX should it be _init calls start? yes
  },
    
  /**********************************************************************
   * stop
   */        
  stop : function() {
  },    

  /**********************************************************************
   * _init
   */        
  _init : function(args, options) { // XXX should this take a callback
    console.log("ObjectServer._init()", args, options)

    var self = this
    
    util.spawn(function() {
      // initialize db connection
      if (self.mongodbURI) { // XXX maybe make this lazy by making _db property getter
        console.log("initializing connection to db: " + self.mongodbURI)
        try {
          self._db = connect(self.mongodbURI)
        } catch (e) {
          console.log(e) // XXX probably don't even start
        }
      }

      // express
      self._initializeExpress()    
      var app = self._expressApp
      
      // configure top-level fiber -- this should be first in the middleware chain
      app.use(function(req, res, next) {
        util.spawn(function() {
          try {
            next()
          } catch (e) {
            console.error(e.stack)
          }
        })
      })
    
      // initialize authenticator
      self._initializeAuthenticator()
    
      // add objectserver to the req
      app.use(function(req, res, next) {
        req.objectserver = self // XXX maybe a more obscure name?
        next()
      })
    
      // cors
      app.use(function(req, res, next) {
        if (self.corsEnabled) {
          res.header("Access-Control-Allow-Origin", "*")
          res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
          res.header('Access-Control-Allow-Headers', 'Authorization, Content-Length, X-Requested-With, Content-Type')
        }
        next()
      })
      
      // static routes XXX TODO may change
      app.use("/apidoc", express.static(__dirname + "/../www/apidoc"))
      app.use("/swagger-ui", express.static(__dirname + "/../node_modules/swagger-ui/dist"))
    
      // swagger descriptor endpoint
      app.get("/api-docs", function(req, res) {
        res.send(self._swaggerDescriptorGenerator.generateSwaggerDescriptor(self))
      })
      
      // XXX more general init()?
      
      // final app.use for errors?
      
      // endpoints
      console.log("initializing API endpoints")
      self._initializeEndpoints(self.endpoints)
      
      // start
      /* for when we use microservice
         microservice.start(function() {
         console.log("objectserver listening on port " + self.port)
         })
      */
      
      app.listen(self.port)
      console.log("objectserver listening on port " + self.port)
    })
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
  }
  
})
