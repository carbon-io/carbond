var o = require('atom').o(module);
var oo = require('atom').oo(module);
var _o = require('bond')._o(module);
var _ = require('lodash')

/******************************************************************************
 * @class MongoDBCollection
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */
  _type: "../collections/Collection", 

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.db = undefined // The name of a db in this.objectserver.dbs XXX should be dbname?
    this.idPathParameter = "id" // XXX make _id? (same as Collection but we explicitly define it here)
    this.collection = undefined
    this.querySchema = undefined // used for find, update, and remove
    this.updateSchema = undefined
  },

  /**********************************************************************
   * _db // the actual db object
   */
  _db : { 
    '$property': { 
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
   * insert
   */
  insert: function(obj) {
    try {
      var result = this._db.getCollection(this.collection).insertOne(obj, {})
      result = result.ops[0]
      return result
    } catch (e) {
      throw new this.objectserver.errors.InternalServerError(e.message)
    }
  },

  /**********************************************************************
   * findConfig
   */    
  findConfig: {
    $property: {
      get: function() {
        var self = this
        return {
          descripton: "Find",
          
          supportsQuery: true,
          
          // XXX we should allow this to be undefined? Or null?
          querySchema: self.querySchema,
          
          parameters: {
            "sort" : {
              description: "Sort spec (JSON)",
              location: "query", 
              schema: { type: "object"}, 
              required: false
            },
            "fields" : {
              description: "Fields spec (JSON)",
              location: "query", 
              schema: { type: "object" }, 
              required: false              
            },
            "skip" : {
              description: "Results to skip",
              location: "query", 
              schema: { type: "integer" },
              required: false
            },
            "limit" : {
              description: "Results to limit",
              location: "query", 
              schema: { type: "integer" },
              required: false
            },
          }
        }
      }
    }
  },
  
  /**********************************************************************
   * find
   */    
  find: function(query, reqCtx) {
    try {
      var options = {}
      if (reqCtx.req.sort) options.sort = reqCtx.req.sort
      if (reqCtx.req.fields) options.fields = reqCtx.req.fields
      if (reqCtx.req.skip) options.skip = reqCtx.req.skip
      if (reqCtx.req.limit) options.limit = reqCtx.req.limit
      
      return this._db.getCollection(this.collection).find(query, options).toArray()
    } catch (e) {
      throw new this.objectserver.errors.InternalServerError(e.message)
    }
  },

  /**********************************************************************
   * updateConfig
   */        
  updateConfig: {
    $property: {
      get: function() {
        return {
          descripton: "Update",
          // XXX we should allow this to be undefined? Or null?
          querySchema: this.querySchema,
          updateSchema: this.updateSchema,
          parameters: {} // XXX once we define options we will have something here
        }
      }
    }
  },

  /**********************************************************************
   * update
   */        
  update: function(query, update, reqCtx) {
    try { // XXX define and document options
      // XXX should convert non $set to $set ??? Maybe not
      var result = this._db.getCollection(this.collection).update(query, update, reqCtx.req.parameters.options)
      return { 
        n: result.result.nModified
      }
    } catch (e)  {
      throw new this.objectserver.errors.InternalServerError(e.message)
    }
  },

  /**********************************************************************
   * removeConfig
   */ 
  removeConfig: {
    $property: {
      get: function() {
        return {
          descripton: "Remove",
          // XXX we should allow this to be undefined? Or null?
          querySchema: this.querySchema,
        }
      }
    }
  },       
  
  /**********************************************************************
   * remove
   */ 
  remove: function(query) {
    try {
      var result = this._db.getCollection(this.collection).remove(query)
      return { 
        n: result.result.n
      }
    } catch (e) {
      throw new this.objectserver.errors.InternalServerError(e.message)
    }
  },

  /**********************************************************************
   * saveObject
   */        
  saveObject: function(obj) {
    try {
      var result = this._db.getCollection(this.collection).save(obj)
      return {
        nUpdated: result.result.nModified,
        nUpserted: result.result.upserted.length
      }
    } catch (e) {
      throw new this.objectserver.errors.InternalServerError(e.message)
    }
  },

  /**********************************************************************
   * findObject
   */        
  findObject: function(id) {
    try {
      var result = this._db.getCollection(this.collection).findOne({_id: id})
      if (!result) {
        throw new this.objectserver.errors.NotFoundError("_id: " + id)
      }
      return result
    } catch (e) {
      throw new this.objectserver.errors.InternalServerError(e.message)
    }
  },

  /**********************************************************************
   * updateObjectConfig
   */        
  updateObjectConfig: {
    $property: {
      get: function() {
        return {
          descripton: "Update object",
          // XXX we should allow this to be undefined? Or null?
          updateSchema: this.updateSchema
        }
      }
    }
  },

  /**********************************************************************
   * updateObject
   */        
  updateObject: function(id, update, reqCtx) {
    try {
      // XXX should convert non $set to $set ??? Maybe not
      var result = this._db.getCollection(this.collection).update({ _id: id }, update)
      if (result.result.nModified === 0) {
        throw new this.objectserver.errors.NotFoundError("_id: " + id)
      }
      return null // Cannot return undefined
    } catch (e) {
      throw new this.objectserver.errors.InternalServerError(e.message)
    }
  },

  /**********************************************************************
   * removeObject
   */        
  removeObject: function(id, reqCtx) {
    try {
      var result = this._db.getCollection(this.collection).remove({ _id: id })
      if (result.result.n === 0) {
        throw new this.objectserver.errors.NotFoundError("_id: " + id)
      }
      return null // Cannot return undefined
    } catch (e) {
      throw new this.objectserver.errors.InternalServerError(e.message)
    }
  }

})
