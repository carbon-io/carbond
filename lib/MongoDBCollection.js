var o = require('maker').o(module);
var oo = require('maker').oo(module);
var _o = require('maker')._o(module);

/******************************************************************************
 * @class MongoDBCollection
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */
  _type: "./Collection", 

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.db = null // The name of a db in this.objectserver.dbs
    this.collection = null
  },

  /**********************************************************************
   * _db // the actual db object
   */
  _db : { 
    "$property": { 
      get: function() {
        return this.objectserver.dbs[this.db] || this.objectserver.db
      }
    }
  },

  /**********************************************************************
   * findById
   */        
  findById: function(id) {
    try {
      return this._db.getCollection(this.collection).findOne({_id: id})
    } catch (e) {
      throw this.objectserver.errors.InternalServerError(e.message)
    }
  },

  /**********************************************************************
   * find
   */        
  find: function(query, options) { 
    try {
      options = options || {}
      options.limit = options.limit || this._defaultLimit
      return this._db.getCollection(this.collection).find(query, options).toArray()
    } catch (e) {
      throw this.objectserver.errors.InternalServerError(e.message)
    }
  },
  
  /**********************************************************************
   * findOne
   */        
  findOne: function(query, options) {
    // XXX
    return { query: query }
  },
  
  /**********************************************************************
   * insert
   */        
  insert: function(obj, cb) {
    try {
      return this._db.getCollection(this.collection).insert(obj, {})
    } catch (e) {
      throw this.objectserver.errors.InternalServerError(e.message)
    }
  },

  /**********************************************************************
   * update
   */        
  update: function(query, obj, options, cb) {
    try {
      return this._db.getCollection(this.collection).update(query, obj, options)
    } catch (e)  {
      throw this.objectserver.errors.InternalServerError(e.message)
    }
  },

  /**********************************************************************
   * removeById
   */        
  removeById: function(id) {
    return this.remove({_id: id}) // XXX change this to return docs when upgrading to driver 2.0
  },

  /**********************************************************************
   * remove
   */        
  remove: function(query) {
    try {
      var result = this._db.getCollection(this.collection).remove(query)
      return { count: result } // XXX change this to return docs when upgrading to driver 2.0
    } catch (e) {
      throw this.objectserver.errors.InternalServerError(e.message)
    }
  }
  
})
