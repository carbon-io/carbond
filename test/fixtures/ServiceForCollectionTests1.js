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

      enabled: {
        insert: true,
        insertObject: true,
        find: true,
        findObject: true,
        save: true,
        saveObject: true,
        update: true,
        updateObject: true,
        remove: true,
        removeObject: true
      },

      insert: function(objects, context) {
        var count = 0
        return {
          val: _.map(objects, function(obj) {
            return _.assignIn(_.cloneDeep(obj), {_id: (count++).toString()})
          }),
          created: true
        }
      },

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

      save: function(objs, context) {
        return objs
      },

      update: function(update, context) {
        return {
          val: 1,
          created: context.upsert ? true : false
        }
      },

      remove: function(context) {
        return 1
      },

      insertObject: function(obj, context) {
        return {
          val: _.assignIn(_.cloneDeep(obj), {_id: "0"}),
          created: true
        }
      },

      findObject: function(id, context) {
        if (id < 0) {
          return null
        }
        return {
          _id: id,
          op: "findObject",
          context: context
        }
      },

      saveObject: function(obj, context) {
        return {
          val: obj,
          created: true
        }
      },

      updateObject: function(id, update, context) {
        return {
          val: 1,
          created: context.upsert ? true : false
        }
      },

      removeObject: function(id, context) {
        return 1
      }

    })
  }
})
