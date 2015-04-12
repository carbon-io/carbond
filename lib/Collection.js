var o = require('atom').o(module);
var oo = require('atom').oo(module);
var _o = require('atom')._o(module);

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
    this.acl = null // XXX add to docs
    this.dataAcl = null
    this.instanceAclsEnabled = false
    this.initialInstanceAcl = null
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
  supportsSave: {
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
      var self = this
      self.create = {
        service: function(req) {
          return self.create()
        }
      }
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
          return self._serviceInsert(req)
        }
      }
    }
  },
  
  /**********************************************************************
   * _serviceInsert
   */        
  _serviceInsert: function(req) {
    var obj = req.body // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
    if (!obj) {
      throw this.objectserver.errors.BadRequest("Body required (JSON)")
    }

    // handle instance acls
    if (this.instanceAclsEnabled) {
      this._assignInitialInstanceAcl(obj, req.user)
    }

    return this.insert(obj)
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
        this.endpoints[':id'] = this._makeObjectSubEndpoint()
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
        service: function(req, res) { // XXX still need third arg here?
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
          return self._serviceFind(req)
        }
      }
    }
  },
  
  /**********************************************************************
   * _serviceFind
   */        
  _serviceFind: function(req) {
    var result

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
    
    // do the find
    result = this.find(query, options)

    // sanitize results
    result = this._sanitize(result, req.user, false, true) // XXX these args right?          

    return result
  },

  /**********************************************************************
   * _initializeGetObject
   */        
  _initializeGetObject: function() {
    if (this.supportsGetObject) {
      // create a sub-endpoint for ':id' with a 'get' method

      if (!this.endpoints[':id']) {
        this.endpoints[':id'] = this._makeObjectSubEndpoint()
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
        this.endpoints[':id'] = this._makeObjectSubEndpoint()
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
  },

  /**********************************************************************
   * _makeObjectSubEndpoint
   */
  _makeObjectSubEndpoint: function() {
    var self = this
    return o({
      _type: './Endpoint',
      acl: o({ // new acl that delegates to the CollectionAcl on this Collection
        _type: './security/EndpointAcl',

        hasPermission: function(user, permission) {
          if (permission === 'get') {
            return self.acl.hasPermission('getObject')
          }
          if (permission === 'put') {
            return self.acl.hasPermission('save') // XXX should this be save && update? Important I think. 
            // XXX Or could we argue save is strong than update on single doc so all we need is save?
          }
          if (permission === 'delete') {
            return self.acl.hasPermission('removeObject')
          }
          if (permission === 'head') {
            return self.acl.hasPermission('getObject')
          }
          if (permission === 'options') {
            return true
          }

          return false
        }
      })
    })
  },
  
  /**********************************************************************
   * _assignInitialInstanceAcl
   */
  _assignInitialInstanceAcl: function(obj, user) {
    if (obj.__acl__) {
      // XXX why cant we do this and not be owner?
      if (obj[obj.__acl__[ownerField]] !== user._id) {
        throw this.objectserver.errors.Forbidden("Cannot insert object not owned by authenticated user")
      }
    } else {
      // set __acl__ on object and set owner to be authenticated user
      // fine to operate on __acl__ as datum here
      var acl = this.initialInstanceAcl || { 
        entries: { 
          "__owner__:true": {
            "*": true
          }
        }
      }
      
      // assign owner
      obj[acl.ownerField] = user._id 
      
      // set on obj
      obj.__acl__ = acl
    }
  },

  /**********************************************************************
   * _sanitize
   */
  _sanitize: function(value, user, filterSingleValue, filterArrays) {
    // Notice we do not check instanceAclsEnabled. We sanitize based on 
    // instance acls regardless. This instanceAclsEnabled flag will only 
    // control whether we create initialInstanceAcl on insert
    try {
      var ObjectAcl = _o('./security/ObjectAcl')
      var acl
      var aclDatum = this.dataAcl
      if (aclDatum) { 
        acl = o(aclDatum, null, ObjectAcl)
      }
      return ObjectAcl.sanitize(value, user, filterSingleValue, filterArrays, acl)
    } catch (e) { // XXX should this be 500? Do we want exception to mean forbidden?
//      console.log(e.stack) // XXX this is not really ok -- need to know which type exception
      throw this.objectserver.errors.Forbidden(e.message)
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
