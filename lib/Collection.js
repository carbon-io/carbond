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
      
      service: function(req) {
        var options = {}
        var query = {}
        try {
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
        } catch (e) {
          // XXX should we do one try / catch per param to give better error message?
          throw this.objectserver.errors.BadRequest("Malformed query param: " + e.message)
        }
   
        return self.find(query, options)
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
          required: true, // XXX Swagger UI does not seem to be enforcing this (unlike elsewhere with path params)
          schema: {}
        }
      },          
      service: function(req) {
        var body = req.body // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
        if (!body) {
          throw this.objectserver.errors.BadRequest("Body required (JSON)")
        }
        return self.insert(body)
      }
    }
  },
  
  /**********************************************************************
   * _initializeCollectionUpdate
   */        
  _initializeCollectionUpdate: function() {
    // XXX this one will be complicated 
  },

  /**********************************************************************
   * _initializeCollectionDelete
   */        
  _initializeCollectionDelete: function() {
    var self = this
    // create a 'get' operation on this endpoint to implement collection reads
    this.delete = {
      params: {
        "query" : {
          "in": "query", 
          type: "string", // XXX we cant seem to make this object or json?
          description: "Query spec (JSON)",
          required: true
        }
      },      
      
      service: function(req) {
        // This is not the same impl as collection read where query param is optional and defaults to {}
        // The query param is required. This is for saftey reasons and to make it harder to unintentionally
        // delete the whole collection
        if (!req.query.query) {
          throw this.objectserver.errors.BadRequest("Must supply a query via the 'query' url param")
        }

        var query
        try {
          query = JSON.parse(req.query.query) // XXX framework should do this
        } catch (e) {
          throw this.objectserver.errors.BadRequest("Malformed query: '" + req.query.query + "'")
        }
        
        return self.remove(query)
      }
    }
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
        _type: './Endpoint'
      })
    }

    var self = this
    this.endpoints[':id'].get = {
      service: function(req) {
        return self.findById(req.params.id)
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
        _type: './Endpoint'
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
      service: function(req, res, endpoint) { // XXX still need third arg here?
        var id = req.params.id
        var body = req.body // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
        if (body) {
          // XXX save vs update????
          return self.update({_id: id}, body, {})// XXX what happens if doc does not exist? Should look at our current API
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
        _type: './Endpoint'
      })
    }
    
    var self = this
    this.endpoints[':id'].delete = {
      params: {
        "id": { // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
          "in": "path", 
          description: "_id of object to delete",
          required: true
        }
      },

      service: function(req) {
        return self.removeById(req.params.id)
      }
    }
  },
  
  /**********************************************************************
   * find
   */        
  find: function(query, options) { 
    throw this.objectserver.errors.InternalServerError("not implemented")
  },

  /**********************************************************************
   * findOne
   */        
  findOne: function(query, options) {
    throw this.objectserver.errors.InternalServerError("not implemented")
  },

  /**********************************************************************
   * findById
   */        
  findById: function(id) {
    throw this.objectserver.errors.InternalServerError("not implemented")
  },
    
  /**********************************************************************
   * insert
   */        
  insert: function(obj) {
    throw this.objectserver.errors.InternalServerError("not implemented")
  },

  /**********************************************************************
   * update
   */        
  update: function(query, obj, options) {
    throw this.objectserver.errors.InternalServerError("not implemented")
  },

  /**********************************************************************
   * save
   */        
  save: function(obj) {
    throw this.objectserver.errors.InternalServerError("not implemented")
  },

  /**********************************************************************
   * removeById
   */        
  removeById: function(id) {
    throw this.objectserver.errors.InternalServerError("not implemented")
  },

  /**********************************************************************
   * remove
   */        
  remove: function(query) {
    throw this.objectserver.errors.InternalServerError("not implemented")
  }

})
