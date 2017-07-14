var url = require('url')

var _ = require('lodash')

var EJSON = require('@carbon-io/carbon-core').ejson
var _o = require('@carbon-io/carbon-core').bond._o(module)
var o = require('@carbon-io/carbon-core').atom.o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var CollectionOperationConfig = require('./CollectionOperationConfig')
var OperationResponse = require('../OperationResponse')

function _notImplemented(name) {
  return function() {
    throw new Error('"' + name + '" not implemented.')
  }
}

DEFAULT_ID_PARAMETER = '_id'

var Collection = oo({
  _type: '../Endpoint',

  /*****************************************************************************
   * @property ALL_COLLECTION_OPERATIONS
   */
  ALL_COLLECTION_OPERATIONS: [
    'find', 'findObject'
  ],

  /*****************************************************************************
   * @property defaultIdParameter
   */
  defaultIdParameter: DEFAULT_ID_PARAMETER,

  /*****************************************************************************
   * @property defaultIdHeader
   */
  defaultIdHeader: 'carbonio-id',

  /*****************************************************************************
   * @property defaultSchema
   *
   * This is the default schema used to validate all objects in this collection.
   * If a schema is not specified explicitly, this schema will be used.
   */
  defaultSchema: {
    type: 'object',
    properties: {
      [DEFAULT_ID_PARAMETER]: { type: 'string' }
    },
    required: [DEFAULT_ID_PARAMETER],
    additionalProperties: true
  },

  /*****************************************************************************
   * @property defaultErrorSchema
   *
   * This is the default error body schema.
   *
   * XXX: this is not configurable via `errorSchema` at present.
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

  /*****************************************************************************
   * FindConfigClass
   */
  FindConfigClass: _o('./FindConfig'),

  /*****************************************************************************
   * FindObjectConfigClass
   */
  FindObjectConfigClass: _o('./FindObjectConfig'),

  /*****************************************************************************
   * _C
   */
  _C: function() {
    /***************************************************************************
     * @property {object} [enabled] -- Control which collection level operations
     */
    this.enabled = { '*' : true }
    /***************************************************************************
     * @property {object} [schema] -- The schema used to validate objects in this
     *                                collection
     * @default {@link Collection.defaultSchema}
     */
    this.schema = undefined
    /***************************************************************************
     * @property {object} -- An example object for this collection
     */
    this.example = undefined
    /***************************************************************************
     * @property {object} -- An object with the method "generateId" that will be
     *                       called to populate <ID> if present and when
     *                       appropriate (e.g. Colleciont#insert)
     */
    this.idGenerator = undefined
    /***************************************************************************
     * @property {string} -- The <ID> parameter name (object and path parameter)
     */
    this.idParameter = this.defaultIdParameter
    /***************************************************************************
     * @property {string} -- The header name which should contain the EJSON
     *                       serialized <ID>
     */
    this.idHeader = this.defaultIdHeader
    /***************************************************************************
     * @property {object} -- See {@link carbond.Endpoint#endpoints}
     */
    this.endpoints = {}
    /***************************************************************************
     * @property {object} -- See {@link carbond.collections.FindConfig}
     */
    this.findConfig = undefined
    /***************************************************************************
     * @property {object} -- See {@link carbond.collections.FindObjectConfig}
     */
    this.findObjectConfig = undefined
  },

  /*****************************************************************************
   * _init
   */
  _init: function() {
    // validate schemas, etc...
    this._validate()
    // instantiate op configs using the appropriate config class (this allows
    // the implementor to specify configs as raw objects rather than instances
    // of the appropriate config objects)
    this._initializeCollectionOperationConfigs()
    // build the operations for this endpoint (including /<collection>/:<ID>/
    // endpoints)
    this._generateEndpointOperations()
    // build any child endpoints on top of /<collection>/:<ID>/<children>
    this._initializeChildEndpoints()
    // call super *last*
    _o('../Endpoint').prototype._init.call(this)
  },

  /******************************************************************************
   * @method find
   *
   * @param {object} context -- A map of options that apply to this operation
   * @param {number} context.skip -- The number of objects in the collection to
   *                                 skip over before compiling the result set
   * @param {number} context.limit -- The maximum number of objects to return
   * @param {*} context.* -- Other parameters specified in the config
   * @returns {object[]|null} -- A list of objects
   * @throws {@link carbond.collections.errors.CollectionError}
   */
  find: _notImplemented('find'),

  /******************************************************************************
   * @method findObject
   *
   * @param {*} id -- The object id
   * @param {object} context -- A map of options that apply to this operation
   * @param {*} context.* -- Other parameters specified in the config
   * @returns {Object|null} -- The found object or null
   * @throws {@link carbond.collections.errors.CollectionError}
   */
  findObject: _notImplemented('findObject'),

  /*****************************************************************************
   * supportsFind
   */
  supportsFind: {
    $property: {
      get: function() {
        return this._isEnabled('find')
      }
    }
  },

  /*****************************************************************************
   * supportsFindObject
   */
  supportsFindObject: {
    $property: {
      get: function() {
        return this._isEnabled('findObject')
      }
    }
  },

  /*****************************************************************************
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

  /*****************************************************************************
   * getOperationConfigFieldName
   */
  getOperationConfigFieldName: function(op) {
    if (!_.includes(this.ALL_COLLECTION_OPERATIONS, op)) {
      throw new Error('Unknown collection op: ' + op)
    }
    return op + 'Config'
  },

  /*****************************************************************************
   * getOperationConfigClassFieldName
   */
  getOperationConfigClass: function(op) {
    if (!_.includes(this.ALL_COLLECTION_OPERATIONS, op)) {
      throw new Error('Unknown collection op: ' + op)
    }
    return this[_.upperFirst(op) + 'ConfigClass']
  },

  /*****************************************************************************
   * getOperationConfig
   */
  getOperationConfig: function(op) {
    return this[this.getOperationConfigFieldName(op)]
  },

  /*****************************************************************************
   * _validate
   */
  _validate: function() {
    if (this.schema && !this._validateSchemaHasId(this.schema)) {
    }
  },

  /*****************************************************************************
   * _validateSchemaHasId
   */
  _validateSchemaHasId: function(schema) {
    if (schema.type === 'array') {
      // If schema is for an array, validate it's element schema
      return this._validateSchemaHasId(schema.items)
    } else if (schema && schema.properties && schema.properties[this.idParameter] &&
               _.includes(schema.required, this.idParameter)) {
      return schema
    }
    throw new Error('Invalid schema. ' + this.idParameter +
                    ' must be a property, and must be required: ' +
                    EJSON.stringify(this.schema))
  },

  /*****************************************************************************
   * _instantiateCollectionOperationConfig
   */
  _instantiateCollectionOperationConfig: function(op, config) {
    if (config instanceof CollectionOperationConfig) {
      return config
    }
    return o(config, this.getOperationConfigClass(op))
  },

  /*****************************************************************************
   * _initializeCollectionOperationConfigs
   */
  _initializeCollectionOperationConfigs: function() {
    var self = this

    self.ALL_COLLECTION_OPERATIONS.forEach(function(op) {
      var configObjectFieldName = self.getOperationConfigFieldName(op)
      self[configObjectFieldName] =
        self._instantiateCollectionOperationConfig(
          op, self[configObjectFieldName] || {})
    })
  },

  /*****************************************************************************
   * _generateEndpointOperations
   */
  _generateEndpointOperations: function() {
    this._generateEndpointOperationForFind()
    this._generateEndpointOperationForFindObject()
  },

  /******************************************************************************
   * configureFindOperation
   */
  configureFindOperation: function() {
    // Find the CollectionOperationConfig for this operation
    var config = this.getOperationConfig('find')

    // Create the default responses descriptor
    var defaultResponses = [
      {
        statusCode: 200,
        description: 'Returns an array of objects. Each object has an ' +
                     this.idParameter +
                     ' and possible additional properties.',
        schema: {
          type: 'array',
          items: this.schema || this.defaultSchema
        }
      }
    ]

    if(this.example) {
      defaultResponses[0].example = this.example
    }

    return {
      opConfig: config,
      defaultResponses: defaultResponses
    }
  },

  /******************************************************************************
   * preFindOperation
   *
   * @return {object} -- Find operation context for this request
   */
  preFindOperation: function(config, req, res) {
    var skip = _.get(req.parameters, 'skip', 0)
    var limit = _.get(req.parameters, 'limit', config.opConfig.pageSize)
    if (!_.isNil(config.opConfig.maxPageSize)) {
      limit = _.min([limit, config.opConfig.maxPageSize])
    }
    if (config.opConfig.supportsPagination) {
      var page = _.get(req.parameters, 'page', 0)
      skip += page * config.opConfig.pageSize
    }
    return _.assignIn(
      {skip: skip, limit: limit},
      _.pick(
        req.parameters,
        _.difference(
          _.keys(req.parameters),
          ['skip', 'limit', 'page'])))
  },

  /******************************************************************************
   * postFindOperation
   */
  postFindOperation: function(result, config, req, res) {
    if (!_.isArray(result)) {
      throw new Error('Unexpected value returned from find. Expected array ' +
                      'and got: ' + result)
    }
    var links = {}
    if (req.parameters.page > 0) {
      links.prev = url.format({
        protocol: req.protocol,
        hostname: req.hostname,
        port: this.service.port,
        pathname: req.path,
        query: _.pickBy({
          page: _.get(req.query, 'page', -1) - 1,
          skip: _.get(req.query, 'skip', -1),
          limit: _.get(req.query, 'limit', -1),
        }, function(value, key) {
          return value >= 0
        })
      })
    }
    if (_.isArray(result) && result.length >= config.opConfig.pageSize) {
      links.next = url.format({
        protocol: req.protocol,
        hostname: req.hostname,
        port: this.service.port,
        pathname: req.path,
        query: _.pickBy({
          page: _.get(req.query, 'page', 0) + 1,
          skip: _.get(req.query, 'skip', -1),
          limit: _.get(req.query, 'limit', -1),
        }, function(value, key) {
          return value >= 0
        })
      })
    }
    if (_.keys(links).length > 0) {
      res.links(links)
    }
    return result
  },

  /*****************************************************************************
   * _generateEndpointOperationForFind
   */
  _generateEndpointOperationForFind: function() {
    if (this.supportsFind) {
      var self = this
      var config = this.configureFindOperation()
      this.get = {
        description: config.opConfig.description || 'Find objects in this Collection.',
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters,
        responses: self._makeResponses(
          'find', config.opConfig, config.defaultResponses, true),
        service: function(req, res) {
          var context = self.preFindOperation(config, req, res)
          var result = self.find(context)
          return self.postFindOperation(result, config, req, res)
        }
      }
    }
  },

  /*****************************************************************************
   * configureFindObjectOperation
   */
  configureFindObjectOperation: function() {
    var config = this.getOperationConfig('findObject')

    var defaultResponses = [
      {
        statusCode: 200,
        description: 'Returns the object resource found at this URL ' +
                     'specified by id.',
        schema: this.schema || this.defaultSchema,
        headers: []
      }
    ]

    if(this.example) {
      defaultResponses[0].example = this.example
    }

    return {
      opConfig: config,
      defaultResponses: defaultResponses
    }
  },

  /*****************************************************************************
   * preFindObjectOperation
   */
  preFindObjectOperation: function(config, req, res) {
    return _.assignIn(
      {[this.idParameter]: req.parameters[this.idParameter]},
      _.pick(
        req.parameters,
        _.difference(
          _.keys(req.parameters,
          [this.idParameter]))))
  },

  /*****************************************************************************
   * postFindObjectOperation
   */
  postFindObjectOperation: function(result, config, req, res) {
    if (_.isNil(result)) {
      throw new this.endpoint.service.errors.NotFound(
        this.idParameter + ': ' + id)
    }
    return result
  },

  /*****************************************************************************
   * _generateEndpointOperationForFindObject
   */
  _generateEndpointOperationForFindObject: function() {
    if (this.supportsFindObject) {
      var self = this
      var config = self.configureFindObjectOperation()
      var objectSubEndpoint = self._getObjectSubEndpoint()
      objectSubEndpoint.get = o({
        _type: '../Operation',
        description: config.opConfig.description ||
                     'Find an object in this Collection by ' + self.idParameter,
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters || {},
        responses: self._makeResponses(
          'findObject', config.opConfig, config.defaultResponses, true),
        endpoint: objectSubEndpoint,
        service: function(req, res) {
          var context = self.preFindObjectOperation(config, req, res)
          var result = self.findObject(context[self.idParameter],
                                       _.omit(context, self.idParameter))
          return self.postFindObjectOperation(result, config, req, res)
        }
      })
    }
  },

  /*****************************************************************************
   * _initializeChildEndpoints
   */
  _initializeChildEndpoints: function() {
    var self = this

    // Sub endpoints are really meant as sub-endpoints of :<ID>/
    // so we move them there (except :<ID> itself)
    var childEndpoints = self.endpoints
    _.forIn(childEndpoints, function(childEndpoint, path) {
      if (path !== ':' + self.idParameter) {
        self._getObjectSubEndpoint().endpoints[path] = childEndpoint
        delete self.endpoints[path]
      }
    })
  },

  /*****************************************************************************
   * _getObjectSubEndpoint
   */
  _getObjectSubEndpoint: function() {
    var subEndpointPath = ':' + this.idParameter
    if (!this.endpoints[subEndpointPath]) {
        this.endpoints[subEndpointPath] = this._makeObjectSubEndpoint()
    }

    return this.endpoints[subEndpointPath]
  },

  /*****************************************************************************
   * _makeObjectSubEndpoint
   */
  _makeObjectSubEndpoint: function() {
    var self = this

    // See if schema has a type for <ID> defined
    var schema = this.schema || this.defaultSchema
    var idSchema = undefined
    if (schema && schema.properties && schema.properties[this.idParameter]) {
        idSchema = schema.properties[this.idParameter]
    }

    // parameters
    var parameters = {}
    var idParameterName = this.idParameter[0] === ':' ?
        this.idParameter.substring(1) :
        this.idParameter

    parameters[idParameterName] = {
      description: 'Object ' + this.idParameter,
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
          if (permission === 'options') {
            return true
          }

          return false
        }
      }),

      endpoints: {}
    })
  },

  /*****************************************************************************
   * _makeResponses
   */
  _makeResponses: function(op, config, defaultResponses, validateResponseSchemasHaveId) {
    var self = this
    var responses = defaultResponses || []
    if (_.isObjectLike(config) &&
        _.isArrayLike(config.responses) &&
        config.responses.length > 0) {
      responses = config.responses
    }
    responses = _.map(responses, function(responseDescriptor) {
      responseDescriptor = self._normalizeResponseDescriptor(responseDescriptor)
      if (validateResponseSchemasHaveId && !self._validateSchemaHasId(responseDescriptor.schema)) {
        throw new Error('Invalid schema. ' + self.idParameter +
                        ' must be a property, and must be required: ' +
                        EJSON.stringify(responseDescriptor.schema))
      }
      return responseDescriptor
    })

    // Consider NotFound
    if (_.includes(['findObject', 'updateObject', 'removeObject'], op)) {
      responses.push({
        statusCode: 404,
        description: 'Collection resource cannot be found by the supplied ' +
                     self.idParameter + '.',
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

  /*****************************************************************************
   * _normalizeAndResponseDescriptor
   */
  _normalizeResponseDescriptor: function(responseDescriptor) {
    var result = {
      statusCode: responseDescriptor.statusCode || 200,
      description: responseDescriptor.description,
      schema: this._normalizeSchema(responseDescriptor.schema),
      headers: responseDescriptor.headers || []
    }
    if(responseDescriptor.example) {
      result.example = responseDescriptor.example
    }
    return result
  },

  /*****************************************************************************
   * _normalizeSchema
   */
  _normalizeSchema: function(schema) {
    schema = _.cloneDeep(schema)

    if (schema) {
      if (schema.type === 'array') {
        schema.items = this._normalizeSchema(schema.items)
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

  /*****************************************************************************
   * _unrequireIdPropertyFromSchema
   */
  _unrequireIdPropertyFromSchema: function(schema) {
    var result = schema
    if (schema.properties[this.idParameter]) {
      result = _.clone(schema)
      if (result.required) {
        result.required = _.difference(result.required, [this.idParameter])
        if (_.isEmpty(result.required)) {
          delete result.required
        }
      }

      if (result.additionalProperties) {
        delete result.additionalProperties
      }
    }

    return result
  },
})

module.exports = Collection
