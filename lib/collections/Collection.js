var _ = require('lodash')

var EJSON = require('@carbon-io/carbon-core').ejson
var _o = require('@carbon-io/carbon-core').bond._o(module)
var o = require('@carbon-io/carbon-core').atom.o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var OperationResponse = require('../OperationResponse')

/******************************************************************************
 * @class Collection
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */
  _type: '../Endpoint',

  /**********************************************************************
   * ALL_COLLECTION_OPERATIONS
   */        
  ALL_COLLECTION_OPERATIONS: [
    'insert', 'find', 'update', 'remove',
    'saveObject', 'findObject', 'updateObject', 'removeObject'
  ],

  /**********************************************************************
   * defaultIdHeader
   */ 
  defaultIdHeader: 'carbonio-id',

  /**********************************************************************
   * defaultSchema
   */ 
  defaultSchema: {
    type: 'object',
    properties: {
      _id: { type: 'string' }
    },
    required: ['_id'],
    additionalProperties: true
  },

  /**********************************************************************
   * defaultErrorSchema
   */ 
  defaultErrorSchema: {
    type: 'object',
    properties: {
      code: { type: 'integer' },
      description: { type: 'string' },
      message: { type: 'string' },
    },
    required: ['code', 'description', 'message']
  },

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.enabled = { '*' : true }
    this.schema = undefined
    this.idGenerator = undefined
    this.idRequiredOnInsert = false // Controls how insertSchema is generated in default case
    this.idPathParameter = '_id' // XXX make _id?
    this.idHeader = undefined
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
      throw new Error('Unknown collection op: ' + op)
    }

    return this[op + 'Config'] || {}
  },

  /**********************************************************************
   * _validate
   */
  _validate: function() {
    if (this.schema && !this._validateSchemaHasId(this.schema)) {
      throw new Error('Invalid schema. _id must be a property, and must be required: ' + 
                      EJSON.stringify(this.schema))
    }
  },

  /**********************************************************************
   * _validateSchemaHasId
   */
  _validateSchemaHasId: function(schema) {
    if (schema.type === 'array') {
      if (this._validateSchemaHasId(schema.items)) {
        return schema.items
      } else {
        return false
      }
    }

    if (schema && schema.properties && schema.properties._id && _.includes(schema.required, '_id')) {
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

      // Schema. We deal with this slightly differently than other operations. 
      // We delete _id in some cases.
      var schema = config.insertSchema || self.schema || self.defaultSchema

      // _id header name
      var idHeader = self.idHeader || self.defaultIdHeader

      // Create the default responses descriptor
      var defaultResponses = [
        {
          statusCode: 201,
          description: 'Returns the URL of the newly inserted object ' +
                       'in the Location header of the response.',
          schema: { type: 'Undefined' }, 
          headers: ['Location', idHeader]
        }
      ]

      // Create a 'post' operation on this endpoint to implement collection insert
      self.post = {
        description: config.description || 
                     'Insert an object into this Collection.',
        parameters: {
          'body' : { // XXX can we stop need body -- is swagger bug fixed yet?
            description: 'Object to insert',
            location: 'body', 
            required: true, // XXX Swagger UI does not seem to be enforcing 
                            //     this (unlike elsewhere with path params)
            schema: (self.idRequiredOnInsert ? 
                        self._normalizeSchema(schema) : 
                        self._unrequireIdPropertyFromSchema(schema))
          }
        },          
        responses: self._makeResponses('insert', config, defaultResponses, false),
        
        service: function(req, res) {
          var obj = req.parameters.body // XXX make obj instead of body (for 
                                        // name)? Must be body for Swagger 2.0 
                                        // UI bug
          if (!obj) {
            throw new this.endpoint.service.errors.BadRequest(
              'Body required (JSON)')
          }

          // generate _id if id generator exists
          if (self.idGenerator) {
            if (obj._id === undefined) {
              obj._id = self.idGenerator.generateId()
            }
          }
          // Note this will always be sync.
          var result = self.insert(obj, { req: req, res: res }) 
          res.status(201) 
          // No need to EJSON serialize here. String and ObjectId turn out how 
          // we want. Other EJSON (like Date) not allowed.
          var location = req.path + '/' + result._id 
          res.header('Location', location)
          res.header(idHeader, EJSON.stringify(result._id))
          // Must convert undefined to null for Service to know to commit 
          // the response.
          return null 
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
      
      // Create the default responses descriptor
      var defaultResponses = [
        {
          statusCode: 200,
          description: 'Returns an array of objects. Each object has an _id ' +
                       'and possible additional properties.',
          schema: {
            type: 'array',
            items: self.schema || self.defaultSchema
          }
        }
      ]

      var parameters = _.assignIn({ // Merge defined config parameters with query parameter.
        query: {
          description: 'Query spec (JSON)',
          schema: config.querySchema || { type: 'object' },
          location: 'query',
          required: false
        },
      }, config.parameters)

      // Remove query if not supported (we delete vs not add in case config.parameters has it)
      if (config.supportsQuery === false) {
        delete parameters.query
      }

      // Create a 'get' operation on this endpoint to implement collection find
      this.get = {
        description: config.description || 'Find objects in this Collection.',
        parameters: parameters,
        responses: self._makeResponses('find', config, defaultResponses, true),

        service: function(req, res) {
          var result = self.find(req.parameters.query, { req: req, res: res })
          if (!_.isArray(result)) {
            throw new Error('Unexpected value returned from find. Expected array and got: ' + result)
          }
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

      // Create the default responses descriptor
      var defaultResponses = [
        {
          statusCode: 200,
          description: 'Returns an update result specifying the number of documents updated.',
          schema:  { 
            type: 'object',
            properties: {
              n: { type: 'integer' } // Respond with the number of items updated
            },
            required: [ 'n' ],
            additionalProperties: false
          },
          headers: []
        }
      ]

      // Create a 'patch' operation on this endpoint to implement Collection update
      this.patch = {
        description: config.description || 'Update objects in this Collection.',
        parameters: _.assignIn({ // Merge defined config parameters with query parameter.
          query: {
            schema: config.querySchema || { type: 'object' },
            location: 'query',
            required: false
          },
          body: { 
            location: 'body', 
            description: 'Update spec (JSON). Update operator (e.g {"$inc": {"n": 1}})',
            schema: config.updateSchema || { 
              type: 'object'
            }, 
            required: true
          },
        }, config.parameters),
        responses: self._makeResponses('update', config, defaultResponses, false), 

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

      // Create the default responses descriptor
      var defaultResponses = [
        {
          statusCode: 200,
          description: 'Returns a remove result specifying the number of documents removed.',

          schema:  { 
            type: 'object',
            properties: {
              n: { type: 'integer' } // Respond with the number of items removed
            },
            required: [ 'n' ],
            additionalProperties: false
          },
        }
      ]

      // create a 'delete' operation on this endpoint to implement collection remove
      this.delete = {
        description: config.description || 'Remove objects from this Collection.',
        parameters: _.assignIn({ // Merge defined config parameters with query parameter.
          query: {
            schema: config.querySchema || { type: 'object' },
            location: 'query',
            required: false
          }
        }, config.parameters),
        responses: self._makeResponses('remove', config, defaultResponses, false), 

        // service
        service: function(req, res) {
          // -- IMPORTANT --
          // This is not the same impl as collection read where query param is optional and defaults to {}
          // The query param is required. This is for saftey reasons and to make it harder to unintentionally
          // delete the whole collection
          if (!req.parameters.query) {
            throw new this.endpoint.service.errors.BadRequest('Must supply a query via the "query" url param')
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

      // Create the default responses descriptor
      var defaultResponses = [
        {
          statusCode: 201,
          description: 'Returns the URL of the newly inserted object ' +
            'in the Location header of the response.',
          schema: { type: 'Undefined' }, 
          headers: ['Location', self.idHeader]
        },
        {
          statusCode: 204,
          description: 'Returns no content.',
          schema: { type: 'Undefined' }, 
          headers: []
        },
      ]
      
      // _id header name
      var idHeader = self.idHeader || self.defaultIdHeader

      var objectSubEndpoint = self._getObjectSubEndpoint()
      objectSubEndpoint.put = o({
        // We need to use _type here because we are doing it after Endpoint 
        // initialization
        // XXX maybe if we had Endpoint.setOperation we would be good
        _type: '../Operation', 
        description: config.description || 
                     'Save an object to this Collection. Will insert if ' +
                     'does not exist.',
        // Merge defined config parameters with body parameter.
        parameters: _.assignIn({ 
          body: { 
            // XXX make obj instead of body (for name)? Must be body for 
            // Swagger 2.0 UI bug
            location: 'body', 
            description: 'Full object for update. Must contain _id field ' +
                         'that has the same value as the id in the path.',
            schema: self._validateSchemaHasId(
              self._normalizeSchema(config.saveSchema || 
                                    self.schema || 
                                    self.defaultSchema)),
            required: true
          }
        }, config.parameters),
        responses: self._makeResponses(
          'saveObject', config, defaultResponses, false),
                                                  
        // Convenience
        endpoint: objectSubEndpoint,

        service: function(req, res) {
          var id = req.parameters[self.idPathParameter]
          var body = req.parameters.body 

          if (body) {
            if (EJSON.stringify(id) !== EJSON.stringify(body._id)) { 
              // XXX Is there more efficient compare?
              throw new self.endpoint.service.errors.BadRequest(
                'Path id must be equal to body._id')
            }
            var result = self.saveObject(body, { req: req, res: res })

            if (result === true) { // This was an upsert, success
              res.status(201)
              // No need to EJSON serialize here. String and ObjectId turn 
              // out how we want. 
              // Other EJSON (like Date) not allowed.
              var location = req.path // _id is already a part of the path 
                                      // since this is a object operation
              res.header('Location', location)
              res.header(idHeader, EJSON.stringify(id))
              return null
            } else if (result === null || result === undefined) { 
              res.status(204)
              // Update case, success
              return null // Must convert undefined to null for Service to 
                          // know to commit the response.
            } else if (result === false) { // Update case, not found
              throw new this.endpoint.service.errors.NotFound('_id: ' + id)
            }

            return result // If this is a type that does not conform to 
                          // schema error will occur there
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

      // Create the default responses descriptor
      var defaultResponses = [
        {
          statusCode: 200,
          description: 'Returns the object resource found at this URL specified by id.',
          schema: self.schema || self.defaultSchema, // FindObjectConfig does not support customization
          headers: []
        }
      ]

      var objectSubEndpoint = self._getObjectSubEndpoint()
      objectSubEndpoint.get = o({
        // We need to use _type here because we are doing it after Endpoint initialization
        // XXX maybe if we had Endpoint.setOperation we would be good
        _type: '../Operation',

        description: config.description || 'Find an object in this Collection by _id.',
        // No need to take care of id parameter. Done by sub-Endpoint object
        parameters: {},
        responses: self._makeResponses('findObject', config, defaultResponses, true),

        // Convenience
        endpoint: objectSubEndpoint,

        service: function(req, res) {
          var id = req.parameters[self.idPathParameter]
          var result = self.findObject(id, { req: req, res: res })
          if (_.isNil(result)) {
            throw new this.endpoint.service.errors.NotFound(self.idPathParameter + ': ' + id)
                                                        
          }
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
      
      // Create the default responses descriptor
      var defaultResponses = []
      if (config.returnsUpdatedObject) {
        defaultResponses.push({
          statusCode: 200,
          description: 'Returns the updated object.',
          schema: self.schema || self.defaultSchema
        })
      } else if (config.returnsOriginalObject) {
        defaultResponses.push({
          statusCode: 200,
          description: 'Returns the original object.',
          schema: self.schema || self.defaultSchema
        })
      } else {
        defaultResponses.push({
          statusCode: 204,
          description: 'Returns no content.',
          schema: { type: 'Undefined' }
        })
      }

      var objectSubEndpoint = self._getObjectSubEndpoint()
      objectSubEndpoint.patch = o({
        // We need to use _type here because we are doing it after Endpoint initialization
        // XXX maybe if we had Endpoint.setOperation we would be good
        _type: '../Operation',

        description: config.description || 'Update an object in this Collection.',
        parameters: _.assignIn({ // Merge defined config parameters with body parameter.
          body: { // XXX make obj instead of body (for name)? Must be body for Swagger 2.0 UI bug
            location: 'body', 
            description: 'Update spec (JSON). Update operator (e.g {"$inc": {"n": 1}})',
            schema: config.updateSchema || {  type: 'object' }, 
            required: true
          }
        }, config.parameters),
        responses: self._makeResponses('updateObject', config, defaultResponses, false),

        // Convenience
        endpoint: objectSubEndpoint,

        // service
        service: function(req, res) { 
          var _id = req.parameters[self.idPathParameter]
          var body = req.parameters.body
          if (body) {
            var result = self.updateObject(_id, body, { req: req, res: res })

            // Handle different return value cases
            if (config.returnsUpdatedObject || config.returnsOriginalObject) {
              // Coerce empty or false result
              if (result === null || result === undefined || result === false) {
                throw new this.endpoint.service.errors.NotFound('_id: ' + _id)
              }
            } else { // Returns nothing (default)
              // Coerce boolean or empty results
              if (result === false) {
                throw new this.endpoint.service.errors.NotFound('_id: ' + _id)
              } else if (result === null || result === undefined || result === true) {
                res.status(204)
                return null // Must convert undefined to null for Service to know to commit the response. 
              }
            }
            return result
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

      // Create the default responses descriptor
      var defaultResponses = []
      if (config.returnsRemovedObject) {
        defaultResponses.push({
          statusCode: 200,
          description: 'Returns the removed object.',
          schema: self.schema || self.defaultSchema
        })
      } else {
        defaultResponses.push({
          statusCode: 204,
          description: 'Returns no content.',
          schema: { type: 'Undefined' }
        })
      }

      var objectSubEndpoint = self._getObjectSubEndpoint()
      objectSubEndpoint.delete = o({
        _type: '../Operation', 

        description: config.description || 'Remove an object from this Collection by _id.',
        responses: self._makeResponses('removeObject', config, defaultResponses, false),

        // Convenience
        endpoint: objectSubEndpoint,

        // service
        service: function(req, res) {
          var _id = req.parameters[self.idPathParameter]
          var result = self.removeObject(_id, { req: req, res: res }) // Impl *may* throw Error

          // Handle different return value cases
          if (config.returnsRemovedObject) {
            // Coerce empty or false result
            if (result === null || result === undefined || result === false) {
              throw new this.endpoint.service.errors.NotFound('_id: ' + _id)
            }
          } else { // Returns nothing (default)
            // Coerce boolean or empty results
            if (result === false) {
              throw new this.endpoint.service.errors.NotFound('_id: ' + _id)
            } else if (result === null || result === undefined || result === true) {
              res.status(204)
              return null // Must convert undefined to null for Service to know to commit the response. 
            }
          }
          return result
        }
      })
    }
  },

  /**********************************************************************
   * _initializeChildEndpoints
   */
  _initializeChildEndpoints: function() {
    var self = this

    // Sub endpoints are really meant as sub-endpoints of :_id/
    // so we move them there (excpet :_id itself)
    var childEndpoints = self.endpoints
    _.forIn(childEndpoints, function(childEndpoint, path) {
      if (path !== ':' + self.idPathParameter) {
        self._getObjectSubEndpoint().endpoints[path] = childEndpoint
        delete self.endpoints[path]
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
    var idSchema = (this.schema || this.defaultSchema)._id
    if (this.schema && this.schema.properties && this.schema.properties._id) {
        idSchema = this.schema.properties._id
    }

    // parameters
    var parameters = {}
    var idParameterName = self.idPathParameter[0] === ':' ? 
        self.idPathParameter.substring(1) : 
        self.idPathParameter

    parameters[idParameterName] = {
      description: 'Object _id',
      location: 'path',
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
   * _makeResponses
   */
  _makeResponses: function(op, config, defaultResponses, validateResponseSchemasHaveId) {
    var self = this

    var responses = (config && config.responses && config.responses.length > 0) || defaultResponses || []
    responses = _.map(responses, function(responseDescriptor) {
      responseDescriptor = self._normalizeResponseDescriptor(responseDescriptor)
      if (validateResponseSchemasHaveId && !self._validateSchemaHasId(responseDescriptor.schema)) {
        throw new Error('Invalid schema. _id must be a property, and must be required: ' + 
                        EJSON.stringify(responseDescriptor.schema))
      }
      return responseDescriptor
    })

    // Consider NotFound
    if (_.includes(['findObject', 'updateObject', 'removeObject'], op)) {
      responses.push({
        statusCode: 404,
        description: 'Collection resource cannot be found by the supplied _id.',
        schema: self.defaultErrorSchema
      })
    }

    // Consider BadRequest
    if (!_.includes(['removeObject'], op)) {
      if (!_.find(responses, function(r) { return r.statusCode === 400 })) {
        responses.push({
          statusCode: 400,
          description: 'Request is malformed (i.e. invalid parameters).',
          schema: self.defaultErrorSchema
        })
      }
    }

    // Add Forbidden
    if (!_.find(responses, function(r) { return r.statusCode === 403 })) {
      responses.push({
        statusCode: 403,
        description: 'User is not authorized to run this operation.',
        schema: self.defaultErrorSchema
      })
    }

    // Add InternalServerError
    if (!_.find(responses, function(r) { return r.statusCode === 500 })) {
      responses.push({
        statusCode: 500,
        description: 'There was an unexpected internal error processing this request.',
        schema: self.defaultErrorSchema
      })
    }

    return responses
  },

  /**********************************************************************
   * _normalizeAndResponseDescriptor
   */
  _normalizeResponseDescriptor: function(responseDescriptor) {
    var result = {
      statusCode: responseDescriptor.statusCode || 200,
      description: responseDescriptor.description,
      schema: this._normalizeSchema(responseDescriptor.schema),
      headers: responseDescriptor.headers || []
    }
    
    return result
  },

  /**********************************************************************
   * _normalizeSchema
   */
  _normalizeSchema: function(schema) {
    if (schema) {
      if (schema.type === 'array') {
        this._normalizeSchema(schema.items)
        return schema
      }

      if (_.isEmpty(schema.properties)) {
        delete schema.properties
      }

      if (_.isEmpty(schema.required)) {
        delete schema.required
      }

      if (schema.additionalProperties) { // XXX maybe not?
        delete schema.additionalProperties
      }
    }

    return schema
  },

  /**********************************************************************
   * _unrequireIdPropertyFromSchema
   */
  _unrequireIdPropertyFromSchema: function(schema) {
    var result = schema
    if (schema.properties._id) {
      result = _.clone(schema)
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
  
/* Abstract interface

  insert: function(obj, reqCtx) {},
  find: function(query, reqCtx) {},  // MongoDBCollection would add Parameters like skip and limit. Would be in reqCtx
  update: function(query, update, reqCtx) {}, // MongoDBCollection would add Parameters as needed. Would be in reqCtx
  remove: function(query, reqCtx) {},
  findObject: function(id, reqCtx) {},
  saveObject: function(object, reqCtx) {},
  updateObject: function(id, update, reqCtx) {},
  removeObject: function(id, reqCtx) {}

*/

})
