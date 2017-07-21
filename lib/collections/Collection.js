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
    'insert',
    'insertObject',
    'find',
    'findObject'
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
   * InsertConfigClass
   */
  InsertConfigClass: _o('./InsertConfig'),

  /*****************************************************************************
   * InsertObjectConfigClass
   */
  InsertObjectConfigClass: _o('./InsertObjectConfig'),

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
    this.enabled = { '*' : false }

    /***************************************************************************
     * @property {object} [schema] -- The schema used to validate objects in this
     *                                collection
     * @default {@link Collection.defaultSchema}
     */
    this.schema = this.defaultSchema

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
     * @property {object} -- See {@link carbond.collections.InsertConfig}
     */
    this.insertConfig = undefined

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
   * @method insert
   *
   * @param {Array} objects -- An array of objects to insert
   * @param {object} context -- A map of options that apply to this operation
   * @param {number} context.skip -- The number of objects in the collection to
   *                                 skip over before compiling the result set
   * @param {number} context.limit -- The maximum number of objects to return
   * @param {*} context.* -- Other parameters specified in the config
   * @returns {object[]|null} -- A list of inserted objects
   * @throws {@link carbond.collections.errors.CollectionError}
   */
  insert: _notImplemented('insert'),

  /******************************************************************************
   * @method insertOne
   *
   * @param {object} object -- The object to insert
   * @param {object} context -- A map of options that apply to this operation
   * @param {number} context.skip -- The number of objects in the collection to
   *                                 skip over before compiling the result set
   * @param {number} context.limit -- The maximum number of objects to return
   * @param {*} context.* -- Other parameters specified in the config
   * @returns {object|null} -- The inserted object
   * @throws {@link carbond.collections.errors.CollectionError}
   */
  insertObject: _notImplemented('insertObject'),

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
  supportsInsert: {
    $property: {
      get: function() {
        return this._isEnabled('insert')
      }
    }
  },

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
    config = o(config, this.getOperationConfigClass(op))
    config.idParameter = this.idParameter
    return config
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
    this._generateEndpointOperationForInsertAndInsertObject()
    this._generateEndpointOperationForFind()
    this._generateEndpointOperationForFindObject()
  },

  /*****************************************************************************
   * _mergeInsertSchemas
   */
  _mergeInsertSchemas: function(insertObjectSchema, insertSchema) {
    schema = {
      oneOf: [
        insertObjectSchema,
        insertSchema
      ]
    }
  },

  /*****************************************************************************
   * configureInsertOperation
   */
  configureInsertOperation: function() {
    var config = this.getOperationConfig('insert')

    // insert schema

    var insertSchema = config.insertSchema || this.schema

    if (insertSchema.type !== 'array') {
      insertSchema = {
        type: 'array',
        items: insertSchema
      }
    }

    if (_.isArray(insertSchema.items)) {
      throw new TypeError(
        'Tuple validation is not supported: ' + util.inspect(insertSchema))
    }

    // NOTE: removal of any <ID> parameter is handled by the config class
    config.parameters.body.schema = insertSchema

    // result schema

    var resultSchema = {
      type: 'array',
      items: this.schema
    }

    // responses

    var defaultResponses = [
      {
        statusCode: 201,
        description: 'Returns the URL of the newly inserted object(s) ' +
                     'in the Location header of the response.',
        schema: config.returnsInsertedObjects ?
                  resultSchema :
                  {type: 'undefined'},
        headers: ['Location', this.idHeader]
      }
    ]

    // example

    var example = config.example ||
      (config.insertSchema ? undefined : [this.example])

    if (example) {
      defaultResponses[0].example = example
    }

    // config

    return {
      opConfig: config,
      defaultResponses: defaultResponses
    }
  },

  /*****************************************************************************
   * configureInsertObjectOperation
   */
  configureInsertObjectOperation: function() {
    var config = this.getOperationConfig('insertObject')

    // schema

    var insertSchema = config.insertSchema || this.schema

    // NOTE: removal of any <ID> parameter is handled by the config class
    config.parameters.body.schema = insertSchema

    // result schema

    var resultSchema = this.schema

    // responses

    var defaultResponses = [
      {
        statusCode: 201,
        description: 'Returns the URL of the newly inserted object ' +
                     'in the Location header of the response.',
        schema: config.returnsInsertedObject ?
                  resultSchema :
                  {type: 'undefined'},
        headers: ['Location', this.idHeader]
      }
    ]

    // example

    var example = config.example ||
      (config.insertSchema ? undefined : this.example)

    if (example) {
      defaultResponses[0].example = example
    }

    // config

    return {
      opConfig: config,
      defaultResponses: defaultResponses
    }
  },

  /******************************************************************************
   * preInsertOperation
   *
   * @return {object} -- Find operation context for this request
   */
  preInsertOperation: function(config, req, res) {
    var self = this
    var obj = req.parameters.body

    for (var i = 0; i < obj.length; i++) {
      if (!_.isNil(obj[i][this.idParameter])) {
        throw new this.service.errors.BadRequest(
          '"' + this.idParameter +'" is not allowed on insert')
      }
    }

    // generate <ID> if a generator exists
    if (this.idGenerator) {
      obj.forEach(function(obj) {
        obj[self.idParameter] = self.idGenerator.generateId()
      })
    }

    return req.parameters
  },

  /******************************************************************************
   * preInsertObjectOperation
   *
   * @return {object} -- Find operation context for this request
   */
  preInsertObjectOperation: function(config, req, res) {
    var self = this
    var obj = req.parameters.body

    if (!_.isNil(obj[this.idParameter])) {
      throw new this.service.errors.BadRequest(
        '"' + this.idParameter +'" is not allowed on insert')
    }

    // generate <ID> if a generator exists
    if (this.idGenerator) {
      obj[self.idParameter] = self.idGenerator.generateId()
    }

    return req.parameters
  },

  /******************************************************************************
   * postInsertOperation
   */
  postInsertOperation: function(result, config, req, res) {
    var self = this
    res.status(201)
    // No need to EJSON serialize here. String and ObjectId turn out how
    // we want. Other EJSON (like Date) not allowed.
    var location = url.format({
      pathname: _.trimEnd(req.path, '/'),
      query: {
        [this.idParameter]: _.map(result, function(obj) {
          return obj[self.idParameter].toString()
        })
      }
    })
    res.header('Location', location)
    res.header(
      self.idHeader,
      _.map(result, function(obj) {
        return EJSON.stringify(obj[self.idParameter])
      }))
    // Must convert undefined to null for Service to know to commit
    // the response.
    return !_.isNil(config.opConfig.returnsInsertedObjects) ? result : null
  },

  /******************************************************************************
   * postInsertObjectOperation
   */
  postInsertObjectOperation: function(result, config, req, res) {
    res.status(201)
    var location =
      path.normalize(
        path.join(_.trim(req.path, '/'), result[self.idParameter].toString()))
    res.header('Location', location)
    res.header(self.idHeader, EJSON.stringify(result[self.idParameter]))
    return !_.isNil(config.opConfig.returnsInsertedObject) ? result : null
  },

  /*****************************************************************************
   * _generateEndpointOperationForInsertAndInsertObject
   */
  _generateEndpointOperationForInsertAndInsertObject: function() {
    if (this.supportsInsert || this.supportsInsertObject) {
      var self = this
      var config = undefined
      var insertConfig = this.configureInsertOperation()
      var insertObjectConfig = this.configureInsertObjectOperation()
      if (this.supportsInsert && this.supportsInsertObject) {
        config = {
          opConfig: {
            description: insertConfig.opConfig.description,
            noDocument: insertConfig.opConfig.noDocument ||
                        insertObjectConfig.opConfig.noDocument,
            allowUnauthenticated: insertConfig.opConfig.allowUnauthenticated &&
                                  insertObjectConfig.opConfig.allowUnauthenticated,
            returnsInsertedObjects: insertConfig.opConfig.returnsInsertedObjects,
            returnsInsertedObject: insertObjectConfig.opConfig.returnsInsertedObject,
            example: insertConfig.opConfig.example ||
                     insertObjectConfig.opConfig.example,
            parameters: _.clone(insertConfig.opConfig.parameters)
          },
          defaultResponses: _.clone(insertConfig.defaultResponses)
        }
        // fix up request body schema
        config.opConfig.parameters.body = _.clone(config.opConfig.parameters.body)
        config.opConfig.parameters.body.schema = {
          oneOf: [
            insertConfig.opConfig.parameters.body.schema,
            insertObjectConfig.opConfig.parameters.body.schema
          ]
        }
        var successResponsePred = function(response) {
          return response.statusCode === 201
        }
        // fix up success response body schema
        var insertSuccessResponseIndex =
          _.findIndex(insertConfig.defaultResponses, successResponsePred)
        var insertObjectSuccessResponseIndex =
          _.findIndex(insertObjectConfig.defaultResponses, successResponsePred)
        var successResponse =
          _.clone(insertConfig.defaultResponses[insertSuccessResponseIndex])
        successResponse.schema = {
          oneOf: [
            insertConfig.defaultResponses[insertSuccessResponseIndex].schema,
            insertObjectConfig.defaultResponses[insertObjectSuccessResponseIndex].schema,
          ]
        }
        var successResponseIndex =
          _.findIndex(config.defaultResponses, successResponsePred)
        config.defaultResponses[successResponseIndex] = successResponse
      } else if (this.supportsInsert) {
        config = insertConfig
      } else if (this.supportsInsertObject) {
        config = insertObjectConfig
      }
      self.post = {
        description: config.opConfig.description ||
                     'Insert object(s) into this Collection.',
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters,
        responses: self._makeResponses(
          ['insert', 'insertObject'], config.opConfig, config.defaultResponses, false),
        service: function(req, res) {
          var context = undefined
          var result = undefined
          if (_.isArray(req.parameters.body)) {
            if (!self.supportsInsert) {
              throw new Error('Got an array but supportsInsert === false')
            }
            context = self.preInsertOperation(config, req, res)
            result = self.insert(context.body, _.omit(context, 'body'))
            return self.postInsertOperation(result, config, req, res)
          } else {
            if (!this.supportsInsertObject) {
              throw new Error('Got an single object but supportsInsertObject === false')
            }
            context = self.preInsertObjectOperation(config, req, res)
            result = self.insertObject(context.body, _.omit(context, 'body'))
            return self.postInsertObjectOpertaion(result, config, req, res)
          }
        }
      }
    }
  },

  /******************************************************************************
   * configureFindOperation
   */
  configureFindOperation: function() {
    // Find the CollectionOperationConfig for this operation
    var config = this.getOperationConfig('find')

    if (config.supportsIdQuery) {
      config.addIdQueryParameter()
    }

    // Create the default responses descriptor
    var defaultResponses = [
      {
        statusCode: 200,
        description: 'Returns an array of objects. Each object has an ' +
                     this.idParameter +
                     ' and possible additional properties.',
        schema: {
          type: 'array',
          items: this.schema
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
    var ids = _.get(req.parameters, this.idParameter, [])
    if (!_.isArray(ids)) {
      ids = [ids]
    }
    if (!_.isNil(config.opConfig.maxPageSize)) {
      limit = _.min([limit, config.opConfig.maxPageSize])
    }
    if (config.opConfig.supportsPagination) {
      var page = _.get(req.parameters, 'page', 0)
      skip += page * config.opConfig.pageSize
    }
    return _.assignIn(
      {skip: skip, limit: limit, [this.idParameter]: ids},
      _.pick(
        req.parameters,
        _.difference(
          _.keys(req.parameters),
          ['skip', 'limit', 'page', this.idParameter])))
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
        schema: this.schema,
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
      res.status(404)
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
    var schema = this.schema
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
        _.isArray(config.responses) &&
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

    op = !_.isArray(op) ? [op] : op

    // Consider NotFound
    if ((_.intersection(['findObject', 'updateObject', 'removeObject'], op)).length > 0) {
      responses.push({
        statusCode: 404,
        description: 'Collection resource cannot be found by the supplied ' +
                     self.idParameter + '.',
        schema: self.defaultErrorSchema
      })
    }

    // Consider BadRequest
    if ((_.intersection(['removeObject'], op)).length === 0) {
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
    if (schema) {
      schema = _.cloneDeep(schema)

      if ('oneOf' in schema) {
        for (var i = 0; i < schema.oneOf.length; i++) {
          schema.oneOf[i] = this._normalizeSchema(schema.oneOf[i])
        }
        return schema
      }

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
  }

})

module.exports = Collection
