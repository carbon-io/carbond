var o = require('atom').o(module)
var _o = require('bond')._o(module)
var __ = require('fiber').__(module, true)
var assert = require('assert')
var BSON = require('leafnode').BSON
var carbond = require('../../')

/*******************************************************************************
 * ObjectServerForBasicCollectionTests
 * 
 * This is an ObjectServer for basic Collection testing.
 */
__(function() {
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
            op: "insert",
            obj: obj
          }
        },

        find: function(query, reqCtx) {
          return {
            op: "find",
            query: query,
          }
        },

        update: function(query, update) {
          return {
            op: "update",
            query: query,
            update: update
          }
        },

        remove: function(query) {
          return {
            op: "remove",
            query: query
          }
        },

        saveObject: function(obj) {
          return {
            op: "saveObject",
            obj: obj
          }
        },

        findObject: function(id) {
          return {
            op: "findObject",
            id: id
          }
        },
        
        updateObject: function(id, update) {
          return {
            op: "updateObject",
            id: id, 
            update: update
          }
        },

        removeObject: function(id) {
          return {
            op: "removeObject",
            id: id
          }
        }

      })
    }
  })

})
