var o = require('atom').o(module);
var oo = require('atom').oo(module);
var _o = require('bond')._o(module);

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
    this._defaultFindLimit = 100 // XXX do we also need a maxFindLimit?
    this.enabled = { '*' : true }
    this.schema = undefined
    this.querySchema = undefined // XXX does this apply only to find() or others like remove?
    this.idGenerator = undefined
    this.acl = null // XXX add to docs
    this.dataAcl = null
    this.instanceAclsEnabled = false
    this.initialInstanceAcl = null
    this.objectIdPathParameterName = "id" // XXX use this
    this.endpoints = {}
  },

  /**********************************************************************
   * _init
   */        
  _init: function() {
    // setup endpoints and operations based on config 
    // important this is first since we are dynamically creating endpoints and operations
    // XXX would it be better to dynamically setup stuff with explicit types etc... vs needing inits?
    this._initializeEndpoints()

    _o('./Endpoint').prototype._init.call(this) 
  },

  /**********************************************************************
   * _isEnabled
   */
  _isEnabled: function(operation) {
    if (this.enabled[operation] === true) {
      return true
    }

    if (this.enabled[operation] !== false && this.enabled['*'] === true) {
      return true
    }
    
    return false
  },

  /**********************************************************************
   * supportsCreate
   */        
  supportsCreate: {
    $property: {
      get: function() {
        return this.create != undefined && this._isEnabled('create')
      }
    }
  },

  /**********************************************************************
   * supportsInsert
   */        
  supportsInsert: {
    $property: {
      get: function() {
        return this.insert != undefined && this._isEnabled('insert')
      }
    }
  },

  /**********************************************************************
   * supportsFind
   */        
  supportsFind: {
    $property: {
      get: function() {
        return this.find != undefined && this._isEnabled('find')
      }
    }
  },

  /**********************************************************************
   * supportsUpdate
   */        
  supportsUpdate: {
    $property: {
      get: function() {
        return this.update != undefined && this._isEnabled('update')
      }
    }
  },

  /**********************************************************************
   * supportsRemove
   */        
  supportsRemove: {
    $property: {
      get: function() {
        return this.remove != undefined && this._isEnabled('remove')
      }
    }
  },

  /**********************************************************************
   * supportsGetObject
   */        
  supportsGetObject: {
    $property: {
      get: function() {
        return this.getObject != undefined && this._isEnabled('getObject')
      }
    }
  },

  /**********************************************************************
   * supportsUpdateObject
   */        
  supportsUpdateObject: {
    $property: {
      get: function() {
        return this.updateObject != undefined && this._isEnabled('updateObject')
      }
    }
  },

  /**********************************************************************
   * supportsRemoveObject
   */        
  supportsRemoveObject: {
    $property: {
      get: function() {
        return this.removeObject != undefined && this._isEnabled('removeObject')
      }
    }
  },

  /**********************************************************************
   * _initializeEndpoints
   */        
  _initializeEndpoints: function() {
    this._initializeInsert()
    this._initializeFind()
    this._initializeUpdate()
    this._initializeRemove()
    this._initializeGetObject()
    this._initializeUpdateObject()
    this._initializeRemoveObject()
  },

  /**********************************************************************
   * _initializeInsert
   */        
  _initializeInsert: function() {
    if (this.supportsInsert) {
      var self = this
      // create a 'post' operation on this endpoint to implement collection insert
      self.post = {
        parameters: {
          "body" : { // XXX can we stop need body -- is swagger bug fixed yet?
            description: "Object to insert",
            location: "body", 
            required: true, // XXX Swagger UI does not seem to be enforcing this (unlike elsewhere with path params)
            schema: self.schema || { type: "object" }
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
    var obj = req.parameters.body // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
    if (!obj) {
      throw new this.objectserver.errors.BadRequest("Body required (JSON)")
    }

    // generate _id if id generator exists
    if (this.idGenerator) {
      if (obj._id === undefined) {
        obj._id = this.idGenerator.generateId()
      }
    }

    // handle instance acls
    if (this.instanceAclsEnabled) {
      this._assignInitialInstanceAcl(obj, req.user)
    }
    
    return this.insert(obj, { req: req })
  },

  /**********************************************************************
   * _initializeFind
   */
  _initializeFind: function() {
    if (this.supportsFind) {
      var self = this
      // create a 'get' operation on this endpoint to implement collection reads
      this.get = {
        parameters: {
          "query" : {
            description: "Query spec (JSON)",
            location: "query", 
            schema: self.querySchema || { type: "object" }, 
            required: false
          },
          "sort" : {
            description: "Sort spec (JSON)",
            location: "query", 
            schema: { type: "object"}, 
            required: false
          },
          "fields" : {
            description: "Fields spec (JSON)",
            location: "query", 
            schema: { type: "object" }, 
            required: false              
          },
          "skip" : {
            description: "Results to skip",
            location: "query", 
            schema: { type: "integer" },
            required: false
          },
          "limit" : {
            description: "Results to limit",
            location: "query", 
            schema: { type: "integer" },
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
      if (req.parameters.query) {
        query = req.parameters.query
      }
      if (req.parameters.sort) {
        options.sort = req.parameters.sort
      }
      if (req.parameters.fields) {
        options.fields = req.parameters.fields
      }
      if (req.parameters.skip) {
        options.skip = req.parameters.skip
      }
      if (req.parameters.limit) {
        options.limit = req.parameters.limit
      }
    } catch (e) {
      // XXX should we do one try / catch per param to give better error message?
      throw new this.objectserver.errors.BadRequest("Malformed query param: " + e.message)
    }
    
    // do the find
    result = this.find(query, options, { req: req })

    // sanitize results
    result = this._sanitize(result, req.user, false, true) // XXX these args right?          

    return result
  },

  /**********************************************************************
   * _initializeUpdate
   */        
  _initializeUpdate: function() { // XXX this one will be complicated 
    if (this.supportsUpdate) {
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
        parameters: {
          "query" : {
            description: "Query spec (JSON)",
            location: "query", 
            schema: { type: "object" }, 
            required: true
          }
        },      
        
        service: function(req) {
          // This is not the same impl as collection read where query param is optional and defaults to {}
          // The query param is required. This is for saftey reasons and to make it harder to unintentionally
          // delete the whole collection
          if (!req.parameters.query) {
            throw new this.objectserver.errors.BadRequest("Must supply a query via the 'query' url param")
          }
          return self.remove(parameters.query, { req: req })
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
        this.endpoints[':id'] = this._makeObjectSubEndpoint()
      }

      // See if schema has a type for _id defined
      var idSchema = {}
      if (this.schema && this.schema.properties && this.schema.properties._id) {
        idSchema = this.schema.properties._id
      }

      var self = this
      this.endpoints[':id'].get = o({
        _type: './Operation',
        endpoint: self.endpoints[':id'],
        parameters: {
          id: {
            description: "Object _id",
            location: "path",
            schema: idSchema, 
            required: true
          }
        },
        service: function(req) {
          return self.getObject(req.parameters.id, { req: req })
        }
      })
    }
  },

  /**********************************************************************
   * _initializeUpdateObject
   */
  _initializeUpdateObject: function() {
    if (this.supportsUpdateObject) {
      // create a sub-endpoint for ':id' with a 'put' method
      if (!this.endpoints[':id']) {
        this.endpoints[':id'] = this._makeObjectSubEndpoint()
      }
      
      var self = this
      this.endpoints[':id'].put = o({
        _type: './Operation',
        endpoint: self.endpoints[':id'],
        parameters: {
          "body": { // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
            location: "body", 
            description: "Update spec (JSON). Can be full object or update operator (e.g {'$inc': {'n': 1}})",
            schema: { type: "object" },
            required: true
          }
        },
        service: function(req, res) { // XXX still need third arg here?
          var id = req.parameters.id
          var body = req.parameters.body // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
          if (body) {
            return self.update({_id: id}, body, {}, { req: req })// XXX what happens if doc does not exist? Should look at our current API
          }
        }
      })
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
      this.endpoints[':id'].delete = o({
        _type: './Operation', 
        endpoint: self.endpoints[':id'],
        parameters: {
          id: {
            description: "Object _id to delete",
            location: "path",
            schema: {},
            required: true
          }
        },
        service: function(req) {
          return self.removeObject(req.parameters.id, { req: req })
        }
      })
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
        _type: './security/EndpointAcl', // XXX why? 

        hasPermission: function(user, permission) {
          if (!self.acl) {
            return true // XXX right?
          }

          if (permission === 'get') {
            return self.acl.hasPermission('getObject')
          }
          if (permission === 'put') {
            return self.acl.hasPermission('updateObject') 
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
        throw new this.objectserver.errors.Forbidden("Cannot insert object not owned by authenticated user")
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
      throw new this.objectserver.errors.Forbidden(e.message)
    }
  }

/* Abstract interface

  insert: function(obj, reqCtx) {},
  find: function(query, options, reqCtx) {},
  update: function(query, obj, options, reqCtx) {},
  remove: function(query, reqCtx) {},
  getObject: function(id, reqCtx) {},
  updateObject: function(id, reqCtx) {},
  removeObject: function(id, reqCtx) {}

*/

})
