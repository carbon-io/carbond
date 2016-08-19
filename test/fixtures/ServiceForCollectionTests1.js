var o = require('atom').o(module).main
var _o = require('bond')._o(module)
var __ = require('@carbon-io/fibers').__(module)
var assert = require('assert')
var BSON = require('leafnode').BSON
var carbond = require('../../')

/*******************************************************************************
 * ServiceForBasicCollectionTests1
 * 
 * This is an Service for basic Collection testing.
 */
module.exports = o({
  _type: carbond.Service,
  
  port: 8888,
  verbosity: 'info',
  
  endpoints: {
    // Simple endpoint with Collection operations defined as functions
    basic: o({
      _type: carbond.collections.Collection,
      
      insert: function(obj) {
        return {
          _id: "000",
          op: "insert",
          obj: obj
        }
      },

      find: function(query, reqCtx) {
        return [{
          _id: "000",
          op: "find",
          query: query
        }]
      },

      update: function(query, update) {
        return {
          n: 1
        }
      },

      remove: function(query) {
        return {
          n: 1 
        }
      },

      saveObject: function(obj, reqCtx) {
        reqCtx.res.status(201)
        return obj
      },

      findObject: function(id) {
        if (id === "doesnotexist") {
          return null
        }
        return {
          _id: id,
          op: "findObject",
        }
      },
        
      updateObject: function(id, update, reqCtx) {
        return true
      },

      removeObject: function(id) {
        return true
      }

    })
  }
})
