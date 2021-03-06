var assert = require('assert')
var path = require('path')
var url = require('url')

var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var atom = require('@carbon-io/carbon-core').atom
var ejson = require('@carbon-io/carbon-core').ejson
var o = atom.o(module)
var oo = atom.oo(module)

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
  _ctorName: 'Collection',

  /*****************************************************************************
   * @constructs Collection
   * @description Provides a high-level abstraction for defining Endpoints that
   *              behave like a RESTful collection of resources
   * @memberof carbond.collections
   * @extends carbond.Endpoint
   */
  _C: function() {
    /***************************************************************************
     * @property {Object} [enabled] -- Control which collection level operations
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
     * @property {Object} [schema] -- The schema used to validate objects in this collection
     * @default {@link carbond.collections.Collection.defaultSchema}
     */
    this.schema = this.defaultSchema

    /***************************************************************************
     * @property {Object} [example] -- An example object for this collection
     */
    this.example = undefined

    /***************************************************************************
     * @property {Object} [idGenerator] -- An object with the method "generateId" that will be
     *                                     called to populate ID if present and when
     *                                     appropriate (e.g. {@link carbond.collections.Collection.insert})
     */
    this.idGenerator = undefined

    /***************************************************************************
     * @property {string} [idPathParameterName] -- The PATH_ID parameter name (e.g., /collection/:PATH_ID)
     * @default {@link carbond.collections.Collection.defaultIdParameter}
     */
    this.idPathParameterName = this.defaultIdParameter

    /***************************************************************************
     * @property {string} [idParameterName] -- The ID parameter name (XXX: rename to "objectIdName"
     *                                     since this is not a "parameter" name?)
     * @default {@link carbond.collections.Collection.defaultIdParameter}
     */
    this.idParameterName = this.defaultIdParameter

    /***************************************************************************
     * @property {string} [idHeaderName] -- The header name which should contain the EJSON serialized ID
     * @default {@link carbond.collections.Collection.defaultIdHeaderName}
     */
    this.idHeaderName = this.defaultIdHeaderName

    /***************************************************************************
     * @property {Object} [insertConfig] -- The config used to govern the behavior of the {@link insert}
     *                                      operation
     * @default o({}, carbond.collections.InsertConfigClass)
     */
    this.insertConfig = undefined

    /***************************************************************************
     * @property {Object} [insertObjectConfig] -- The config used to govern the behavior of the
     *                                            {@link insertObject} operation
     * @default o({}, carbond.collections.InsertObjectConfigClass)
     */
    this.insertObjectConfig = undefined

    /***************************************************************************
     * @property {Object} [findConfig] -- The config used to govern the behavior of the {@link find}
     *                                    operation
     * @default o({}, carbond.collections.FindConfigClass)
     */
    this.findConfig = undefined

    /***************************************************************************
     * @property {Object} [findObjectConfig] -- The config used to govern the behavior of the
     *                                          {@link findObject} operation
     * @default o({}, carbond.collections.FindObjectConfigClass)
     */
    this.findObjectConfig = undefined

    /***************************************************************************
     * @property {Object} [saveConfig] -- The config used to govern the behavior of the {@link save}
     *                                    operation
     * @default o({}, carbond.collections.SaveConfigClass)
     */
    this.saveConfig = undefined

    /***************************************************************************
     * @property {Object} [saveObjectConfig] -- The config used to govern the behavior of the
     *                                          {@link saveObject} operation
     * @default o({}, carbond.collections.SaveObjectConfigClass)
     */
    this.saveObjectConfig = undefined

    /***************************************************************************
     * @property {Object} [updateConfig] -- The config used to govern the behavior of the {@link update}
     *                                      operation
     * @default o({}, carbond.collections.UpdateConfigClass)
     */
    this.updateConfig = undefined

    /***************************************************************************
     * @property {Object} [updateObjectConfig] -- The config used to govern the behavior of the
     *                                            {@link updateObject} operation
     * @default o({}, carbond.collections.UpdateObjectConfigClass)
     */
    this.updateObjectConfig = undefined

    /***************************************************************************
     * @property {Object} [removeConfig] -- The config used to govern the behavior of the {@link remove}
     *                                      operation
     * @default o({}, carbond.collections.RemoveConfigClass)
     */
    this.removeConfig = undefined

    /***************************************************************************
     * @property {Object} [removeObjectConfig] -- The config used to govern the behavior of the
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
   * @property {string} defaultIdHeaderName -- The default ID header name
   * @readonly
   */
  defaultIdHeaderName: {
    $property: {
      enumerable: true,
      value: 'carbonio-id'
    }
  },

  /*****************************************************************************
   * @property {Object} defaultSchema
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
   * @property {Object} defaultErrorSchema
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
          code: {
            type: 'integer',
            description: 'The HTTP status code of the error that occurred'
          },
          description: {
            type: 'string',
            description: 'A description of the error that occurred'
          },
          message: {
            type: 'string',
            description: 'A message sent with the error response'
          },
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
   * @param {Object} options -- The operation parameters (see:
   *                            {@link carbond.collections.Collection.InsertConfigClass})
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object[]} -- The list of inserted objects
   * @throws {carbond.collections.errors.CollectionError}
   */
  insert: _notImplemented('insert'),

  /******************************************************************************
   * @method insertObject
   * @description Insert a single object into a collection
   * @abstract
   * @param {Object} object -- An object to insert
   * @param {Object} options -- The operation parameters (see:
   *                            {@link carbond.collections.Collection.InsertObjectConfigClass})
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object} -- The inserted object
   * @throws {carbond.collections.errors.CollectionError}
   */
  insertObject: _notImplemented('insertObject'),

  /******************************************************************************
   * @method find
   * @description Retrieve objects from a collection
   * @abstract
   * @param {Object} options -- The operation parameters (see:
   *                            {@link carbond.collections.Collection.FindConfigClass})
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object[]} -- A list of objects
   * @throws {carbond.collections.errors.CollectionError}
   */
  find: _notImplemented('find'),

  /******************************************************************************
   * @method findObject
   * @description Retrieve a single object from a collection
   * @abstract
   * @param {string} id -- The object id
   * @param {Object} options -- The operation parameters (see:
   *                            {@link carbond.collections.Collection.FindObjectConfigClass})
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object|null} -- The found object or null
   * @throws {carbond.collections.errors.CollectionError}
   */
  findObject: _notImplemented('findObject'),

  /******************************************************************************
   * @method save
   * @description Replace the collection with an array of objects
   * @abstract
   * @param {Array} objects -- An array of objects (with IDs) to save
   * @param {Object} options -- The operation parameters (see:
   *                            {@link carbond.collections.Collection.SaveConfigClass})
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object[]} -- The list of saved objects
   * @throws {carbond.collections.errors.CollectionError}
   */
  save: _notImplemented('save'),

  /*****************************************************************************
   * @typedef SaveObjectResult
   * @type {Object}
   * @property {Object} val -- The saved object
   * @property {boolean} created -- A flag indicating whether the object was created or replaced
   */

  /******************************************************************************
   * @method saveObject
   * @description Replace or insert an object with a known ID
   * @abstract
   * @param {Object} object -- The object to save (with ID)
   * @param {Object} options -- The operation parameters (see:
   *                            {@link carbond.collections.Collection.SaveObjectConfigClass})
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.SaveObjectResult}
   * @throws {carbond.collections.errors.CollectionError}
   */
  saveObject: _notImplemented('saveObject'),

  /*****************************************************************************
   * @typedef UpdateResult
   * @type {Object}
   * @property {number|Object} val -- The number of objects updated if no upsert took place, the
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
   * @param {Object} options -- The operation parameters (see:
   *                            {@link carbond.collections.Collection.UpdateConfigClass})
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.UpdateResult}
   * @throws {carbond.collections.errors.CollectionError}
   */
  update: _notImplemented('update'),

  /*****************************************************************************
   * @typedef UpdateObjectResult
   * @type {Object}
   * @property {number|Object} val -- The number of objects updated if no upsert took place, the
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
   * @param {Object} options -- The operation parameters (see:
   *                            {@link carbond.collections.Collection.UpdateObjectConfigClass})
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.UpdateObjectResult}
   * @throws {carbond.collections.errors.CollectionError}
   */
  updateObject: _notImplemented('updateObject'),

  /******************************************************************************
   * @method remove
   * @description Remove objects from a collection
   * @abstract
   * @param {Object} options -- The operation parameters (see:
   *                            {@link carbond.collections.Collection.RemoveConfigClass})
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
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
   * @param {Object} options -- The operation parameters (see:
   *                            {@link carbond.collections.Collection.RemoveConfigClass})
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {number|Object} -- An integer representing the number of objects removed (0 or 1) or the
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
      throw new TypeError('Schema must conain ' + this.idParameterName + ', got: ' +
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
    } else if (schema && schema.properties && schema.properties[this.idParameterName] &&
               _.includes(schema.required, this.idParameterName)) {
      return schema
    }
    throw new Error('Invalid schema. ' + this.idParameterName +
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
    // make sure behavior of parameters and responses merge is the same. if $merge is present, then
    // atom do the work, otherwise delete parameters from the config and merge in later
    if (!_.isNil(config.parameters) &&
        (_.keys(config.parameters).length != 1 ||
         !_.includes(_.values(atom.OPERATORS), _.keys(config.parameters)[0]))) {
      config.parameters = {[atom.OPERATORS.MERGE]: config.parameters}
    }
    // delay processing of responses
    let responses = config.responses
    delete config.responses
    config = o(config, this.getOperationConfigClass(op))
    config.responses = responses
    config.idParameterName = this.idParameterName
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
   * @type {Object}
   * @property {carbond.collections.CollectionOperationConfig} opConfig -- The operation config
   * @property {carbond.OperationResponse[]|Object[]} defaultResponses -- A list of default responses (raw
   *                                                                      Objects will be converted to instances
   *                                                                      of {@link carbond.OperationResponse})
   */

  /*****************************************************************************
   * @typedef PreOperationResult
   * @type {Object}
   * @property {Object} options -- A map of parameters to be passed to the operation handler. Note, this is
   *                               generally just {@code req.parameters}.
   */

  /*****************************************************************************
   * @method configureInsertOperation
   * @description Update the operation config using collection level config (e.g., {@link
   *              carbond.collections.Collection.schema}) and build operation responses. In general,
   *              this method should not need to be overridden or extended. Instead, customization
   *              should be driven by the operation config and the pre/post handler methods.
   * @returns {typedef:carbond.collections.Collection.ConfigureOperationResult}
   */
  configureInsertOperation: function() {
    var config = this.getOperationConfig('insert')

    // insert schema

    var insertSchema = config.schema || config.parameters.objects.schema || this.schema

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
    config.parameters.objects.schema = _.cloneDeep(insertSchema)

    // result schema

    var resultSchema = {
      type: 'array',
      items: _.cloneDeep(this.schema)
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
        headers: ['Location', this.idHeaderName]
      }
    }

    // example

    var example = config.example ||
      (insertSchema || _.isNil(this.example) ? undefined : [this.example])

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
   * @returns {typedef:carbond.collections.Collection.ConfigureOperationResult}
   */
  configureInsertObjectOperation: function() {
    var config = this.getOperationConfig('insertObject')

    // schema

    var insertObjectSchema = config.schema ||
                             config.parameters.object.schema ||
                             this.schema

    // NOTE: removal of any ID parameter is handled by the config class
    config.parameters.object.schema = _.cloneDeep(insertObjectSchema)

    // result schema

    var resultSchema = _.cloneDeep(this.schema)

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
        headers: ['Location', this.idHeaderName]
      }
    }

    // example

    var example = config.example ||
      (insertObjectSchema ? undefined : this.example)

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
   * @description Build the options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.collections.InsertConfig} config -- The insert operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreOperationResult}
   */
  preInsertOperation: function(config, req, res, context) {
    var self = this
    var obj = req.parameters.objects
    var options = {}

    for (var i = 0; i < obj.length; i++) {
      if (!_.isNil(obj[i][this.idParameterName])) {
        throw new this.service.errors.BadRequest(
          '"' + this.idParameterName +'" is not allowed on insert')
      }
    }

    // generate ID if a generator exists
    if (this.idGenerator) {
      obj.forEach(function(obj) {
        obj[self.idParameterName] = self.idGenerator.generateId(self, req)
      })
    }

    options = _.assignIn(options, config.options, req.parameters)

    return options
  },

  /******************************************************************************
   * @method preInsertObjectOperation
   * @description Build the options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.collections.InsertObjectConfig} config -- The insert object operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreOperationResult}
   */
  preInsertObjectOperation: function(config, req, res, context) {
    var self = this
    var obj = req.parameters.object
    var options = {}

    if (!_.isNil(obj[this.idParameterName])) {
      throw new this.service.errors.BadRequest(
        '"' + this.idParameterName +'" is not allowed on insert')
    }

    // generate ID if a generator exists
    if (this.idGenerator) {
      obj[self.idParameterName] = self.idGenerator.generateId(self, req)
    }

    options = _.assignIn(options, config.options, req.parameters)

    return options
  },

  /******************************************************************************
   * @method postInsertOperation
   * @description Update the HTTP response to reflect the result of the operation
   * @param {Object[]} result -- The inserted objects
   * @param {carbond.collections.Collection.InsertConfigClass} config -- The insert operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object[]|null} -- Returns the inserted objects if configured to do so and
   *                             {@code null} otherwise
   */
  postInsertOperation: function(result, config, req, res, context) {
    result = this._getResult(result)
    var self = this
    res.status(201)
    var headers = this._get201Headers(result, req)
    res.header('Location', headers.location)
    res.header(this.idHeaderName, headers[this.idHeaderName])
    // Must convert undefined to null for Service to know to commit
    // the response.
    return config.opConfig.returnsInsertedObjects ? result.val : null
  },

  /******************************************************************************
   * @method postInsertObjectOperation
   * @description Update the HTTP response to reflect the result of the operation
   * @param {Object} result -- The inserted object
   * @param {carbond.collections.Collection.InsertObjectConfigClass} config -- The insert object
   *                                                                           operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object|null} -- Returns the inserted object if configured to do so and
   *                           {@code null} otherwise
   */
  postInsertObjectOperation: function(result, config, req, res, context) {
    result = this._getResult(result)
    res.status(201)
    var headers = this._get201Headers(result, req)
    res.header('Location', headers.location)
    res.header(this.idHeaderName, headers[this.idHeaderName])
    return config.opConfig.returnsInsertedObject ? result.val : null
  },

  /*****************************************************************************
   * @typedef PreInsertResult
   * @type {Object}
   * @property {Object[]} [objects] -- The objects to insert
   * @property {Object} [options] -- The operation handler options
   */

  /******************************************************************************
   * @method preInsert
   * @description Update or transform any parameters to be passed to the operation handler
   * @param {Object[]} objects -- The objects to insert
   * @param {Object} options -- The operation handler options
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreInsertResult|undefined}
   */
  preInsert: function(objects, options, context) {
    return {
      objects: objects,
      options: options
    }
  },

  /*****************************************************************************
   * @typedef PreInsertObjectResult
   * @type {Object}
   * @property {Object} [object] -- The object to insert
   * @property {Object} [options] -- The operation handler options
   */

  /******************************************************************************
   * @method preInsertObject
   * @description Update or transform any parameters to be passed to the operation handler
   * @param {Object} object -- The object to insert
   * @param {Object} options -- The operation handler options
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreInsertObjectResult|undefined}
   */
  preInsertObject: function(object, options, context) {
    return {
      object: object,
      options: options
    }
  },

  /******************************************************************************
   * @method postInsert
   * @description Update or transform the operation result before passing it back up to
   *              the HTTP layer
   * @param {Object[]} result -- The inserted object(s)
   * @param {Object[]} objects -- The object(s) to insert
   * @param {Object} options -- The operation handler options
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object[]}
   */
  postInsert: function(result, objects, options, context) {
    return result
  },

  /******************************************************************************
   * @method postInsertObject
   * @description Update or transform the operation result before passing it back up to
   *              the HTTP layer
   * @param {Object} result -- The inserted object
   * @param {Object} object -- The object to insert
   * @param {Object} options -- The operation handler options
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object}
   */
  postInsertObject: function(result, object, options, context) {
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
        // need to call _makeResponses here to ensure config.responses is merged into the default
        // responses since config level `responses` definitions will not take `oneOf` into account
        var insertResponses = this._makeResponses(
          'insert', insertConfig.opConfig, insertConfig.defaultResponses, false)
        var insertObjectResponses = this._makeResponses(
          'insertObject', insertObjectConfig.opConfig, insertObjectConfig.defaultResponses, false)
        // merge schemas from insertObjectResponses into insertResponses and use as default responses
        var defaultResponses = _.forIn(insertResponses, (descriptor, statusCode) => {
          if (!_.isNil(insertObjectResponses[statusCode]) &&
              !_.isNil(insertObjectResponses[statusCode].schema)) {
            // XXX: this will lead to duplicate schemas in the "oneOf" block. should probably
            // clean this up
            descriptor.schema =
              _.isNil(descriptor.schema) ? insertObjectResponses[statusCode].schema :
                                           {
                                             oneOf: [
                                               descriptor.schema,
                                               insertObjectResponses[statusCode].schema
                                             ]
                                           }
          }
        })
        // add any responses specific to insertObjectResponses to the set of default
        // responses
        _.forIn(insertObjectResponses, (descriptor, statusCode) => {
          if (_.isNil(defaultResponses[statusCode])) {
            defaultResponses[statusCode] = descriptor
          }
        })
        // XXX: take union of headers definitions in insert/insertObjects responses
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
          defaultResponses: defaultResponses
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
      } else if (this.supportsInsert) {
        config = insertConfig
      } else if (this.supportsInsertObject) {
        config = insertObjectConfig
      }
      this._setAllowUnauthenticated(this, 'post', config.opConfig)
      this.post = o({
        _type: '../Operation',
        description: config.opConfig.description ||
                     'Insert object(s) into this Collection.',
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters,
        responses: this._makeResponses(
          ['insert', 'insertObject'], config.opConfig, config.defaultResponses, false),
        handle: function(req, res) {
          var object = undefined
          var objects = undefined
          var options = undefined
          var result = undefined
          var context = {}
          if (!_.isNil(req.parameters.objects) && _.isArray(req.parameters.objects)) {
            options = self.preInsertOperation(config.opConfig, req, res, context)
            objects = options.objects
            options = _.omit(options, 'objects')
            // XXX: we should be using Insert/InsertObject specific config here
            ;({objects, options} = _.assignIn(
              {objects, options}, self.preInsert(objects, options, context) || {}))
            result = self.insert(objects, options, context)
            return self.postInsertOperation(
              self.postInsert(result, objects, options, context),
              config, req, res, context)
          } else if (!_.isNil(req.parameters.object) && !_.isArray(req.parameters.object)) {
            options = self.preInsertObjectOperation(config.opConfig, req, res, context)
            object = options.object
            options = _.omit(options, 'object')
            // XXX: we should be using Insert/InsertObject specific config here
            ;({object, options} = _.assignIn(
              {object, options}, self.preInsertObject(object, options, context) || {}))
            result = self.insertObject(
              object, options, context)
            return self.postInsertObjectOperation(
              self.postInsertObject(result, object, options, context),
              config, req, res, context)
          } else {
            throw new Error('Unexpected request parameters/types in insert/insertObject')
          }
        }
      })
    }
  },

  /*****************************************************************************
   * @method configureFindOperation
   * @description Update the operation config using collection level config (e.g., {@link
   *              carbond.collections.Collection.schema}) and build operation responses. In general,
   *              this method should not need to be overridden or extended. Instead, customization
   *              should be driven by the operation config and the pre/post handler methods.
   * @returns {typedef:carbond.collections.Collection.ConfigureOperationResult}
   */
  configureFindOperation: function() {
    // Find the CollectionOperationConfig for this operation
    var config = this.getOperationConfig('find')

    // Create the default responses descriptor
    var defaultResponses = {
      '200': {
        statusCode: 200,
        description: 'Returns an array of objects. Each object has an ' +
                     this.idParameterName +
                     ' and possible additional properties.',
        schema: {
          type: 'array',
          items: _.cloneDeep(this.schema)
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
   * @description Build the options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.collections.FindConfig} config -- The find operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreOperationResult}
   */
  preFindOperation: function(config, req, res, context) {
    var options = {}
    var paramDiff = []

    if (config.supportsSkipAndLimit) {
      options.skip = _.get(req.parameters, 'skip', 0)
      options.limit = _.get(req.parameters, 'limit', config.pageSize)
      if (!_.isNil(config.maxPageSize)) {
        options.limit = _.min([options.limit, config.maxPageSize])
      }
      paramDiff = paramDiff.concat(['skip', 'limit'])
      // note, config.supportsSkipAndLimit will always be true if config.supportsPagination is true
      if (config.supportsPagination) {
        var page = _.get(req.parameters, 'page', 0)
        var pageSize = _.get(req.parameters, 'pageSize', config.pageSize)
        if (!_.isNil(config.maxPageSize)) {
          pageSize = _.min([pageSize, config.maxPageSize])
        }
        if (_.isNil(req.parameters.limit)) {
          options.limit = pageSize
        }
        options.skip += page * pageSize
        paramDiff = paramDiff.concat(['page', 'pageSize'])
      }
    }

    if (config.supportsIdQuery) {
      options[this.idParameterName] = _.get(req.parameters, this.idParameterName, [])
      if (!_.isArray(options[this.idParameterName])) {
        options[this.idParameterName] = [options[this.idParameterName]]
      }
      if (options[this.idParameterName].length === 0) {
        options[this.idParameterName] = undefined
      }
      paramDiff = paramDiff.concat([this.idParameterName])
    }

    options = _.assignIn(
      options,
      config.options,
      _.pick(
        req.parameters,
        _.difference(
          _.keys(req.parameters),
          paramDiff))
      )
    return options
  },

  /******************************************************************************
   * @method postFindOperation
   * @description Update the HTTP response to reflect the result of the operation
   * @param {Object[]} result -- The found objects
   * @param {carbond.collections.Collection.findConfig} config -- The find operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object[]} -- Returns the found objects
   */
  postFindOperation: function(result, config, req, res, context) {
    result = this._getResult(result)
    if (config.opConfig.supportsPagination) {
      var links = {}
      var limit = _.get(req.parameters, 'limit', config.opConfig.pageSize)
      if (!_.isNil(config.opConfig.maxPageSize)) {
        limit = _.min([limit, config.opConfig.maxPageSize])
      }
      if (req.parameters.page > 0) {
        links.prev = url.format({
          protocol: req.protocol,
          hostname: req.hostname,
          port: this.service.port,
          pathname: req.path,
          query: _.pickBy({
            page: _.get(req.parameters, 'page', -1) - 1,
            skip: _.get(req.parameters, 'skip', -1),
            limit: !_.isNil(req.parameters.limit) ? limit : -1,
          }, function(value, key) {
            return value >= 0
          })
        })
      }
      if (_.isArray(result.val) && result.val.length >= limit) {
        links.next = url.format({
          protocol: req.protocol,
          hostname: req.hostname,
          port: this.service.port,
          pathname: req.path,
          query: _.pickBy({
            page: _.get(req.parameters, 'page', 0) + 1,
            skip: _.get(req.parameters, 'skip', -1),
            limit: !_.isNil(req.parameters.limit) ? limit : -1,
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
   * @type {Object}
   * @property {Object} [options] -- The operation handler options
   */

  /******************************************************************************
   * @method preFind
   * @description Update or transform any parameters to be passed to the operation handler
   * @param {Object} options -- The operation handler options
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreFindResult|undefined}
   */
  preFind: function(options, context) {
    return {
      options: options
    }
  },

  /*****************************************************************************
   * @method postFind
   * @description Update or transform the operation result before passing it back up to
   *              the HTTP layer
   * @param {Object[]} result -- The found object(s)
   * @param {Object} options -- The operation handler options
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object[]}
   */
  postFind: function(result, options, context) {
    var _result = this._getResult(result)
    if (!_.isArray(_result.val)) {
      throw new Error('Unexpected value returned from find. Expected array ' +
                      'and got: ' + _result.val)
    }
    if (!_.isNil(options.limit) && _result.val.length > options.limit) {
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

      this._setAllowUnauthenticated(this, 'get', config.opConfig)
      this._setAllowUnauthenticated(this, 'head', config.opConfig)
      this.get = o({
        _type: '../Operation',
        description: config.opConfig.description || 'Find objects in this Collection.',
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters,
        responses: this._makeResponses(
          'find', config.opConfig, config.defaultResponses, true),
        handle: function(req, res) {
          var context = {}
          var options = self.preFindOperation(config.opConfig, req, res, context)
          ;({options} = _.assignIn({options: options}, self.preFind(options, context) || {}))
          var result = self.find(options, context)
          return self.postFindOperation(
            self.postFind(result, options, context), config, req, res, context)
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
   * @returns {typedef:carbond.collections.Collection.ConfigureOperationResult}
   */
  configureFindObjectOperation: function() {
    var config = this.getOperationConfig('findObject')

    var defaultResponses = {
      '200': {
        statusCode: 200,
        description: 'Returns the object resource found at this URL ' +
                     'specified by id.',
        schema: _.cloneDeep(this.schema),
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
   * @description Build the options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.collections.FindObjectConfig} config -- The find object operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreOperationResult}
   */
  preFindObjectOperation: function(config, req, res, context) {
    var options = {}
    options = _.assignIn(options, config.options, req.parameters)
    return options
  },

  /*****************************************************************************
   * @method postFindObjectOperation
   * @description Update the HTTP response to reflect the result of the operation
   * @param {Object|null} result -- The found object
   * @param {carbond.collections.Collection.findObjectConfig} config -- The find object operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object|null} -- Returns the found object
   */
  postFindObjectOperation: function(result, config, req, res, context) {
    result = this._getResult(result)
    if (_.isNil(result.val)) {
      res.status(404)
    }
    return result.val
  },

  /*****************************************************************************
   * @typedef PreFindObjectResult
   * @type {Object}
   * @property {string} [id] -- The object id
   * @property {Object} [options] -- The operation handler options
   */

  /******************************************************************************
   * @method preFindObject
   * @description Update or transform any parameters to be passed to the operation handler
   * @param {string} [id] -- The object id
   * @param {Object} options -- The operation handler options
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreFindObjectResult|undefined}
   */
  preFindObject: function(id, options, context) {
    return {
      id: id,
      options: options
    }
  },

  /*****************************************************************************
   * @method postFindObject
   * @description Update or transform the operation result before passing it back up to
   *              the HTTP layer
   * @param {Object|null} result -- The found object
   * @param {string} id -- The object id
   * @param {Object} options -- The operation handler options
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object|null}
   */
  postFindObject: function(result, id, options, context) {
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

      this._setAllowUnauthenticated(objectSubEndpoint, 'get', config.opConfig)
      this._setAllowUnauthenticated(objectSubEndpoint, 'head', config.opConfig)
      objectSubEndpoint.get = o({
        _type: '../Operation',
        description: config.opConfig.description ||
                     'Find an object in this Collection by ' + this.idParameterName,
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters || {},
        endpoint: objectSubEndpoint,
        responses: this._makeResponses(
          'findObject', config.opConfig, config.defaultResponses, true),
        handle: function(req, res) {
          var id = undefined
          var context = {}
          var options = self.preFindObjectOperation(config.opConfig, req, res, context)
          id = options[self.idPathParameterName]
          options = _.omit(options, self.idPathParameterName)
          ;({id, options} = _.assignIn(
            {id, options}, self.preFindObject(id, options, context) || {}))
          var result = self.findObject(id, options, context)
          return self.postFindObjectOperation(
            self.postFindObject(result, id, options, context), config, req, res, context)
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
   * @returns {typedef:carbond.collections.Collection.ConfigureOperationResult}
   */
  configureSaveOperation: function() {
    var config = this.getOperationConfig('save')

    // schema

    var saveSchema = this._validateSchemaHasId(
      config.schema ||
      config.parameters.objects.schema ||
      this.schema)

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

    config.parameters.objects.schema = _.cloneDeep(saveSchema)

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
          schema: _.cloneDeep(resultSchema)
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
      (saveSchema ? undefined : this.example)

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
   * @description Build the options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.collections.SaveConfig} config -- The save operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreOperationResult}
   */
  preSaveOperation: function(config, req, res, context) {
    var options = {}
    options = _.assignIn(options, config.options, req.parameters)
    return options
  },

  /*****************************************************************************
   * @method postSaveOperation
   * @description Update the HTTP response to reflect the result of the operation
   * @param {Object[]} result -- The saved objects
   * @param {carbond.collections.Collection.saveConfig} config -- The save operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object[]|null} -- Returns the saved objects if configured to do so and
   *                             {@code null} if not
   */
  postSaveOperation: function(result, config, req, res, context) {
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
   * @type {Object}
   * @property {Object[]} [objects] -- The objects to save
   * @property {Object} [options] -- The operation handler options
   */

  /******************************************************************************
   * @method preSave
   * @description Update or transform any parameters to be passed to the operation handler
   * @param {Object[]} [objects] -- The objects to save
   * @param {Object} options -- The operation handler options
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreSaveResult|undefined}
   */
  preSave: function(objects, options, context) {
    return {
      objects: objects,
      options: options
    }
  },

  /*****************************************************************************
   * @method postSave
   * @description Update or transform the operation result before passing it back up to
   *              the HTTP layer
   * @param {Object[]} result -- The saved objects
   * @param {Object[]} objects -- The objects to save
   * @param {Object} options -- The operation handler options
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object[]}
   */
  postSave: function(result, objects, options, context) {
    return result
  },

  /*****************************************************************************
   * _generateEndpointOperationForSave
   */
  _generateEndpointOperationForSave: function() {
    if (this.supportsSave) {
      var self = this
      var config = this.configureSaveOperation()

      this._setAllowUnauthenticated(this, 'put', config.opConfig)
      this.put = o({
        _type: '../Operation',
        description: config.opConfig.description ||
                     'Replace all objects in this Collection',
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters || {},
        responses: this._makeResponses(
          'save', config.opConfig, config.defaultResponses, config.opConfig.returnsSavedObjects),
        handle: function(req, res) {
          var objects = undefined
          var context = {}
          var options = self.preSaveOperation(config.opConfig, req, res, context)
          objects = options.objects
          options = _.omit(options, 'objects')
          ;({objects, options} = _.assignIn(
            {objects, options}, self.preSave(objects, options, context) || {}))
          var result = self.save(objects, options, context)
          return self.postSaveOperation(
            self.postSave(result, objects, options, context), config, req, res, context)
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
   * @returns {typedef:carbond.collections.Collection.ConfigureOperationResult}
   */
  configureSaveObjectOperation: function() {
    var config = this.getOperationConfig('saveObject')

    // schema

    var saveObjectSchema = config.schema ||
                           config.parameters.object.schema ||
                           this.schema

    config.parameters.object.schema = _.cloneDeep(saveObjectSchema)

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
                    _.cloneDeep(resultSchema) :
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
                  _.cloneDeep(resultSchema) :
                  {type: 'undefined'},
        headers: ['Location', this.idHeaderName]
      }
    }

    // example

    var example = config.example ||
      (saveObjectSchema ? undefined : this.example)

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
   * @description Build the options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.collections.SaveObjectConfig} config -- The save object operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreOperationResult}
   */
  preSaveObjectOperation: function(config, req, res, context) {
    var options = {}
    if (_.isObjectLike(req.parameters.object[this.idParameterName]) &&
          ejson.stringify(req.parameters[this.idPathParameterName]) !==
          ejson.stringify(req.parameters.object[this.idParameterName]) ||
        !_.isObjectLike(req.parameters.object[this.idParameterName]) &&
          req.parameters[this.idPathParameterName] !==
          req.parameters.object[this.idParameterName]) {
      throw new this.service.errors.BadRequest(
        'Path ' + this.idPathParameterName + ' does not match object.' + this.idParameterName + '.')
    }
    options = _.assignIn(
      options, _.omit(req.parameters, config.options, this.idPathParameterName))
    return options
  },

  /*****************************************************************************
   * @method postSaveObjectOperation
   * @description Update the HTTP response to reflect the result of the operation
   * @param {typedef:carbond.collections.Collection.SaveObjectResult} result -- The saved object and
   *                                                                    a flag to indicate if it
   *                                                                    was created rather than
   *                                                                    replaced
   * @param {carbond.collections.Collection.SaveObjectConfigClass} config -- The save object operation
   *                                                                         config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object[]|null} -- Returns the saved object if configured to do so and
   *                             {@code null} if not
   */
  postSaveObjectOperation: function(result, config, req, res, context) {
    result = this._getResult(result)
    if (_.isNil(result.val)) {
      res.status(404)
      return null
    }
    if (config.opConfig.supportsUpsert && result.created) {
      var headers = this._get201Headers(result, req)
      res.status(201)
      res.header('Location', headers.location)
      res.header(this.idHeaderName, headers[this.idHeaderName])
    } else if (config.opConfig.returnsSavedObject) {
      res.status(200)
    } else {
      res.status(204)
    }
    return config.opConfig.returnsSavedObject ? result.val : null
  },

  /*****************************************************************************
   * @typedef PreSaveObjectResult
   * @type {Object}
   * @property {Object} [object] -- The object to save
   * @property {Object} [options] -- The operation handler options
   */

  /******************************************************************************
   * @method preSaveObject
   * @description Update or transform any parameters to be passed to the operation handler
   * @param {Object} [object] -- The object to save
   * @param {Object} options -- The operation handler options
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreSaveObjectResult|undefined}
   */
  preSaveObject: function(object, options, context) {
    return {
      object: object,
      options: options
    }
  },

  /*****************************************************************************
   * @method postSaveObject
   * @description Update or transform the operation result before passing it back up to
   *              the HTTP layer
   * @param {typedef:carbond.collections.Collection.SaveObjectResult} result -- The {@code SaveObjectResult}
   * @param {Object} object -- The object to save
   * @param {Object} options -- The operation handler options
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.SaveObjectResult}
   */
  postSaveObject: function(result, object, options, context) {
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

      this._setAllowUnauthenticated(objectSubEndpoint, 'put', config.opConfig)
      objectSubEndpoint.put = o({
        _type: '../Operation',
        description: config.opConfig.description ||
                     'Save an object in this Collection by ' + this.idPathParameterName,
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters || {},
        responses: this._makeResponses(
          'saveObject', config.opConfig, config.defaultResponses, config.opConfig.returnsSavedObject),
        endpoint: objectSubEndpoint,
        handle: function(req, res) {
          var object = undefined
          var context = {}
          var options = self.preSaveObjectOperation(config.opConfig, req, res, context)
          object = options.object
          options = _.omit(options, 'object')
          ;({Object, options} = _.assignIn(
            {Object, options}, self.preSaveObject(object, options, context) || {}))
          var result = self.saveObject(object, options, context)
          return self.postSaveObjectOperation(
            self.postSaveObject(result, object, options, context), config, req, res, context)
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
   * @returns {typedef:carbond.collections.Collection.ConfigureOperationResult}
   */
  configureUpdateOperation: function() {
    var config = this.getOperationConfig('update')

    // schema
    var updateSchema = config.schema ||
                       config.parameters.update.schema ||
                       {type: 'object'}

    config.parameters.update.schema = _.cloneDeep(updateSchema)

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
        schema: _.cloneDeep(resultSchema)
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
                  _.cloneDeep(resultSchema),
        headers: ['Location', this.idHeaderName]
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
   * @description Build the options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.collections.UpdateConfig} config -- The update operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreOperationResult}
   */
  preUpdateOperation: function(config, req, res, context) {
    var options = {}
    options = _.assignIn(options, config.options, req.parameters)
    return options
  },

  /*****************************************************************************
   * @method postUpdateOperation
   * @description Update the HTTP response to reflect the result of the operation. It should be
   *              noted that the result can be either a number or an array of objects. If the
   *              underlying driver does not support returning the upserted object(s), then the
   *              result will always be a number and
   *              {@link carbond.collections.UpdateConfig.returnsUpsertedObjects} should be
   *              configured to reflect this.
   * @param {typedef:carbond.collections.Collection.UpdateResult} result -- The number of objects
   *                                                                updated/upserted or the upserted
   *                                                                object(s)
   * @param {carbond.collections.Collection.UpdateConfigClass} config -- The update operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object} -- Returns {@link {n: NUMBER_OF_OBJECTS_UPDATED_OR_UPSERTED}} or the upserted
   *                      object(s)
   */
  postUpdateOperation: function(result, config, req, res, context) {
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
        throw new Error('An array of objects with at least ' + this.idParameterName +
                        ' properties must be returned if "supportsUpsert" is true')
      }
      var headers = this._get201Headers(result, req)
      res.status(201)
      res.header('Location', headers.location)
      res.header(this.idHeaderName, headers[this.idHeaderName])
      return config.opConfig.returnsUpsertedObjects ? result.val : {n: result.val.length}
    }
    return {n: result.val}
  },

  /*****************************************************************************
   * @typedef PreUpdateResult
   * @type {Object}
   * @property {*} [update] -- The update spec
   * @property {Object} [options] -- The operation handler options
   */

  /******************************************************************************
   * @method preUpdate
   * @description Update or transform any parameters to be passed to the operation handler
   * @param {*} [update] -- The update spec
   * @param {Object} options -- The operation handler options
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreUpdateResult|undefined}
   */
  preUpdate: function(update, options, context) {
    return {
      update: update,
      options: options
    }
  },

  /*****************************************************************************
   * @method postUpdate
   * @description Update or transform the operation result before passing it back up to
   *              the HTTP layer
   * @param {typedef:carbond.collections.Collection.UpdateResult} result -- The {@code UpdateResult}
   * @param {*} update -- The update spec
   * @param {Object} options -- The operation handler options
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.UpdateResult}
   */
  postUpdate: function(result, update, options, context) {
    return result
  },

  /*****************************************************************************
   * _generateEndpointOperationForUpdate
   */
  _generateEndpointOperationForUpdate: function() {
    if (this.supportsUpdate) {
      var self = this
      var config = this.configureUpdateOperation()

      this._setAllowUnauthenticated(this, 'patch', config.opConfig)
      this.patch = o({
        _type: '../Operation',
        description: config.opConfig.description ||
                     'Update all objects in the collection',
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters || {},
        responses: self._makeResponses(
          'update', config.opConfig, config.defaultResponses, false),
        handle: function(req, res) {
          var update = undefined
          var context = {}
          var options = self.preUpdateOperation(config.opConfig, req, res, context)
          update = options.update
          options = _.omit(options, 'update')
          ;({update, options} = _.assignIn(
            {update, options}, self.preUpdate(update, options, context) || {}))
          var result = self.update(update, options, context)
          return self.postUpdateOperation(
            self.postUpdate(result, update, options, context),
            config, req, res, context)
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
   * @returns {typedef:carbond.collections.Collection.ConfigureOperationResult}
   */
  configureUpdateObjectOperation: function() {
    var config = this.getOperationConfig('updateObject')

    // schema

    var updateObjectSchema = config.schema ||
                             config.parameters.update.schema ||
                             {type: 'object'}

    config.parameters.update.schema = _.cloneDeep(updateObjectSchema)

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
        schema: _.cloneDeep(resultSchema)
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
                  _.cloneDeep(resultSchema),
        headers: ['Location', this.idHeaderName]
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
   * @description Build the options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.collections.UpdateObjectConfig} config -- The update object operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreOperationResult}
   */
  preUpdateObjectOperation: function(config, req, res, context) {
    var options = {}
    options = _.assignIn(options, config.options, req.parameters)
    return options
  },

  /*****************************************************************************
   * @method postUpdateObjectOperation
   * @description Update the HTTP response to reflect the result of the operation. It should be
   *              noted that the result can be either a number or an object. If the underlying
   *              driver does not support returning the upserted object, then the result will
   *              always be a number and
   *              {@link carbond.collections.UpdateObjectConfig.returnsUpsertedObject} should be
   *              configured to reflect this.
   * @param {typedef:carbond.collections.Collection.UpdateObjectResult} result -- The number of objects
   *                                                                      updated/upserted or the
   *                                                                      upserted object
   * @param {carbond.collections.Collection.UpdateObjectConfigClass} config -- The update object operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object} -- Returns {@link {n: NUMBER_OF_OBJECTS_UPDATED_OR_UPSERTED}} or the upserted
   *                      object
   */
  postUpdateObjectOperation: function(result, config, req, res, context) {
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
      if (!_.isObjectLike(result.val)) {
        throw new Error('An object with at least ' + this.idParameterName + ' property must be ' +
                        'returned if "supportsUpsert" is true')
      }
      var headers = this._get201Headers(result, req)
      res.status(201)
      res.header('Location', headers.location)
      res.header(this.idHeaderName, headers[this.idHeaderName])
      return config.opConfig.returnsUpsertedObject ? result.val : {n: 1}
    }

    if (_.isNil(result.val) || result.val === 0) {
      throw new this.service.errors.NotFound(path.basename(req.path))
    }

    return {n: 1}
  },

  /*****************************************************************************
   * @typedef PreUpdateObjectResult
   * @type {Object}
   * @property {string} [id] -- The object id
   * @property {*} [update] -- The update spec
   * @property {Object} [options] -- The operation handler options
   */

  /******************************************************************************
   * @method preUpdateObject
   * @description Update or transform any parameters to be passed to the operation handler
   * @param {string} [id] -- The object id
   * @param {*} [update] -- The update spec
   * @param {Object} options -- The operation handler options
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreUpdateObjectResult|undefined}
   */
  preUpdateObject: function(id, update, options, context) {
    return {
      id: id,
      update: update,
      options: options
    }
  },

  /*****************************************************************************
   * @method postUpdateObject
   * @description Update or transform the operation result before passing it back up to
   *              the HTTP layer
   * @param {typedef:carbond.collections.Collection.UpdateResult} result -- The {@code UpdateResult}
   * @param {string} update -- The update spec
   * @param {*} update -- The update spec
   * @param {Object} options -- The operation handler options
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.UpdateResult}
   */
  postUpdateObject: function(result, id, update, options, context) {
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

      this._setAllowUnauthenticated(objectSubEndpoint, 'patch', config.opConfig)
      objectSubEndpoint.patch = o({
        _type: '../Operation',
        description: config.opConfig.description ||
                     'Update an object in this Collection by ' + this.idPathParameterName,
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters || {},
        responses: this._makeResponses(
          'updateObject', config.opConfig, config.defaultResponses, false),
        endpoint: objectSubEndpoint,
        handle: function(req, res) {
          var id = undefined
          var update = undefined
          var context = {}
          var options = self.preUpdateObjectOperation(config.opConfig, req, res, context)
          id = options[self.idPathParameterName]
          update = options.update
          options = _.omit(options, 'update', self.idPathParameterName)
          ;({id, update, options} = _.assignIn(
            {id, update, options}, self.preUpdateObject(id, update, options, context) || {}))
          var result = self.updateObject(id, update, options, context)
          return self.postUpdateObjectOperation(
            self.postUpdateObject(result, id, update, options, context),
            config, req, res, context)
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
   * @returns {typedef:carbond.collections.Collection.ConfigureOperationResult}
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
        schema: _.cloneDeep(resultSchema)
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
   * @description Build the options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.collections.RemoveConfig} config -- The remove operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreOperationResult}
   */
  preRemoveOperation: function(config, req, res, context) {
    var options = {}
    options = _.assignIn(options, config.options, req.parameters)
    return options
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
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object} -- Returns {@link {n: NUMBER_OF_OBJECTS_REMOVED}} or the removed objects
   */
  postRemoveOperation: function(result, config, req, res, context) {
    result = this._getResult(result)
    if (!config.opConfig.returnsRemovedObjects) {
      if (!_.isInteger(result.val) || result.val < 0) {
        throw new Error('Remove returned ' + result.val.toString() + ' instead of an integer')
      }
      return {n: result.val}
    }
    if (!_.isArray(result.val)) {
      throw new Error('Remove returned ' + result.val.toString() + ' instead of an array')
    }
    return result.val
  },

  /*****************************************************************************
   * @typedef PreRemoveResult
   * @type {Object}
   * @property {Object} [options] -- The operation handler options
   */

  /******************************************************************************
   * @method preRemove
   * @description Update or transform any parameters to be passed to the operation handler
   * @param {Object} options -- The operation handler options
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreRemoveResult|undefined}
   */
  preRemove: function(options, context) {
    return {
      options: options
    }
  },

  /*****************************************************************************
   * @method postRemove
   * @description Update or transform the operation result before passing it back up to
   *              the HTTP layer
   * @param {number|array} result -- The number of objects (or the object(s) themselves) removed
   * @param {Object} options -- The operation handler options
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {number|array}
   */
  postRemove: function(result, options, context) {
    return result
  },

  /*****************************************************************************
   * _generateEndpointOperationForRemove
   */
  _generateEndpointOperationForRemove: function() {
    if (this.supportsRemove) {
      var self = this
      var config = this.configureRemoveOperation()

      this._setAllowUnauthenticated(this, 'delete', config.opConfig)
      this.delete = o({
        _type: '../Operation',
        description: config.opConfig.description ||
                     'Remove all objects in the collection',
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters || {},
        responses: self._makeResponses(
          'remove', config.opConfig, config.defaultResponses, false),
        handle: function(req, res) {
          var context = {}
          var options = self.preRemoveOperation(config.opConfig, req, res, context)
          options = _.assignIn(
            options, self.preRemove(options, context) || {})
          var result = self.remove(options, context)
          return self.postRemoveOperation(
            self.postRemove(result, options, context), config, req, res, context)
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
   * @returns {typedef:carbond.collections.Collection.ConfigureOperationResult}
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
        schema: _.cloneDeep(resultSchema)
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
   * @description Build the options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.collections.RemoveObjectConfig} config -- The remove object operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreOperationResult}
   */
  preRemoveObjectOperation: function(config, req, res, context) {
    var options = {}
    options = _.assignIn(options, config.options, req.parameters)
    return options
  },

  /*****************************************************************************
   * @method postRemoveObjectOperation
   * @description Update the HTTP response to reflect the result of the operation. It should be
   *              noted that the result can be either a number or an object. If the
   *              underlying driver does not support returning the removed object, then the
   *              result will always be a number and
   *              {@link carbond.collections.RemoveObjectConfig.returnsRemovedObject} should be
   *              configured to reflect this.
   * @param {number|Object} result -- The number of objects removed or the removed object
   * @param {carbond.collections.Collection.RemoveObjectConfigClass} config -- The remove object
   *                                                                           operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object} -- Returns {@link {n: NUMBER_OF_OBJECTS_REMOVED}} or the removed object
   */
  postRemoveObjectOperation: function(result, config, req, res, context) {
    result = this._getResult(result)
    if (result.val === 0 || _.isNil(result.val)) {
      throw new this.service.errors.NotFound(path.basename(req.path))
    }
    if (!config.opConfig.returnsRemovedObject) {
      if (!_.isInteger(result.val) || result.val < 0 || result.val > 1) {
        throw new Error('Remove object returned ' + result.val.toString() + ' instead of the integers 0 or 1')
      }
      return {n: result.val}
    }
    if (_.isArray(result.val) || !_.isObjectLike(result.val)) {
      throw new Error('Remove object returned ' + result.val.toString() + ' instead of an object')
    }
    return result.val
  },

  /*****************************************************************************
   * @typedef PreRemoveObjectResult
   * @type {Object}
   * @property {string} [id] -- The object id
   * @property {Object} [options] -- The operation handler options
   */

  /******************************************************************************
   * @method preRemoveObject
   * @description Update or transform any parameters to be passed to the operation handler
   * @param {string} [id] -- The object id
   * @param {Object} options -- The operation handler options
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreRemoveObjectResult|undefined}
   */
  preRemoveObject: function(id, options, context) {
    return {
      id: id,
      options: options
    }
  },

  /*****************************************************************************
   * @method postRemoveObject
   * @description Update or transform the operation result before passing it back up to
   *              the HTTP layer
   * @param {number|Object} result -- The number of objects (or the object itself) removed
   * @param {Object} options -- The operation handler options
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {number|array}
   */
  postRemoveObject: function(result, id, options, context) {
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

      this._setAllowUnauthenticated(objectSubEndpoint, 'delete', config.opConfig)
      objectSubEndpoint.delete = o({
        _type: '../Operation',
        description: config.opConfig.description ||
                     'Remove an object in this Collection by ' + this.idPathParameterName,
        noDocument: config.opConfig.noDocument || false,
        parameters: config.opConfig.parameters || {},
        responses: this._makeResponses(
          'removeObject', config.opConfig, config.defaultResponses, false),
        endpoint: objectSubEndpoint,
        handle: function(req, res) {
          var id = undefined
          var context = {}
          var options = self.preRemoveObjectOperation(config.opConfig, req, res, context)
          id = options[self.idPathParameterName]
          options = _.omit(options, self.idPathParameterName)
          ;({id, options} = _.assignIn(
            {id, options}, self.preRemoveObject(id, options, context) || {}))
          var result = self.removeObject(id, options, context)
          return self.postRemoveObjectOperation(
            self.postRemoveObject(result, id, options, context), config, req, res, context)
        }
      })
    }
  },

  /******************************************************************************
   * _setAllowUnauthenticated
   */
  _setAllowUnauthenticated: function(endpoint, method, config) {
    if (!config.allowUnauthenticated) {
      return
    }
    if (_.isNil(endpoint.allowUnauthenticated)) {
      endpoint.allowUnauthenticated = []
    }
    endpoint.allowUnauthenticated.push(method)
  },

  /*****************************************************************************
   * _getResult
   */
  _getResult: function(result) {
    if (!(result instanceof CollectionOperationResult)) {
      if (_.isObjectLike(result) && 'val' in result &&
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
      [this.idHeaderName]: undefined
    }
    var _path = req.path
    if (!_.isNil(req.parameters[this.idPathParameterName]) &&
        req.parameters[this.idPathParameterName].toString() === path.basename(_path)) {
      _path = path.dirname(_path)
    }
    if (_.isArray(result.val)) {
      headers.location = url.format({
        pathname: _.trimEnd(_path, '/'),
        query: {
          [this.idParameterName]: _.map(result.val, function(obj) {
            return obj[self.idParameterName].toString()
          })
        }
      })
      headers[this.idHeaderName] = ejson.stringify(
        _.map(result.val, function(obj) {
          return obj[self.idParameterName]
        })
      )
    } else {
      headers.location =
        path.normalize(
          path.join(_.trimEnd(_path, '/'), result.val[this.idParameterName].toString()))
      headers[this.idHeaderName] = ejson.stringify(result.val[this.idParameterName])
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
      if (path !== ':' + self.idPathParameterName) {
        self._getObjectSubEndpoint().endpoints[path] = childEndpoint
        delete self.endpoints[path]
      }
    })
  },

  /*****************************************************************************
   * _getObjectSubEndpoint
   */
  _getObjectSubEndpoint: function() {
    var subEndpointPath = ':' + this.idPathParameterName
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
    if (schema && schema.properties && schema.properties[this.idParameterName]) {
      idSchema = schema.properties[this.idParameterName]
    }

    // parameters
    var parameters = {}
    var idParameterName = this.idPathParameterName[0] === ':' ?
        this.idPathParameterName.substring(1) :
        this.idPathParameterName

    parameters[idParameterName] = {
      description: 'Object ' + this.idParameterName,
      location: 'path',
      schema: idSchema,
      required: true,
      // XXX: dead code?
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
    var responses = defaultResponses || {}

    op = !_.isArray(op) ? [op] : op

    // Consider NotFound
    if ((_.intersection([
      'headObject',
      'findObject',
      'saveObject',
      'updateObject',
      'removeObject'
    ], op)).length > 0) {
      if ((op.indexOf('saveObject') === -1 || !config.supportsUpsert) &&
          (op.indexOf('updateObject') === -1 || !config.supportsUpsert)) {
        responses['404'] = {
          statusCode: 404,
          description: 'Collection resource cannot be found by the supplied ' +
                       self.idPathParameterName + '.',
          schema: _.cloneDeep(self.defaultErrorSchema)
        }
      }
    }

    // Consider BadRequest
    if (!('400' in responses)) {
      responses['400'] = {
        statusCode: 400,
        description: 'Request is malformed (i.e. invalid parameters).',
        schema: _.cloneDeep(self.defaultErrorSchema)
      }
    }

    // Add Forbidden
    if (!('403' in responses)) {
      responses['403'] = {
        statusCode: 403,
        description: 'User is not authorized to run this operation.',
        schema: _.cloneDeep(self.defaultErrorSchema)
      }
    }

    // Add InternalServerError
    if (!('500' in responses)) {
      responses['500'] = {
        statusCode: 500,
        description: 'There was an unexpected internal error processing this request.',
        schema: _.cloneDeep(self.defaultErrorSchema)
      }
    }

    if ((_.intersection(['head', 'headObject'], op)).length > 0) {
      responses = _.map(responses, function(r) {
        r = _.clone(r)
        r.schema = {type: 'null'}
        return r
      })
    }

    if (_.isObjectLike(config) &&
        _.isObjectLike(config.responses) &&
        _.keys(config.responses).length > 0 &&
        _.every(config.reqponses, function(val, key) {
          return key.match(/\d{3}/)
        })) {
      // let atom take care of the merge
      // NOTE: this should happen before normalization so any transformations are valid
      //       against the original response objects
      if (_.keys(config.responses).length != 1 ||
          !_.includes(_.values(atom.OPERATORS), _.keys(config.responses)[0])) {
        // use atom to merge in configured responses
        responses = o(config.responses, responses)
      } else {
        // if the `config.responses` object contains atom operator(s), then craft arguments
        // to `o` to apply these operator(s)
        responses = o({responses: config.responses}, {responses: responses}).responses
      }
      // XXX: some type of validation should happen after this merge
    }

    _.forIn(responses, function(responseDescriptor, statusCode) {
      responses[statusCode] = self._normalizeResponseDescriptor(responseDescriptor)
      if (Number.parseInt(statusCode) < 400 && validateResponseSchemasHaveId) {
        self._validateSchemaHasId(responses[statusCode].schema)
      }
    })

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
