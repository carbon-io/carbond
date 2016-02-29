var EJSON = require('mongodb-extended-json')

var o = require('atom').o(module);
var oo = require('atom').oo(module);
var _o = require('bond')._o(module);
var _ = require('lodash')

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
    this.sanitizesOutput = true
    this.instanceAclsEnabled = false
    this.initialInstanceAcl = null
    this.idPathParameter = "id"
    this.idParameterResolver = undefined
    this.endpoints = {}
  },

  /**********************************************************************
   * _init
   */        
  _init: function() {
    // Setup endpoints and operations based on config 
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
   * supportsFindObject
   */        
  supportsFindObject: {
    $property: {
      get: function() {
        return this.findObject != undefined && this._isEnabled('findObject')
      }
    }
  },

  /**********************************************************************
   * supportsSaveObject
   */        
  supportsSaveObject: {
    $property: {
      get: function() {
        return this.saveObject != undefined && this._isEnabled('saveObject')
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
    this._initializeFindObject()
    this._initializeSaveObject()
    this._initializeUpdateObject()
    this._initializeRemoveObject()

    // initialize child Endpoints
    this._initializeChildEndpoints()
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
        responseSchema: {
          type: 'array',
          items: {
            type: self.schema
          }
        },

        parameters: {
          "query" : {
            description: "Query spec (JSON)",
            location: "query", 
            schema: self.querySchema || { type: "object" }, 
            required: false,
            default: {} 
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
    
    // Validate query. A bit of belt and suspenders and schema is set on OperationParameter. However
    // we also want to make sure we validate the final query not just what is passed in. If someone
    // forgets to make the default in the OperationParameter {} an undefined query can sneak past. This
    // will prevent that. However we do perform validation twice with this implementation. If we find this
    // is a performance problem we can revisit.
    if (this.querySchema) {
      var validationResult = this.objectserver.jsonSchemaValidator.validate(query, this.querySchema)
      if (!validationResult.valid) {
        throw new this.objectserver.errors.BadRequest("Query does not match query schema. Query: " + 
                                                      EJSON.stringify(query) + ", Schema: " + 
                                                      EJSON.stringify(this.querySchema) + ". Reason: " +
                                                      validationResult.error)
      }
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
      var self = this
      // create a 'patch' operation on this endpoint to implement collection reads
      this.patch = {
        parameters: {
          "query" : {
            description: "Query spec (JSON)",
            location: "query", 
            schema: { type: "object" }, 
            required: true
          },
          body: { // XXX make 'update' instead of body (for name)? Must be body for Swagger 2.0 UI bug
            location: "body", 
            description: "Update spec (JSON). Update operator (e.g {'$inc': {'n': 1}})",
            schema: { 
              type: "object"
            }, 
            required: true
          },
          options: { 
            location: "query", 
            description: "Update options",
            schema: { 
              type: "object"
            }, 
            required: false
          }
        },      

        service: function(req) {
          return self.update(parameters.query, parameters.body, parameters.options, { req: req })
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
   * _initializeFindObject
   */        
  _initializeFindObject: function() {
    if (this.supportsFindObject) {
      var self = this
      var objectSubEndpoint = self._getObjectSubEndpoint()
      objectSubEndpoint.get = o({
        _type: './Operation',
        endpoint: objectSubEndpoint,
        responseSchema: self.schema,

        service: function(req) {
          return self.findObject(req.parameters[self.idPathParameter], { req: req })
        }
      })
    }
  },

  /**********************************************************************
   * _initializeSaveObject
   */        
  _initializeSaveObject: function() { 
    if (this.supportsSaveObject) {
      var self = this
      var objectSubEndpoint = self._getObjectSubEndpoint()
      objectSubEndpoint.put = o({
        _type: './Operation',
        endpoint: objectSubEndpoint,
        parameters: {
          body: { // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
            location: "body", 
            description: "Full object for update. Must contain _id field that has the same value is the id in the path.",
            schema: self.schema || { 
              type: "object",
              requiredProperties: [ '_id' ]
            },
            required: true
          }
        },

        service: function(req, res) {
          var id = req.parameters[self.idPathParameter]
          var body = req.parameters.body // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug

          if (body) {
            if (EJSON.stringify(id) !== EJSON.stringify(body._id)) {
              throw new this.objectserver.errors.BadRequest("Path id must be equal to obj._id")
            }
            return self.save(body, { req: req }) // XXX What happens if doc does not exist? Do we insert? 
          }
        }
      })
    }
  },

  /**********************************************************************
   * _initializeUpdateObject
   */
  _initializeUpdateObject: function() {
    if (this.supportsUpdateObject) {
      var self = this
      var objectSubEndpoint = self._getObjectSubEndpoint()
      objectSubEndpoint.patch = o({
        _type: './Operation',
        endpoint: objectSubEndpoint,
        parameters: {
          body: { // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
            location: "body", 
            description: "Update spec (JSON). Update operator (e.g {'$inc': {'n': 1}})",
            schema: { // XXX do we want to try to make this use Collection schema or {} ?
              type: "object"
            }, 
            required: true
          },
          options: { 
            location: "query", 
            description: "Update options",
            schema: { // XXX do we want to try to make this use Collection schema or {} ?
              type: "object"
            }, 
            required: false
          }
        },
        service: function(req, res) { // XXX still need third arg here?
          var id = req.parameters[self.idPathParameter]
          var body = req.parameters.body // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
          if (body) {
            // XXX are we supporting any options here?
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
      var self = this
      var objectSubEndpoint = self._getObjectSubEndpoint()
      objectSubEndpoint.delete = o({
        _type: './Operation', 
        endpoint: objectSubEndpoint,

        service: function(req) {
          return self.removeObject(req.parameters[self.idPathParameter], { req: req })
        }
      })
    }
  },

  /**********************************************************************
   * _initializeChildEndpoints
   */
  _initializeChildEndpoints: function() {
    var self = this

    // If any paths are of the form ':x/...' will file these children 
    // as children of the object sub-endpoint.
    var childEndpoints = self.endpoints
    _.forIn(childEndpoints, function(childEndpoint, path) {
      if (path[0] === ':') {
        var i = path.indexOf('/')
        if (i !== -1) {
          var newPath = path.substring(i + 1)
          self._getObjectSubEndpoint().endpoints[newPath] = childEndpoint
          delete self.endpoints[path]
        }
      }
    })
  },

  /**********************************************************************
   * _getObjectSubEndpoint
   */
  _getObjectSubEndpoint: function() {
    var subEndpointPath = ':' + this.idPathParameter
    if (!this.endpoints[subEndpointPath]) {
        this.endpoints[subEndpointPath] = this._makeObjectSubEndpoint()
    }

    return this.endpoints[subEndpointPath]
  },

  /**********************************************************************
   * _makeObjectSubEndpoint
   */
  _makeObjectSubEndpoint: function() {
    var self = this

    // See if schema has a type for _id defined
    var idSchema = {}
    if (this.schema && this.schema.properties && this.schema.properties._id) {
        idSchema = this.schema.properties._id
    }

    // parameters
    var parameters = {}
    var idParameterName = self.idPathParameter[0] === ':' ? 
        self.idPathParameter.substring(1) : 
        self.idPathParameter

    parameters[idParameterName] = {
      description: "Object _id",
      location: "path",
      schema: idSchema, 
      required: true,
      resolver: self.idParameterResolver ? self.idParameterResolver.bind(self) : undefined
    }

    return o({
      _type: './Endpoint', 

      // take dataAcl of parent
      dataAcl: self.dataAcl,

      // parameters
      parameters: parameters,

      // acl
      acl: o({ // new acl that delegates to the CollectionAcl on this Collection
        _type: './security/EndpointAcl', // XXX why? 

        hasPermission: function(user, permission, env) {
          if (!self.acl) {
            return true // XXX right?
          }

          if (permission === 'get') {
            return self.acl.hasPermission(user, 'findObject', env)
          }
          if (permission === 'put') {
            return self.acl.hasPermission(user, 'saveObject', env) 
          }
          if (permission === 'patch') {
            return self.acl.hasPermission(user, 'updateObject', env) 
          }
          if (permission === 'delete') {
            return self.acl.hasPermission(user, 'removeObject', env)
          }
          if (permission === 'head') {
            return self.acl.hasPermission(user, 'findObject', env)
          }
          if (permission === 'options') {
            return true
          }

          return false
        }
      }),

      endpoints: {}
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
    return this.objectserver._sanitize(value, user, filterSingleValue, filterArrays, this.dataAcl)
  }

/* Abstract interface

  insert: function(obj, reqCtx) {},
  find: function(query, options, reqCtx) {},
  update: function(query, update, options, reqCtx) {},
  remove: function(query, reqCtx) {},
  findObject: function(id, reqCtx) {},
  saveObject: function(object, reqCtx) {},
  updateObject: function(id, update, reqCtx) {},
  removeObject: function(id, reqCtx) {}

*/

})
