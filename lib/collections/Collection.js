var assert = require('assert')
var path = require('path')
var url = require('url')

var _ = require('lodash')

var ejson = require('@carbon-io/carbon-core').ejson
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

/***************************************************************************************************
 * @class Collection
 */
var Collection = oo({
  _type: '../Endpoint',

  /*****************************************************************************
   * @constructs Collection
   * @description Provides a high-level abstraction for defining Endpoints that
   *              behave like a RESTful collection of resources
   * @memberof carbond.collections
   * @extends carbond.Endpoint
   */
  _C: function() {
    /***************************************************************************
     * @property {object} [enabled] -- Control which collection level operations
     * @property {boolean} [enabled.*] -- The default value for all operations that are not
     *                                    explicitly specified
     * @property {boolean} [enabled.insert] -- Enable or disable the insert operation
     * @property {boolean} [enabled.find] -- Enable or disable the find operation
     * @property {boolean} [enabled.save] -- Enable or disable the save operation
     * @property {boolean} [enabled.update] -- Enable or disable the update operation
     * @property {boolean} [enabled.remove] -- Enable or disable the remove operation
     * @property {boolean} [enabled.insertObject] -- Enable or disable the insertObject operation
     * @property {boolean} [enabled.findObject] -- Enable or disable the findObject operation
     * @property {boolean} [enabled.saveObject] -- Enable or disable the saveObject operation
     * @property {boolean} [enabled.updateObject] -- Enable or disable the updateObject operation
     * @property {boolean} [enabled.removeObject] -- Enable or disable the removeObject operation
     * @default {'*': false}
     */
    this.enabled = {'*': false}

    /***************************************************************************
     * @property {object} [schema] -- The schema used to validate objects in this collection
     * @default {@link carbond.collection.Collection.defaultSchema}
     */
    this.schema = this.defaultSchema

    /***************************************************************************
     * @property {object} [example] -- An example object for this collection
     */
    this.example = undefined

    /***************************************************************************
     * @property {object} [idGenerator] -- An object with the method "generateId" that will be
     *                                     called to populate ID if present and when
     *                                     appropriate (e.g. {@link carbond.collection.Colleciont.insert})
     */
    this.idGenerator = undefined

    /***************************************************************************
     * @property {string} [idPathParameter] -- The PATH_ID parameter name (e.g., /collection/:PATH_ID)
     * @default {@link carbond.collection.Collection.defaultIdParameter}
     */
    this.idPathParameter = this.defaultIdParameter

    /***************************************************************************
     * @property {string} [idParameter] -- The ID parameter name (XXX: rename to "objectIdName"
     *                                     since this is not a "parameter" name?)
     * @default {@link carbond.collection.Collection.defaultIdParameter}
     */
    this.idParameter = this.defaultIdParameter

    /***************************************************************************
     * @property {string} [idHeader] -- The header name which should contain the EJSON serialized ID
     * @default {@link carbond.collection.Collection.defaultIdHeader}
     */
    this.idHeader = this.defaultIdHeader

    /***************************************************************************
     * @property {object} [insertConfig] -- The config used to govern the behavior of the {@link insert}
     *                                      operation
     * @default o({}, carbond.collections.InsertConfigClass)
     */
    this.insertConfig = undefined

    /***************************************************************************
     * @property {object} [insertObjectConfig] -- The config used to govern the behavior of the
     *                                            {@link insertObject} operation
     * @default o({}, carbond.collections.InsertObjectConfigClass)
     */
    this.insertObjectConfig = undefined

    /***************************************************************************
     * @property {object} [findConfig] -- The config used to govern the behavior of the {@link find}
     *                                    operation
     * @default o({}, carbond.collections.FindConfigClass)
     */
    this.findConfig = undefined

    /***************************************************************************
     * @property {object} [findObjectConfig] -- The config used to govern the behavior of the
     *                                          {@link findObject} operation
     * @default o({}, carbond.collections.FindObjectConfigClass)
     */
    this.findObjectConfig = undefined

    /***************************************************************************
     * @property {object} [saveConfig] -- The config used to govern the behavior of the {@link save}
     *                                    operation
     * @default o({}, carbond.collections.SaveConfigClass)
     */
    this.saveConfig = undefined

    /***************************************************************************
     * @property {object} [saveObjectConfig] -- The config used to govern the behavior of the
     *                                          {@link saveObject} operation
     * @default o({}, carbond.collections.SaveObjectConfigClass)
     */
    this.saveObjectConfig = undefined

    /***************************************************************************
     * @property {object} [updateConfig] -- The config used to govern the behavior of the {@link update}
     *                                      operation
     * @default o({}, carbond.collections.UpdateConfigClass)
     */
    this.updateConfig = undefined

    /***************************************************************************
     * @property {object} [updateObjectConfig] -- The config used to govern the behavior of the
     *                                            {@link updateObject} operation
     * @default o({}, carbond.collections.UpdateObjectConfigClass)
     */
    this.updateObjectConfig = undefined

    /***************************************************************************
     * @property {object} [removeConfig] -- The config used to govern the behavior of the {@link remove}
     *                                      operation
     * @default o({}, carbond.collections.RemoveConfigClass)
     */
    this.removeConfig = undefined

    /***************************************************************************
     * @property {object} [removeObjectConfig] -- The config used to govern the behavior of the
     *                                            {@link removeObject} operation
     * @default o({}, carbond.collections.RemoveObjectConfigClass)
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
    // build the operations for this endpoint (including /<collection>/:<PATH_ID>/
    // endpoints)
    this._generateEndpointOperations()
    // build any child endpoints on top of /<collection>/:<PATH_ID>/<children>
    this._initializeChildEndpoints()
    // call super *last*
    _o('../Endpoint').prototype._init.call(this)
  },

  /*****************************************************************************
   * @property {array} ALL_COLLECTION_OPERATIONS -- The list of valid collection operations
   * @readonly
   */
  ALL_COLLECTION_OPERATIONS: {
    $property: {
      enumerable: true,
      value: [
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
      ]
    }
  },

  /*****************************************************************************
   * @property {string} defaultIdPathParameter -- The default path parameter name representing the ID
   *                                              for an object in this collection
   * @readonly
   */
  defaultIdPathParameter: {
    $property: {
      enumerable: true,
      value: DEFAULT_ID_PARAMETER
    }
  },

  /*****************************************************************************
   * @property {string} defaultIdParameter -- The default ID name of objects in this collection
   * @readonly
   */
  defaultIdParameter: {
    $property: {
      enumerable: true,
      value: DEFAULT_ID_PARAMETER
    }
  },

  /*****************************************************************************
   * @property {string} defaultIdHeader -- The default ID header name
   * @readonly
   */
  defaultIdHeader: {
    $property: {
      enumerable: true,
      value: 'carbonio-id'
    }
  },

  /*****************************************************************************
   * @property {object} defaultSchema
   * @description This is the default schema used to validate all objects in this collection.
   *              If a schema is not specified explicitly, this schema will be used.
   * @readonly
   */
  defaultSchema: {
    $property: {
      enumerable: true,
      value: {
        type: 'object',
        properties: {
          [DEFAULT_ID_PARAMETER]: {type: 'string'}
        },
        required: [DEFAULT_ID_PARAMETER],
        additionalProperties: true
      }
    }
  },

  /*****************************************************************************
   * @property {object} defaultErrorSchema
   * @description This is the default error body schema.
   * @readonly
   * @todo XXX: This is not configurable via `errorSchema` at present.
   */
  defaultErrorSchema: {
    $property: {
      enumerable: true,
      value: {
        type: 'object',
        properties: {
          code: { type: 'integer' },
          description: { type: 'string' },
          message: { type: 'string' },
        },
        required: ['code', 'description', 'message']
      }
    }
  },

  /*****************************************************************************
   * @property {carbond.collections.InsertConfig} InsertConfigClass
   * @description The config class used to instantiate the
   *              {@link carbond.collections.Collection.insert} operation config
   * @readonly
   */
  InsertConfigClass: {
    $property: {
      enumerable: true,
      value: _o('./InsertConfig')
    }
  },

  /*****************************************************************************
   * @property {carbond.collections.InsertObjectConfig} InsertObjectConfigClass
   * @description The config class used to instantiate the
   *              {@link carbond.collections.Collection.insertObject} operation config
   * @readonly
   */
  InsertObjectConfigClass: {
    $property: {
      enumerable: true,
      value: _o('./InsertObjectConfig')
    }
  },

  /*****************************************************************************
   * @property {carbond.collections.FindConfig} FindConfigClass
   * @description The config class used to instantiate the
   *              {@link carbond.collections.Collection.find} operation config
   * @readonly
   */
  FindConfigClass: {
    $property: {
      enumerable: true,
      value: _o('./FindConfig')
    }
  },

  /*****************************************************************************
   * @property {carbond.collections.FindObjectConfig} FindObjectConfigClass
   * @description The config class used to instantiate the
   *              {@link carbond.collections.Collection.findObject} operation config
   * @readonly
   */
  FindObjectConfigClass: {
    $property: {
      enumerable: true,
      value: _o('./FindObjectConfig')
    }
  },

  /*****************************************************************************
   * @property {carbond.collections.SaveConfig} SaveConfigClass
   * @description The config class used to instantiate the
   *              {@link carbond.collections.Collection.save} operation config
   * @readonly
   */
  SaveConfigClass: {
    $property: {
      enumerable: true,
      value: _o('./SaveConfig')
    }
  },

  /*****************************************************************************
   * @property {carbond.collections.SaveObjectConfig} SaveObjectConfigClass
   * @description The config class used to instantiate the
   *              {@link carbond.collections.Collection.saveObject} operation config
   * @readonly
   */
  SaveObjectConfigClass: {
    $property: {
      enumerable: true,
      value: _o('./SaveObjectConfig')
    }
  },

  /*****************************************************************************
   * @property {carbond.collections.UpdateConfig} UpdateConfigClass
   * @description The config class used to instantiate the
   *              {@link carbond.collections.Collection.update} operation config
   * @readonly
   */
  UpdateConfigClass: {
    $property: {
      enumerable: true,
      value: _o('./UpdateConfig')
    }
  },

  /*****************************************************************************
   * @property {carbond.collections.UpdateObjectConfig} UpdateObjectConfigClass
   * @description The config class used to instantiate the
   *              {@link carbond.collections.Collection.updateObject} operation config
   * @readonly
   */
  UpdateObjectConfigClass: {
    $property: {
      enumerable: true,
      value: _o('./UpdateObjectConfig')
    }
  },

  /*****************************************************************************
   * @property {carbond.collections.RemoveConfig} RemoveConfigClass
   * @description The config class used to instantiate the
   *              {@link carbond.collections.Collection.remove} operation config
   * @readonly
   */
  RemoveConfigClass: {
    $property: {
      enumerable: true,
      value: _o('./RemoveConfig')
    }
  },

  /*****************************************************************************
   * @property {carbond.collections.RemoveObjectConfig} RemoveObjectConfigClass
   * @description The config class used to instantiate the
   *              {@link carbond.collections.Collection.removeObject} operation config
   * @readonly
   */
  RemoveObjectConfigClass: {
    $property: {
      enumerable: true,
      value: _o('./RemoveObjectConfig')
    }
  },

  /******************************************************************************
   * @method insert
   * @description Bulk insert objects into a collection
   * @abstract
   * @param {Array} objects -- An array of objects to insert
   * @param {object} context -- The operation parameters (see:
   *                            {@link carbond.collections.Collection.InsertConfigClass})
   * @param {object} options -- A map of backend driver specific options (see:
   *                            {@link carbond.collections.Collection.InsertConfigClass.options})
   * @returns {object[]} -- The list of inserted objects
   * @throws {carbond.collections.errors.CollectionError}
   */
  insert: _notImplemented('insert'),

  /******************************************************************************
   * @method insertObject
   * @description Insert a single object into a collection
   * @abstract
   * @param {object} object -- An object to insert
   * @param {object} context -- The operation parameters (see:
   *                            {@link carbond.collections.Collection.InsertObjectConfigClass})
   * @param {object} options -- A map of backend driver specific options (see:
   *                            {@link carbond.collections.Collection.InsertObjectConfigClass.options})
   * @returns {object} -- The inserted object
   * @throws {carbond.collections.errors.CollectionError}
   */
  insertObject: _notImplemented('insertObject'),

  /******************************************************************************
   * @method find
   * @description Retrieve objects from a collection
   * @abstract
   * @param {object} context -- The operation parameters (see:
   *                            {@link carbond.collections.Collection.FindConfigClass})
   * @param {object} options -- A map of backend driver specific options (see:
   *                            {@link carbond.collections.Collection.FindConfigClass.options})
   * @returns {object[]} -- A list of objects
   * @throws {carbond.collections.errors.CollectionError}
   */
  find: _notImplemented('find'),

  /******************************************************************************
   * @method findObject
   * @description Retrieve a single object from a collection
   * @abstract
   * @param {string} id -- The object id
   * @param {object} context -- The operation parameters (see:
   *                            {@link carbond.collections.Collection.FindObjectConfigClass})
   * @param {object} options -- A map of backend driver specific options (see:
   *                            {@link carbond.collections.Collection.FindObjectConfigClass.options})
   * @returns {object|null} -- The found object or null
   * @throws {carbond.collections.errors.CollectionError}
   */
  findObject: _notImplemented('findObject'),

  /******************************************************************************
   * @method save
   * @description Replace the collection with an array of objects
   * @abstract
   * @param {Array} objects -- An array of objects (with IDs) to save
   * @param {object} context -- The operation parameters (see:
   *                            {@link carbond.collections.Collection.SaveConfigClass})
   * @param {object} options -- A map of backend driver specific options (see:
   *                            {@link carbond.collections.Collection.SaveConfigClass.options})
   * @returns {object[]} -- The list of saved objects
   * @throws {carbond.collections.errors.CollectionError}
   */
  save: _notImplemented('save'),

  /*****************************************************************************
   * @typedef SaveObjectResult
   * @type {object}
   * @property {object} val -- The saved object
   * @property {boolean} created -- A flag indicating whether the object was created or replaced
   */

  /******************************************************************************
   * @method saveObject
   * @description Replace or insert an object with a known ID
   * @abstract
   * @param {object} object -- The object to save (with ID)
   * @param {object} context -- The operation parameters (see:
   *                            {@link carbond.collections.Collection.SaveObjectConfigClass})
   * @param {object} options -- A map of backend driver specific options (see:
   *                            {@link carbond.collections.Collection.SaveObjectConfigClass.options})
   * @returns {carbond.collections.Collection.SaveObjectResult}
   * @throws {carbond.collections.errors.CollectionError}
   */
  saveObject: _notImplemented('saveObject'),

  /*****************************************************************************
   * @typedef UpdateResult
   * @type {object}
   * @property {number|object} val -- The number of objects updated if no upsert took place, the
   *                                  number of objects upserted if configured not to return
   *                                  upserted objects, or the upserted object(s) if configured
   *                                  to return the upserted object(s) (see:
   *                                  {@link carbond.collections.Collection.UpdateConfigClass})
   * @property {boolean} created -- A flag indicating whether an upsert took place
   */

  /******************************************************************************
   * @method update
   * @description Update (or upsert) a number of objects in a collection
   * @abstract
   * @param {*} update -- The update to be applied to the collection
   * @param {object} context -- The operation parameters (see:
   *                            {@link carbond.collections.Collection.UpdateConfigClass})
   * @param {object} options -- A map of backend driver specific options (see:
   *                            {@link carbond.collections.Collection.UpdateConfigClass.options})
   * @returns {carbond.collections.Collection.UpdateResult}
   * @throws {carbond.collections.errors.CollectionError}
   */
  update: _notImplemented('update'),

  /*****************************************************************************
   * @typedef UpdateObjectResult
   * @type {object}
   * @property {number|object} val -- The number of objects updated if no upsert took place, the
   *                                  number of objects upserted if configured not to return
   *                                  upserted objects, or the upserted object(s) if configured
   *                                  to return the upserted object(s) (see:
   *                                  {@link carbond.collections.Collection.UpdateObjectConfigClass})
   * @property {boolean} created -- A flag indicating whether an upsert took place
   */

  /******************************************************************************
   * @method updateObject
   * @description Update a specific object
   * @abstract
   * @param {string} id -- The ID of the object to update
   * @param {*} update -- The update to be applied to the collection
   * @param {object} context -- The operation parameters (see:
   *                            {@link carbond.collections.Collection.UpdateObjectConfigClass})
   * @param {object} options -- A map of backend driver specific options (see:
   *                            {@link carbond.collections.Collection.UpdateObjectConfigClass.options})
   * @returns {carbond.collections.Collection.UpdateObjectResult}
   * @throws {carbond.collections.errors.CollectionError}
   */
  updateObject: _notImplemented('updateObject'),

  /******************************************************************************
   * @method remove
   * @description Remove objects from a collection
   * @abstract
   * @param {object} context -- The operation parameters (see:
   *                            {@link carbond.collections.Collection.RemoveConfigClass})
   * @param {object} options -- A map of backend driver specific options (see:
   *                            {@link carbond.collections.Collection.RemoveConfigClass.options})
   * @returns {number|array} -- An integer representing the number of objects removed or an array of
   *                            the objects removed
   * @throws {carbond.collections.errors.CollectionError}
   */
  remove: _notImplemented('remove'),

  /******************************************************************************
   * @method removeObject
   * @description Remove a specific object from a collection
   * @abstract
   * @param {String} id -- The ID of the object to remove
   * @param {object} context -- The operation parameters (see:
   *                            {@link carbond.collections.Collection.RemoveConfigClass})
   * @param {object} options -- A map of backend driver specific options (see:
   *                            {@link carbond.collections.Collection.RemoveConfigClass.options})
   * @returns {number|object} -- An integer representing the number of objects removed (0 or 1) or the
   *                             the object removed
   * @throws {carbond.collections.errors.CollectionError}
   */
  removeObject: _notImplemented('removeObject'),

  /*****************************************************************************
   * @property {boolean} supportsInsert -- Whether or not the {@code insert} operation is supported
   */
  supportsInsert: {
    $property: {
      get: function() {
        return this._isEnabled('insert')
      }
    }
  },

  /*****************************************************************************
   * @property {boolean} supportsInsertObject -- Whether or not the {@code insertObject} operation is
   *                                             supported
   */
  supportsInsertObject: {
    $property: {
      get: function() {
        return this._isEnabled('insertObject')
      }
    }
  },

  /*****************************************************************************
   * @property {boolean} supportsFind -- Whether or not the {@code find} operation is supported
   */
  supportsFind: {
    $property: {
      get: function() {
        return this._isEnabled('find')
      }
    }
  },

  /*****************************************************************************
   * @property {boolean} supportsFindObject -- Whether or not the {@code findObject} operation is
   *                                           supported
   */
  supportsFindObject: {
    $property: {
      get: function() {
        return this._isEnabled('findObject')
      }
    }
  },

  /*****************************************************************************
   * @property {boolean} supportsSave -- Whether or not the {@code save} operation is supported
   */
  supportsSave: {
    $property: {
      get: function() {
        return this._isEnabled('save')
      }
    }
  },

  /*****************************************************************************
   * @property {boolean} supportsSaveObject -- Whether or not the {@code saveObject} operation is
   *                                           supported
   */
  supportsSaveObject: {
    $property: {
      get: function() {
        return this._isEnabled('saveObject')
      }
    }
  },

  /*****************************************************************************
   * @property {boolean} supportsUpdate -- Whether or not the {@code update} operation is supported
   */
  supportsUpdate: {
    $property: {
      get: function() {
        return this._isEnabled('update')
      }
    }
  },

  /*****************************************************************************
   * @property {boolean} supportsUpdateObject -- Whether or not the {@code updateObject} operation
   *                                             is supported
   */
  supportsUpdateObject: {
    $property: {
      get: function() {
        return this._isEnabled('updateObject')
      }
    }
  },

  /*****************************************************************************
   * @property {boolean} supportsRemove -- Whether or not the {@code remove} operation is supported
   */
  supportsRemove: {
    $property: {
      get: function() {
        return this._isEnabled('remove')
      }
    }
  },

  /*****************************************************************************
   * @property {boolean} supportsRemoveObject -- Whether or not the {@code removeObject} operation is
   *                                             supported
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
   * @method getOperationConfigFieldName
   * @description Get the property name for an operation config by name
   * @param {string} op -- The operation name (e.g., "insert")
   * @returns {string}
   */
  getOperationConfigFieldName: function(op) {
    if (!_.includes(this.ALL_COLLECTION_OPERATIONS, op)) {
      throw new Error('Unknown collection op: ' + op)
    }
    return op + 'Config'
  },

  /*****************************************************************************
   * getOperationConfigClass
   * @description Get the config class for an operation by name
   * @param {string} op -- The operation name (e.g., "insert")
   * @returns {carbond.collections.CollectionOperationConfig}
   */
  getOperationConfigClass: function(op) {
    if (!_.includes(this.ALL_COLLECTION_OPERATIONS, op)) {
      throw new Error('Unknown collection op: ' + op)
    }
    return this[_.upperFirst(op) + 'ConfigClass']
  },

  /*****************************************************************************
   * @method getOperationConfig
   * @description Get the config for an operation by name
   * @param {string} op -- The operation name (e.g., "insert")
   * @returns {carbond.collections.CollectionOperationConfig}
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
                          ejson.stringify(this.schema))
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
                    ejson.stringify(this.schema))
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
   * @typedef ConfigureOperationResult
   * @type {object}
   * @property {carbond.collection.CollectionOperationConfig} opConfig -- The operation config
   * @property {carbond.OperationResponse[]|object[]} defaultResponses -- A list of default responses (raw
   *                                                                      Objects will be converted to instances
   *                                                                      of {@link carbond.OperationResponse})
   */

  /*****************************************************************************
   * @typedef PreOperationResult
   * @type {object}
   * @property {object} context -- A map of parameters to be passed to the operation handler. Note, this is
   *                               generally just {@code req.parameters}.
   * @property {object} options -- A map of options to be passed to the underlying driver used to communicate
   *                               with the backing datastore. Generally, this will be pulled straight from
   *                               {@link carbond.collections.CollectionOperationConfig.options}, however,
   *                               the pre operation method can be overridden to extend options based on the
   *                               current request.
   */

  /*****************************************************************************
   * @method configureInsertOperation
   * @description Update the operation config using collection level config (e.g., {@link
   *              carbond.collections.Collection.schema}) and build operation responses. In general,
   *              this method should not need to be overridden or extended. Instead, customization
   *              should be driven by the operation config and the pre/post handler methods.
   * @returns {carbond.collections.Collection.ConfigureOperationResult}
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
        'Tuple validation is not supported: ' + ejson.stringify(insertSchema))
    }

    // NOTE: removal of any ID parameter is handled by the config class
    config.parameters.objects.schema = insertSchema

    // result schema

    var resultSchema = {
      type: 'array',
      items: this.schema
    }

    // responses

    var defaultResponses = {
      '201': {
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
    }

    // example

    var example = config.example ||
      (config.insertSchema || _.isNil(this.example) ? undefined : [this.example])

    if (example) {
      defaultResponses['201'].example = example
    }

    // config

    return {
      opConfig: config,
      defaultResponses: defaultResponses
    }
  },

  /*****************************************************************************
   * @method configureInsertObjectOperation
   * @description Update the operation config using collection level config (e.g., {@link
   *              carbond.collections.Collection.schema}) and build operation responses. In general,
   *              this method should not need to be overridden or extended. Instead, customization
   *              should be driven by the operation config and the pre/post handler methods.
   * @returns {carbond.collections.Collection.ConfigureOperationResult}
   */
  configureInsertObjectOperation: function() {
    var config = this.getOperationConfig('insertObject')

    // schema

    var insertObjectSchema = config.insertObjectSchema || this.schema

    // NOTE: removal of any ID parameter is handled by the config class
    config.parameters.object.schema = insertObjectSchema

    // result schema

    var resultSchema = this.schema

    // responses

    var defaultResponses = {
      '201': {
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
    }

    // example

    var example = config.example ||
      (config.insertObjectSchema ? undefined : this.example)

    if (example) {
      defaultResponses['201'].example = example
    }

    // config

    return {
      opConfig: config,
      defaultResponses: defaultResponses
    }
  },

  /******************************************************************************
   * @method preInsertOperation
   * @description Build the context and options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.collections.InsertConfig} config -- The insert operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {carbond.collections.Collection.PreOperationResult}
   */
  preInsertOperation: function(config, req, res) {
    var self = this
    var obj = req.parameters.objects

    for (var i = 0; i < obj.length; i++) {
      if (!_.isNil(obj[i][this.idParameter])) {
        throw new this.service.errors.BadRequest(
          '"' + this.idParameter +'" is not allowed on insert')
      }
    }

    // generate ID if a generator exists
    if (this.idGenerator) {
      obj.forEach(function(obj) {
        obj[self.idParameter] = self.idGenerator.generateId(self, req)
      })
    }

    return {
      context: req.parameters,
      options: config.options
    }
  },

  /******************************************************************************
   * @method preInsertObjectOperation
   * @description Build the context and options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.collections.InsertObjectConfig} config -- The insert object operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {carbond.collections.Collection.PreOperationResult}
   */
  preInsertObjectOperation: function(config, req, res) {
    var self = this
    var obj = req.parameters.object

    if (!_.isNil(obj[this.idParameter])) {
      throw new this.service.errors.BadRequest(
        '"' + this.idParameter +'" is not allowed on insert')
    }

    // generate ID if a generator exists
    if (this.idGenerator) {
      obj[self.idParameter] = self.idGenerator.generateId(self, req)
    }

    return {
      context: req.parameters,
      options: config.options
    }
  },

  /******************************************************************************
   * @method postInsertOperation
   * @description Update the HTTP response to reflect the result of the operation
   * @param {object[]} result -- The inserted objects
   * @param {carbond.collections.Collection.InsertConfigClass} config -- The insert operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {object[]|null} -- Returns the inserted objects if configured to do so and
   *                             {@code null} otherwise
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
   * @method postInsertObjectOperation
   * @description Update the HTTP response to reflect the result of the operation
   * @param {object} result -- The inserted object
   * @param {carbond.collections.Collection.InsertObjectConfigClass} config -- The insert object
   *                                                                           operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {object|null} -- Returns the inserted object if configured to do so and
   *                           {@code null} otherwise
   */
  postInsertObjectOperation: function(result, config, req, res) {
    result = this._getResult(result)
    res.status(201)
    var headers = this._get201Headers(result, req)
    res.header('Location', headers.location)
    res.header(this.idHeader, headers[this.idHeader])
    return config.opConfig.returnsInsertedObject ? result.val : null
  },

  /*****************************************************************************
   * @typedef PreInsertResult
   * @type {object}
   * @property {objects[]} [objects] -- The objects to insert
   * @property {object} [context] -- The operation handler context
   * @property {object} [options] -- The operation handler options
   */

  /******************************************************************************
   * @method preInsert
   * @description Update or transform any parameters to be passed to the operation handler
   * @param {object[]} objects -- The objects to insert
   * @param {object} context -- The operation handler context
   * @param {object} options -- The operation handler options
   * @returns {carbond.collections.Collection.PreInsertResult|undefined}
   */
  preInsert: function(objects, context, options) {
    return {
      objects: objects,
      context: context,
      options: options
    }
  },

  /*****************************************************************************
   * @typedef PreInsertObjectResult
   * @type {object}
   * @property {object} [object] -- The object to insert
   * @property {object} [context] -- The operation handler context
   * @property {object} [options] -- The operation handler options
   */

  /******************************************************************************
   * @method preInsertObject
   * @description Update or transform any parameters to be passed to the operation handler
   * @param {object} object -- The object to insert
   * @param {object} context -- The operation handler context
   * @param {object} options -- The operation handler options
   * @returns {carbond.collections.Collection.PreInsertObjectResult|undefined}
   */
  preInsertObject: function(object, context, options) {
    return {
      object: object,
      context: context,
      options: options
    }
  },

  /******************************************************************************
   * @method postInsert
   * @description Update or transform the operation result before passing it back up to
   *              the HTTP layer
   * @param {object[]} result -- The inserted object(s)
   * @param {object[]} objects -- The object(s) to insert
   * @param {object} context -- The operation handler context
   * @param {object} options -- The operation handler options
   * @returns {object[]}
   */
  postInsert: function(result, objects, context, options) {
    return result
  },

  /******************************************************************************
   * @method postInsertObject
   * @description Update or transform the operation result before passing it back up to
   *              the HTTP layer
   * @param {object} result -- The inserted object
   * @param {object} object -- The object to insert
   * @param {object} context -- The operation handler context
   * @param {object} options -- The operation handler options
   * @returns {object}
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
            parameters: _.assign(
              {}, insertObjectConfig.opConfig.parameters, insertConfig.opConfig.parameters)
          },
          defaultResponses: _.clone(insertConfig.defaultResponses)
        }
        // fix up request body schema
        _.forEach(['objects', 'object'], function(param) {
          config.opConfig.parameters[param] = _.clone(config.opConfig.parameters[param])
          config.opConfig.parameters[param].schema = {
            oneOf: [
              insertConfig.opConfig.parameters.objects.schema,
              insertObjectConfig.opConfig.parameters.object.schema
            ]
          }
        })
        var successResponse =
          _.clone(insertConfig.defaultResponses['201'])
        successResponse.schema = {
          oneOf: [
            insertConfig.defaultResponses['201'].schema,
            insertObjectConfig.defaultResponses['201'].schema,
          ]
        }
        config.defaultResponses['201'] = successResponse
      } else if (this.supportsInsert) {
        config = insertConfig
      } else if (this.supportsInsertObject) {
        config = insertObjectConfig
      }
      this.post = o({
        _type: '../Operation',
        description: config.opConfig.description ||
                     'Insert object(s) into this Collection.',
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters,
        responses: this._makeResponses(
          ['insert', 'insertObject'], config.opConfig, config.defaultResponses, false),
        service: function(req, res) {
          var params = undefined
          var result = undefined
          if (!_.isNil(req.parameters.objects) && _.isArray(req.parameters.objects)) {
            params = self.preInsertOperation(config.opConfig, req, res)
            params.objects = params.context.objects
            params.context = _.omit(params.context, 'objects')
            // XXX: we should be using Insert/InsertObject specific config here
            params = _.assignIn(
              params, self.preInsert(params.objects, params.context, params.options) || {})
            result = self.insert(
              params.objects, params.context, params.options)
            return self.postInsertOperation(
              self.postInsert(result, params.objects, params.context, params.options),
              config, req, res)
          } else if (!_.isNil(req.parameters.object) && !_.isArray(req.parameters.object)) {
            params = self.preInsertObjectOperation(config.opConfig, req, res)
            params.object = params.context.object
            params.context = _.omit(params.context, 'object')
            // XXX: we should be using Insert/InsertObject specific config here
            params = _.assignIn(
              params, self.preInsertObject(params.object, params.context, params.options) || {})
            result = self.insertObject(
              params.object, params.context, params.options)
            return self.postInsertObjectOperation(
              self.postInsertObject(result, params.object, params.context, params.options),
              config, req, res)
          } else {
            throw new Error('Unexpected request parameters/types in insert/insertObject')
          }
        }
      })
    }
  },

  /*****************************************************************************
   * @method configureFindObjectOperation
   * @description Update the operation config using collection level config (e.g., {@link
   *              carbond.collections.Collection.schema}) and build operation responses. In general,
   *              this method should not need to be overridden or extended. Instead, customization
   *              should be driven by the operation config and the pre/post handler methods.
   * @returns {carbond.collections.Collection.ConfigureOperationResult}
   */
  configureFindOperation: function() {
    // Find the CollectionOperationConfig for this operation
    var config = this.getOperationConfig('find')

    // XXX: this is done here instead of in FindConfig._init because atom instantiates objects 
    //      depth first and FindConfig.idParameter is set on Collection._init
    if (config.supportsIdQuery) {
      config.addIdQueryParameter()
    }

    // Create the default responses descriptor
    var defaultResponses = {
      '200': {
        statusCode: 200,
        description: 'Returns an array of objects. Each object has an ' +
                     this.idParameter +
                     ' and possible additional properties.',
        schema: {
          type: 'array',
          items: this.schema
        }
      }
    }

    if(this.example) {
      defaultResponses['200'].example = this.example
    }

    return {
      opConfig: config,
      defaultResponses: defaultResponses
    }
  },

  /******************************************************************************
   * @method preFindOperation
   * @description Build the context and options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.collections.FindConfig} config -- The find operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {carbond.collections.Collection.PreOperationResult}
   */
  preFindOperation: function(config, req, res) {
    var context = {}
    var paramDiff = []

    if (config.supportsSkipAndLimit) {
      context.skip = _.get(req.parameters, 'skip', 0)
      context.limit = _.get(req.parameters, 'limit', config.pageSize)
      if (!_.isNil(config.maxPageSize)) {
        context.limit = _.min([context.limit, config.maxPageSize])
      }
      paramDiff = paramDiff.concat(['skip', 'limit'])
      // note, config.supportsSkipAndLimit will always be true if config.supportsPagination is true
      if (config.supportsPagination) {
        var page = _.get(req.parameters, 'page', 0)
        context.skip += page * config.pageSize
        paramDiff = paramDiff.concat(['page'])
      }
    }

    if (config.supportsIdQuery) {
      context[this.idParameter] = _.get(req.parameters, this.idParameter, [])
      if (!_.isArray(context[this.idParameter])) {
        context[this.idParameter] = [context[this.idParameter]]
      }
      if (context[this.idParameter].length === 0) {
        context[this.idParameter] = undefined
      }
      paramDiff = paramDiff.concat([this.idParameter])
    }

    return {
      context: _.assignIn(
        context,
        _.pick(
          req.parameters,
          _.difference(
            _.keys(req.parameters),
            paramDiff))),
      options: config.options
    }
  },

  /******************************************************************************
   * @method postFindOperation
   * @description Update the HTTP response to reflect the result of the operation
   * @param {object[]} result -- The found objects
   * @param {carbond.collections.Collection.FindConfig} config -- The find operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {object[]} -- Returns the found objects
   */
  postFindOperation: function(result, config, req, res) {
    result = this._getResult(result)
    if (config.opConfig.supportsPagination) {
      var links = {}
      if (req.parameters.page > 0) {
        links.prev = url.format({
          protocol: req.protocol,
          hostname: req.hostname,
          port: this.service.port,
          pathname: req.path,
          query: _.pickBy({
            page: _.get(req.parameters, 'page', -1) - 1,
            skip: _.get(req.parameters, 'skip', -1),
            limit: _.get(req.parameters, 'limit', -1),
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
            page: _.get(req.parameters, 'page', 0) + 1,
            skip: _.get(req.parameters, 'skip', -1),
            limit: _.get(req.parameters, 'limit', -1),
          }, function(value, key) {
            return value >= 0
          })
        })
      }
      if (_.keys(links).length > 0) {
        res.links(links)
      }
    }
    return result.val
  },


  /*****************************************************************************
   * @typedef PreFindResult
   * @type {object}
   * @property {object} [context] -- The operation handler context
   * @property {object} [options] -- The operation handler options
   */

  /******************************************************************************
   * @method preFind
   * @description Update or transform any parameters to be passed to the operation handler
   * @param {object} context -- The operation handler context
   * @param {object} options -- The operation handler options
   * @returns {carbond.collections.Collection.PreFindResult|undefined}
   */
  preFind: function(context, options) {
    return {
      context: context,
      options: options
    }
  },

  /*****************************************************************************
   * @method postFind
   * @description Update or transform the operation result before passing it back up to
   *              the HTTP layer
   * @param {object[]} result -- The found object(s)
   * @param {object} context -- The operation handler context
   * @param {object} options -- The operation handler options
   * @returns {object[]}
   */
  postFind: function(result, context, options) {
    var _result = this._getResult(result)
    if (!_.isArray(_result.val)) {
      throw new Error('Unexpected value returned from find. Expected array ' +
                      'and got: ' + _result.val)
    }
    if (!_.isNil(context.limit) && _result.val.length > context.limit) {
      throw new Error('Find handler returned more elements than specified by "limit"')
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

      this.get = o({
        _type: '../Operation',
        description: config.opConfig.description || 'Find objects in this Collection.',
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters,
        responses: this._makeResponses(
          'find', config.opConfig, config.defaultResponses, true),
        service: function(req, res) {
          var params = self.preFindOperation(config.opConfig, req, res)
          params = _.assignIn(params, self.preFind(params.context, params.options) || {})
          var result = self.find(params.context, params.options)
          return self.postFindOperation(
            self.postFind(result, params.context, params.options), config, req, res)
        }
      })
    }
  },

  /*****************************************************************************
   * @method configureFindObjectOperation
   * @description Update the operation config using collection level config (e.g., {@link
   *              carbond.collections.Collection.schema}) and build operation responses. In general,
   *              this method should not need to be overridden or extended. Instead, customization
   *              should be driven by the operation config and the pre/post handler methods.
   * @returns {carbond.collections.Collection.ConfigureOperationResult}
   */
  configureFindObjectOperation: function() {
    var config = this.getOperationConfig('findObject')

    var defaultResponses = {
      '200': {
        statusCode: 200,
        description: 'Returns the object resource found at this URL ' +
                     'specified by id.',
        schema: this.schema,
        headers: []
      }
    }

    if(this.example) {
      defaultResponses['200'].example = this.example
    }

    return {
      opConfig: config,
      defaultResponses: defaultResponses
    }
  },

  /*****************************************************************************
   * @method preFindObjectOperation
   * @description Build the context and options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.collections.FindObjectConfig} config -- The find object operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {carbond.collections.Collection.PreOperationResult}
   */
  preFindObjectOperation: function(config, req, res) {
    return {
      context: req.parameters,
      options: config.options
    }
  },

  /*****************************************************************************
   * @method postFindObjectOperation
   * @description Update the HTTP response to reflect the result of the operation
   * @param {object|null} result -- The found object
   * @param {carbond.collections.Collection.FindObjectConfig} config -- The find object operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {object|null} -- Returns the found object
   */
  postFindObjectOperation: function(result, config, req, res) {
    result = this._getResult(result)
    if (_.isNil(result.val)) {
      res.status(404)
    }
    return result.val
  },

  /*****************************************************************************
   * @typedef PreFindObjectResult
   * @type {object}
   * @property {string} [id] -- The object id
   * @property {object} [context] -- The operation handler context
   * @property {object} [options] -- The operation handler options
   */

  /******************************************************************************
   * @method preFindObject
   * @description Update or transform any parameters to be passed to the operation handler
   * @param {string} [id] -- The object id
   * @param {object} context -- The operation handler context
   * @param {object} options -- The operation handler options
   * @returns {carbond.collections.Collection.PreFindObjectResult|undefined}
   */
  preFindObject: function(id, context, options) {
    return {
      id: id,
      context: context,
      options: options
    }
  },

  /*****************************************************************************
   * @method postFindObject
   * @description Update or transform the operation result before passing it back up to
   *              the HTTP layer
   * @param {object|null} result -- The found object
   * @param {string} id -- The object id
   * @param {object} context -- The operation handler context
   * @param {object} options -- The operation handler options
   * @returns {object|null}
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
        endpoint: objectSubEndpoint,
        responses: this._makeResponses(
          'findObject', config.opConfig, config.defaultResponses, true),
        service: function(req, res) {
          var params = self.preFindObjectOperation(config.opConfig, req, res)
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
   * @method configureSaveOperation
   * @description Update the operation config using collection level config (e.g., {@link
   *              carbond.collections.Collection.schema}) and build operation responses. In general,
   *              this method should not need to be overridden or extended. Instead, customization
   *              should be driven by the operation config and the pre/post handler methods.
   * @returns {carbond.collections.Collection.ConfigureOperationResult}
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
        'Tuple validation is not supported: ' + ejson.stringify(saveSchema))
    }

    config.parameters.objects.schema = saveSchema

    // result schema

    var resultSchema = config.returnsSavedObjects ? {
        type: 'array',
        items: this.schema
      } :
      {
        type: 'undefined'
      }

    // responses

    var defaultResponses = config.returnsSavedObjects ?
      {
        '200': {
          statusCode: 200,
          description: 'The object(s) were successfully saved. The body will ' +
                       'contain the list of saved object(s).',
          schema: resultSchema
        }
      } :
      {
        '204': {
          statusCode: 204,
          description: 'The object(s) were successfully saved.',
          schema: {type: 'undefined'}
        }
      }

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
   * @method preSaveOperation
   * @description Build the context and options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.collections.SaveConfig} config -- The save operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {carbond.collections.Collection.PreOperationResult}
   */
  preSaveOperation: function(config, req, res) {
    return {
      context: req.parameters,
      options: config.options
    }
  },

  /*****************************************************************************
   * @method postSaveOperation
   * @description Update the HTTP response to reflect the result of the operation
   * @param {object[]} result -- The saved objects
   * @param {carbond.collections.Collection.SaveConfig} config -- The save operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {object[]|null} -- Returns the saved objects if configured to do so and
   *                             {@code null} if not
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
   * @typedef PreSaveResult
   * @type {object}
   * @property {object[]} [objects] -- The objects to save
   * @property {object} [context] -- The operation handler context
   * @property {object} [options] -- The operation handler options
   */

  /******************************************************************************
   * @method preSave
   * @description Update or transform any parameters to be passed to the operation handler
   * @param {object[]} [objects] -- The objects to save
   * @param {object} context -- The operation handler context
   * @param {object} options -- The operation handler options
   * @returns {carbond.collections.Collection.PreSaveResult|undefined}
   */
  preSave: function(objects, context, options) {
    return {
      objects: objects,
      context: context,
      options: options
    }
  },

  /*****************************************************************************
   * @method postSave
   * @description Update or transform the operation result before passing it back up to
   *              the HTTP layer
   * @param {object[]} result -- The saved objects
   * @param {object[]} objects -- The objects to save
   * @param {object} context -- The operation handler context
   * @param {object} options -- The operation handler options
   * @returns {object[]}
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
          var params = self.preSaveOperation(config.opConfig, req, res)
          params.objects = params.context.objects
          params.context = _.omit(params.context, 'objects')
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
   * @method configureSaveObjectOperation
   * @description Update the operation config using collection level config (e.g., {@link
   *              carbond.collections.Collection.schema}) and build operation responses. In general,
   *              this method should not need to be overridden or extended. Instead, customization
   *              should be driven by the operation config and the pre/post handler methods.
   * @returns {carbond.collections.Collection.ConfigureOperationResult}
   */
  configureSaveObjectOperation: function() {
    var config = this.getOperationConfig('saveObject')

    // schema

    var saveObjectSchema = config.saveObjectSchema || this.schema

    config.parameters.object.schema = saveObjectSchema

    // result schema

    var resultSchema = this.schema

    // responses

    // XXX: add 201?
    var defaultResponses = config.returnsSavedObject ?
      {
        '200': {
          statusCode: 200,
          description: 'The object was successfully saved. The body will ' +
                       'contain the saved object.',
          schema: config.returnsSavedObject ?
                    resultSchema :
                    {type: 'undefined'},
        }
      } :
      {
        '204': {
          statusCode: 204,
          description: 'The object was successfully saved.',
          schema: {type: 'undefined'}
        }
      }

    if (config.supportsUpsert) {
      defaultResponses['201'] = {
        statusCode: 201,
        description: 'The object was successfully inserted. The Location ' +
                     'header will contain a URL pointing to the newly created ' +
                     'resource and the body will contain the inserted object if ' +
                     'configured to do so.',
        schema: config.returnsSavedObject ?
                  resultSchema :
                  {type: 'undefined'},
        headers: ['Location', this.idHeader]
      }
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
   * @method preSaveObjectOperation
   * @description Build the context and options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.collections.SaveObjectConfig} config -- The save object operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {carbond.collections.Collection.PreOperationResult}
   */
  preSaveObjectOperation: function(config, req, res) {
    if (_.isObjectLike(req.parameters.object[this.idParameter]) &&
          ejson.stringify(req.parameters[this.idPathParameter]) !==
          ejson.stringify(req.parameters.object[this.idParameter]) ||
        !_.isObjectLike(req.parameters.object[this.idParameter]) &&
          req.parameters[this.idPathParameter] !==
          req.parameters.object[this.idParameter]) {
      throw new this.service.errors.BadRequest(
        'Path ' + this.idPathParameter + ' does not match object.' + this.idParameter + '.')
    }
    return {
      context: _.omit(req.parameters, this.idPathParameter),
      options: config.options
    }
  },

  /*****************************************************************************
   * @method postSaveObjectOperation
   * @description Update the HTTP response to reflect the result of the operation
   * @param {carbond.collections.Collection.SaveObjectResult} result -- The saved object and
   *                                                                    a flag to indicate if it
   *                                                                    was created rather than
   *                                                                    replaced
   * @param {carbond.collections.Collection.SaveObjectConfigClass} config -- The save object operation
   *                                                                         config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {object[]|null} -- Returns the saved object if configured to do so and
   *                             {@code null} if not
   */
  postSaveObjectOperation: function(result, config, req, res) {
    result = this._getResult(result)
    if (_.isNil(result.val)) {
      res.status(404)
      return null
    }
    if (config.opConfig.supportsUpsert && result.created) {
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
   * @typedef PreSaveObjectResult
   * @type {object}
   * @property {object} [object] -- The object to save
   * @property {object} [context] -- The operation handler context
   * @property {object} [options] -- The operation handler options
   */

  /******************************************************************************
   * @method preSaveObject
   * @description Update or transform any parameters to be passed to the operation handler
   * @param {object} [object] -- The object to save
   * @param {object} context -- The operation handler context
   * @param {object} options -- The operation handler options
   * @returns {carbond.collections.Collection.PreSaveObjectResult|undefined}
   */
  preSaveObject: function(object, context, options) {
    return {
      object: object,
      context: context,
      options: options
    }
  },

  /*****************************************************************************
   * @method postSaveObject
   * @description Update or transform the operation result before passing it back up to
   *              the HTTP layer
   * @param {carbond.collections.Collection.SaveObjectResult} result -- The {@code SaveObjectResult}
   * @param {object} object -- The object to save
   * @param {object} context -- The operation handler context
   * @param {object} options -- The operation handler options
   * @returns {carbond.collections.Collection.SaveObjectResult}
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
          var params = self.preSaveObjectOperation(config.opConfig, req, res)
          params.object = params.context.object
          params.context = _.omit(params.context, 'object')
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
   * @method configureUpdateOperation
   * @description Update the operation config using collection level config (e.g., {@link
   *              carbond.collections.Collection.schema}) and build operation responses. In general,
   *              this method should not need to be overridden or extended. Instead, customization
   *              should be driven by the operation config and the pre/post handler methods.
   * @returns {carbond.collections.Collection.ConfigureOperationResult}
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

    var defaultResponses = {
      '200': {
        statusCode: 200,
        description: 'Object(s) in the collection were successfully updated',
        schema: resultSchema
      }
    }

    if (config.supportsUpsert) {
      defaultResponses['201'] = {
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
      }
    }

    // config

    return {
      opConfig: config,
      defaultResponses: defaultResponses
    }
  },

  /*****************************************************************************
   * @method preUpdateOperation
   * @description Build the context and options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.collections.UpdateConfig} config -- The update operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {carbond.collections.Collection.PreOperationResult}
   */
  preUpdateOperation: function(config, req, res) {
    return {
      context: req.parameters,
      options: config.options
    }
  },

  /*****************************************************************************
   * @method postUpdateOperation
   * @description Update the HTTP response to reflect the result of the operation. It should be
   *              noted that the result can be either a number or an array of objects. If the
   *              underlying driver does not support returning the upserted object(s), then the
   *              result will always be a number and
   *              {@link carbond.collections.UpdateConfig.returnsUpsertedObjects} should be
   *              configured to reflect this.
   * @param {carbond.collections.Collection.UpdateResult} result -- The number of objects
   *                                                                updated/upserted or the upserted
   *                                                                object(s)
   * @param {carbond.collections.Collection.UpdateConfigClass} config -- The update operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {object} -- Returns {@link {n: NUMBER_OF_OBJECTS_UPDATED_OR_UPSERTED}} or the upserted
   *                      object(s)
   */
  postUpdateOperation: function(result, config, req, res) {
    result = this._getResult(result)
    if (!result.created && (!_.isInteger(result.val) || result.val < 0)) {
      throw new Error('Update returned ' + result.val.toString() + ' instead of an integer')
    }
    if (result.created && (!config.opConfig.supportsUpsert || !req.parameters.upsert)) {
      throw new Error('Update performed upsert but operation is not configured to support ' +
                      'upsert or upsert not requested')
    }
    // the upsert/created verification case should be handled by the response schema

    if (config.opConfig.supportsUpsert && result.created) {
      if (!_.isArray(result.val)) {
        throw new Error('An array of objects with at least ' + this.idParameter + 
                        ' properties must be returned if "supportsUpsert" is true')
      }
      var headers = this._get201Headers(result, req)
      res.status(201)
      res.header('Location', headers.location)
      res.header(this.idHeader, headers[this.idHeader])
      return config.opConfig.returnsUpsertedObjects ? result.val : {n: result.val.length}
    }
    return {n: result.val}
  },

  /*****************************************************************************
   * @typedef PreUpdateResult
   * @type {object}
   * @property {*} [update] -- The update spec
   * @property {object} [context] -- The operation handler context
   * @property {object} [options] -- The operation handler options
   */

  /******************************************************************************
   * @method preUpdate
   * @description Update or transform any parameters to be passed to the operation handler
   * @param {*} [update] -- The update spec
   * @param {object} context -- The operation handler context
   * @param {object} options -- The operation handler options
   * @returns {carbond.collections.Collection.PreUpdateResult|undefined}
   */
  preUpdate: function(update, context, options) {
    return {
      update: update,
      context: context,
      options: options
    }
  },

  /*****************************************************************************
   * @method postUpdate
   * @description Update or transform the operation result before passing it back up to
   *              the HTTP layer
   * @param {carbond.collections.Collection.UpdateResult} result -- The {@code UpdateResult}
   * @param {*} update -- The update spec
   * @param {object} context -- The operation handler context
   * @param {object} options -- The operation handler options
   * @returns {carbond.collections.Collection.UpdateResult}
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
          var params = self.preUpdateOperation(config.opConfig, req, res)
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
   * @method configureUpdateObjectOperation
   * @description Update the operation config using collection level config (e.g., {@link
   *              carbond.collections.Collection.schema}) and build operation responses. In general,
   *              this method should not need to be overridden or extended. Instead, customization
   *              should be driven by the operation config and the pre/post handler methods.
   * @returns {carbond.collections.Collection.ConfigureOperationResult}
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

    var defaultResponses = {
      '200': {
        statusCode: 200,
        description: 'The object was successfully updated',
        schema: resultSchema
      }
    }

    if (config.supportsUpsert) {
      defaultResponses['201'] = {
        statusCode: 201,
        description: 'The object was successfully upserted. The Location ' +
                     'header will contain a URL pointing to the newly created ' +
                     'resource and the body will contain the upserted object if ' +
                     'configured to do so.',
        schema: config.returnsUpsertedObject ?
                  this.schema :
                  resultSchema,
        headers: ['Location', this.idHeader]
      }
    }

    // config

    return {
      opConfig: config,
      defaultResponses: defaultResponses
    }
  },

  /*****************************************************************************
   * @method preUpdateObjectOperation
   * @description Build the context and options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.collections.UpdateObjectConfig} config -- The update object operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {carbond.collections.Collection.PreOperationResult}
   */
  preUpdateObjectOperation: function(config, req, res) {
    return {
      context: req.parameters,
      options: config.options
    }
  },

  /*****************************************************************************
   * @method postUpdateObjectOperation
   * @description Update the HTTP response to reflect the result of the operation. It should be
   *              noted that the result can be either a number or an object. If the underlying
   *              driver does not support returning the upserted object, then the result will
   *              always be a number and
   *              {@link carbond.collections.UpdateObjectConfig.returnsUpsertedObject} should be
   *              configured to reflect this.
   * @param {carbond.collections.Collection.UpdateObjectResult} result -- The number of objects
   *                                                                      updated/upserted or the
   *                                                                      upserted object
   * @param {carbond.collections.Collection.UpdateObjectConfigClass} config -- The update object operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {object} -- Returns {@link {n: NUMBER_OF_OBJECTS_UPDATED_OR_UPSERTED}} or the upserted
   *                      object
   */
  postUpdateObjectOperation: function(result, config, req, res) {
    result = this._getResult(result)
    if ((!result.created && (!_.isInteger(result.val) || result.val < 0 || result.val > 1))) {
      throw new Error('Update returned ' + result.val.toString() + ' instead of an integer')
    }
    if (result.created && (!config.opConfig.supportsUpsert || !req.parameters.upsert)) {
      throw new Error('Update performed upsert but operation is not configured to support ' +
                      'upsert or upsert not requested')
    }
    // the upsert/created verification case should be handled by the response schema

    if (config.opConfig.supportsUpsert && result.created) {
      if (!_.isObject(result.val)) {
        throw new Error('An object with at least ' + this.idParameter + ' property must be ' +
                        'returned if "supportsUpsert" is true')
      }
      var headers = this._get201Headers(result, req)
      res.status(201)
      res.header('Location', headers.location)
      res.header(this.idHeader, headers[this.idHeader])
      return config.opConfig.returnsUpsertedObject ? result.val : {n: 1}
    }

    if (_.isNil(result.val) || result.val === 0) {
      throw new this.service.errors.NotFound(path.basename(req.path))
    }

    return {n: 1}
  },

  /*****************************************************************************
   * @typedef PreUpdateObjectResult
   * @type {object}
   * @property {string} [id] -- The object id
   * @property {*} [update] -- The update spec
   * @property {object} [context] -- The operation handler context
   * @property {object} [options] -- The operation handler options
   */

  /******************************************************************************
   * @method preUpdateObject
   * @description Update or transform any parameters to be passed to the operation handler
   * @param {string} [id] -- The object id
   * @param {*} [update] -- The update spec
   * @param {object} context -- The operation handler context
   * @param {object} options -- The operation handler options
   * @returns {carbond.collections.Collection.PreUpdateObjectResult|undefined}
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
   * @method postUpdateObject
   * @description Update or transform the operation result before passing it back up to
   *              the HTTP layer
   * @param {carbond.collections.Collection.UpdateResult} result -- The {@code UpdateResult}
   * @param {string} update -- The update spec
   * @param {*} update -- The update spec
   * @param {object} context -- The operation handler context
   * @param {object} options -- The operation handler options
   * @returns {carbond.collections.Collection.UpdateResult}
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
          var params = self.preUpdateObjectOperation(config.opConfig, req, res)
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
   * @method configureRemoveOperation
   * @description Update the operation config using collection level config (e.g., {@link
   *              carbond.collections.Collection.schema}) and build operation responses. In general,
   *              this method should not need to be overridden or extended. Instead, customization
   *              should be driven by the operation config and the pre/post handler methods.
   * @returns {carbond.collections.Collection.ConfigureOperationResult}
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

    var defaultResponses = {
      '200': {
        statusCode: 200,
        description: 'Object(s) in collection were successfully removed',
        schema: resultSchema
      }
    }

    // config

    return {
      opConfig: config,
      defaultResponses: defaultResponses
    }
  },

  /*****************************************************************************
   * @method preRemoveOperation
   * @description Build the context and options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.collections.RemoveConfig} config -- The remove operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {carbond.collections.Collection.PreOperationResult}
   */
  preRemoveOperation: function(config, req, res) {
    return {
      context: req.parameters,
      options: config.options
    }
  },

  /*****************************************************************************
   * @method postRemoveOperation
   * @description Update the HTTP response to reflect the result of the operation. It should be
   *              noted that the result can be either a number or an array of object(s). If the
   *              underlying driver does not support returning the removed object(s), then the
   *              result will always be a number and
   *              {@link carbond.collections.RemoveConfig.returnsRemovedObjects} should be
   *              configured to reflect this.
   * @param {number|array} result -- The number of objects removed or the removed objec(s)
   * @param {carbond.collections.Collection.RemoveConfigClass} config -- The remove operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {object} -- Returns {@link {n: NUMBER_OF_OBJECTS_REMOVED}} or the removed objects
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
   * @typedef PreRemoveResult
   * @type {object}
   * @property {object} [context] -- The operation handler context
   * @property {object} [options] -- The operation handler options
   */

  /******************************************************************************
   * @method preRemove
   * @description Update or transform any parameters to be passed to the operation handler
   * @param {object} context -- The operation handler context
   * @param {object} options -- The operation handler options
   * @returns {carbond.collections.Collection.PreRemoveResult|undefined}
   */
  preRemove: function(context, options) {
    return {
      context: context,
      options: options
    }
  },

  /*****************************************************************************
   * @method postRemove
   * @description Update or transform the operation result before passing it back up to
   *              the HTTP layer
   * @param {number|array} result -- The number of objects (or the object(s) themselves) removed
   * @param {object} context -- The operation handler context
   * @param {object} options -- The operation handler options
   * @returns {number|array}
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
          var params = self.preRemoveOperation(config.opConfig, req, res)
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
   * @method configureRemoveObjectOperation
   * @description Update the operation config using collection level config (e.g., {@link
   *              carbond.collections.Collection.schema}) and build operation responses. In general,
   *              this method should not need to be overridden or extended. Instead, customization
   *              should be driven by the operation config and the pre/post handler methods.
   * @returns {carbond.collections.Collection.ConfigureOperationResult}
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

    var defaultResponses = {
      '200': {
        statusCode: 200,
        description: 'The object was successfully removed',
        schema: resultSchema
      }
    }

    // config

    return {
      opConfig: config,
      defaultResponses: defaultResponses
    }
  },

  /*****************************************************************************
   * @method preRemoveObjectOperation
   * @description Build the context and options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.collections.RemoveObjectConfig} config -- The remove object operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {carbond.collections.Collection.PreOperationResult}
   */
  preRemoveObjectOperation: function(config, req, res) {
    return {
      context: req.parameters,
      options: config.options
    }
  },

  /*****************************************************************************
   * @method postRemoveObjectOperation
   * @description Update the HTTP response to reflect the result of the operation. It should be
   *              noted that the result can be either a number or an object. If the
   *              underlying driver does not support returning the removed object, then the
   *              result will always be a number and
   *              {@link carbond.collections.RemoveObjectConfig.returnsRemovedObject} should be
   *              configured to reflect this.
   * @param {number|object} result -- The number of objects removed or the removed object
   * @param {carbond.collections.Collection.RemoveObjectConfigClass} config -- The remove object
   *                                                                           operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {object} -- Returns {@link {n: NUMBER_OF_OBJECTS_REMOVED}} or the removed object
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
   * @typedef PreRemoveObjectResult
   * @type {object}
   * @property {string} [id] -- The object id
   * @property {object} [context] -- The operation handler context
   * @property {object} [options] -- The operation handler options
   */

  /******************************************************************************
   * @method preRemoveObject
   * @description Update or transform any parameters to be passed to the operation handler
   * @param {string} [id] -- The object id
   * @param {object} context -- The operation handler context
   * @param {object} options -- The operation handler options
   * @returns {carbond.collections.Collection.PreRemoveObjectResult|undefined}
   */
  preRemoveObject: function(id, context, options) {
    return {
      id: id,
      context: context,
      options: options
    }
  },

  /*****************************************************************************
   * @method postRemoveObject
   * @description Update or transform the operation result before passing it back up to
   *              the HTTP layer
   * @param {number|object} result -- The number of objects (or the object itself) removed
   * @param {object} context -- The operation handler context
   * @param {object} options -- The operation handler options
   * @returns {number|array}
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
          var params = self.preRemoveObjectOperation(config.opConfig, req, res)
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
          _.union(_.keys(result), ['val', 'created']).length === 2) {
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
      headers[this.idHeader] = ejson.stringify(
        _.map(result.val, function(obj) {
          return obj[self.idParameter]
        })
      )
    } else {
      headers.location =
        path.normalize(
          path.join(_.trimEnd(_path, '/'), result.val[this.idParameter].toString()))
      headers[this.idHeader] = ejson.stringify(result.val[this.idParameter])
    }
    return headers
  },

  /*****************************************************************************
   * _initializeChildEndpoints
   */
  _initializeChildEndpoints: function() {
    var self = this

    // Sub endpoints are really meant as sub-endpoints of :<PATH_ID>/
    // so we move them there (except :<PATH_ID> itself)
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

    // See if schema has a type for ID defined
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
    _.forEach(responses, function(responseDescriptor, statusCode) {
      responses[statusCode] = self._normalizeResponseDescriptor(responseDescriptor)
      if (validateResponseSchemasHaveId) {
        self._validateSchemaHasId(responses[statusCode].schema)
      }
    })

    op = !_.isArray(op) ? [op] : op

    // Consider NotFound
    if ((_.intersection(['headObject', 'findObject', 'saveObject', 'updateObject', 'removeObject'], op)).length > 0) {
      if ((op.indexOf('saveObject') === -1 || !config.supportsUpsert) &&
          (op.indexOf('updateObject') === -1 || !config.supportsUpsert)) {
        responses['404'] = {
          statusCode: 404,
          description: 'Collection resource cannot be found by the supplied ' +
                       self.idPathParameter + '.',
          schema: self.defaultErrorSchema
        }
      }
    }

    // Consider BadRequest
    if (!('400' in responses)) {
      responses['400'] = {
        statusCode: 400,
        description: 'Request is malformed (i.e. invalid parameters).',
        schema: self.defaultErrorSchema
      }
    }

    // Add Forbidden
    if (!('403' in responses)) {
      responses['403'] = {
        statusCode: 403,
        description: 'User is not authorized to run this operation.',
        schema: self.defaultErrorSchema
      }
    }

    // Add InternalServerError
    if (!('500' in responses)) {
      responses['500'] = {
        statusCode: 500,
        description: 'There was an unexpected internal error processing this request.',
        schema: self.defaultErrorSchema
      }
    }

    if ((_.intersection(['head', 'headObject'], op)).length > 0) {
      responses = _.map(responses, function(r) {
        r = _.clone(r)
        r.schema = {type: 'null'}
        return r
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
