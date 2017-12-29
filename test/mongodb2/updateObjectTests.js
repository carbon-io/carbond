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
 * updateObject tests
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
    name: 'UpdateObjectTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'DefaultConfigUpdateObjectTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/updateObject',
          endpoints: {
            updateObject: o({
              _type: pong.MongoDBCollection,
              enabled: {updateObject: true},
              collectionName: 'updateObject'
            })
          }
        }),
        fixture: {
          updateObject: [
            {_id: getObjectId(0), foo: 666},
            {_id: getObjectId(1), bar: 'baz'},
            {_id: getObjectId(2), baz: 'yaz'}
          ]
        },
        tests: [
          {
            name: 'UpdateObjectTest',
            description: 'Test PATCH',
            setup: function() {
              this.parent.populateDb()
            },
            teardown: function() {
              assert.equal(
                this.parent.db.getCollection('updateObject').findOne({_id: getObjectId(0)}).foo,
                'bar')
            },
            reqSpec: {
              url: '/updateObject/' + getObjectId(0).toString(),
              method: 'PATCH',
              body: {
                foo: 'bar'
              }
            },
            resSpec: {
              statusCode: 200,
              body: {n: 1}
            }
          },
          {
            name: 'UpdateObjectNotFoundTest',
            description: 'Test PATCH of non-existent object',
            reqSpec: {
              url: '/updateObject/' + getObjectId(666).toString(),
              method: 'PATCH',
              body: {
                foo: 'bar'
              }
            },
            resSpec: {
              statusCode: 404
            }
          },
          {
            name: 'UpdateObjectNoBodyTest',
            description: 'Test PATCH with no body',
            reqSpec: {
              url: '/updateObject/' + getObjectId(0),
              method: 'PATCH'
              // NOTE: an undefined body gets converted to `{}` which complies with the default
              //       update schema
            },
            resSpec: {
              statusCode: 200,
              body: {n: 1}
            }
          },
        ]
      }),
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'SupportsUpsertDoesNotReturnUpsertedObjectsConfigUpdateObjectTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/updateObject',
          endpoints: {
            updateObject: o({
              _type: pong.MongoDBCollection,
              enabled: {updateObject: true},
              collectionName: 'updateObject',
              updateObjectConfig: {
                supportsUpsert: true
              }
            })
          }
        }),
        setup: function(context) {
          MongoDBCollectionHttpTest.prototype.setup.apply(this, arguments)
          context.global.idHeaderName = this.service.endpoints.updateObject.idHeaderName
        },
        teardown: function(context) {
          delete context.global.idHeaderName
          MongoDBCollectionHttpTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'UpdateObjectWithUpsertTest',
            description: 'Test PATCH results in upsert when requested',
            reqSpec: {
              url: '/updateObject/' + getObjectId(666).toString(),
              method: 'PATCH',
              parameters: {
                upsert: true
              },
              body: {
                foo: 'bar'
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepStrictEqual(headers.location, '/updateObject/' + getObjectId(666).toString())
                assert.deepStrictEqual(headers[context.global.idHeaderName], ejson.stringify(getObjectId(666)))
              },
              body: {n: 1}
            }
          }
        ]
      }),
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'UpdateSchemaConfigUpdateObjectTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/updateObject',
          endpoints: {
            updateObject: o({
              _type: pong.MongoDBCollection,
              enabled: {updateObject: true},
              collectionName: 'updateObject',
              updateObjectSchema: {
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
            updateObject1: o({
              _type: pong.MongoDBCollection,
              enabled: {updateObject: true},
              collectionName: 'updateObject',
              updateObjectConfig: {
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
            updateObject2: o({
              _type: pong.MongoDBCollection,
              enabled: {updateObject: true},
              collectionName: 'updateObject',
              updateObjectSchema: {
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
              updateObjectConfig: {
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
          updateObject: [
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
              let endpoint = this.parent.service.endpoints.updateObject2.endpoints[':_id']
              assert.deepEqual(endpoint.patch.parameters.update.schema, {
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
              url: '/updateObject/' + getObjectId(0).toString(),
              method: 'PATCH',
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
              let collection = this.parent.db.getCollection('updateObject')
              assert.deepEqual(
                collection.findOne({_id: getObjectId(0)}),
                {_id: getObjectId(0), foo: 'bar', val: 2})
              assert.equal(collection.find({val: 0}).count(), 2)
            },
            reqSpec: {
              url: '/updateObject/' + getObjectId(0).toString(),
              method: 'PATCH',
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
                              {url: '/updateObject1/' + getObjectId(0).toString()})
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
              let collection = this.parent.db.getCollection('updateObject')
              assert.deepEqual(
                collection.findOne({_id: getObjectId(0)}),
                {_id: getObjectId(0), foo: 'bar', val: 4})
              assert.equal(collection.find({val: 0}).count(), 2)
            },
            reqSpec: function() {
              return _.assign(this.history.getReqSpec('CollectionUpdateSchemaSuccessTest'),
                              {url: '/updateObject1/' + getObjectId(0).toString()})
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
                              {url: '/updateObject2/' + getObjectId(0).toString()})
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
              let collection = this.parent.db.getCollection('updateObject')
              assert.deepEqual(
                collection.findOne({_id: getObjectId(0)}),
                {_id: getObjectId(0), foo: 'bar', val: 6})
              assert.equal(collection.find({val: 0}).count(), 2)
            },
            reqSpec: function() {
              return _.assign(this.history.getReqSpec('CollectionUpdateSchemaSuccessTest'),
                              {url: '/updateObject2/' + getObjectId(0).toString()})
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

