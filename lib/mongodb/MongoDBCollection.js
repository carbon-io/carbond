var oo = require('carbon-core').atom.oo(module);

/******************************************************************************
 * @class MongoDBCollection
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */
  _type: "../collections/Collection", 

  /**********************************************************************
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

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.db = undefined // The name of a db in this.endpoint.service.dbs XXX should be dbname?
    this.idPathParameter = "_id" // Same as Collection but we explicitly define it here)
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
          return this.service.dbs[this.db]
        } else {
          return this.service.db
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
      throw new this.service.errors.InternalServerError(e.message)
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
            "projection" : {
              description: "Projection spec (JSON)",
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
      var projection = reqCtx.req.parameters.projection
      if (reqCtx.req.parameters.sort) options.sort = reqCtx.req.parameters.sort
      if (reqCtx.req.parameters.skip) options.skip = reqCtx.req.parameters.skip
      if (reqCtx.req.parameters.limit) options.limit = reqCtx.req.parameters.limit
      
      return this._db.getCollection(this.collection).find(query, projection, options).toArray()
    } catch (e) {
      throw new this.service.errors.InternalServerError(e.message)
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
      throw new this.service.errors.InternalServerError(e.message)
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
      throw new this.service.errors.InternalServerError(e.message)
    }
  },

  /**********************************************************************
   * saveObject
   */        
  saveObject: function(obj, reqCtx) {
    try {
      var result = this._db.getCollection(this.collection).save(obj)
      if (result.result.upserted && result.result.upserted.length > 0) { // was an upsert
        reqCtx.res.status(201)
        obj._id = result.result.upserted[0]._id // Set new _id
        return obj
      } else {
        return null
      }
    } catch (e) {
      throw new this.service.errors.InternalServerError(e.message)
    }
  },

  /**********************************************************************
   * findObject
   */        
  findObject: function(id) {
    var result = undefined
    try {
      result = this._db.getCollection(this.collection).findOne({_id: id})
    } catch (e) {
      throw new this.service.errors.InternalServerError(e.message)
    }

    if (!result) {
      throw new this.service.errors.NotFound("_id: " + id)
    }
    
    return result
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
      var options = {}
      if (this.updateObjectConfig && this.updateObjectConfig.returnsOriginalObject) {
        return this._db.getCollection(this.collection).findAndModify({ _id: id }, undefined, update, { new: false }).value
      } else if (this.updateObjectConfig && this.updateObjectConfig.returnsUpdatedObject) {
        return this._db.getCollection(this.collection).findAndModify({ _id: id }, undefined, update, { new: true }).value
      } else {
        var result = this._db.getCollection(this.collection).update({ _id: id }, update)
        return result.result.nModified !== 0 // return boolean which will control 404
      } 
      
    } catch (e) {
      throw new this.service.errors.InternalServerError(e.message)
    }
  },

  /**********************************************************************
   * removeObject
   */        
  removeObject: function(id, reqCtx) {
    try {
      if (this.removeObjectConfig && this.removeObjectConfig.returnsRemovedObject) {
        return this._db.getCollection(this.collection).findOneAndDelete({ _id: id }).value
      } else {
        var result = this._db.getCollection(this.collection).remove({ _id: id })
        return result.result.n !== 0 // return boolean which will control 404
      }
    } catch (e) {
      throw new this.service.errors.InternalServerError(e.message)
    }
  }

})
