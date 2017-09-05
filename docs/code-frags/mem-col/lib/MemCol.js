var path = require('path')

var carbon = require('carbon-io')

var __ = carbon.fibers.__(module)
var _o = carbon.bond._o(module)
var o = carbon.atom.o(module)

__(function() {
  module.exports = o.main({
    _type: carbon.carbond.Service,
    port: 8888,
    endpoints: {
      scoresAdvanced: o({
        _type: carbon.carbond.collections.Collection,
        scores: {},
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
            score: {
              type: 'number',
              minimum: 0,
              multipleOf: 1
            }
          },
          required: ['_id'],
          additionalProperties: false
        },
        enabled: {'*': true},
        idGenerator: o({
          _type: carbon.carbond.collections.IdGenerator,
          _id: 0,
          generateId: function(collection) {
            var maxId = Math.max.apply(undefined, Object.keys(collection.scores))
            if (maxId >= this._id) {
              this._id = maxId + 1
            }
            return this._id++
          }
        }),
        insert: function(objects, context, options) {
          var self = this
          objects.forEach(function(object) {
            self.scores[object._id] = object
          })
          return objects
        },
        insertObject: function(object, context, options) {
          this.scores[object._id] = object
          return object
        },
        find: function(context, options) {
          var self = this
          var result = []
          if (context._id) {
            var id = Array.isArray(context._id) ? context._id : [context._id]
            id.forEach(function(id) {
              if (self.scores[id]) {
                result.push(self.scores[id])
              }
            })
          } else {
            result = Object.keys(this.scores).map(function(k) {
              return self.scores[k]
            }).sort(function(score1, score2) {
              return score1._id - score2._id
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
          return typeof this.scores[id] === 'undefined' ? null : this.scores[id]
        },
        save: function(objects, context, options) {
          var idSet = new Set(objects.map(function(object) {
            return object._id
          }))
          if (idSet.length < objects.length) {
            throw new this.getService().errors.BadRequest('Duplicate IDs')
          }
          this.scores = objects
          return objects
        },
        saveObject: function(object, context, options) {
          var created = typeof this.scores[object._id] === 'undefined'
          this.scores[object._id] = object
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
          for (var id in this.scores) {
            count += 1
            if (update.$inc) {
              this.scores[id].score += update.$inc
            } else {
              this.scores[id].score -= update.$dec
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
          if (this.scores[id]) {
            if (update.$inc) {
              this.scores[id].score += update.$inc
            } else {
              this.scores[id].score -= update.$dec
            }
            return 1
          }
          return 0
        },
        remove: function(context, options) {
          var n = Object.keys(this.scores).length
          this.scores = {}
          return n
        },
        removeObject: function(id, context, options) {
          if (this.scores[id]) {
            delete this.scores[id]
            return 1
          }
          return 0
        }
      }),
      scoresBasic: o({
        _type: carbon.carbond.collections.Collection,
        scores: {},
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
            self.scores[object._id] = object
          })
          return objects
        },
        insertObject: function(object, context, options) {
          this.scores[object._id] = object
          return object
        },
        find: function(context, options) {
          var objects = []
          for (var id in this.scores) {
            objects.push(this.scores[id])
          }
          return objects
        },
        findObject: function(id, context, options) {
          return this.scores[id] || null
        },
        save: function(objects, context, options) {
          this.scores = objects
          return objects
        },
        saveObject: function(object, context, options) {
          this.scores[object._id] = object
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
          for (var id in this.scores) {
            this.scores[id].score += update.n
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
          this.scores[id] += update.n
          return 1
        },
        remove: function(context, options) {
          var n = Object.keys(this.scores).length
          this.scores = {}
          return n
        },
        removeObject: function(id, context, options) {
          delete this.scores[id]
          return 1
        }
      })
    }
  })
})
