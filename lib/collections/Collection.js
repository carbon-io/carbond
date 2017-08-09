var assert = require('assert')
var path = require('path')
var url = require('url')

var _ = require('lodash')

var EJSON = require('@carbon-io/carbon-core').ejson
var _o = require('@carbon-io/carbon-core').bond._o(module)
var o = require('@carbon-io/carbon-core').atom.o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var CollectionOperationConfig = require('./CollectionOperationConfig')
var CollectionOperationResult = require('./CollectionOperationResult')
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
    'findObject',
    'save',
    'saveObject',
    'update',
    'updateObject',
    'remove',
    'removeObject'
  ],

  /*****************************************************************************
   * @property defaultIdPathParameter
   */
  defaultIdPathParameter: DEFAULT_ID_PARAMETER,

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
      [DEFAULT_ID_PARAMETER]: {type: 'string'}
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
   * SaveConfigClass
   */
  SaveConfigClass: _o('./SaveConfig'),

  /*****************************************************************************
   * SaveObjectConfigClass
   */
  SaveObjectConfigClass: _o('./SaveObjectConfig'),

  /*****************************************************************************
   * UpdateConfigClass
   */
  UpdateConfigClass: _o('./UpdateConfig'),

  /*****************************************************************************
   * UpdateObjectConfigClass
   */
  UpdateObjectConfigClass: _o('./UpdateObjectConfig'),

  /*****************************************************************************
   * _C
   */
  _C: function() {
    /***************************************************************************
     * @property {object} [enabled] -- Control which collection level operations
     */
    this.enabled = {'*': false}

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
     * @property {string} -- The <ID> path parameter name
     */
    this.idPathParameter = this.defaultIdParameter

    /***************************************************************************
     * @property {string} -- The <ID> parameter name
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
     * @property {object} -- See {@link carbond.collections.InsertObjectConfig}
     */
    this.insertObjectConfig = undefined

    /***************************************************************************
     * @property {object} -- See {@link carbond.collections.FindConfig}
     */
    this.findConfig = undefined

    /***************************************************************************
     * @property {object} -- See {@link carbond.collections.FindObjectConfig}
     */
    this.findObjectConfig = undefined

    /***************************************************************************
     * @property {object} -- See {@link carbond.collections.SaveConfig}
     */
    this.saveConfig = undefined

    /***************************************************************************
     * @property {object} -- See {@link carbond.collections.SaveObjectConfig}
     */
    this.saveObjectConfig = undefined

    /***************************************************************************
     * @property {object} -- See {@link carbond.collections.UpdateConfig}
     */
    this.updateConfig = undefined

    /***************************************************************************
     * @property {object} -- See {@link carbond.collections.UpdateObjectConfig}
     */
    this.updateObjectConfig = undefined

    /***************************************************************************
     * @property {object} -- See {@link carbond.collections.RemoveConfig}
     */
    this.removeConfig = undefined

    /***************************************************************************
     * @property {object} -- See {@link carbond.collections.RemoveObjectConfig}
     */
    this.removeObjectConfig = undefined
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
   * @param {*} context.* -- Other parameters specified in the config
   * @returns {object[]|null} -- A list of inserted objects
   * @throws {@link carbond.collections.errors.CollectionError}
   */
  insert: _notImplemented('insert'),

  /******************************************************************************
   * @method insertObject
   *
   * @param {object} object -- The object to insert
   * @param {object} context -- A map of options that apply to this operation
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
   * @returns {object|null} -- The found object or null
   * @throws {@link carbond.collections.errors.CollectionError}
   */
  findObject: _notImplemented('findObject'),

  /******************************************************************************
   * @method save
   *
   * @param {Array} objects -- An array of objects (with <ID>s) to save
   * @param {object} context -- A map of options that apply to this operation
   * @param {*} context.* -- Other parameters specified in the config
   * @returns {object[]|null} -- A list of saved objects
   * @throws {@link carbond.collections.errors.CollectionError}
   */
  save: _notImplemented('save'),

  /******************************************************************************
   * @method saveObject
   *
   * @param {object} object -- The object to save (with <ID>)
   * @param {object} context -- A map of options that apply to this operation
   * @param {*} context.* -- Other parameters specified in the config
   * @returns {object|null} -- The saved object
   * @throws {@link carbond.collections.errors.CollectionError}
   */
  saveObject: _notImplemented('saveObject'),

  /******************************************************************************
   * @method update
   *
   * @param {object} updateSpec -- An object describing the update
   * @param {object} context -- A map of options that apply to this operation
   * @param {*} context.* -- Other parameters specified in the config
   * @returns {number} -- An integer representing the number of objects updated
   * @throws {@link carbond.collections.errors.CollectionError}
   */
  update: _notImplemented('update'),

  /******************************************************************************
   * @method updateObject
   *
   * @param {String} id -- The <ID> of the object to update
   * @param {object} updateSpec -- An object describing the update
   * @param {object} context -- A map of options that apply to this operation
   * @param {*} context.* -- Other parameters specified in the config
   * @returns {number} -- An integer representing the number of objects updated (0 or 1)
   * @throws {@link carbond.collections.errors.CollectionError}
   */
  updateObject: _notImplemented('updateObject'),

  /******************************************************************************
   * @method remove
   *
   * @param {object} context -- A map of options that apply to this operation
   * @param {*} context.* -- Other parameters specified in the config
   * @returns {number} -- An integer representing the number of objects removed
   * @throws {@link carbond.collections.errors.CollectionError}
   */
  remove: _notImplemented('remove'),

  /******************************************************************************
   * @method removeObject
   *
   * @param {String} id -- The <ID> of the object to remove
   * @param {object} context -- A map of options that apply to this operation
   * @param {*} context.* -- Other parameters specified in the config
   * @returns {number} -- An integer representing the number of objects removed (0 or 1)
   * @throws {@link carbond.collections.errors.CollectionError}
   */
  removeObject: _notImplemented('removeObject'),

  /*****************************************************************************
   * supportsInsert
   */
  supportsInsert: {
    $property: {
      get: function() {
        return this._isEnabled('insert')
      }
    }
  },

  /*****************************************************************************
   * supportsInsertObject
   */
  supportsInsertObject: {
    $property: {
      get: function() {
        return this._isEnabled('insertObject')
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
   * supportsSave
   */
  supportsSave: {
    $property: {
      get: function() {
        return this._isEnabled('save')
      }
    }
  },

  /*****************************************************************************
   * supportsSaveObject
   */
  supportsSaveObject: {
    $property: {
      get: function() {
        return this._isEnabled('saveObject')
      }
    }
  },

  /*****************************************************************************
   * supportsUpdate
   */
  supportsUpdate: {
    $property: {
      get: function() {
        return this._isEnabled('update')
      }
    }
  },

  /*****************************************************************************
   * supportsUpdateObject
   */
  supportsUpdateObject: {
    $property: {
      get: function() {
        return this._isEnabled('updateObject')
      }
    }
  },

  /*****************************************************************************
   * supportsRemove
   */
  supportsRemove: {
    $property: {
      get: function() {
        return this._isEnabled('remove')
      }
    }
  },

  /*****************************************************************************
   * supportsRemoveObject
   */
  supportsRemoveObject: {
    $property: {
      get: function() {
        return this._isEnabled('removeObject')
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
      throw new TypeError('Schema must conain ' + this.idParameter + ', got: ' +
                          EJSON.stringify(this.schema))
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
    this._generateEndpointOperationForSave()
    this._generateEndpointOperationForSaveObject()
    this._generateEndpointOperationForUpdate()
    this._generateEndpointOperationForUpdateObject()
    this._generateEndpointOperationForRemove()
    this._generateEndpointOperationForRemoveObject()
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
        'Tuple validation is not supported: ' + EJSON.stringify(insertSchema))
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
        description: 'The object(s) were successfully inserted. The Location ' +
                     'header will contain a URL pointing to the newly created ' +
                     'resources and the body will contain the list of inserted ' +
                     'object(s) if configured to do so.',
        schema: config.returnsInsertedObjects ?
                  resultSchema :
                  {type: 'undefined'},
        headers: ['Location', this.idHeader]
      }
    ]

    // example

    var example = config.example ||
      (config.insertSchema || _.isNil(this.example) ? undefined : [this.example])

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

    var insertObjectSchema = config.insertObjectSchema || this.schema

    // NOTE: removal of any <ID> parameter is handled by the config class
    config.parameters.body.schema = insertObjectSchema

    // result schema

    var resultSchema = this.schema

    // responses

    var defaultResponses = [
      {
        statusCode: 201,
        description: 'The object was successfully inserted. The Location ' +
                     'header will contain a URL pointing to the newly created ' +
                     'resource and the body will contain the inserted object if ' +
                     'configured to do so.',
        schema: config.returnsInsertedObject ?
                  resultSchema :
                  {type: 'undefined'},
        headers: ['Location', this.idHeader]
      }
    ]

    // example

    var example = config.example ||
      (config.insertObjectSchema ? undefined : this.example)

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

    return {
      context: req.parameters,
      options: config.opConfig.options
    }
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

    return {
      context: req.parameters,
      options: config.opConfig.options
    }
  },

  /******************************************************************************
   * postInsertOperation
   */
  postInsertOperation: function(result, config, req, res) {
    result = this._getResult(result)
    var self = this
    res.status(201)
    var headers = this._get201Headers(result, req)
    res.header('Location', headers.location)
    res.header(this.idHeader, headers[this.idHeader])
    // Must convert undefined to null for Service to know to commit
    // the response.
    return config.opConfig.returnsInsertedObjects ? result.val : null
  },

  /******************************************************************************
   * postInsertObjectOperation
   */
  postInsertObjectOperation: function(result, config, req, res) {
    result = this._getResult(result)
    res.status(201)
    var headers = this._get201Headers(result, req)
    res.header('Location', headers.location)
    res.header(this.idHeader, headers[this.idHeader])
    return config.opConfig.returnsInsertedObject ? result.val : null
  },

  /******************************************************************************
   * preInsert
   */
  preInsert: function(objects, context, options) {
    return {
      objects: objects,
      context: context,
      options: options
    }
  },

  /******************************************************************************
   * preInsertObject
   */
  preInsertObject: function(object, context, options) {
    return {
      object: object,
      context: context,
      options: options
    }
  },

  /******************************************************************************
   * postInsert
   */
  postInsert: function(result, objects, context, options) {
    return result
  },

  /******************************************************************************
   * postInsertObject
   */
  postInsertObject: function(result, object, context, options) {
    return result
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
      this.post = {
        description: config.opConfig.description ||
                     'Insert object(s) into this Collection.',
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters,
        responses: this._makeResponses(
          ['insert', 'insertObject'], config.opConfig, config.defaultResponses, false),
        service: function(req, res) {
          var params = undefined
          var result = undefined
          if (_.isArray(req.parameters.body)) {
            params = self.preInsertOperation(config, req, res)
            params.objects = params.context.body
            params.context = _.omit(params.context, 'body')
            // XXX: we should be using Insert/InsertObject specific config here
            params = _.assignIn(
              params, self.preInsert(params.objects, params.context, params.options) || {})
            result = self.insert(
              params.objects, params.context, params.options)
            return self.postInsertOperation(
              self.postInsert(result, params.objects, params.context, params.options),
              config, req, res)
          } else {
            params = self.preInsertObjectOperation(config, req, res)
            params.object = params.context.body
            params.context = _.omit(params.context, 'body')
            // XXX: we should be using Insert/InsertObject specific config here
            params = _.assignIn(
              params, self.preInsertObject(params.object, params.context, params.options) || {})
            result = self.insertObject(
              params.object, params.context, params.options)
            return self.postInsertObjectOperation(
              self.postInsertObject(result, params.object, params.context, params.options),
              config, req, res)
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
    return {
      context: _.assignIn(
        {
          skip: skip,
          limit: limit,
          [this.idParameter]: ids.length > 0 ? ids : undefined
        },
        _.pick(
          req.parameters,
          _.difference(
            _.keys(req.parameters),
            ['skip', 'limit', 'page', this.idParameter]))),
      options: config.opConfig.options
    }
  },

  /******************************************************************************
   * postFindOperation
   */
  postFindOperation: function(result, config, req, res) {
    result = this._getResult(result)
    if (!_.isArray(result.val)) {
      throw new Error('Unexpected value returned from find. Expected array ' +
                      'and got: ' + result.val)
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
    if (_.isArray(result.val) && result.val.length >= config.opConfig.pageSize) {
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
    return result.val
  },


  /*****************************************************************************
   * preFind
   */
  preFind: function(context, options) {
    return {
      context: context,
      options: options
    }
  },

  /*****************************************************************************
   * postFind
   */
  postFind: function(result, context, options) {
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
        responses: this._makeResponses(
          'find', config.opConfig, config.defaultResponses, true),
        service: function(req, res) {
          var params = self.preFindOperation(config, req, res)
          params = _.assignIn(params, self.preFind(params.context, params.options) || {})
          var result = self.find(params.context, params.options)
          return self.postFindOperation(
            self.postFind(result, params.context, params.options), config, req, res)
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
    return {
      context: req.parameters,
      options: config.opConfig.options
    }
  },

  /*****************************************************************************
   * postFindObjectOperation
   */
  postFindObjectOperation: function(result, config, req, res) {
    result = this._getResult(result)
    if (_.isNil(result.val)) {
      res.status(404)
    }
    return result.val
  },

  /*****************************************************************************
   * preFindObject
   */
  preFindObject: function(id, context, options) {
    return {
      id: id,
      context: context,
      options: options
    }
  },

  /*****************************************************************************
   * postFindObject
   */
  postFindObject: function(result, id, context, options) {
    return result
  },

  /*****************************************************************************
   * _generateEndpointOperationForFindObject
   */
  _generateEndpointOperationForFindObject: function() {
    if (this.supportsFindObject) {
      var self = this
      var config = this.configureFindObjectOperation()
      var objectSubEndpoint = this._getObjectSubEndpoint()
      objectSubEndpoint.get = o({
        _type: '../Operation',
        description: config.opConfig.description ||
                     'Find an object in this Collection by ' + this.idParameter,
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters || {},
        responses: this._makeResponses(
          'findObject', config.opConfig, config.defaultResponses, true),
        endpoint: objectSubEndpoint,
        service: function(req, res) {
          var params = self.preFindObjectOperation(config, req, res)
          params.id = params.context[self.idPathParameter]
          params.context = _.omit(params.context, self.idPathParameter)
          params = _.assignIn(
            params, self.preFindObject(params.id, params.context, params.options) || {})
          var result = self.findObject(
            params.id, params.context, params.options)
          return self.postFindObjectOperation(
            self.postFindObject(result, params.id, params.context, params.options),
            config, req, res)
        }
      })
    }
  },

  /*****************************************************************************
   * configureSaveOperation
   */
  configureSaveOperation: function() {
    var config = this.getOperationConfig('save')

    // schema

    var saveSchema = this._validateSchemaHasId(config.saveSchema || this.schema)

    if (saveSchema.type !== 'array') {
      saveSchema = {
        type: 'array',
        items: saveSchema
      }
    }

    if (_.isArray(saveSchema.items)) {
      throw new TypeError(
        'Tuple validation is not supported: ' + EJSON.stringify(saveSchema))
    }

    config.parameters.body.schema = saveSchema

    // result schema

    var resultSchema = config.returnsSavedObjects ? {
        type: 'array',
        items: this.schema
      } :
      {
        type: 'undefined'
      }

    // responses

    var defaultResponses = [
      config.returnsSavedObjects ?
      {
        statusCode: 200,
        description: 'The object(s) were successfully saved. The body will ' +
                     'contain the list of saved object(s).',
        schema: resultSchema
      } :
      {
        statusCode: 204,
        description: 'The object(s) were successfully saved.',
        schema: {type: 'undefined'}
      }
    ]

    // example

    var example = config.example ||
      (config.saveSchema ? undefined : this.example)

    if (example) {
      defaultResponses.forEach(function(response) {
        response.example = example
      })
    }

    // config

    return {
      opConfig: config,
      defaultResponses: defaultResponses
    }
  },

  /*****************************************************************************
   * preSaveOperation
   */
  preSaveOperation: function(config, req, res) {
    return {
      context: req.parameters,
      options: config.opConfig.options
    }
  },

  /*****************************************************************************
   * postSaveOperation
   */
  postSaveOperation: function(result, config, req, res) {
    result = this._getResult(result)
    if (config.opConfig.returnsSavedObjects) {
      res.status(200)
      return result.val
    }
    res.status(204)
    return null
  },

  /*****************************************************************************
   * preSave
   */
  preSave: function(objects, context, options) {
    return {
      objects: objects,
      context: context,
      options: options
    }
  },

  /*****************************************************************************
   * postSave
   */
  postSave: function(result, objects, context, options) {
    return result
  },

  /*****************************************************************************
   * _generateEndpointOperationForSave
   */
  _generateEndpointOperationForSave: function() {
    if (this.supportsSave) {
      var self = this
      var config = this.configureSaveOperation()
      this.put = o({
        _type: '../Operation',
        description: config.opConfig.description ||
                     'Replace all objects in this Collection',
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters || {},
        responses: this._makeResponses(
          'save', config.opConfig, config.defaultResponses, config.opConfig.returnsSavedObjects),
        service: function(req, res) {
          var params = self.preSaveOperation(config, req, res)
          params.objects = params.context.body
          params.context = _.omit(params.context, 'body')
          params = _.assignIn(
            params, self.preSave(params.objects, params.context, params.options) || {})
          var result = self.save(
            params.objects, params.context, params.options)
          return self.postSaveOperation(
            self.postSave(result, result.objects, params.context, params.options),
            config, req, res)
        }
      })
    }
  },

  /*****************************************************************************
   * configureSaveObjectOperation
   */
  configureSaveObjectOperation: function() {
    var config = this.getOperationConfig('saveObject')

    // schema

    var saveObjectSchema = config.saveObjectSchema || this.schema

    config.parameters.body.schema = saveObjectSchema

    // result schema

    var resultSchema = this.schema

    // responses

    // XXX: add 201?
    var defaultResponses = [
      config.returnsSavedObject ?
      {
        statusCode: 200,
        description: 'The object was successfully saved. The body will ' +
                     'contain the saved object.',
        schema: config.returnsSavedObject ?
                  resultSchema :
                  {type: 'undefined'},
      } :
      {
        statusCode: 204,
        description: 'The object was successfully saved.',
        schema: {type: 'undefined'}
      }
    ]

    if (config.supportsInsert) {
      defaultResponses.push({
        statusCode: 201,
        description: 'The object was successfully inserted. The Location ' +
                     'header will contain a URL pointing to the newly created ' +
                     'resource and the body will contain the inserted object if ' +
                     'configured to do so.',
        schema: config.returnsSavedObject ?
                  resultSchema :
                  {type: 'undefined'},
        headers: ['Location', this.idHeader]
      })
    }

    // example

    var example = config.example ||
      (config.savedObjectSchema ? undefined : this.example)

    if (example) {
      defaultResponses.forEach(function(response) {
        response.example = example
      })
    }

    // config

    return {
      opConfig: config,
      defaultResponses: defaultResponses
    }
  },

  /*****************************************************************************
   * preSaveObjectOperation
   */
  preSaveObjectOperation: function(config, req, res) {
    if (req.parameters[this.idPathParameter] !== req.parameters.body[this.idParameter].toString()) {
      throw new this.service.errors.BadRequest(
        'Path ' + this.idPathParameter + ' does not match body.' + this.idParameter + '.')
    }
    return {
      context: _.omit(req.parameters, this.idPathParameter),
      options: config.opConfig.options
    }
  },

  /*****************************************************************************
   * postSaveObjectOperation
   */
  postSaveObjectOperation: function(result, config, req, res) {
    result = this._getResult(result)
    if (config.opConfig.supportsInsert && result.created) {
      var headers = this._get201Headers(result, req)
      res.status(201)
      res.header('Location', headers.location)
      res.header(this.idHeader, headers[this.idHeader])
    } else if (config.opConfig.returnsSavedObject) {
      res.status(200)
    } else {
      res.status(204)
    }
    return config.opConfig.returnsSavedObject ? result.val : null
  },

  /*****************************************************************************
   * preSaveObject
   */
  preSaveObject: function(object, context, options) {
    return {
      object: object,
      context: context,
      options: options
    }
  },

  /*****************************************************************************
   * postSaveObject
   */
  postSaveObject: function(result, object, context, options) {
    return result
  },

  /*****************************************************************************
   * _generateEndpointOperationForSaveObject
   */
  _generateEndpointOperationForSaveObject: function() {
    if (this.supportsSaveObject) {
      var self = this
      var config = this.configureSaveObjectOperation()
      var objectSubEndpoint = this._getObjectSubEndpoint()
      objectSubEndpoint.put = o({
        _type: '../Operation',
        description: config.opConfig.description ||
                     'Save an object in this Collection by ' + this.idPathParameter,
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters || {},
        responses: this._makeResponses(
          'saveObject', config.opConfig, config.defaultResponses, config.opConfig.returnsSavedObject),
        endpoint: objectSubEndpoint,
        service: function(req, res) {
          var params = self.preSaveObjectOperation(config, req, res)
          params.object = params.context.body
          params.context = _.omit(params.context, 'body')
          params = _.assignIn(
            params, self.preSaveObject(params.object, params.context, params.options) || {})
          var result = self.saveObject(
            params.object, params.context, params.options)
          return self.postSaveObjectOperation(
            self.postSaveObject(result, params.object, params.context, params.options),
            config, req, res)
        }
      })
    }
  },

  /*****************************************************************************
   * configureUpdateOperation
   */
  configureUpdateOperation: function() {
    var config = this.getOperationConfig('update')

    // schema

    var updateSchema = config.updateSchema || {type: 'object'}

    config.parameters.update.schema = updateSchema

    // result schema

    var resultSchema = {
      type: 'object',
      properties: {
        n: {
          type: 'number',
          minimum: 0,
          multipleOf: 1
        }
      },
      required: ['n'],
      additionalProperties: false
    }


    // responses

    var defaultResponses = [
      {
        statusCode: 200,
        description: 'Object(s) in the collection were successfully updated',
        schema: resultSchema
      }
    ]

    if (config.supportsUpsert) {
      defaultResponses.push({
        statusCode: 201,
        description: 'The object(s) was/were successfully upserted. The Location ' +
                     'header will contain a URL pointing to the newly created ' +
                     'resource(s) and the body will contain the upserted object(s) if ' +
                     'configured to do so.',
        schema: config.returnsUpsertedObjects ?
                  {
                    type: 'array',
                    items: this.schema,
                    minItems: 1
                  } :
                  resultSchema,
        headers: ['Location', this.idHeader]
      })
    }

    // config

    return {
      opConfig: config,
      defaultResponses: defaultResponses
    }
  },

  /*****************************************************************************
   * preUpdateOperation
   */
  preUpdateOperation: function(config, req, res) {
    return {
      context: req.parameters,
      options: config.opConfig.options
    }
  },

  /*****************************************************************************
   * postUpdateOperation
   */
  postUpdateOperation: function(result, config, req, res) {
    result = this._getResult(result)
    if ((!result.created && (!_.isInteger(result.val) || result.val < 0))) {
      throw new Error('Update returned ' + result.val.toString() + ' instead of an integer')
    }
    // the upsert/created verification case should be handled by the response schema

    if (config.opConfig.supportsUpsert && result.created) {
      var headers = this._get201Headers(result, req)
      res.status(201)
      res.header('Location', headers.location)
      res.header(this.idHeader, headers[this.idHeader])
      return config.opConfig.returnsUpsertedObjects ? result.val : {n: result.val.length}
    }
    return {n: result.val}
  },

  /*****************************************************************************
   * preUpdate
   */
  preUpdate: function(update, context, options) {
    return {
      update: update,
      context: context,
      options: options
    }
  },

  /*****************************************************************************
   * postUpdate
   */
  postUpdate: function(result, update, context, options) {
    return result
  },

  /*****************************************************************************
   * _generateEndpointOperationForUpdate
   */
  _generateEndpointOperationForUpdate: function() {
    if (this.supportsUpdate) {
      var self = this
      var config = this.configureUpdateOperation()
      this.patch = o({
        _type: '../Operation',
        description: config.opConfig.description ||
                     'Update all objects in the collection',
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters || {},
        responses: self._makeResponses(
          'update', config.opConfig, config.defaultResponses, false),
        service: function(req, res) {
          var params = self.preUpdateOperation(config, req, res)
          params.update = params.context.update
          params.context = _.omit(params.context, 'update')
          params = _.assignIn(
            params, self.preUpdate(params.update, params.context, params.options) || {})
          var result = self.update(params.update, params.context, params.options)
          return self.postUpdateOperation(
            self.postUpdate(result, params.update, params.context, params.options),
            config, req, res)
        }
      })
    }
  },

  /*****************************************************************************
   * configureUpdateObjectOperation
   */
  configureUpdateObjectOperation: function() {
    var config = this.getOperationConfig('updateObject')

    // schema

    var updateObjectSchema = config.updateObjectSchema || {type: 'object'}

    config.parameters.update.schema = updateObjectSchema

    // result schema

    var resultSchema = {
      type: 'object',
      properties: {
        n: {
          type: 'number',
          minimum: 0,
          maximum: 1,
          multipleOf: 1
        }
      },
      required: ['n'],
      additionalProperties: false
    }

    // responses

    var defaultResponses = [
      {
        statusCode: 200,
        description: 'The object was successfully updated',
        schema: resultSchema
      }
    ]

    if (config.supportsUpsert) {
      defaultResponses.push({
        statusCode: 201,
        description: 'The object was successfully upserted. The Location ' +
                     'header will contain a URL pointing to the newly created ' +
                     'resource and the body will contain the upserted object if ' +
                     'configured to do so.',
        schema: config.returnsUpsertedObject ?
                  this.schema :
                  resultSchema,
        headers: ['Location', this.idHeader]
      })
    }

    // config

    return {
      opConfig: config,
      defaultResponses: defaultResponses
    }
  },

  /*****************************************************************************
   * preUpdateObjectOperation
   */
  preUpdateObjectOperation: function(config, req, res) {
    return {
      context: req.parameters,
      options: config.opConfig.options
    }
  },

  /*****************************************************************************
   * postUpdateObjectOperation
   */
  postUpdateObjectOperation: function(result, config, req, res) {
    result = this._getResult(result)
    if ((!result.created && (!_.isInteger(result.val) || result.val < 0))) {
      throw new Error('Update returned ' + result.val.toString() + ' instead of an integer')
    }
    // the upsert/created verification case should be handled by the response schema

    if (config.opConfig.supportsUpsert && result.created) {
      var headers = this._get201Headers(result, req)
      res.status(201)
      res.header('Location', headers.location)
      res.header(this.idHeader, headers[this.idHeader])
      return config.opConfig.returnsUpsertedObject ? result.val : {n: 1}
    }

    if (result.val === 0) {
      throw new this.service.errors.NotFound(path.basename(req.path))
    }

    return {n: 1}
  },

  /*****************************************************************************
   * preUpdateObject
   */
  preUpdateObject: function(id, update, context, options) {
    return {
      id: id,
      update: update,
      context: context,
      options: options
    }
  },

  /*****************************************************************************
   * postUpdateObject
   */
  postUpdateObject: function(result, id, update, context, options) {
    return result
  },

  /*****************************************************************************
   * _generateEndpointOperationForUpdateObject
   */
  _generateEndpointOperationForUpdateObject: function() {
    if (this.supportsUpdateObject) {
      var self = this
      var config = this.configureUpdateObjectOperation()
      var objectSubEndpoint = this._getObjectSubEndpoint()
      objectSubEndpoint.patch = o({
        _type: '../Operation',
        description: config.opConfig.description ||
                     'Update an object in this Collection by ' + this.idPathParameter,
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters || {},
        responses: this._makeResponses(
          'updateObject', config.opConfig, config.defaultResponses, false),
        endpoint: objectSubEndpoint,
        service: function(req, res) {
          var params = self.preUpdateObjectOperation(config, req, res)
          params.id = params.context[self.idPathParameter]
          params.update = params.context.update
          params.context = _.omit(params.context, 'update', self.idPathParameter)
          params = _.assignIn(
            params, self.preUpdateObject(
              params.id, params.update, params.context, params.options) || {})
          var result = self.updateObject(
            params.id, params.update, params.context, params.options)
          return self.postUpdateObjectOperation(
            self.postUpdateObject(
              result, params.id, params.update, params.context, params.options),
            config, req, res)
        }
      })
    }
  },

  /*****************************************************************************
   * configureRemoveOperation
   */
  configureRemoveOperation: function() {
    var config = this.getOperationConfig('remove')

    // result schema

    var resultSchema = undefined

    if (config.returnsRemovedObjects) {
      resultSchema = {
        type: 'array',
        items: this.schema
      }
    } else {
      resultSchema = {
        type: 'object',
        properties: {
          n: {
            type: 'number',
            minimum: 0,
            multipleOf: 1
          }
        },
        required: ['n'],
        additionalProperties: false
      }
    }

    // responses

    var defaultResponses = [
      {
        statusCode: 200,
        description: 'Object(s) in collection were successfully removed',
        schema: resultSchema
      }
    ]

    // config

    return {
      opConfig: config,
      defaultResponses: defaultResponses
    }
  },

  /*****************************************************************************
   * preRemoveOperation
   */
  preRemoveOperation: function(config, req, res) {
    return {
      context: req.parameters,
      options: config.opConfig.options
    }
  },

  /*****************************************************************************
   * postRemoveOperation
   */
  postRemoveOperation: function(result, config, req, res) {
    result = this._getResult(result)
    if (!config.opConfig.returnsRemovedObjects) {
      if (!_.isInteger(result.val) || result.val < 0) {
        throw new Error('Remove returned ' + result.val.toString() + ' instead of an integer')
      }
      return {n: result.val}
    }
    return result.val
  },

  /*****************************************************************************
   * preRemove
   */
  preRemove: function(context, options) {
    return {
      context: context,
      options: options
    }
  },

  /*****************************************************************************
   * postRemove
   */
  postRemove: function(result, context, options) {
    return result
  },

  /*****************************************************************************
   * _generateEndpointOperationForRemove
   */
  _generateEndpointOperationForRemove: function() {
    if (this.supportsRemove) {
      var self = this
      var config = this.configureRemoveOperation()
      this.delete = o({
        _type: '../Operation',
        description: config.opConfig.description ||
                     'Remove all objects in the collection',
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters || {},
        responses: self._makeResponses(
          'remove', config.opConfig, config.defaultResponses, false),
        service: function(req, res) {
          var params = self.preRemoveOperation(config, req, res)
          params = _.assignIn(
            params, self.preRemove(params.context, params.options) || {})
          var result = self.remove(params.context, params.options)
          return self.postRemoveOperation(
            self.postRemove(result, params.context, params.options), config, req, res)
        }
      })
    }
  },

  /*****************************************************************************
   * configureRemoveObjectOperation
   */
  configureRemoveObjectOperation: function() {
    var config = this.getOperationConfig('removeObject')

    // result schema

    var resultSchema = undefined

    if (config.returnsRemovedObject) {
      resultSchema = this.schema
    } else {
      resultSchema = {
        type: 'object',
        properties: {
          n: {
            type: 'number',
            minimum: 0,
            maximum: 1,
            multipleOf: 1
          }
        },
        required: ['n'],
        additionalProperties: false
      }
    }

    // responses

    var defaultResponses = [
      {
        statusCode: 200,
        description: 'The object was successfully removed',
        schema: resultSchema
      }
    ]

    // config

    return {
      opConfig: config,
      defaultResponses: defaultResponses
    }
  },

  /*****************************************************************************
   * preRemoveObjectOperation
   */
  preRemoveObjectOperation: function(config, req, res) {
    return {
      context: req.parameters,
      options: config.opConfig.options
    }
  },

  /*****************************************************************************
   * postRemoveObjectOperation
   */
  postRemoveObjectOperation: function(result, config, req, res) {
    result = this._getResult(result)
    if (result.val === 0 || _.isNil(result.val)) {
      throw new this.service.errors.NotFound(path.basename(req.path))
    }
    if (!config.opConfig.returnsRemovedObject) {
      if (!_.isInteger(result.val) || result.val < 0 || result.val > 1) {
        throw new Error('Remove returned ' + result.val.toString() + ' instead of the integers 0 or 1')
      }
      return {n: result.val}
    }
    return result.val
  },

  /*****************************************************************************
   * preRemoveObject
   */
  preRemoveObject: function(id, context, options) {
    return {
      id: id,
      context: context,
      options: options
    }
  },

  /*****************************************************************************
   * postRemoveObject
   */
  postRemoveObject: function(result, id, context, options) {
    return result
  },

  /*****************************************************************************
   * _generateEndpointOperationForRemoveObject
   */
  _generateEndpointOperationForRemoveObject: function() {
    if (this.supportsRemoveObject) {
      var self = this
      var config = this.configureRemoveObjectOperation()
      var objectSubEndpoint = this._getObjectSubEndpoint()
      objectSubEndpoint.delete = o({
        _type: '../Operation',
        description: config.opConfig.description ||
                     'Remove an object in this Collection by ' + this.idPathParameter,
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters || {},
        responses: this._makeResponses(
          'removeObject', config.opConfig, config.defaultResponses, false),
        endpoint: objectSubEndpoint,
        service: function(req, res) {
          var params = self.preRemoveObjectOperation(config, req, res)
          params.id = params.context[self.idPathParameter]
          params.context = _.omit(params.context, self.idPathParameter)
          params = _.assignIn(
            params, self.preRemoveObject(params.id, params.context, params.options) || {})
          var result = self.removeObject(
            params.id, params.context, params.options)
          return self.postRemoveObjectOperation(
            self.postRemoveObject(result, params.id, params.context, params.options),
            config, req, res)
        }
      })
    }
  },

  /*****************************************************************************
   * _getResult
   */
  _getResult: function(result) {
    if (!(result instanceof CollectionOperationResult)) {
      if (_.isObject(result) && 'val' in result &&
          _.isEqual(_.union(_.keys(result), ['val', 'created']), ['val', 'created'])) {
        result = o(result, CollectionOperationResult)
      } else {
        result = o({
          _type: CollectionOperationResult,
          val: result
        })
      }
    }
    return result
  },

  /*****************************************************************************
   * _get201Headers
   */
  _get201Headers: function(result, req) {
    var self = this
    var headers = {
      location: undefined,
      [this.idHeader]: undefined
    }
    var _path = req.path
    if (req.parameters[this.idPathParameter] === path.basename(_path)) {
      _path = path.dirname(_path)
    }
    if (_.isArray(result.val)) {
      headers.location = url.format({
        pathname: _.trimEnd(_path, '/'),
        query: {
          [this.idParameter]: _.map(result.val, function(obj) {
            return obj[self.idParameter].toString()
          })
        }
      })
      headers[this.idHeader] = _.map(result.val, function(obj) {
        return EJSON.stringify(obj[self.idParameter])
      })
    } else {
      headers.location =
        path.normalize(
          path.join(_.trimEnd(_path, '/'), result.val[this.idParameter].toString()))
      headers[this.idHeader] = EJSON.stringify(result.val[this.idParameter])
    }
    return headers
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
      if (path !== ':' + self.idPathParameter) {
        self._getObjectSubEndpoint().endpoints[path] = childEndpoint
        delete self.endpoints[path]
      }
    })
  },

  /*****************************************************************************
   * _getObjectSubEndpoint
   */
  _getObjectSubEndpoint: function() {
    var subEndpointPath = ':' + this.idPathParameter
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
    var idParameterName = this.idPathParameter[0] === ':' ?
        this.idPathParameter.substring(1) :
        this.idPathParameter

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
          if (permission === 'put') {
            return self.acl.hasPermission(user, 'saveObject', env)
          }
          if (permission === 'patch') {
            return self.acl.hasPermission(user, 'updateObject', env)
          }
          if (permission === 'delete') {
            return self.acl.hasPermission(user, 'removeObject', env)
          }
          // XXX: is head supported?
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
      if (validateResponseSchemasHaveId) {
        self._validateSchemaHasId(responseDescriptor.schema)
      }
      return responseDescriptor
    })

    op = !_.isArray(op) ? [op] : op

    // Consider NotFound
    if ((_.intersection(['findObject', 'updateObject', 'removeObject'], op)).length > 0) {
      responses.push({
        statusCode: 404,
        description: 'Collection resource cannot be found by the supplied ' +
                     self.idPathParameter + '.',
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
