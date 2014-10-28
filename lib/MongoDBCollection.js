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
   * mongodbURI
   */
  mongodbURI: null,

  /**********************************************************************
   * _db
   */
  _db : { 
    "$property" : { 
      get: function() {
        return this._getdb(this.mongodbURI) || this._objectserver._db
      }
    }
  },

  /**********************************************************************
   * collection
   */
  collection: null,

  /**********************************************************************
   * findById
   */        
  findById: function(id, cb) {
    cb(null, {_id: id})
  },

  /**********************************************************************
   * find
   */        
  find: function(query, options, cb) { // XXX should return a cursor? Probably not at this level of abs. Clients cant use cursors really. 
    //We might just have MDBColl limit results if limits not sent
    cb(null, [{_id: 0}, {_id: 1}])
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
    console.log("insert called:", obj)
    this._notImplemented(cb)
  },

  /**********************************************************************
   * update
   */        
  update: function(query, obj, options, cb) {
    this._notImplemented(cb)
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
  },

  /**********************************************************************
   * _getdb
   */        
  _getdb: function(uri) {
    return null // XXX
  }
  
})
