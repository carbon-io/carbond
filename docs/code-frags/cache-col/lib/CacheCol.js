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
    dbUri: 'mongodb://127.0.0.1:27017/cache-col',
    endpoints: {
      memCacheAdvanced: o({
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
        insert: function(objects, context, options) {
          var self = this
          objects.forEach(function(object) {
            self.cache[object._id] = object
          })
          return objects
        },
        insertObject: function(object, context, options) {
          this.cache[object._id] = object
          return object
        },
        find: function(context, options) {
          var self = this
          var result = []
          if (context._id) {
            var id = Array.isArray(context._id) ? context._id : [context._id]
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
            if (context.skip || context.limit) {
              var skip = context.skip || 0
              var limit = context.limit || 0
              return result.slice(skip, skip + limit)
            }
          }
          return result
        },
        findObject: function(id, context, options) {
          return typeof this.cache[id] === 'undefined' ? null : this.cache[id]
        },
        save: function(objects, context, options) {
          var idSet = new Set(objects.map(function(object) {
            return object._id
          }))
          if (idSet.length < objects.length) {
            throw new this.getService().errors.BadRequest('Duplicate IDs')
          }
          this.cache = objects
          return objects
        },
        saveObject: function(object, context, options) {
          var created = typeof this.cache[object._id] === 'undefined'
          this.cache[object._id] = object
          return {
            created: created,
            val: object
          }
        },
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
        update: function(update, context, options) {
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
        updateObject: function(id, update, context, options) {
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
        remove: function(context, options) {
          var n = Object.keys(this.cache).length
          this.cache = {}
          return n
        },
        removeObject: function(id, context, options) {
          if (this.cache[id]) {
            delete this.cache[id]
            return 1
          }
          return 0
        }
      }),
      memCacheBasic: o({
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
        insert: function(objects, context, options) {
          var self = this
          objects.forEach(function(object) {
            self.cache[object._id] = object
          })
          return objects
        },
        insertObject: function(object, context, options) {
          this.cache[object._id] = object
          return object
        },
        find: function(context, options) {
          var objects = []
          for (var id in this.cache) {
            objects.push(this.cache[id])
          }
          return objects
        },
        findObject: function(id, context, options) {
          return this.cache[id] || null
        },
        save: function(objects, context, options) {
          this.cache = objects
          return objects
        },
        saveObject: function(object, context, options) {
          this.cache[object._id] = object
          return object
        },
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
        update: function(update, context, options) {
          var count = 0
          for (var id in this.cache) {
            this.cache[id].count += update.n
            count += 1
          }
          return count
        },
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
        updateObject: function(id, update, context, options) {
          this.cache[id] += update.n
          return 1
        },
        remove: function(context, options) {
          var n = Object.keys(this.cache).length
          this.cache = {}
          return n
        },
        removeObject: function(id, context, options) {
          delete this.cache[id]
          return 1
        }
      }),
      mongoCacheBasic: o({
        _type: carbon.carbond.collections.Collection,
        enabled: {'*': true},
        collection: {
          $property: {
            get: function() {
              return this.service.db.getCollection('mongo-cache')
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
        insert: function(objects, context, options) {
          return this.collection.insertObjects(objects)
        },
        insertObject: function(object, context, options) {
          return this.collection.insertObject(object)
        },
        find: function(context, options) {
          return this.collection.find().toArray()
        },
        findObject: function(id, context, options) {
          return this.collection.findOne({_id: id})
        },
        save: function(objects, context, options) {
          this.collection.deleteMany()
          return this.collection.insertMany(objects).ops
        },
        saveObject: function(object, context, options) {
          return this.collection.findOneAndReplace(
            {_id: object._id}, object, {returnOriginal: false}).value
        },
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
        update: function(update, context, options) {
          return this.collection.updateMany({}, {$inc: {count: update.n}}).modifiedCount
        },
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
        updateObject: function(id, update, context, options) {
          return this.collection.updateOne({_id: id}, {$inc: {count: update.n}}).modifiedCount
        },
        remove: function(context, options) {
          return this.collection.deleteMany({}).deletedCount
        },
        removeObject: function(id, context, options) {
          var _ejson = ejson
          return this.collection.deleteOne({_id: id}).deletedCount
        }
      }),
    }
  })
})
