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
  _init : function(args, options) {
    console.log("ObjectServer._init()", args, options)

    var self = this
    
    // setup microservice
    console.log("setting up internal microservice")
    var microservice = new Microservice({ port: self.port })
    self._microservice = microservice 
    var app = microservice.listener
    // ------
    
    // better than using bodyParser -- more secure to not allow file uploads
    // XXX why does this not work then?
    // app.use(express.json())
    // app.use(express.urlencoded())
    // microservice may be doing some of this
    app.use(express.bodyParser()) // XXX do we only want json() and urlencoded()
    // XXX maybe do this after auth?
    
    // initialize authenticator
    self._initializeAuthenticator()
    
    app.use(function(req, res, next) {
      if (self.authenticator && req.remoteUser) {
        var user = self.authenticator.findUserByUsername(req.remoteUser)
        if (user) {
          req.user = user
        } // XXX reject properly
      }
      console.log("Request user: " + req.user) 
      next()
    })
    
    // add objectserver to the req
    app.use(function(req, res, next) {
      req.objectserver = self 
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
         
    // initialize endpoints
    self._initializeEndpoints(self.endpoints)
    
    // start
    microservice.start(function() {
      console.log("objectserver listening on port " + self.port)
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
    this._defineExpressRoutesForEndpoint(this._microservice.listener, endpoint)

    // recurse
    this._initializeEndpoints(endpoint.endpoints, path)
    console.log(endpoint.endpoints)
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
            endpoint[method](req, res)
          }
        } else {
          if (endpoint[method].service) {
            f = function(req, res) {
              endpoint[method].service(req, res)
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
