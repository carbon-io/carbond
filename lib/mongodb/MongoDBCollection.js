var _ = require('lodash')

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
    'find'
  ],

  /*****************************************************************************
   * @property COLLECTION_UPDATE_OPERATIONS
   */
  // COLLECTION_QUERY_OPERATIONS: [
  //   'update'
  // ],

  /*****************************************************************************
   * defaultSchema
   */
  defaultSchema: {
    type: 'object',
    properties: {
      _id: { type: 'ObjectId' }
    },
    required: ['_id'],
    additionalProperties: true
  },

  /*****************************************************************************
   * FindConfigClass
   */
  FindConfigClass: _o('./MongoDBFindConfig'),

  /*****************************************************************************
   * FindObjectConfigClass
   */
  FindObjectConfigClass: _o('./MongoDBFindObjectConfig'),

  /*****************************************************************************
   * _C
   */
  _C: function() {
    this.idParameter = '_id' // Same as Collection but we explicitly define it here)

    this.db = undefined // The name of a db in this.endpoint.service.dbs XXX should be dbname?
    this.collection = undefined
    this.querySchema = undefined
    // this.updateSchema = undefined
  },

  /*****************************************************************************
   * _init
   */
  _init: function() {
    Collection.prototype._init.call(this)
    var self = this
    // set the query schema if defined
    if (!_.isNil(this.querySchema)) {
      this.COLLECTION_QUERY_OPERATIONS.forEach(function(op) {
        var config = self.getOperationConfig(op)
        _.set(config, 'parameters.query.schema', self.querySchema)
      })
    }
    // set the update schema if defined
    // if (!_.isNil(this.updateSchema)) {
    //   this.COLLECTION_UPDATE_OPERATIONS.forEach(function(op) {
    //     var config = self[self.getOperationConfigFieldName(op)]
    //     _.set(config, 'parameters.update.schema', self.updateSchema)
    //   })
    // }
    // chain _init
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
   * find
   */
  find: function(context) {
    try {
      // query
      var curs = this._db.getCollection(this.collection).find(context.query)
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
    } catch (e) {
      // XXX: use collection errors
      throw new this.service.errors.InternalServerError(e.message)
    }
  },

  /*****************************************************************************
   * findObject
   */
  findObject: function(id, context) {
    var result = undefined
    try {
      result = this._db.getCollection(this.collection).findOne({_id: id})
    } catch (e) {
      // XXX: use collection errors
      throw new this.service.errors.InternalServerError(e.message)
    }

    if (!result) {
      // XXX: use collection errors
      throw new this.service.errors.NotFound("_id: " + id)
    }

    return result
  },
})
