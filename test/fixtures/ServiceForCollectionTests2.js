var o = require('@carbon-io/carbon-core').atom.o(module).main

var carbond = require('../../')

/*******************************************************************************
 * ServiceForBasicCollectionTests2
 * 
 * This is an Service for advanced Collection testing.
 */
module.exports = o({
  _type: carbond.Service,
  
  port: 8888,
  verbosity: 'warn',
  
  endpoints: {
    // Endpoint to test config of saveObject, updateObject, and removeObject
    advanced1: o({
      _type: carbond.collections.Collection,

      saveObject: function(obj, reqCtx) {
        return true
      },

      // updateObject
      updateObjectConfig: {
        returnsUpdatedObject: true
      },
      updateObject: function(id, update, reqCtx) {
        return { _id: "1111" }
      },
      
      // removeObject
      removeObjectConfig: {
        returnsRemovedObject: true
      },
      removeObject: function(id) {
        return { _id: "1234" }
      }
    }),

    // Endpoint to test config of saveObject, updateObject, and removeObject
    advanced2: o({
      _type: carbond.collections.Collection,

      // updateObject
      updateObjectConfig: {
        returnsOriginalObject: true
      },
      updateObject: function(id, update, reqCtx) {
        return { _id: "1111" }
      },

      // removeObject
      removeObjectConfig: {
        returnsRemovedObject: false
      },
      removeObject: function(id) {
        return null
      }

    }),
    
    // Endpoint to test config of saveObject, updateObject, and removeObject
    advanced3: o({
      _type: carbond.collections.Collection,

      // updateObject
      updateObject: function(id, update, reqCtx) {
        return null
      },

      // removeObject
      removeObjectConfig: {
        returnsRemovedObject: false
      },
      removeObject: function(id) {
        return false
      }

    }),

    // Endpoint to test config of insert
    advanced4: o({
      _type: carbond.collections.Collection,

      insertConfig: {
        returnsInsertedObject: true
      },

      insert: function(obj) {
        return obj
      }
    })

  }
})
