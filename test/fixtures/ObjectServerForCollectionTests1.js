var o = require('atom').o(module).main
var _o = require('bond')._o(module)
var __ = require('fiber').__
var assert = require('assert')
var BSON = require('leafnode').BSON
var carbond = require('../../')

/*******************************************************************************
 * ObjectServerForBasicCollectionTests
 * 
 * This is an ObjectServer for basic Collection testing.
 */
module.exports = o({
  _type: carbond.ObjectServer,
  
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
        reqCtx.res.end() // More convenient to just return null but want to test that this works too.
      },

      removeObject: function(id) {
        return null
      }

    })
  }
})
