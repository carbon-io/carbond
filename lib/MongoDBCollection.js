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
    this.db = null // The name of a db in this.objectserver.dbs XXX should be dbname?
    this.collection = null
  },

  /**********************************************************************
   * _db // the actual db object
   */
  _db : { 
    "$property": { 
      get: function() {
        if (this.db) {
          return this.objectserver.dbs[this.db]
        } else {
          return this.objectserver.db
        }
      }
    }
  },

  /**********************************************************************
   * create
   */        
  create: function() {
    throw this.objectserver.errors.InternalServerError("Not implemented")
  },
    
  /**********************************************************************
   * insert
   */        
  insert: function(obj) {
    try {
      return this._db.getCollection(this.collection).insert(obj, {})
    } catch (e) {
      throw this.objectserver.errors.InternalServerError(e.message)
    }
  },

  /**********************************************************************
   * update
   */        
  update: function(query, obj, options) {
    try {
      return this._db.getCollection(this.collection).update(query, obj, options)
    } catch (e)  {
      throw this.objectserver.errors.InternalServerError(e.message)
    }
  },

  /**********************************************************************
   * save
   */        
  save: function(query, obj, options) {
    try {
      return this._db.getCollection(this.collection).save(query, obj, options)
    } catch (e)  {
      throw this.objectserver.errors.InternalServerError(e.message)
    }
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
  },

  /**********************************************************************
   * find
   */        
  find: function(query, options) { 
    try {
      options = options || {}
      options.limit = options.limit || this._defaultFindLimit // XXX should this default not be defined in in this class va Collection?
      return this._db.getCollection(this.collection).find(query, options).toArray()
    } catch (e) {
      throw this.objectserver.errors.InternalServerError(e.message)
    }
  },

  /**********************************************************************
   * getObject
   */        
  getObject: function(id) {
    try {
      return this._db.getCollection(this.collection).findOne({_id: id})
    } catch (e) {
      throw this.objectserver.errors.InternalServerError(e.message)
    }
  },
  
  /**********************************************************************
   * removeObject
   */        
  removeObject: function(id) {
    return this.remove({_id: id}) // XXX change this to return docs when upgrading to driver 2.0
  }
  
})
