// XXX: add idStringify and idParse methods

var _ = require('lodash')
var uuid = require('uuid/v1')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var leafnode = require('@carbon-io/carbon-core').leafnode
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var Collection = require('../collections/Collection')

/***************************************************************************************************
 * @class MongoDBCollection
 */
module.exports = oo({
  _type: Collection,

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
   * @description A concrete implementation of {@link carbond.collections.Collection} that supports
   *              MongoDB
   * @memberof carbond.mongodb
   * @extends carbond.collections.Collection
   */
  _C: function() {
    /***************************************************************************
     * @property {string} [idParameter] -- The ID parameter name (XXX: rename to "objectIdName"
     *                                     since this is not a "parameter" name?)
     * @default '_id'
     */
    this.idParameter = '_id' // Same as Collection but we explicitly define it here)

    /***************************************************************************
     * @property {string} [db] -- The database name. Note, this is only needed if the
     *                            {@link carbond.Service} instance connects to multiple databases
     */
    this.db = undefined // The name of a db in this.endpoint.service.dbs XXX should be dbname?

    /***************************************************************************
     * @property {string} collection -- The database collection name
     */
    this.collection = undefined

    /***************************************************************************
     * @property {object} [querySchema] -- The JSON schema used to validate the query spec for query
     *                                     enabled operations (e.g.,
     *                                     {@link carbond.mongodb.MongoDBCollection.find})
     */
    this.querySchema = undefined

    /***************************************************************************
     * @property {object} [updateSchema] -- The JSON schema used to validate the update spec passed
     *                                      to {@link carbond.mongodb.MongoDBCollection.update}
     */
    this.updateSchema = undefined

    /***************************************************************************
     * @property {object} [updateObjectSchema] -- The JSON schema used to validate the update spec passed
     *                                            to {@link carbond.mongodb.MongoDBCollection.updateObject}
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
          _.set(config, 'parameters.query.schema', self.querySchema)
        }
      })
    }
    // set the update schema if defined
    if (!_.isNil(this.updateSchema)) {
      var config = self[self.getOperationConfigFieldName('update')]
      _.set(config, 'parameters.update.schema', self.updateSchema)
    }
    // set the updateObject schema if defined
    if (!_.isNil(this.updateObjectSchema)) {
      var config = self[self.getOperationConfigFieldName('updateObject')]
      _.set(config, 'parameters.update.schema', self.updateObjectSchema)
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
   * @property {object} defaultSchema
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
   *              {@link carbond.mongodb.MongoDBCollection.findObject} operation config
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
   *              {@link carbond.mongodb.MongoDBCollection.saveObject} operation config
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
   *              {@link carbond.mongodb.MongoDBCollection.updateObject} operation config
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
   *              {@link carbond.mongodb.MongoDBCollection.removeObject} operation config
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
   * _db // the actual db object
   */
  _db : {
    '$property': {
      get: function() {
        if (this.db) {
          return this.service.dbs[this.db]
        } else {
          return this.service.db
        }
      }
    }
  },

  /*****************************************************************************
   * @method insert
   * @description Bulk insert objects into a collection
   * @param {Array} objects -- An array of objects to insert
   * @param {object} context -- The operation parameters (see:
   *                            {@link carbond.mongodb.MongoDBCollection.InsertConfigClass})
   * @param {object} options -- A map of backend driver specific options (see:
   *                            {@link carbond.mongodb.MongoDBCollection.InsertConfigClass.options})
   * @returns {object[]} -- The list of inserted objects
   * @throws {carbond.collections.errors.CollectionError}
   */
  insert: function(objects, context, options) {
    return this._db.getCollection(this.collection).insertObjects(objects, options)
  },

  /*****************************************************************************
   * @method insertObject
   * @description Insert a single object into a collection
   * @param {object} object -- An object to insert
   * @param {object} context -- The operation parameters (see:
   *                            {@link carbond.mongodb.MongoDBCollection.InsertObjectConfigClass})
   * @param {object} options -- A map of backend driver specific options (see:
   *                            {@link carbond.mongodb.MongoDBCollection.InsertObjectConfigClass.options})
   * @returns {object} -- The inserted object
   * @throws {carbond.collections.errors.CollectionError}
   */
  insertObject: function(object, context, options) {
    debugger
    return this._db.getCollection(this.collection).insertObject(object, options)
  },

  /*****************************************************************************
   * @method find
   * @description Retrieve objects from a collection
   * @param {object} context -- The operation parameters (see:
   *                            {@link carbond.mongodb.MongoDBCollection.FindConfigClass})
   * @param {object} options -- A map of backend driver specific options (see:
   *                            {@link carbond.mongodb.MongoDBCollection.FindConfigClass.options})
   * @returns {object[]} -- A list of objects
   * @throws {carbond.collections.errors.CollectionError}
   */
  find: function(context) {
    var self = this
    var query = undefined
    if (!_.isNil(context.query)) {
      query = _.clone(context.query)
      // handle _id queries passed in "_id" query parameter
      if (!_.isNil(context[this.idParameter])) {
        if (_.isArray(context[this.idParameter])) {
          if (context[this.idParameter].length > 0) {
            query[this.idParameter] = {
              $in: context[this.idParameter]
            }
          }
        } else {
          query[this.idParameter] = context[this.idParameter]
        }
      }
    }
    // query
    var curs = this._db.getCollection(this.collection).find(query)
    // project
    if (!_.isNil(context.projection)) {
      curs = curs.project(context.projection)
    }
    // skip
    if (!_.isNil(context.skip)) {
      curs = curs.skip(context.skip)
    }
    // limit
    if (!_.isNil(context.limit)) {
      curs = curs.limit(context.limit)
    }
    // sort
    if (!_.isNil(context.sort)) {
      curs = curs.sort(context.sort)
    }
    return curs.toArray()
  },

  /*****************************************************************************
   * @method findObject
   * @description Retrieve a single object from a collection
   * @param {string} id -- The object id
   * @param {object} context -- The operation parameters (see:
   *                            {@link carbond.mongodb.MongoDBCollection.FindObjectConfigClass})
   * @param {object} options -- A map of backend driver specific options (see:
   *                            {@link carbond.mongodb.MongoDBCollection.FindObjectConfigClass.options})
   * @returns {object|null} -- The found object or null
   * @throws {carbond.collections.errors.CollectionError}
   */
  findObject: function(id, context, options) {
    return this._db.getCollection(this.collection).findOne({_id: id}, options)
  },

  /*****************************************************************************
   * @method save
   * @description Replace the collection with an array of objects
   * @param {Array} objects -- An array of objects (with IDs) to save
   * @param {object} context -- The operation parameters (see:
   *                            {@link carbond.mongodb.MongoDBCollection.SaveConfigClass})
   * @param {object} options -- A map of backend driver specific options (see:
   *                            {@link carbond.mongodb.MongoDBCollection.SaveConfigClass.options})
   * @returns {object[]} -- The list of saved objects
   * @throws {carbond.collections.errors.CollectionError}
   */
  save: function(objects, context, options) {
    var result = undefined
    var renameResult = undefined
    var tmpCollectionName = uuid() + '-' + this.collection
    var tmpCollection = this._db.getCollection(tmpCollectionName)
    try {
      result = tmpCollection.insertMany(objects, options)
      renameResult = tmpCollection.rename(this.collection, {dropTarget: true})
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
   * @description Build the context and options to be passed to the operation handler from the
   *              request and operation config. Note, in general, this should not need to be
   *              overridden or extended.
   * @param {carbond.mongodb.MongoDBCollection.SaveObjectConfig} config -- The save object operation config
   * @param {carbond.Request} req -- The request object
   * @param {carbond.Response} res -- The response object
   * @returns {carbond.collections.Collection.PreOperationResult}
   */
  preSaveObjectOperation: function(config, req, res) {
    var params =
      Collection.prototype.preSaveObjectOperation.call(this, config, req, res)
    params.options.returnOriginal = false
    if (config.supportsUpsert) {
      params.options.upsert = true
    }
    return params
  },

  /*****************************************************************************
   * @method saveObject
   * @override
   * @description Replace or insert an object with a known ID
   * @param {object} object -- The object to save (with ID)
   * @param {object} context -- The operation parameters (see:
   *                            {@link carbond.mongodb.Collection.SaveObjectConfigClass})
   * @param {object} options -- A map of backend driver specific options (see:
   *                            {@link carbond.mongodb.Collection.SaveObjectConfigClass.options})
   * @returns {carbond.collections.Collection.SaveObjectResult}
   * @throws {carbond.collections.errors.CollectionError}
   */
  saveObject: function(object, context, options) {
    var result = this._db.getCollection(
      this.collection).findOneAndReplace({_id: object._id}, object, options)
    return {
      val: result.value,
      created: options.upsert && !result.lastErrorObject.updatedExisting
    }
  },

  /*****************************************************************************
   * @method update
   * @override
   * @description Update (or upsert) a number of objects in a collection
   * @param {object} update -- The update to be applied to the collection
   * @param {object} context -- The operation parameters (see:
   *                            {@link carbond.mongodb.MongoDBCollection.UpdateConfigClass})
   * @param {object} options -- A map of backend driver specific options (see:
   *                            {@link carbond.mongodb.MongoDBCollection.UpdateConfigClass.options})
   * @returns {carbond.collections.Collection.UpdateResult}
   * @throws {carbond.collections.errors.CollectionError}
   */
  update: function(update, context, options) {
    if (context.upsert) {
      options = _.assignIn(options, {upsert: true})
    }
    var result =
      this._db.getCollection(this.collection).updateMany(context.query, update, options)
    return {
      // no matched count here
      val: result.modifiedCount + result.upsertedCount,
      created: result.upsertedCount > 0
    }
  },

  /*****************************************************************************
   * @method updateObject
   * @description Update a specific object
   * @param {string} id -- The ID of the object to update
   * @param {object} update -- The update to be applied to the collection
   * @param {object} context -- The operation parameters (see:
   *                            {@link carbond.mongodb.MongoDBCollection.UpdateObjectConfigClass})
   * @param {object} options -- A map of backend driver specific options (see:
   *                            {@link carbond.mongodb.MongoDBCollection.UpdateObjectConfigClass.options})
   * @returns {carbond.collections.Collection.UpdateObjectResult}
   * @throws {carbond.collections.errors.CollectionError}
   */
  updateObject: function(id, update, context, options) {
    if (context.upsert) {
      options = _.assignIn(options, {upsert: true})
    }
    // use updateOne to expose upsertedCount
    var result =
      this._db.getCollection( this.collection).updateOne({_id: id}, update, options)
    return {
      // omit matchedCount here since we are counting updates
      val: result.modifiedCount + result.upsertedCount,
      created: result.upsertedCount > 0
    }
  },

  /*****************************************************************************
   * @method remove
   * @description Remove objects from a collection
   * @param {object} context -- The operation parameters (see:
   *                            {@link carbond.mongodb.MongoDBCollection.RemoveConfigClass})
   * @param {object} options -- A map of backend driver specific options (see:
   *                            {@link carbond.mongodb.MongoDBCollection.RemoveConfigClass.options})
   * @returns {number|array} -- An integer representing the number of objects removed or an array of
   *                            the objects removed
   * @throws {carbond.collections.errors.CollectionError}
   */
  remove: function(context, options) {
    return this._db.getCollection(
      this.collection).deleteMany(context.query, options).deletedCount
  },

  /*****************************************************************************
   * @method removeObject
   * @description Remove a specific object from a collection
   * @param {String} id -- The ID of the object to remove
   * @param {object} context -- The operation parameters (see:
   *                            {@link carbond.mongodb.MongoDBCollection.RemoveConfigClass})
   * @param {object} options -- A map of backend driver specific options (see:
   *                            {@link carbond.mongodb.MongoDBCollection.RemoveConfigClass.options})
   * @returns {number|object} -- An integer representing the number of objects removed (0 or 1) or the
   *                             the object removed
   * @throws {carbond.collections.errors.CollectionError}
   */
  removeObject: function(id, context, options) {
    try {
      this._db.getCollection(this.collection).deleteObject(id, options)
      return 1
    } catch (e) {
      if (e instanceof leafnode.errors.LeafnodeObjectSetOperationError) {
        return e.deletedCount
      }
      throw e
    }
  },
})

