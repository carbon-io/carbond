var _ = require('lodash')

var o = require('@carbon-io/carbon-core').atom.o(module).main

var carbond = require('../../')

/***************************************************************************************************
 * ServiceForBasicCollectionTests1
 *
 * This is an Service for basic Collection testing.
 */
module.exports = o({
  _type: carbond.Service,

  port: 8888,
  verbosity: 'warn',

  endpoints: {
    // Simple endpoint with Collection operations defined as functions
    basic: o({
      _type: carbond.collections.Collection,

      // insert: function(obj) {
      //   return { _id: "000" }
      // },

      find: function(context) {
        var self = this
        return _.map(_.range(context.limit), function(id) {
          return {
            [self.idParameter]: (context.skip + id).toString(),
            op: 'find',
            context: context
          }
        })
      },

      // update: function(query, update) {
      //   return {
      //     n: 1
      //   }
      // },

      // remove: function(query) {
      //   return {
      //     n: 1
      //   }
      // },

      // saveObject: function(obj, reqCtx) {
      //   reqCtx.res.status(201)
      //   return true
      // },

      findObject: function(id, context) {
        if (id === "doesnotexist") {
          return null
        }
        return {
          _id: id,
          op: "findObject",
          context: context
        }
      },

      // updateObject: function(id, update, reqCtx) {
      //   return true
      // },

      // removeObject: function(id) {
      //   return true
      // }

    })
  }
})
