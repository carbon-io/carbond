var path = require('path')

var carbon = require('carbon-io')

var __ = carbon.fibers.__(module)
var _o = carbon.bond._o(module)
var ejson = carbon.ejson
var o = carbon.atom.o(module)

__(function() {
  module.exports = o.main({
    _type: carbon.carbond.Service,
    port: 8888,
    dbUri: 'mongodb://127.0.0.1:27017/counter-col',
    endpoints: {
      memCacheCounterAdvanced: o({
        _type: carbon.carbond.collections.Collection,
        cache: {},
        schema: {
          type: 'object',
          properties: {
            _id: {
              type: 'number',
              minimum: 0,
              multipleOf: 1
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 64
            },
            count: {
              type: 'number',
              minimum: 0,
              multipleOf: 1
            }
          },
          required: ['_id', 'name', 'count'],
          additionalProperties: false
        },
        enabled: {'*': true},
        idGenerator: o({
          _type: carbon.carbond.collections.IdGenerator,
          _id: 0,
          generateId: function(collection) {
            var maxId = Math.max.apply(undefined, Object.keys(collection.cache))
            if (maxId >= this._id) {
              this._id = maxId + 1
            }
            return this._id++
          }
        }),
        // pre-insert-memCacheCounterAdvanced
        insert: function(objects, options) {
          var self = this
          objects.forEach(function(object) {
            self.cache[object._id] = object
          })
          return objects
        },
        // post-insert-memCacheCounterAdvanced
        // pre-insertObject-memCacheCounterAdvanced
        insertObject: function(object, options) {
          this.cache[object._id] = object
          return object
        },
        // post-insertObject-memCacheCounterAdvanced
        findConfig: {
          supportsPagination: true
        },
        // pre-find-memCacheCounterAdvanced
        find: function(options) {
          var self = this
          var result = []
          if (options._id) {
            var id = Array.isArray(options._id) ? options._id : [options._id]
            id.forEach(function(id) {
              if (self.cache[id]) {
                result.push(self.cache[id])
              }
            })
          } else {
            result = Object.keys(this.cache).map(function(k) {
              return self.cache[k]
            }).sort(function(count1, count2) {
              return count1._id - count2._id
            })
            if (options.skip || options.limit) {
              var skip = options.skip || 0
              var limit = options.limit || 0
              return result.slice(skip, skip + limit)
            }
          }
          return result
        },
        // post-find-memCacheCounterAdvanced
        // pre-findObject-memCacheCounterAdvanced
        findObject: function(id, options) {
          return typeof this.cache[id] === 'undefined' ? null : this.cache[id]
        },
        // post-findObject-memCacheCounterAdvanced
        // pre-save-memCacheCounterAdvanced
        save: function(objects, options) {
          var idSet = new Set(objects.map(function(object) {
            return object._id
          }))
          if (idSet.length < objects.length) {
            throw new this.getService().errors.BadRequest('Duplicate IDs')
          }
          this.cache = objects
          return objects
        },
        // post-save-memCacheCounterAdvanced
        // pre-saveObject-memCacheCounterAdvanced
        saveObject: function(object, options) {
          var created = typeof this.cache[object._id] === 'undefined'
          this.cache[object._id] = object
          return {
            created: created,
            val: object
          }
        },
        // post-saveObject-memCacheCounterAdvanced
        // pre-updateConfig-memCacheCounterAdvanced
        updateConfig: {
          updateSchema: {
            oneOf: [{
              type: 'object',
              properties: {
                $inc: {
                  type: 'number',
                  mimimum: 0,
                  multipleOf: 1
                }
              },
              required: ['$inc'],
              additionalProperties: false
            }, {
              type: 'object',
              properties: {
                $dec: {
                  type: 'number',
                  mimimum: 0,
                  multipleOf: 1
                }
              },
              required: ['$dec'],
              additionalProperties: false
            }]
          }
        },
        // post-updateConfig-memCacheCounterAdvanced
        // pre-update-memCacheCounterAdvanced
        update: function(update, options) {
          var count = 0
          for (var id in this.cache) {
            count += 1
            if (update.$inc) {
              this.cache[id].count += update.$inc
            } else {
              this.cache[id].count -= update.$dec
            }
          }
          return count
        },
        // post-update-memCacheCounterAdvanced
        // pre-updateObjectConfig-memCacheCounterAdvanced
        updateObjectConfig: {
          updateObjectSchema: {
            oneOf: [{
              type: 'object',
              properties: {
                $inc: {
                  type: 'number',
                  mimimum: 0,
                  multipleOf: 1
                }
              },
              required: ['$inc'],
              additionalProperties: false
            }, {
              type: 'object',
              properties: {
                $dec: {
                  type: 'number',
                  mimimum: 0,
                  multipleOf: 1
                }
              },
              required: ['$dec'],
              additionalProperties: false
            }]
          }
        },
        // post-updateObjectConfig-memCacheCounterAdvanced
        // pre-updateObject-memCacheCounterAdvanced
        updateObject: function(id, update, options) {
          if (this.cache[id]) {
            if (update.$inc) {
              this.cache[id].count += update.$inc
            } else {
              this.cache[id].count -= update.$dec
            }
            return 1
          }
          return 0
        },
        // post-updateObject-memCacheCounterAdvanced
        // pre-removeConfig-memCacheCounterAdvanced
        removeConfig: {
          returnsRemovedObjects: true
        },
        // post-removeConfig-memCacheCounterAdvanced
        // pre-remove-memCacheCounterAdvanced
        remove: function(options) {
          var objects = []
          for (var id in this.cache) {
            objects.push(this.cache[id])
          }
          this.cache = {}
          return objects
        },
        // post-remove-memCacheCounterAdvanced
        // pre-removeObject-memCacheCounterAdvanced
        removeObject: function(id, options) {
          if (this.cache[id]) {
            delete this.cache[id]
            return 1
          }
          return 0
        }
        // post-removeObject-memCacheCounterAdvanced
      }),
      memCacheCounterBasic: o({
        _type: carbon.carbond.collections.Collection,
        cache: {},
        schema: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 64
            },
            count: {
              type: 'number',
              minimum: 0,
              multipleOf: 1
            }
          },
          required: ['_id', 'name', 'count'],
          additionalProperties: false
        },
        enabled: {'*': true},
        idGenerator: o({
          _type: carbon.carbond.collections.IdGenerator,
          _id: 0,
          generateId: function(collection) {
            return (this._id++).toString()
          }
        }),
        // pre-insert-memCacheCounterBasic
        insert: function(objects, options) {
          var self = this
          objects.forEach(function(object) {
            self.cache[object._id] = object
          })
          return objects
        },
        // post-insert-memCacheCounterBasic
        // pre-insertObject-memCacheCounterBasic
        insertObject: function(object, options) {
          this.cache[object._id] = object
          return object
        },
        // post-insertObject-memCacheCounterBasic
        // pre-find-memCacheCounterBasic
        find: function(options) {
          var objects = []
          for (var id in this.cache) {
            objects.push(this.cache[id])
          }
          return objects
        },
        // post-find-memCacheCounterBasic
        // pre-findObject-memCacheCounterBasic
        findObject: function(id, options) {
          return this.cache[id] || null
        },
        // post-findObject-memCacheCounterBasic
        // pre-save-memCacheCounterBasic
        save: function(objects, options) {
          this.cache = objects
          return objects
        },
        // post-save-memCacheCounterBasic
        // pre-saveObject-memCacheCounterBasic
        saveObject: function(object, options) {
          this.cache[object._id] = object
          return object
        },
        // post-saveObject-memCacheCounterBasic
        // pre-updateConfig-memCacheCounterBasic
        updateConfig: {
          updateSchema: {
            type: 'object',
            properties: {
              n: {
                type: 'number',
                mimimum: 0,
                multipleOf: 1
              }
            }
          },
          required: ['n'],
          additionalProperties: false
        },
        // post-updateConfig-memCacheCounterBasic
        // pre-update-memCacheCounterBasic
        update: function(update, options) {
          var count = 0
          for (var id in this.cache) {
            this.cache[id].count += update.n
            count += 1
          }
          // demonstrate full return type
          return {val: count, created: false}
        },
        // post-update-memCacheCounterBasic
        // pre-updateObjectConfig-memCacheCounterBasic
        updateObjectConfig: {
          updateObjectSchema: {
            type: 'object',
            properties: {
              n: {
                type: 'number',
                mimimum: 0,
                multipleOf: 1
              }
            }
          },
          required: ['n'],
          additionalProperties: false
        },
        // post-updateObjectConfig-memCacheCounterBasic
        // pre-updateObject-memCacheCounterBasic
        updateObject: function(id, update, options) {
          this.cache[id] += update.n
          return 1
        },
        // post-updateObject-memCacheCounterBasic
        // pre-remove-memCacheCounterBasic
        remove: function(options) {
          var n = Object.keys(this.cache).length
          this.cache = {}
          return n
        },
        // post-remove-memCacheCounterBasic
        // pre-removeObject-memCacheCounterBasic
        removeObject: function(id, options) {
          delete this.cache[id]
          return 1
        }
        // post-removeObject-memCacheCounterBasic
      }),
      mongoCounterBasic: o({
        _type: carbon.carbond.collections.Collection,
        enabled: {'*': true},
        collection: {
          $property: {
            get: function() {
              return this.service.db.getCollection('mongo-counter')
            }
          }
        },
        schema: {
          type: 'object',
          properties: {
            _id: {
              type: 'ObjectId',
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 64
            },
            count: {
              type: 'number',
              minimum: 0,
              multipleOf: 1
            }
          },
          required: ['_id', 'name', 'count'],
          additionalProperties: false
        },
        idGenerator: o({
          _type: carbon.carbond.collections.IdGenerator,
          _id: 0,
          generateId: function(collection) {
            var existingIds = collection.collection.find({}).toArray().map(function(obj) {
              return parseInt(obj._id.toString(), 16)
            })
            var maxId = Math.max.apply(undefined, existingIds)
            if (maxId >= this._id) {
              this._id = maxId + 1
            }
            var oid = this._id.toString(16)
            oid = '0'.repeat(24 - oid.length) + oid
            this._id++
            return ejson.types.ObjectId(oid)
          }
        }),
        // pre-insert-mongoCounterBasic
        insert: function(objects, options) {
          return this.collection.insertObjects(objects)
        },
        // post-insert-mongoCounterBasic
        // pre-insertObject-mongoCounterBasic
        insertObject: function(object, options) {
          return this.collection.insertObject(object)
        },
        // post-insertObject-mongoCounterBasic
        // pre-find-mongoCounterBasic
        find: function(options) {
          return this.collection.find().toArray()
        },
        // post-find-mongoCounterBasic
        // pre-findObject-mongoCounterBasic
        findObject: function(id, options) {
          return this.collection.findOne({_id: id})
        },
        // post-findObject-mongoCounterBasic
        // pre-save-mongoCounterBasic
        save: function(objects, options) {
          this.collection.deleteMany()
          return this.collection.insertMany(objects).ops
        },
        // post-save-mongoCounterBasic
        // pre-saveObject-mongoCounterBasic
        saveObject: function(object, options) {
          return this.collection.findOneAndReplace(
            {_id: object._id}, object, {returnOriginal: false}).value
        },
        // post-saveObject-mongoCounterBasic
        // pre-updateConfig-mongoCounterBasic
        updateConfig: {
          updateSchema: {
            type: 'object',
            properties: {
              n: {
                type: 'number',
                mimimum: 0,
                multipleOf: 1
              }
            }
          },
          required: ['n'],
          additionalProperties: false
        },
        // post-updateConfig-mongoCounterBasic
        // pre-update-mongoCounterBasic
        update: function(update, options) {
          // demonstrate abbreviated return type
          return this.collection.updateMany({}, {$inc: {count: update.n}}).modifiedCount
        },
        // post-update-mongoCounterBasic
        // pre-updateObjectConfig-mongoCounterBasic
        updateObjectConfig: {
          updateObjectSchema: {
            type: 'object',
            properties: {
              n: {
                type: 'number',
                mimimum: 0,
                multipleOf: 1
              }
            }
          },
          required: ['n'],
          additionalProperties: false
        },
        // post-updateObjectConfig-mongoCounterBasic
        // pre-updateObject-mongoCounterBasic
        updateObject: function(id, update, options) {
          this.collection.updateObject(id, {$inc: {count: update.n}})
          return 1
        },
        // post-updateObject-mongoCounterBasic
        // pre-remove-mongoCounterBasic
        remove: function(options) {
          return this.collection.deleteMany({}).deletedCount
        },
        // post-remove-mongoCounterBasic
        // pre-removeObject-mongoCounterBasic
        removeObject: function(id, options) {
          var _ejson = ejson
          this.collection.removeObject(id)
          return 1
        }
        // post-removeObject-mongoCounterBasic
      }),
    }
  })
})
