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

  /*****************************************************************************
   * _type
   */
  _type: Collection,

  /*****************************************************************************
   * @property COLLECTION_QUERY_OPERATIONS
   */
  COLLECTION_QUERY_OPERATIONS: [
    'find',
    'remove',
    'update'
  ],

  /*****************************************************************************
   * @property COLLECTION_UPDATE_OPERATIONS
   */
  COLLECTION_UPDATE_OPERATIONS: [
    'update'
  ],

  /*****************************************************************************
   * @property COLLECTION_UPDATE_OPERATIONS
   */
  COLLECTION_UPDATE_OPERATIONS: [
    'update'
  ],

  /*****************************************************************************
   * defaultSchema
   */
  defaultSchema: {
    type: 'object',
    properties: {
      _id: {type: 'ObjectId'}
    },
    required: ['_id'],
    additionalProperties: true
  },

  /*****************************************************************************
   * InsertConfigClass
   */
  InsertConfigClass: _o('./MongoDBInsertConfig'),

  /*****************************************************************************
   * InsertObjectConfigClass
   */
  InsertObjectConfigClass: _o('./MongoDBInsertObjectConfig'),

  /*****************************************************************************
   * FindConfigClass
   */
  FindConfigClass: _o('./MongoDBFindConfig'),

  /*****************************************************************************
   * FindObjectConfigClass
   */
  FindObjectConfigClass: _o('./MongoDBFindObjectConfig'),

  /*****************************************************************************
   * UpdateConfigClass
   */
  SaveConfigClass: _o('./MongoDBSaveConfig'),

  /*****************************************************************************
   * UpdateObjectConfigClass
   */
  SaveObjectConfigClass: _o('./MongoDBSaveObjectConfig'),

  /*****************************************************************************
   * UpdateConfigClass
   */
  UpdateConfigClass: _o('./MongoDBUpdateConfig'),

  /*****************************************************************************
   * UpdateObjectConfigClass
   */
  UpdateObjectConfigClass: _o('./MongoDBUpdateObjectConfig'),

  /*****************************************************************************
   * RemoveConfigClass
   */
  RemoveConfigClass: _o('./MongoDBRemoveConfig'),

  /*****************************************************************************
   * RemoveObjectConfigClass
   */
  RemoveObjectConfigClass: _o('./MongoDBRemoveObjectConfig'),

  /*****************************************************************************
   * _C
   */
  _C: function() {
    this.idParameter = '_id' // Same as Collection but we explicitly define it here)

    this.db = undefined // The name of a db in this.endpoint.service.dbs XXX should be dbname?
    this.collection = undefined
    this.querySchema = undefined
    this.updateSchema = undefined
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
        _.set(config, 'parameters.query.schema', self.querySchema)
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
   * insert
   */
  insert: function(objects, context, options) {
    return this._db.getCollection(this.collection).insertObjects(objects, options)
  },

  /*****************************************************************************
   * insertObject
   */
  insertObject: function(object, context, options) {
    return this._db.getCollection(this.collection).insertObject(object, options)
  },

  /*****************************************************************************
   * find
   */
  find: function(context) {
    var self = this
    var query = _.clone(context.query)
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
    // query
    var curs = this._db.getCollection(this.collection).find(query)
    // project
    if (!_.isNil(context.projection)) {
      curs = curs.project(context.projection)
    }
    // skip/limit
    curs = curs.skip(context.skip).limit(context.limit)
    // sort
    if (!_.isNil(context.sort)) {
      curs = curs.sort(context.sort)
    }
    return curs.toArray()
  },

  /*****************************************************************************
   * findObject
   */
  findObject: function(id, context, options) {
    // XXX: no findObject?
    return this._db.getCollection(this.collection).findOne({_id: id}, options)
  },

  /*****************************************************************************
   * save
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
   * preSaveObjectOperation
   */
  preSaveObjectOperation: function(config, req, res) {
    var params =
      Collection.prototype.preSaveObjectOperation.call(this, config, req, res)
    if (config.opConfig.supportsInsert) {
      params.options = _.assign(params.options, {upsert: true})
    }
    return params
  },

  /*****************************************************************************
   * saveObject
   */
  saveObject: function(object, context, options) {
    // use updateOne to expose upsertedCount
    // XXX: throw appropriate error to indicate NotFound if !supportsInsert
    var result = this._db.getCollection(
      this.collection).updateOne({_id: object._id}, object, options)
    return {
      val: object,
      created: result.upsertedCount > 0
    }
  },

  /*****************************************************************************
   * update
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
   * updateObject
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
   * remove
   */
  remove: function(context, options) {
    return this._db.getCollection(
      this.collection).deleteMany(context.query, options).deletedCount
  },

  /*****************************************************************************
   * removeObject
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

