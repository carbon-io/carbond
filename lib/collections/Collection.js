var EJSON = require('mongodb-extended-json')

var o = require('atom').o(module)
var oo = require('atom').oo(module)
var _o = require('bond')._o(module)
var _ = require('lodash')

/******************************************************************************
 * @class Collection
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */
  _type: "../Endpoint",

  /**********************************************************************
   * ALL_COLLECTION_OPERATIONS
   */        
  ALL_COLLECTION_OPERATIONS: [
    'insert', 'find', 'update', 'remove',
    'saveObject', 'findObject', 'updateObject', 'removeObject'
  ],

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.enabled = { '*' : true }
    this.schema = undefined
    this.idGenerator = undefined
    this.idRequiredOnInsert = false // Controls how insertSchema is generated in default case
    this.idPathParameter = "id" // XXX make _id?
    this.views = {}
    this.endpoints = {}

    // Defaults for operation configs
    this.insertConfig = undefined
    this.findConfig = undefined
    this.updateConfig = undefined
    this.removeConfig = undefined
    this.saveObjectConfig = undefined
    this.findObjectConfig = undefined
    this.updateObjectConfig = undefined
    this.removeObjectConfig = undefined
  },

  /**********************************************************************
   * _DEFAULT_SCHEMA
   */ 
  _DEFAULT_SCHEMA: {
    type: 'object',
    properties: {
      _id: { type: 'string' }
    },
    required: ['_id'],
    additionalProperties: true
  },

  /**********************************************************************
   * _init
   */        
  _init: function() {
    this._validate()
    this._initializeCollectionOperationConfigs()
    this._generateEndpointOperations()
    this._initializeChildEndpoints()

    // Call super. Do this last
    _o('../Endpoint').prototype._init.call(this) 
  },

  /**********************************************************************
   * supportsInsert
   */        
  supportsInsert: {
    $property: {
      get: function() {
        return this._supportsOperation('insert')
      }
    }
  },

  /**********************************************************************
   * supportsFind
   */        
  supportsFind: {
    $property: {
      get: function() {
        return this._supportsOperation('find')
      }
    }
  },

  /**********************************************************************
   * supportsUpdate
   */        
  supportsUpdate: {
    $property: {
      get: function() {
        return this._supportsOperation('update')
      }
    }
  },

  /**********************************************************************
   * supportsRemove
   */        
  supportsRemove: {
    $property: {
      get: function() {
        return this._supportsOperation('remove')
      }
    }
  },

  /**********************************************************************
   * supportsFindObject
   */        
  supportsFindObject: {
    $property: {
      get: function() {
        return this._supportsOperation('findObject')
      }
    }
  },

  /**********************************************************************
   * supportsSaveObject
   */        
  supportsSaveObject: {
    $property: {
      get: function() {
        return this._supportsOperation('saveObject')
      }
    }
  },

  /**********************************************************************
   * supportsUpdateObject
   */        
  supportsUpdateObject: {
    $property: {
      get: function() {
        return this._supportsOperation('updateObject')
      }
    }
  },

  /**********************************************************************
   * supportsRemoveObject
   */        
  supportsRemoveObject: {
    $property: {
      get: function() {
        return this._supportsOperation('removeObject')
      }
    }
  },

  /**********************************************************************
   * _supportsOperation
   */ 
  _supportsOperation: function(op) {
    return this[op] && this._isEnabled(op)
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
   * getOperationConfig
   */
  getOperationConfig: function(op) {
    if (!_.includes(this.ALL_COLLECTION_OPERATIONS, op)) {
      throw new Error("Unknown collection op: " + op)
    }

    return this[op + "Config"] || {}
  },

  /**********************************************************************
   * _validate
   */
  _validate: function() {
    if (this.schema && !this._validateSchema(this.schema)) {
      throw new Error("Invalid schema. _id must be a property, and must be required: " + 
                      EJSON.stringify(this.schema))
    }
  },

  /**********************************************************************
   * _validateSchema
   */
  _validateSchema: function(schema) {
    if (schema.properties && schema.properties._id && _.includes(schema.required, '_id')) {
      return schema
    }

    return false
  },

  /**********************************************************************
   * _initializeCollectionOperationConfigs
   * 
   * For each logical Collection operation (insert, find, ...), create
   * an CollectionOperationConfig where applicable. This basically just
   * takes the raw object config and binds it to the appropriate class.
   */        
  _initializeCollectionOperationConfigs: function() {
    var self = this

    self.ALL_COLLECTION_OPERATIONS.forEach(function(op) {
      var configObjectFieldName = op + 'Config'
      var configClassName = _.upperFirst(op) + 'Config'
      var config = self[configObjectFieldName]

      if (config) {
        // Create new CollectionOperationConfig object and assign back
        self[configObjectFieldName] = o(config, _o('./' + configClassName))
      } 
    })
  },

  /**********************************************************************
   * _generateEndpointOperations
   */        
  _generateEndpointOperations: function() {
    this._generateEndpointOperationForInsert()
    this._generateEndpointOperationForFind()
    this._generateEndpointOperationForUpdate()
    this._generateEndpointOperationForRemove()
    this._generateEndpointOperationForFindObject()
    this._generateEndpointOperationForSaveObject()
    this._generateEndpointOperationForUpdateObject()
    this._generateEndpointOperationForRemoveObject()
  },

  /**********************************************************************
   * _generateEndpointOperationForInsert
   */        
  _generateEndpointOperationForInsert: function() {
    if (this.supportsInsert) {
      var self = this

      // Find the CollectionOperationConfig for this operation
      var config = self.getOperationConfig('insert')

      // Schema
      var schema = config.insertSchema || self.schema || self._DEFAULT_SCHEMA

      // Create a 'post' operation on this endpoint to implement collection insert
      self.post = {
        responseSchema: self._makeSchemaForOperation(config.responseSchema, 
                                                     self.schema || self._DEFAULT_SCHEMA, 
                                                     false),
        parameters: {
          "body" : { // XXX can we stop need body -- is swagger bug fixed yet?
            description: "Object to insert",
            location: "body", 
            required: true, // XXX Swagger UI does not seem to be enforcing this (unlike elsewhere with path params)
            schema: (self.idRequiredOnInsert ? schema : self._removeIdPropertyFromSchema(schema))
          }
        },          
      
        service: function(req, res) {
          var obj = req.parameters.body // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
          if (!obj) {
            throw new this.objectserver.errors.BadRequest("Body required (JSON)")
          }

          // generate _id if id generator exists
          if (self.idGenerator) {
            if (obj._id === undefined) {
              obj._id = self.idGenerator.generateId()
            }
          }
          
          var result = self.insert(obj, { req: req, res: res }) // Note this will always be sync.
          res.status(201) // Set status to 201 even though insert has not yet succeeded. Failure will reset. 
          // No need to EJSON here. String and ObjectId turn out how we want. XXX what about Date? Not allowed?
          var location = req.path + "/" + result._id 
          res.header("Location", location)
          return result
        }
      }
    }
  },
  
  /**********************************************************************
   * _generateEndpointOperationForFind
   */
  _generateEndpointOperationForFind: function() {
    if (this.supportsFind) {
      var self = this

      // Find the CollectionOperationConfig for this operation
      var config = this.getOperationConfig('find')
      
      // Create a 'get' operation on this endpoint to implement collection find
      this.get = {
        responseSchema: self._makeSchemaForOperation(config.responseSchema, 
                                                     self.schema || self._DEFAULT_SCHEMA, 
                                                     true),
        parameters: _.assignIn({ // Merge defined config parameters with query parameter.
          query: {
            description: "Query spec (JSON)",
            schema: config.querySchema || { type: 'object' },
            location: 'query',
            required: false
          },
          view: {
            description: "View",
            schema: { type: 'string' },
            location: 'query',
            required: false
          }
        }, config.parameters),
                               
        errorResponses: undefined, // XXX come back to this
      
        service: function(req, res) {
          var result = self.find(req.parameters.query, { req: req, res: res })
          result = self._applyView(result, req.parameters.view)
          return result
        }
      }
    }
  },
  
  /**********************************************************************
   * _generateEndpointOperationForUpdate
   */        
  _generateEndpointOperationForUpdate: function() { // XXX this one will be complicated
    if (this.supportsUpdate) {
      var self = this

      // Find the CollectionOperationConfig for this operation
      var config = this.getOperationConfig('update')

      // Create a 'patch' operation on this endpoint to implement collection update
      this.patch = {
        responseSchema: config.responseSchema || { 
          type: 'object',
          properties: {
            n: { type: 'integer' } // Respond with the number of items updated
          },
          required: [ 'n' ],
          additionalProperties: false
        }, 
        parameters: _.assignIn({ // Merge defined config parameters with query parameter.
          query: {
            schema: config.querySchema || { type: 'object' },
            location: 'query',
            required: false
          },
          body: { 
            location: "body", 
            description: "Update spec (JSON). Update operator (e.g {'$inc': {'n': 1}})",
            schema: config.updateSchema || { 
              type: "object"
            }, 
            required: true
          },
        }, config.parameters),
        
        // service
        service: function(req, res) {
          return self.update(req.parameters.query, req.parameters.body, { req: req, res: res })
        }
      }
    }
  },

  /**********************************************************************
   * _generateEndpointOperationForRemove
   */        
  _generateEndpointOperationForRemove: function() {
    if (this.supportsRemove) {
      var self = this

      // Find the CollectionOperationConfig for this operation
      var config = this.getOperationConfig('remove')

      // create a 'delete' operation on this endpoint to implement collection remove
      this.delete = {
        responseSchema: config.responseSchema || {  // XXX this default should be in Operation?
          type: 'object',
          properties: {
            n: { type: 'integer' } // Respond with the number of items updated
          },
          required: [ 'n' ],
          additionalProperties: false
        }, 

        parameters: _.assignIn({ // Merge defined config parameters with query parameter.
          query: {
            schema: config.querySchema || { type: 'object' },
            location: 'query',
            required: false
          }
        }, config.parameters),
        
        // service
        service: function(req, res) {
          // -- IMPORTANT --
          // This is not the same impl as collection read where query param is optional and defaults to {}
          // The query param is required. This is for saftey reasons and to make it harder to unintentionally
          // delete the whole collection
          if (!req.parameters.query) {
            throw new this.objectserver.errors.BadRequest("Must supply a query via the 'query' url param")
          }
          return self.remove(req.parameters.query, { req: req, res: res })
        }
      }
    }
  },

  /**********************************************************************
   * _generateEndpointOperationForSaveObject
   */        
  _generateEndpointOperationForSaveObject: function() { 
    if (this.supportsSaveObject) {
      var self = this

      // Find the CollectionOperationConfig for this operation
      var config = this.getOperationConfig('saveObject')

      var objectSubEndpoint = self._getObjectSubEndpoint()
      objectSubEndpoint.put = o({
        // We need to use _type here because we are doing it after Endpoint initialization
        // XXX maybe if we had Endpoint.setOperation we would be good
        _type: '../Operation', 
        responseSchema: self._makeSchemaForOperation(config.responseSchema, undefined, false),
        parameters: _.assignIn({ // Merge defined config parameters with body parameter.
          body: { // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
            location: "body", 
            description: "Full object for update. Must contain _id field that has the same value is the id in the path.",
            schema: self._makeSchemaForOperation(config.saveSchema, self.schema || self._DEFAULT_SCHEMA, false),
            required: true
          }
        }, config.parameters),

        // Convenience
        endpoint: objectSubEndpoint,
        objectserver: self.objectserver,

        service: function(req, res) {
          var id = req.parameters[self.idPathParameter]
          var body = req.parameters.body // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug

          if (body) {
            if (EJSON.stringify(id) !== EJSON.stringify(body._id)) { // XXX Is there more efficient compare?
              throw new self.objectserver.errors.BadRequest("Path id must be equal to obj._id")
            }
            return self.saveObject(body, { req: req, res: res }) 
          }
        }
      })
    }
  },
    
  /**********************************************************************
   * _generateEndpointOperationForFindObject
   */        
  _generateEndpointOperationForFindObject: function() {
    if (this.supportsFindObject) {
      var self = this

      // Find the CollectionOperationConfig for this operation
      var config = this.getOperationConfig('findObject')

      var objectSubEndpoint = self._getObjectSubEndpoint()
      objectSubEndpoint.get = o({
        // We need to use _type here because we are doing it after Endpoint initialization
        // XXX maybe if we had Endpoint.setOperation we would be good
        _type: '../Operation',

        // No need to take care of id parameter. Done by sub-Endpoint object
        parameters: { 
          view: {
            description: "View",
            schema: { type: 'string' },
            location: 'query',
            required: false
          }
        },
        
        responseSchema: self._makeSchemaForOperation(config.schema || self.schema || self._DEFAULT_SCHEMA),

        // Convenience
        endpoint: objectSubEndpoint,
        objectserver: self.objectserver,

        service: function(req, res) {
          var id = req.parameters[self.idPathParameter]
          var result = self.findObject(id, { req: req, res: res })
          if (_.isNil(result)) {
            throw new self.objectserver.errors.NotFound(self.idPathParameter + ": " + id)
                                                        
          }
          result = self._applyView(result, req.parameters.view)
          return result
        }
      })
    }
  },

  /**********************************************************************
   * _generateEndpointOperationForUpdateObject
   */
  _generateEndpointOperationForUpdateObject: function() {
    if (this.supportsUpdateObject) {
      var self = this

      // Find the CollectionOperationConfig for this operation
      var config = this.getOperationConfig('updateObject')

      var objectSubEndpoint = self._getObjectSubEndpoint()
      objectSubEndpoint.patch = o({
        // We need to use _type here because we are doing it after Endpoint initialization
        // XXX maybe if we had Endpoint.setOperation we would be good
        _type: '../Operation',

        responseSchema: config.schema ? self._makeSchemaForOperation(config.schema) : { type: "Undefined" },
        parameters: _.assignIn({ // Merge defined config parameters with body parameter.
          body: { // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
            location: "body", 
            description: "Update spec (JSON). Update operator (e.g {'$inc': {'n': 1}})",
            schema: config.updateSchema || {  type: "object" }, 
            required: true
          }
        }, config.parameters),

        // Convenience
        endpoint: objectSubEndpoint,
        objectserver: self.objectserver,

        // service
        service: function(req, res) { 
          var id = req.parameters[self.idPathParameter]
          var body = req.parameters.body // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
          if (body) {
            // If object does not exist implementation of updateObject should throw NotFoundError (404)
            return self.updateObject(id, body, { req: req, res: res }) 
          }
        }
      })
    }
  },        

  /**********************************************************************
   * _generateEndpointOperationForRemoveObject
   */
  _generateEndpointOperationForRemoveObject: function() {
    if (this.supportsRemoveObject) {
      var self = this

      // Find the CollectionOperationConfig for this operation
      var config = this.getOperationConfig('removeObject')

      var objectSubEndpoint = self._getObjectSubEndpoint()
      objectSubEndpoint.delete = o({
        _type: '../Operation', 

        responseSchema: config.schema ? self._makeSchemaForOperation(config.schema) : { type: "Undefined" },

        // Convenience
        endpoint: objectSubEndpoint,
        objectserver: self.objectserver,

        // service
        service: function(req, res) {
          // If object does not exist implementation of updateObject should throw NotFoundError (404)
          return self.removeObject(req.parameters[self.idPathParameter], { req: req, res: res })
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
    var idSchema = (this.schema || this._DEFAULT_SCHEMA)._id
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
      _type: '../Endpoint', 

      // take dataAcl of parent
      dataAcl: self.dataAcl,

      // parameters
      parameters: parameters,

      // acl
      acl: o({ // new acl that delegates to the CollectionAcl on this Collection
        _type: '../security/EndpointAcl', // XXX why? 

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
   * _removeIdPropertyFromSchema
   */
  _removeIdPropertyFromSchema: function(schema) {
    var result = schema
    if (schema.properties._id) {
      result = _.clone(schema)
      result.properties = _.omit(result.properties, ['_id'])
      if (_.isEmpty(result.properties)) {
        delete result.properties
      }

      if (result.required) {
        result.required = _.difference(result.required, ['_id'])
        if (_.isEmpty(result.required)) {
          delete result.required
        }
      }

      if (result.additionalProperties) {
        delete result.additionalProperties
      }
    }

    return(result)
  },

  /**********************************************************************
   * _makeSchemaForOperation
   */
  _makeSchemaForOperation: function(operationSchema, defaultSchema, array) {
    var schema = operationSchema || defaultSchema
    if (schema) {
      if (!this._validateSchema(schema)) {
        throw new Error("Invalid schema. _id must be a property, and must be required: " + 
                        + EJSON.stringify(schema))
      }

      if (_.isEmpty(schema.properties)) {
        delete schema.properties
      }

      if (_.isEmpty(schema.required)) {
        delete schema.required
      }

      if (schema.additionalProperties) {
        delete schema.additionalProperties
      }

      if (array) {
        schema = {
          type: 'array',
          items: schema
        }
      }
    }

    return schema
  },

  /**********************************************************************
   * _applyView
   */
  _applyView: function(obj, viewName) {
    if (!viewName) {
      if (this.defaultView) {
        viewName = defaultView
      } else {
        return obj
      }
    }
    
    var view = this.views[viewName]
    if (!view) {
      throw new this.objectserver.errors.BadRequest("Unknown view: " + viewName)   
    }
    
    if (!typeof(view) === 'function') {
      throw new Error("View should be a function. Got: " + JSON.stringify(view))
    }

    return view(obj)
  },
  
/* Abstract interface

  insert: function(obj, reqCtx) {},
  find: function(query, options, reqCtx) {},
  update: function(query, update, options, reqCtx) {},
  remove: function(query, reqCtx) {},
  findObject: function(id, reqCtx) {},
  saveObject: function(object, reqCtx) {},
  updateObject: function(id, update, reqCtx) {},
  removeObject: function(id, reqCtx) {}

  insert: function(obj, reqCtx) {},
  find: function(options, reqCtx) {},
  update: function(options, update, reqCtx) {},
  remove: function(options, reqCtx) {},
  saveObject: function(object, reqCtx) {},
  findObject: function(id, reqCtx) {},
  updateObject: function(id, update, reqCtx) {},
  removeObject: function(id, reqCtx) {}

  insert: function(obj, reqCtx) {},
  find: function(query, reqCtx) {},  // MongoDBCollection would add Parameters like skip and limit. Would be in reqCtx
  update: function(query, update, reqCtx) {}, // MongoDBCollection would add Parameters as needed. Would be in reqCtx
  remove: function(query, reqCtx) {},
  findObject: function(id, reqCtx) {},
  saveObject: function(object, reqCtx) {},
  updateObject: function(id, update, reqCtx) {},
  removeObject: function(id, reqCtx) {}

CollectionOperation
  - allowUnauthenticated
  - responseSchema
  - options
    - name 
    - description
    - schema
    - required
  - *Schema (insertSchema)

OperationOption < OperationParameter


*/

})
