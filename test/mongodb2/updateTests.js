var assert = require('assert')
var url = require('url')

var _ = require('lodash')
var sinon = require('sinon')

var __ = require('@carbon-io/carbon-core').fibers.__(module)
var ejson = require('@carbon-io/carbon-core').ejson
var o = require('@carbon-io/carbon-core').atom.o(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)
var testtube = require('@carbon-io/carbon-core').testtube

var carbond = require('../..')

var pong = require('../fixtures/pong')
var getObjectId = pong.util.getObjectId
var config = require('../Config')
var MongoDBCollectionHttpTest = require('./MongoDBCollectionHttpTest')

/**************************************************************************
 * update tests
 */
__(function() {
  module.exports = o.main({

    /**********************************************************************
     * _type
     */
    _type: testtube.Test,

    /**********************************************************************
     * name
     */
    name: 'UpdateTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'DefaultConfigUpdateTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/update',
          endpoints: {
            update: o({
              _type: pong.MongoDBCollection,
              enabled: {update: true},
              collectionName: 'update'
            })
          }
        }),
        tests: [
          {
            name: 'UpdateTest',
            description: 'Test PATCH',
            setup: function() {
              this.parent.populateDb({
                update: [{foo: 'baz'}]
              })
            },
            teardown: function() {
              try {
                assert.equal(this.parent.db.getCollection('update').findOne().foo, 'bar')
              } finally {
                this.parent.dropDb()
              }
            },
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              body: {
                $set: {foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 200,
              body: {n: 1}
            }
          },
          {
            name: 'UpdateNoBodyBadRequestTest',
            description: 'Test PATCH with no body results in bad request',
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              // NOTE: an undefined body gets converted to `{}` which complies with the default
              //       update schema
            },
            resSpec: {
              statusCode: 400
            }
          },
          {
            name: 'UpdateUpsertNotSupportedAndIgnoredTest',
            description: 'Test upsert throws when not supported',
            setup: function() {
              this.parent.dropDb()
            },
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              parameters: {
                upsert: true
              },
              body: {
                $set: {foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 200,
              body: {n: 0}
            }
          },
        ]
      }),
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'SupportsUpsertDoesNotReturnUpsertedObjectsConfigUpdateTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/update',
          endpoints: {
            update: o({
              _type: pong.MongoDBCollection,
              enabled: {update: true},
              collectionName: 'update',
              updateConfig: {
                supportsUpsert: true
              }
            })
          }
        }),
        setup: function(context) {
          MongoDBCollectionHttpTest.prototype.setup.apply(this, arguments)
          context.global.idHeaderName = this.service.endpoints.update.idHeaderName
        },
        teardown: function(context) {
          delete context.global.idHeaderName
          MongoDBCollectionHttpTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'UpdateWithUpsertTest',
            description: 'Test PATCH results in upsert when requested',
            setup: function() {
              this.parent.dropDb()
              pong.util.mongoDbCollectionIdGenerator.resetId()
            },
            teardown: function(context) {
              assert.deepEqual(
                this.parent.db.getCollection('update').findOne(),
                {_id: context.local._id, foo: 'bar'})
            },
            reqSpec: function(context) {
              return {
                url: '/update',
                method: 'PATCH',
                parameters: {
                  upsert: true
                },
                body: {
                  $set: {foo: 'bar'}
                }
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                var parsedLocation = url.parse(headers.location, true)
                assert(!_.isArray(parsedLocation.query._id))
                assert.doesNotThrow(function() {
                  context.local._id = new ejson.types.ObjectId(parsedLocation.query._id)
                })
                assert.deepEqual(
                  ejson.parse(headers[context.global.idHeaderName]),
                  [context.local._id])
              },
              body: {n: 1}
            }
          }
        ]
      }),
      o({
        _type: testtube.Test,
        name: 'ConfigureReturnsUpsertedObjectsThrowsTest',
        doTest: function() {
          assert.throws(function() {
            var service = o({
              _type: pong.Service,
              dbUri: config.MONGODB_URI + '/update',
              endpoints: {
                update: o({
                  _type: pong.MongoDBCollection,
                  enabled: {update: true},
                  collectionName: 'update',
                  updateConfig: {
                    supportsUpsert: true,
                    returnsUpsertedObjects: true
                  }
                })
              }
            })
          })
        }
      }),
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'UpdateQueryTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/update',
          endpoints: {
            update: o({
              _type: pong.MongoDBCollection,
              enabled: {update: true},
              collectionName: 'update',
              updateConfig: {
                supportsUpsert: true
              }
            })
          }
        }),
        fixture: {
          update: [
            {_id: getObjectId(0), foo: 'bar'},
            {_id: getObjectId(1), bar: 'baz'},
            {_id: getObjectId(2), baz: 'yaz'},
          ]
        },
        setup: function(context) {
          MongoDBCollectionHttpTest.prototype.setup.apply(this, arguments)
          context.global.idHeaderName = this.service.endpoints.update.idHeaderName
        },
        teardown: function(context) {
          delete context.global.idHeaderName
          MongoDBCollectionHttpTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'QueryUpdateTest',
            description: 'Test query parameter for update',
            setup: function() {
              this.parent.populateDb()
            },
            teardown: function() {
              assert.equal(
                this.parent.db.getCollection('update').find({updated: true}).count(), 2)
            },
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              parameters: {
                query: {
                  $or: [
                    {foo: 'bar'},
                    {bar: 'baz'}
                  ]
                }
              },
              body: {
                $set: {updated: true}
              }
            },
            resSpec: {
              statusCode: 200,
              body: {n: 2}
            }
          },
          {
            name: 'QueryUpdateWithUpsertTest',
            description: 'Test query parameter for update with upsert',
            setup: function() {
              this.parent.populateDb()
            },
            teardown: function(context) {
              assert.equal(
                assert.deepEqual(
                  this.parent.db.getCollection('update').findOne({_id: context.local._id}),
                  {_id: context.local._id, yaz: 'raz', upserted: true}))
            },
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              parameters: {
                query: {
                  yaz: 'raz',
                },
                upsert: true
              },
              body: {
                $set: {upserted: true}
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                context.local._id = ejson.parse(headers[context.global.idHeaderName])[0]
              },
              body: {n: 1}
            }
          }
        ]
      }),
      o({
        _type: testtube.util.SkipTest,
        name: 'QueryDisabledTests',
        description: 'Implement me'
      }),
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'QuerySchemaConfigUpdateTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/update',
          endpoints: {
            update: o({
              _type: pong.MongoDBCollection,
              enabled: {update: true},
              collectionName: 'update',
              querySchema: {
                type: 'object',
                properties: {
                  foo: {
                    type: 'string'
                  }
                },
                required: ['foo'],
                additionalProperties: false
              }
            }),
            update1: o({
              _type: pong.MongoDBCollection,
              enabled: {update: true},
              collectionName: 'update',
              updateConfig: {
                '$parameters.query.schema': {
                  type: 'object',
                  properties: {
                    foo: {
                      type: 'string'
                    }
                  },
                  required: ['foo'],
                  additionalProperties: false
                }
              }
            }),
            update2: o({
              _type: pong.MongoDBCollection,
              enabled: {update: true},
              collectionName: 'update',
              querySchema: {
                type: 'object',
                properties: {
                  foo: {
                    type: 'string'
                  }
                },
                required: ['foo'],
                additionalProperties: false
              },
              updateConfig: {
                '$parameters.query.schema': {
                  type: 'object',
                  properties: {
                    bar: {
                      type: 'string'
                    }
                  },
                  required: ['bar'],
                  additionalProperties: false
                }
              }
            })
          }
        }),
        fixture: {
          update: [
            {_id: getObjectId(0), foo: 'bar', val: 0},
            {_id: getObjectId(1), bar: 'baz', val: 0},
            {_id: getObjectId(2), baz: 'yaz', val: 0}
          ]
        },
        tests: [
          o({
            _type: testtube.Test,
            name: 'CollectionQuerySchemaOverrideTest',
            doTest: function() {
              assert.deepEqual(this.parent.service.endpoints.update2.patch.parameters.query.schema, {
                type: 'object',
                properties: {
                  foo: {
                    type: 'string'
                  }
                },
                required: ['foo'],
                additionalProperties: false
              })
            }
          }),
          {
            name: 'CollectionQuerySchemaFailTest',
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              parameters: {
                query: {bar: 'baz'},
              },
              body: {
                $inc: {val: 1}
              }
            },
            resSpec: {
              statusCode: 400
            }
          },
          {
            name: 'CollectionQuerySchemaSuccessTest',
            teardown: function() {
              let collection = this.parent.db.getCollection('update')
              assert.deepEqual(
                collection.findOne({_id: getObjectId(0)}),
                {_id: getObjectId(0), foo: 'bar', val: 1})
              assert.equal(collection.find({val: 0}).count(), 2)
            },
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              parameters: {
                query: {foo: 'bar'}
              },
              body: {
                $inc: {val: 1}
              }
            },
            resSpec: {
              statusCode: 200,
              body: {n: 1}
            }
          },
          {
            name: 'ConfigQuerySchemaFailTest',
            setup: function(context) {
              this.history = context.httpHistory
            },
            reqSpec: function() {
              return _.assign(this.history.getReqSpec('CollectionQuerySchemaFailTest'),
                              {url: '/update1'})
            },
            resSpec: {
              $property: {
                get: function() { return this.history.getResSpec('CollectionQuerySchemaFailTest') }
              }
            }
          },
          {
            name: 'ConfigQuerySchemaSuccessTest',
            setup: function(context) {
              this.history = context.httpHistory
            },
            teardown: function() {
              let collection = this.parent.db.getCollection('update')
              assert.deepEqual(
                collection.findOne({_id: getObjectId(0)}),
                {_id: getObjectId(0), foo: 'bar', val: 2})
              assert.equal(collection.find({val: 0}).count(), 2)
            },
            reqSpec: function() {
              return _.assign(this.history.getReqSpec('CollectionQuerySchemaSuccessTest'),
                              {url: '/update1'})
            },
            resSpec: {
              $property: {
                get: function() { return this.history.getResSpec('CollectionQuerySchemaSuccessTest') }
              }
            }
          },
          {
            name: 'CollectionQuerySchemaOverrideConfigQuerySchemaFailTest',
            setup: function(context) {
              this.history = context.httpHistory
            },
            reqSpec: function() {
              return _.assign(this.history.getReqSpec('CollectionQuerySchemaFailTest'),
                              {url: '/update2'})
            },
            resSpec: {
              $property: {
                get: function() { return this.history.getResSpec('CollectionQuerySchemaFailTest') }
              }
            }
          },
          {
            name: 'CollectionQuerySchemaOverrideConfigQuerySchemaSuccessTest',
            setup: function(context) {
              this.history = context.httpHistory
            },
            teardown: function() {
              let collection = this.parent.db.getCollection('update')
              assert.deepEqual(
                collection.findOne({_id: getObjectId(0)}),
                {_id: getObjectId(0), foo: 'bar', val: 3})
              assert.equal(collection.find({val: 0}).count(), 2)
            },
            reqSpec: function() {
              return _.assign(this.history.getReqSpec('CollectionQuerySchemaSuccessTest'),
                              {url: '/update2'})
            },
            resSpec: {
              $property: {
                get: function() { return this.history.getResSpec('CollectionQuerySchemaSuccessTest') }
              }
            }
          }
        ]
      }),
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'UpdateSchemaConfigUpdateTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/update',
          endpoints: {
            update: o({
              _type: pong.MongoDBCollection,
              enabled: {update: true},
              collectionName: 'update',
              updateSchema: {
                type: 'object',
                properties: {
                  $inc: {
                    type: 'object',
                    properties: {
                      val: {type: 'number', multipleOf: 2, minimum: 2}
                    },
                    required: ['val'],
                    additionalProperties: false
                  }
                },
                required: ['$inc'],
                additionalProperties: false
              }
            }),
            update1: o({
              _type: pong.MongoDBCollection,
              enabled: {update: true},
              collectionName: 'update',
              updateConfig: {
                '$parameters.update.schema': {
                  type: 'object',
                  properties: {
                    $inc: {
                      type: 'object',
                      properties: {
                        val: {type: 'number', multipleOf: 2, minimum: 2}
                      },
                      required: ['val'],
                      additionalProperties: false
                    }
                  },
                  required: ['$inc'],
                  additionalProperties: false
                }
              }
            }),
            update2: o({
              _type: pong.MongoDBCollection,
              enabled: {update: true},
              collectionName: 'update',
              updateSchema: {
                type: 'object',
                properties: {
                  $inc: {
                    type: 'object',
                    properties: {
                      val: {type: 'number', multipleOf: 2, minimum: 2}
                    },
                    required: ['val'],
                    additionalProperties: false
                  }
                },
                required: ['$inc'],
                additionalProperties: false
              },
              updateConfig: {
                '$parameters.update.schema': {
                  type: 'object',
                  properties: {
                    $inc: {
                      type: 'object',
                      properties: {
                        val: {type: 'number', multipleOf: 3, minimum: 3}
                      },
                      required: ['val'],
                      additionalProperties: false
                    }
                  },
                  required: ['$inc'],
                  additionalProperties: false
                }
              }
            })
          }
        }),
        fixture: {
          update: [
            {_id: getObjectId(0), foo: 'bar', val: 0},
            {_id: getObjectId(1), bar: 'baz', val: 0},
            {_id: getObjectId(2), baz: 'yaz', val: 0}
          ]
        },
        tests: [
          o({
            _type: testtube.Test,
            name: 'CollectionUpdateSchemaOverrideTest',
            doTest: function() {
              assert.deepEqual(this.parent.service.endpoints.update2.patch.parameters.update.schema, {
                type: 'object',
                properties: {
                  $inc: {
                    type: 'object',
                    properties: {
                      val: {type: 'number', multipleOf: 2, minimum: 2}
                    },
                    required: ['val'],
                    additionalProperties: false
                  }
                },
                required: ['$inc'],
                additionalProperties: false
              })
            }
          }),
          {
            name: 'CollectionUpdateSchemaFailTest',
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              parameters: {
                query: {foo: 'bar'},
              },
              body: {
                $inc: {value: 1}
              }
            },
            resSpec: {
              statusCode: 400
            }
          },
          {
            name: 'CollectionUpdateSchemaSuccessTest',
            teardown: function() {
              let collection = this.parent.db.getCollection('update')
              assert.deepEqual(
                collection.findOne({_id: getObjectId(0)}),
                {_id: getObjectId(0), foo: 'bar', val: 2})
              assert.equal(collection.find({val: 0}).count(), 2)
            },
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              parameters: {
                query: {foo: 'bar'}
              },
              body: {
                $inc: {val: 2}
              }
            },
            resSpec: {
              statusCode: 200,
              body: {n: 1}
            }
          },
          {
            name: 'ConfigUpdateSchemaFailTest',
            setup: function(context) {
              this.history = context.httpHistory
            },
            reqSpec: function() {
              return _.assign(this.history.getReqSpec('CollectionUpdateSchemaFailTest'),
                              {url: '/update1'})
            },
            resSpec: {
              $property: {
                get: function() { return this.history.getResSpec('CollectionUpdateSchemaFailTest') }
              }
            }
          },
          {
            name: 'ConfigUpdateSchemaSuccessTest',
            setup: function(context) {
              this.history = context.httpHistory
            },
            teardown: function() {
              let collection = this.parent.db.getCollection('update')
              assert.deepEqual(
                collection.findOne({_id: getObjectId(0)}),
                {_id: getObjectId(0), foo: 'bar', val: 4})
              assert.equal(collection.find({val: 0}).count(), 2)
            },
            reqSpec: function() {
              return _.assign(this.history.getReqSpec('CollectionUpdateSchemaSuccessTest'),
                              {url: '/update1'})
            },
            resSpec: {
              $property: {
                get: function() { return this.history.getResSpec('CollectionUpdateSchemaSuccessTest') }
              }
            }
          },
          {
            name: 'CollectionUpdateSchemaOverrideConfigUpdateSchemaFailTest',
            setup: function(context) {
              this.history = context.httpHistory
            },
            reqSpec: function() {
              return _.assign(this.history.getReqSpec('CollectionUpdateSchemaFailTest'),
                              {url: '/update2'})
            },
            resSpec: {
              $property: {
                get: function() { return this.history.getResSpec('CollectionUpdateSchemaFailTest') }
              }
            }
          },
          {
            name: 'CollectionUpdateSchemaOverrideConfigUpdateSchemaSuccessTest',
            setup: function(context) {
              this.history = context.httpHistory
            },
            teardown: function() {
              let collection = this.parent.db.getCollection('update')
              assert.deepEqual(
                collection.findOne({_id: getObjectId(0)}),
                {_id: getObjectId(0), foo: 'bar', val: 6})
              assert.equal(collection.find({val: 0}).count(), 2)
            },
            reqSpec: function() {
              return _.assign(this.history.getReqSpec('CollectionUpdateSchemaSuccessTest'),
                              {url: '/update2'})
            },
            resSpec: {
              $property: {
                get: function() { return this.history.getResSpec('CollectionUpdateSchemaSuccessTest') }
              }
            }
          }
        ]
      })
    ]
  })
})

