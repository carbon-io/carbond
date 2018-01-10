var _ = require('lodash')

var o = require('@carbon-io/carbon-core').atom.o(module)

var carbond = require('../../')

/***************************************************************************************************
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

      enabled: {
        saveObject: true,
        updateObject: true,
        removeObject: true
      },

      saveObjectConfig: {
        supportsUpsert: true
      },
      saveObject: function(object, context, options) {
        return {
          val: object,
          created: true
        }
      },

      // updateObject
      updateObjectConfig: {
        supportsUpsert: true
      },
      updateObject: function(id, update, context, options) {
        return {
          val: _.assign({_id: id}, update),
          created: context.upsert
        }
      },

      // removeObject
      removeObjectConfig: {
        returnsRemovedObject: true
      },
      removeObject: function(id) {
        return {_id: id}
      }
    }),

    // Endpoint to test config of saveObject, updateObject, and removeObject
    advanced2: o({
      _type: carbond.collections.Collection,

      enabled: {
        saveObject: true,
        updateObject: true,
        removeObject: true
      },

      // updateObject
      updateObjectConfig: {
        supportsUpsert: true,
        returnsUpsertedObject: true
      },
      updateObject: function(id, update, context, options) {
        return {
          val: _.assign({_id: id}, update),
          created: context.upsert
        }
      },

      // removeObject
      removeObjectConfig: {
        returnsRemovedObject: false
      },
      removeObject: function(id) {
        return 0
      }

    }),

    // Endpoint to test config of saveObject, updateObject, and removeObject
    advanced3: o({
      _type: carbond.collections.Collection,

      enabled: {
        saveObject: true,
        updateObject: true,
        removeObject: true
      },

      // updateObject
      updateObject: function(id, update, context, options) {
        return 0
      },

      // removeObject
      removeObjectConfig: {
        returnsRemovedObject: false
      },
      removeObject: function(id) {
        return 1
      }

    }),

    // Endpoint to test config of insert
    advanced4: o({
      _type: carbond.collections.Collection,

      enabled: {
        insert: true
      },

      idGenerator: o({
        id: 0,
        generateId: function() {
          return (this.id++).toString()
        }
      }),

      insertConfig: {
        responses: [
          {
            statusCode: 201,
            description: 'foo',
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: { type: 'string' }
                },
                required: ['_id'],
                additionalProperties: true
              }
            },
            headers: ['Location', this.idHeaderName]
          }
        ],
        returnsInsertedObjects: true
      },

      insert: function(objects) {
        return objects
      }
    })

  }
})
