var o = require('maker').o(module);
var oo = require('maker').oo(module);
var _o = require('maker')._o(module);

/******************************************************************************
 * @class Collection
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */
  _type: "./Endpoint",

  /**********************************************************************
   * _C
   */
  _C: function() {
    this._defaultLimit = 100
    this.supportsCollectionRead = true
    this.supportsCollectionInsert = true
    this.supportsCollectionUpdate = true
    this.supportsCollectionCreate = true
    this.supportsCollectionDelete = true
    this.supportsObjectRead = true
    this.supportsObjectUpdate = true
    this.supportsObjectDelete = true
    this.endpoints = {}
  },

  /**********************************************************************
   * _init
   */        
  _init: function() {
    console.log("Collection._init()")

    // XXX call super init even though there is not one? Should make sure super()
    // does not barf

    // setup endpoints and operations based on config 
    this._initializeEndpoints()
  },

  /**********************************************************************
   * _initializeEndpoints
   */        
  _initializeEndpoints: function() {
    if (this.supportsCollectionRead) {
      this._initializeCollectionRead()
    }

    if (this.supportsCollectionInsert) {
      this._initializeCollectionInsert()
    }

    if (this.supportsCollectionUpdate) {
      this._initializeCollectionUpdate()
    }

    if (this.supportsCollectionDelete) {
      this._initializeCollectionDelete()
    }

    if (this.supportsObjectCreate) {
      this._initializeObjectCreate()
    }

    if (this.supportsObjectRead) {
      this._initializeObjectRead()
    }

    if (this.supportsObjectUpdate) {
      this._initializeObjectUpdate()
    }

    if (this.supportsObjectDelete) {
      this._initializeObjectDelete()
    }
  },

  /**********************************************************************
   * _initializeCollectionRead
   */
  _initializeCollectionRead: function() {
    var self = this
    // create a 'get' operation on this endpoint to implement collection reads
    this.get = {
      params: {
        "query" : {
          "in": "query", 
          type: "string", // XXX we cant seem to make this object or json?
          description: "Query spec (JSON)",
          required: false
        },
        "sort" : {
          "in": "query", 
          type: "string", // XXX we cant seem to make this object or json?
          description: "Sort spec (JSON)",
          required: false
        },
        "fields" : {
          "in": "query", 
          type: "string", // XXX we cant seem to make this object or json?
          description: "Fields spec (JSON)",
          required: false              
        },
        "skip" : {
          "in": "query", 
          type: "integer",
          description: "Results to skip",
          required: false
        },
        "limit" : {
          "in": "query", 
          type: "integer",
          description: "Results to limit",
          required: false
        }
      },      
      
      service: function(req, res) {
        var options = {}
        var query = {}
        if (req.query.query) {
          query = JSON.parse(req.query.query) // XXX framework should do this
        }
        if (req.query.sort) {
          options.sort = JSON.parse(req.query.sort)
        }
        if (req.query.fields) {
          options.fields = JSON.parse(req.query.fields)
        }
        if (req.query.skip) {
          options.skip = JSON.parse(req.query.skip)
        }
        if (req.query.limit) {
          options.limit = JSON.parse(req.query.limit)
        }
        self.find(query, options, function(err, objs) {
          if (err) {
            self._error(res, err)
          } else {
            res.send(objs)
          }
        })
      }
    }
  },

  /**********************************************************************
   * _initializeCollectionInsert
   */        
  _initializeCollectionInsert: function() {
    var self = this
    // create a 'post' operation on this endpoint to implement collection insert
    self.post = {
      params: {
        "body" : {
          "in": "body", // XXX I dont like "in"
          description: "Object to insert",
          required: true,
          schema: {}
        }
      },          
      service: function(req, res) {
        var body = req.body // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
        if (body) {
          self.insert(body, function(err, result) {
            if (err) {
              self._error(res, err)
            } else {
              res.send(result)
            }
          })
        }
      }
    }
  },
  
  /**********************************************************************
   * _initializeCollectionUpdate
   */        
  _initializeCollectionUpdate: function() {
    // XXX
  },

  /**********************************************************************
   * _initializeCollectionDelete
   */        
  _initializeCollectionDelete: function() {
    // XXX
  },

  /**********************************************************************
   * _initializeObjectCreate
   */        
  _initializeObjectCreate: function() {
    // XXX future CREATE method -- oooh baby
  },

  /**********************************************************************
   * _initializeObjectRead
   */        
  _initializeObjectRead: function() {
    // create a sub-endpoint for ':id' with a 'get' method
    if (!this.endpoints[':id']) {
      this.endpoints[':id'] = o({
        _type: './Endpoint',
      })
    }

    var self = this
    this.endpoints[':id'].get = {
      service: function(req, res) {
        self.findById(req.params.id, function(err, result) {
          if (err) {
            self._error(res, err)
          } else {
            res.send(result)
          }
        })
      }
    }
  },

  /**********************************************************************
   * _initializeObjectUpdate
   */
  _initializeObjectUpdate: function() {
    // create a sub-endpoint for ':id' with a 'put' method
    if (!this.endpoints[':id']) {
      this.endpoints[':id'] = o({
        _type: './Endpoint',
      })
    }
    
    var self = this
    this.endpoints[':id'].put = {
      params: {
        "body": { // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
          "in": "body", 
          description: "Update spec (JSON). Can be full object or update operator (e.g {'$inc': {'n': 1}})",
          required: true
        }
      },
      service: function(req, res, endpoint) {
        var id = req.params.id
        var body = req.body // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
        if (body) {
          // XXX save vs update????
          self.update({_id: id}, body, {}, function(err, result) { // XXX what happens if doc does not exist? Should look at our current API
            if (err) {
              self._error(res, err)
            } else {
              res.send(200)
            }
          })
        }
      }
    }
  },        

  /**********************************************************************
   * _initializeObjectDelete
   */
  _initializeObjectDelete: function() {
    // create a sub-endpoint for ':id' with a 'delete' method
    if (!this.endpoints[':id']) {
      this.endpoints[':id'] = o({
        _type: './Endpoint',
      })
    }
    
    var self = this
    this.endpoints[':id'].delete = {
      service: function(req, res) {
        self.removeById(req.params.id, function(err, result) {
          if (err) {
            self._error(res, err)
          } else {
            res.send(200)
          }
        })
      }
    }
  },
  
  /**********************************************************************
   * find
   */        
  find: function(query, options, cb) { 
    this._notImplemented(cb)
  },

  /**********************************************************************
   * findOne
   */        
  findOne: function(query, options, cb) {
    this._notImplemented(cb)
  },

  /**********************************************************************
   * findById
   */        
  findById: function(id, cb) {
    this._notImplemented(cb)
  },
    
  /**********************************************************************
   * insert
   */        
  insert: function(obj, cb) {
    this._notImplemented(cb)
  },

  /**********************************************************************
   * update
   */        
  update: function(query, obj, options, cb) {
    this._notImplemented(cb)
  },

  /**********************************************************************
   * save
   */        
  save: function(obj, cb) {
    this._notImplemented(cb)
  },

  /**********************************************************************
   * removeById
   */        
  removeById: function(id, cb) {
    this._notImplemented(cb)
  },

  /**********************************************************************
   * remove
   */        
  remove: function(query, cb) {
    this._notImplemented(cb)
  },
  
  /**********************************************************************
   * _notImplemented
   */        
  _notImplemented: function(cb) {
    cb(Error("Not implemented"))
  },

  /**********************************************************************
   * _error
   */        
  _error: function(res, error) {
    console.log(error)
    res.send(500)
  }

})
