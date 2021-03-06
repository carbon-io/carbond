// XXX: add idStringify and idParse methods

var _ = require('lodash')
var uuid = require('uuid/v1')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var ejson = require('@carbon-io/carbon-core').ejson
var leafnode = require('@carbon-io/carbon-core').leafnode
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var Collection = require('../collections/Collection')

/***************************************************************************************************
 * @class MongoDBCollection
 */
module.exports = oo({
  _type: Collection,
  _ctorName: 'MongoDBCollection',

  defaultQuerySchema: {
    type: 'object'
  },

  defaultUpdateSchema: {
    type: 'object',
    patternProperties: {
      '^\\$.+': {type: 'object'}
    },
    additionalProperties: false
  },

  defaultUpdateObjectSchema: {
    type: 'object'
  },

  /*****************************************************************************
   * @constructs MongoDBCollection
   * @description A concrete implementation of {@link carbond.collections.Collection}
   *              that supports MongoDB
   * @memberof carbond.mongodb
   * @extends carbond.collections.Collection
   */
  _C: function() {
    /***************************************************************************
     * @property {string} [idParameterName='_id'] -- The ID parameter name
     * @todo rename to "objectIdName" since this is not a "parameter" name?
     */
    this.idParameterName = '_id' // Same as Collection but we explicitly define it here)

    /***************************************************************************
     * @property {string} [dbName] -- The database name. Note, this is only needed if
     *                            the {@link carbond.Service} instance connects
     *                            to multiple databases
     */
    this.dbName = undefined // The name of a db in this.endpoint.service.dbs

    /***************************************************************************
     * @property {string} collectionName -- The database collection name
     */
    this.collectionName = undefined

    /***************************************************************************
     * @property {Object} [querySchema] -- The JSON schema used to validate the
     *                                     query spec for query enabled operations (e.g.,
     *                                     {@link carbond.mongodb.MongoDBCollection.find})
     */
    this.querySchema = undefined

    /***************************************************************************
     * @property {Object} [updateSchema] -- The JSON schema used to validate the
     *                                      update spec passed to {@link
     *                                      carbond.mongodb.MongoDBCollection.update}
     */
    this.updateSchema = undefined

    /***************************************************************************
     * @property {Object} [updateObjectSchema]
     * @description The JSON schema used to validate the update spec passed to
     *              {@link carbond.mongodb.MongoDBCollection.updateObject}
     */
    this.updateObjectSchema = undefined
  },

  /*****************************************************************************
   * _init
   */
  _init: function() {
    var self = this

    // initialize all operations
    Collection.prototype._init.call(this)

    // XXX: note, this is side effecting operation.parameters by assigning to the
    //      original config... this should probably be changed

    // set the query schema if defined
    if (!_.isNil(this.querySchema)) {
      this.COLLECTION_QUERY_OPERATIONS.forEach(function(op) {
        var config = self.getOperationConfig(op)
        if (config.supportsQuery) {
          _.set(config, 'parameters.query.schema', _.cloneDeep(self.querySchema))
        }
      })
    }
    // set the update schema if defined
    if (!_.isNil(this.updateSchema)) {
      var config = self[self.getOperationConfigFieldName('update')]
      _.set(config, 'parameters.update.schema', _.cloneDeep(self.updateSchema))
    }
    // set the updateObject schema if defined
    if (!_.isNil(this.updateObjectSchema)) {
      var config = self[self.getOperationConfigFieldName('updateObject')]
      _.set(config, 'parameters.update.schema', _.cloneDeep(self.updateObjectSchema))
    }
  },


  /*****************************************************************************
   * @property {Array} COLLECTION_QUERY_OPERATIONS -- The list of operations that support queries
   * @readonly
   */
  COLLECTION_QUERY_OPERATIONS: {
    $property: {
      enumerable: true,
      value: [
        'find',
        'remove',
        'update'
      ]
    }
  },

  /*****************************************************************************
   * @property {Object} defaultSchema
   * @description This is the default schema used to validate all objects in this collection.
   *              If a schema is not specified explicitly, this schema will be used.
   * @override
   * @readonly
   */
  defaultSchema: {
    $property: {
      enumerable: true,
      value: {
        type: 'object',
        properties: {
          _id: {type: 'ObjectId'}
        },
        required: ['_id'],
        additionalProperties: true
      }
    }
  },

  /*****************************************************************************
   * @property {carbond.mongodb.MongoDBInsertConfig} InsertConfigClass
   * @description The config class used to instantiate the
   *              {@link carbond.mongodb.MongoDBCollection.insert} operation config
   * @override
   * @readonly
   */
  InsertConfigClass: {
    $property: {
      enumerable: true,
      value: _o('./MongoDBInsertConfig')
    }
  },

  /*****************************************************************************
   * @property {carbond.mongodb.MongoDBInsertObjectConfig} InsertObjectConfigClass
   * @description The config class used to instantiate the
   *              {@link carbond.mongodb.MongoDBCollection.insertObject} operation config
   * @override
   * @readonly
   */
  InsertObjectConfigClass: {
    $property: {
      enumerable: true,
      value: _o('./MongoDBInsertObjectConfig')
    }
  },

  /*****************************************************************************
   * @property {carbond.mongodb.MongoDBFindConfig} FindConfigClass
   * @description The config class used to instantiate the
   *              {@link carbond.mongodb.MongoDBCollection.find} operation config
   * @override
   * @readonly
   */
  FindConfigClass: {
    $property: {
      enumerable: true,
      value: _o('./MongoDBFindConfig')
    }
  },

  /*****************************************************************************
   * @property {carbond.mongodb.MongoDBFindObjectConfig} FindObjectConfigClass
   * @description The config class used to instantiate the
   *              {@link carbond.mongodb.MongoDBCollection.findObject} operation
   *              config
   * @override
   * @readonly
   */
  FindObjectConfigClass: {
    $property: {
      enumerable: true,
      value: _o('./MongoDBFindObjectConfig')
    }
  },

  /*****************************************************************************
   * @property {carbond.mongodb.MongoDBSaveConfig} MongoDBSaveConfigClass
   * @description The config class used to instantiate the
   *              {@link carbond.mongodb.MongoDBCollection.save} operation config
   * @override
   * @readonly
   */
  SaveConfigClass: {
    $property: {
      enumerable: true,
      value: _o('./MongoDBSaveConfig')
    }
  },

  /*****************************************************************************
   * @property {carbond.mongodb.MongoDBSaveObjectConfig} SaveObjectConfigClass
   * @description The config class used to instantiate the
   *              {@link carbond.mongodb.MongoDBCollection.saveObject} operation
   *              config
   * @override
   * @readonly
   */
  SaveObjectConfigClass: {
    $property: {
      enumerable: true,
      value: _o('./MongoDBSaveObjectConfig')
    }
  },

  /*****************************************************************************
   * @property {carbond.mongodb.MongoDBUpdateConfig} UpdateConfigClass
   * @description The config class used to instantiate the
   *              {@link carbond.mongodb.MongoDBCollection.update} operation config
   * @override
   * @readonly
   */
  UpdateConfigClass: {
    $property: {
      enumerable: true,
      value: _o('./MongoDBUpdateConfig')
    }
  },

  /*****************************************************************************
   * @property {carbond.mongodb.MongoDBUpdateObjectConfig} UpdateObjectConfigClass
   * @description The config class used to instantiate the
   *              {@link carbond.mongodb.MongoDBCollection.updateObject} operation
   *              config
   * @override
   * @readonly
   */
  UpdateObjectConfigClass: {
    $property: {
      enumerable: true,
      value: _o('./MongoDBUpdateObjectConfig')
    }
  },

  /*****************************************************************************
   * @property {carbond.mongodb.MongoDBRemoveConfig} RemoveConfigClass
   * @description The config class used to instantiate the
   *              {@link carbond.mongodb.MongoDBCollection.remove} operation config
   * @override
   * @readonly
   */
  RemoveConfigClass: {
    $property: {
      enumerable: true,
      value: _o('./MongoDBRemoveConfig')
    }
  },

  /*****************************************************************************
   * @property {carbond.mongodb.RemoveObjectConfig} RemoveObjectConfigClass
   * @description The config class used to instantiate the
   *              {@link carbond.mongodb.MongoDBCollection.removeObject} operation
   *              config
   * @override
   * @readonly
   */
  RemoveObjectConfigClass: {
    $property: {
      enumerable: true,
      value: _o('./MongoDBRemoveObjectConfig')
    }
  },

  /*****************************************************************************
   * @property {leafnode.db.DB} db
   * @description The database object for the database that houses the collection
   *              this instance is accessing
   * @readonly
   */
  db: {
    $property: {
      get: function() {
        if (this.dbName) {
          return this.service.dbs[this.dbName]
        } else {
          return this.service.db
        }
      }
    }
  },

  /*****************************************************************************
   * @property {leafnode.db.Collection} collection
   * @description The collection object for the collection this instance is
   *              accessing
   * @readonly
   */
  collection: {
    $property: {
      get: function() {
        return this.db.getCollection(this.collectionName)
      }
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
    var options = Collection.prototype.preInsertOperation.apply(this, arguments)
    options.driverOptions = config.driverOptions
    return options
  },

  /*****************************************************************************
   * @method insert
   * @description Bulk insert objects into a collection
   * @param {Array} objects -- An array of objects to insert
   * @param {Object} options -- The operation parameters (see:
   *                            {@link carbond.mongodb.MongoDBCollection.InsertConfigClass})
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object[]} -- The list of inserted objects
   * @throws {carbond.collections.errors.CollectionError}
   */
  insert: function(objects, options, context) {
    return this.collection.insertObjects(objects)
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
    var options = Collection.prototype.preInsertObjectOperation.apply(this, arguments)
    options.driverOptions = config.driverOptions
    return options
  },

  /*****************************************************************************
   * @method insertObject
   * @description Insert a single object into a collection
   * @param {Object} object -- An object to insert
   * @param {Object} options -- The operation parameters (see:
   *                            {@link carbond.mongodb.MongoDBCollection.InsertObjectConfigClass})
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object} -- The inserted object
   * @throws {carbond.collections.errors.CollectionError}
   */
  insertObject: function(object, options, context) {
    return this.collection.insertObject(object, options.driverOptions)
  },

  // XXX: this should be removed once https://github.com/carbon-io/carbond/issues/235 is taken care of
  _parseIdQueryParameter: function(_id) {
    return _.isString(_id) ? new ejson.types.ObjectId(_id) : _id
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
    var options = Collection.prototype.preFindOperation.apply(this, arguments)
    options.driverOptions = config.driverOptions
    return options
  },

  /*****************************************************************************
   * @method find
   * @description Retrieve objects from a collection
   * @param {Object} options -- The operation parameters (see:
   *                            {@link carbond.mongodb.MongoDBCollection.FindConfigClass})
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object[]} -- A list of objects
   * @throws {carbond.collections.errors.CollectionError}
   */
  find: function(options, context) {
    var self = this
    var query = undefined
    if (!_.isNil(options.query)) {
      query = _.clone(options.query)
      // handle _id queries passed in "_id" query parameter
      if (!_.isNil(options[this.idParameterName])) {
        if (_.isArray(options[this.idParameterName])) {
          if (options[this.idParameterName].length > 0) {
            query[this.idParameterName] = {
              $in: _.map(options[this.idParameterName], this._parseIdQueryParameter)
            }
          }
        } else {
          query[this.idParameterName] = this._parseIdQueryParameter(options[this.idParameterName])
        }
      }
    }
    // query
    var curs = this.collection.find(query)
    // project
    if (!_.isNil(options.projection)) {
      curs = curs.project(options.projection)
    }
    // skip
    if (!_.isNil(options.skip)) {
      curs = curs.skip(options.skip)
    }
    // limit
    if (!_.isNil(options.limit)) {
      curs = curs.limit(options.limit)
    }
    // sort
    if (!_.isNil(options.sort)) {
      curs = curs.sort(options.sort)
    }
    return curs.toArray()
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
    var options = Collection.prototype.preFindObjectOperation.apply(this, arguments)
    options.driverOptions = config.driverOptions
    if (!_.isNil(options.projection)) {
      options.driverOptions.fields = options.projection
      delete options.projection
    }
    return options
  },

  /*****************************************************************************
   * @method findObject
   * @description Retrieve a single object from a collection
   * @param {string} id -- The object id
   * @param {Object} options -- The operation parameters (see:
   *                            {@link carbond.mongodb.MongoDBCollection.FindObjectConfigClass})
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object|null} -- The found object or null
   * @throws {carbond.collections.errors.CollectionError}
   */
  findObject: function(id, options, context) {
    return this.collection.findOne({_id: id}, options.driverOptions)
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
    var options = Collection.prototype.preSaveOperation.apply(this, arguments)
    options.driverOptions = config.driverOptions
    return options
  },

  /*****************************************************************************
   * @method save
   * @description Replace the collection with an array of objects
   * @param {Array} objects -- An array of objects (with IDs) to save
   * @param {Object} options -- The operation parameters (see:
   *                            {@link carbond.mongodb.MongoDBCollection.SaveConfigClass})
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {Object[]} -- The list of saved objects
   * @throws {carbond.collections.errors.CollectionError}
   */
  save: function(objects, options, context) {
    var result = undefined
    var renameResult = undefined
    var tmpCollectionName = uuid() + '-' + this.collection
    var tmpCollection = this.db.getCollection(tmpCollectionName)
    try {
      result = tmpCollection.insertMany(objects, options.driverOptions)
      renameResult = tmpCollection.rename(this.collectionName, {dropTarget: true})
    } finally {
      if (_.isNil(renameResult)) {
        tmpCollection.drop()
      }
    }
    return result.ops
  },

  /*****************************************************************************
   * @method preSaveObjectOperation
   * @override
   * @description Build the options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.mongodb.MongoDBCollection.saveObjectConfig} config -- The save object operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.PreOperationResult}
   */
  preSaveObjectOperation: function(config, req, res, context) {
    var options =
      Collection.prototype.preSaveObjectOperation.call(this, config, req, res)
    options.driverOptions = _.clone(config.driverOptions)
    options.driverOptions.returnOriginal = false
    if (config.supportsUpsert) {
      options.driverOptions.upsert = true
    }
    return options
  },

  /*****************************************************************************
   * @method saveObject
   * @override
   * @description Replace or insert an object with a known ID
   * @param {Object} object -- The object to save (with ID)
   * @param {Object} options -- The operation parameters (see:
   *                            {@link carbond.mongodb.Collection.SaveObjectConfigClass})
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.SaveObjectResult}
   * @throws {carbond.collections.errors.CollectionError}
   */
  saveObject: function(object, options, context) {
    var result = this.collection.findOneAndReplace(
      {_id: object._id}, object, options.driverOptions)
    return {
      val: result.value,
      created: options.driverOptions.upsert && !result.lastErrorObject.updatedExisting
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
    var options = Collection.prototype.preUpdateOperation.apply(this, arguments)
    options.driverOptions = config.driverOptions
    return options
  },

  /*****************************************************************************
   * @method update
   * @override
   * @description Update (or upsert) a number of objects in a collection
   * @param {Object} update -- The update to be applied to the collection
   * @param {Object} options -- The operation parameters (see:
   *                            {@link carbond.mongodb.MongoDBCollection.UpdateConfigClass})
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.UpdateResult}
   * @throws {carbond.collections.errors.CollectionError}
   */
  update: function(update, options, context) {
    var driverOptions = {}
    if (options.upsert) {
      driverOptions = _.assignIn(driverOptions, options.driverOptions, {upsert: true})
    }
    var result = undefined
    try {
      var result =
        this.collection.updateMany(options.query, update, driverOptions)
    } catch (e) {
      // XXX: revisit this when leafnode exposes mongo error codes
      // https://github.com/mongodb/mongo/blob/master/src/mongo/base/error_codes.err
      if (!_.isNil(e.code) && e.code === 9) { // FailedToParse
        throw new (this.getService().errors.BadRequest)(e.message)
      }
    }
    var _result = {
      // no matched count here
      val: result.modifiedCount + result.upsertedCount,
      created: result.upsertedCount > 0
    }
    if (_result.created) {
      _result.val = [result.upsertedId]
    }
    return _result
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
    var options = Collection.prototype.preUpdateObjectOperation.apply(this, arguments)
    options.driverOptions = config.driverOptions
    return options
  },

  /*****************************************************************************
   * @method updateObject
   * @description Update a specific object
   * @param {string} id -- The ID of the object to update
   * @param {Object} update -- The update to be applied to the collection
   * @param {Object} options -- The operation parameters (see:
   *                            {@link carbond.mongodb.MongoDBCollection.UpdateObjectConfigClass})
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {typedef:carbond.collections.Collection.UpdateObjectResult}
   * @throws {carbond.collections.errors.CollectionError}
   */
  updateObject: function(id, update, options, context) {
    var driverOptions = {}
    if (options.upsert) {
      driverOptions = _.assignIn(driverOptions, options.driverOptions, {upsert: true})
    }
    // use updateOne to expose upsertedCount
    var result = this.collection.updateOne({_id: id}, update, driverOptions)
    var _result = {
      // omit matchedCount here since we are counting updates
      val: result.modifiedCount + result.upsertedCount,
      created: result.upsertedCount > 0
    }
    if (_result.created) {
      _result.val = result.upsertedId
    }
    return _result
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
    var options = Collection.prototype.preRemoveOperation.apply(this, arguments)
    options.driverOptions = config.driverOptions
    return options
  },

  /*****************************************************************************
   * @method remove
   * @description Remove objects from a collection
   * @param {Object} options -- The operation parameters (see:
   *                            {@link carbond.mongodb.MongoDBCollection.RemoveConfigClass})
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {number|array} -- An integer representing the number of objects removed or an array of
   *                            the objects removed
   * @throws {carbond.collections.errors.CollectionError}
   */
  remove: function(options, context) {
    return this.collection.deleteMany(
      options.query, options.driverOptions).deletedCount
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
    var options = Collection.prototype.preRemoveObjectOperation.apply(this, arguments)
    options.driverOptions = config.driverOptions
    return options
  },

  /*****************************************************************************
   * @method removeObject
   * @description Remove a specific object from a collection
   * @param {String} id -- The ID of the object to remove
   * @param {Object} options -- The operation parameters (see:
   *                            {@link carbond.mongodb.MongoDBCollection.RemoveConfigClass})
   * @param {Object} context -- A free form object to pass data between hook and handler
   *                            methods
   * @returns {number|Object} -- An integer representing the number of objects removed (0 or 1) or the
   *                             the object removed
   * @throws {carbond.collections.errors.CollectionError}
   */
  removeObject: function(id, options, context) {
    try {
      this.collection.deleteObject(id, options.driverOptions)
      return 1
    } catch (e) {
      if (e instanceof leafnode.errors.LeafnodeObjectSetOperationError) {
        return e.deletedCount
      }
      throw e
    }
  }
})
