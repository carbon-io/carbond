var leafnode = require('@carbon-io/carbon-core').leafnode
var oo = require('@carbon-io/carbon-core').atom.oo(module);

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
      var result = this._db.getCollection(this.collection).insertObject(obj)
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

      var cursor = this._db.getCollection(this.collection).find(query)

      if (projection) {
        cursor = cursor.project(projection)
      }

      if (sort) {
        cursor = cursor.sort(sort)
      }

      if (skip) {
        cursor = cursor.skip(skip)
      }

      if (limit) {
        cursor = cursor.limit(limit)
      }

      return cursor.toArray()

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
      var result = this._db.getCollection(this.collection).saveObject(obj)
      return result
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
        return this._db.getCollection(this.collection).findAndModify(
          { _id: id }, undefined, update, { new: false }).value
      } else if (this.updateObjectConfig && this.updateObjectConfig.returnsUpdatedObject) {
        return this._db.getCollection(this.collection).findAndModify(
          { _id: id }, undefined, update, { new: true }).value
      }
      this._db.getCollection(this.collection).updateObject(id, update)
      // return boolean which will control 404
      return true 
    } catch (e) {
      if (e instanceof leafnode.errors.LeafnodeObjectSetOperationError) {
        return false
      }
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
      }
      this._db.getCollection(this.collection).removeObject(id)
      // return boolean which will control 404
      return true
    } catch (e) {
      if (e instanceof leafnode.errors.LeafnodeObjectSetOperationError) {
        return false
      }
      throw new this.service.errors.InternalServerError(e.message)
    }
  }

})
