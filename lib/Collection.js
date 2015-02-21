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
    this._defaultFindLimit = 100
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
   * supportsCreate
   */        
  supportsCreate: {
    $property: {
      get: function() {
        return this.create != undefined
      }
    }
  },

  /**********************************************************************
   * supportsInsert
   */        
  supportsInsert: {
    $property: {
      get: function() {
        return this.insert != undefined
      }
    }
  },

  /**********************************************************************
   * supportsUpdate
   */        
  supportsUpdate: {
    $property: {
      get: function() {
        return this.update != undefined
      }
    }
  },

  /**********************************************************************
   * supportsSave
   */        
  supportsSavet: {
    $property: {
      get: function() {
        return this.save != undefined
      }
    }
  },

  /**********************************************************************
   * supportsRemove
   */        
  supportsRemove: {
    $property: {
      get: function() {
        return this.remove != undefined
      }
    }
  },

  /**********************************************************************
   * supportsFind
   */        
  supportsFind: {
    $property: {
      get: function() {
        return this.find != undefined
      }
    }
  },

  /**********************************************************************
   * supportsGetObject
   */        
  supportsGetObject: {
    $property: {
      get: function() {
        return this.getObject != undefined
      }
    }
  },

  /**********************************************************************
   * supportsRemoveObject
   */        
  supportsRemoveObject: {
    $property: {
      get: function() {
        return this.removeObject != undefined
      }
    }
  },

  /**********************************************************************
   * _initializeEndpoints
   */        
  _initializeEndpoints: function() {
    this._initializeCreate()
    this._initializeInsert()
    this._initializeUpdate()
    this._initializeSave()
    this._initializeRemove()
    this._initializeFind()
    this._initializeGetObject()
    this._initializeRemoveObject()
  },

  /**********************************************************************
   * _initializeCreate
   */        
  _initializeCreate: function() { // XXX future CREATE method -- oooh baby
    if (this.supportsCreate) {
    }
  },

  /**********************************************************************
   * _initializeInsert
   */        
  _initializeInsert: function() {
    if (this.supportsInsert) {
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
    }
  },
  
  /**********************************************************************
   * _initializeUpdate
   */        
  _initializeUpdate: function() { // XXX this one will be complicated 
    if (this.supportsUpdate) {
    }
  },

  /**********************************************************************
   * _initializeSave
   */
  _initializeSave: function() {
    if (this.supportsSave) {
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
    }
  },        

  /**********************************************************************
   * _initializeRemove
   */        
  _initializeRemove: function() {
    if (this.supportsRemove) {
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
    }
  },
    
  /**********************************************************************
   * _initializeFind
   */
  _initializeFind: function() {
    if (this.supportsFind) {
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
    }
  },
  
  /**********************************************************************
   * _initializeGetObject
   */        
  _initializeGetObject: function() {
    if (this.supportsGetObject) {
      // create a sub-endpoint for ':id' with a 'get' method
      if (!this.endpoints[':id']) {
        this.endpoints[':id'] = o({
          _type: './Endpoint'
        })
      }

      var self = this
      this.endpoints[':id'].get = {
        service: function(req) {
          return self.getObject(req.params.id)
        }
      }
    }
  },

  /**********************************************************************
   * _initializeRemoveObject
   */
  _initializeRemoveObject: function() {
    if (this.supportsRemoveObject) {
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
          return self.removeObject(req.params.id)
        }
      }
    }
  }

/* Abstract interface

  create: function() {}

  insert: function(obj) {},

  update: function(query, obj, options) {},

  save: function(obj) {},

  remove: function(query) {},

   // XXX need to think through options. 
   // XXX Thinking findOne option should be in there (maybe as an option known only by subclass)
  find: function(query, options) {},

  getObject: function(id) {},

  removeObject: function(id) {}

*/

})
