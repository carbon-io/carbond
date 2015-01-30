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
  findById: function(id, cb) {
    var result = this._db.getCollection(this.collection).findOne({_id: id})
    cb(null, result)
  },

  /**********************************************************************
   * find
   */        
  find: function(query, options, cb) { 
    try {
      if (!options.limit) {
        options.limit = this._defaultLimit
      }
      var result = this._db.getCollection(this.collection).find(query, options).toArray()
      cb(null, result)
    } catch (e) {
      cb(e, null)
    }
  },
  
  /**********************************************************************
   * findOne
   */        
  findOne: function(query, options, cb) {
    cb(null, { query: query })
  },
  
  /**********************************************************************
   * insert
   */        
  insert: function(obj, cb) {
    this._db.getCollection(this.collection).insert(obj, {}, function(err, result) {
      cb(err, result)
    })
  },

  /**********************************************************************
   * update
   */        
  update: function(query, obj, options, cb) {
    try {
      var result = this._db.getCollection(this.collection).update(query, obj, options)
      cb(null, result)
    } catch (e)  {
      cb(e, null)
    }
  },

  /**********************************************************************
   * removeById
   */        
  removeById: function(id, cb) {
    this._notImplemented(cb)
  },

  /**********************************************************************
   * remove
   */        
  remove: function(query, cb) {
    this._notImplemented(cb)
  }
  
})
