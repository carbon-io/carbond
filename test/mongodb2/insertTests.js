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

function getObjectId(n) {
  return new ejson.types.ObjectId(_.padStart(n.toString(16), 24, '0'))
}

/**************************************************************************
 * insert tests
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
    name: 'InsertTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'DefaultConfigInsertTests',
        fixture: {
          insert: []
        },
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/insert',
          endpoints: {
            insert: o({
              _type: pong.MongoDBCollection,
              idGenerator: pong.util.mongoDbCollectionIdGenerator,
              enabled: {insert: true},
              collectionName: 'insert'
            })
          }
        }),
        setup: function(context) {
          MongoDBCollectionHttpTest.prototype.setup.apply(this, arguments)
          context.global.idHeaderName = this.service.endpoints.insert.idHeaderName
        },
        teardown: function(context) {
          pong.util.mongoDbCollectionIdGenerator.resetId()
          delete context.global.idHeaderName
          MongoDBCollectionHttpTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'InsertObjectResultsInBadRequestTest',
            description: 'Test POST of a single object is rejected',
            reqSpec: {
              url: '/insert',
              method: 'POST',
              body: {
                foo: 'bar'
              }
            },
            resSpec: {
              statusCode: 400
            }
          },
          {
            name: 'InsertSinglObjectInArrayTest',
            description: 'Test POST of array with single object',
            setup: function() {
              pong.util.mongoDbCollectionIdGenerator.resetId()
              this.parent.dropDb()
            },
            reqSpec: function(context) {
              return {
                url: '/insert',
                method: 'POST',
                body: [{foo: 'bar'}]
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepEqual(
                  headers[context.global.idHeaderName],
                  ejson.stringify([getObjectId(0)]))
                assert.deepEqual(
                  headers.location,
                  url.format({pathname: '/insert', query: {_id: getObjectId(0).toString()}}))
              },
              body: function(body, context) {
                assert.deepEqual(body, [{
                  _id: getObjectId(0),
                  foo: 'bar'
                }])
              }
            }
          },
          {
            name: 'InsertMultipleObjectsTest',
            description: 'Test POST of array with multiple objects',
            setup: function() {
              pong.util.mongoDbCollectionIdGenerator.resetId()
              this.parent.dropDb()
            },
            reqSpec: function(context) {
              return {
                url: '/insert',
                method: 'POST',
                body: [{foo: 'bar'}, {bar: 'baz'}, {baz: 'yaz'}]
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepEqual(
                  headers[context.global.idHeaderName],
                  ejson.stringify([getObjectId(0), getObjectId(1), getObjectId(2)]))
                assert.deepEqual(
                  headers.location,
                  url.format(
                    {
                      pathname: '/insert',
                      query: {
                        _id: [
                          getObjectId(0).toString(),
                          getObjectId(1).toString(),
                          getObjectId(2).toString()
                        ]
                      }
                    }))
              },
              body: function(body, context) {
                assert.deepEqual(body, [
                  {_id: getObjectId(0), foo: 'bar'},
                  {_id: getObjectId(1), bar: 'baz'},
                  {_id: getObjectId(2), baz: 'yaz'}
                ])
              }
            }
          },
          {
            name: 'InsertSingleObjectWithIdTest',
            description: 'Test POST of array with single object with ID',
            reqSpec: function(context) {
              return {
                url: '/insert',
                method: 'POST',
                body: [{_id: getObjectId(0), foo: 'bar'}]
              }
            },
            resSpec: {
              statusCode: 400,
            }
          },
          {
            name: 'InsertMultipleObjectsWithIdsTest',
            description: 'Test POST of array with multiple objects with IDs',
            reqSpec: function(context) {
              return {
                url: '/insert',
                method: 'POST',
                body: [
                  {_id: getObjectId(0), foo: 'bar'},
                  {_id: getObjectId(1), bar: 'baz'},
                  {_id: getObjectId(2), baz: 'yaz'}
                ]
              }
            },
            resSpec: {
              statusCode: 400,
            }
          }
        ]
      }),
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'CustomSchemaConfigInsertTests',
        description: 'Test custom insert schema',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/insert',
          endpoints: {
            insert: o({
              _type: pong.MongoDBCollection,
              dbUri: config.MONGODB_URI + '/insert',
              idGenerator: pong.util.mongoDbCollectionIdGenerator,
              enabled: {insert: true},
              collectionName: 'insert',
              insertConfig: {
                schema: {
                  type: 'object',
                  properties: {
                    foo: {
                      type: 'string',
                      pattern: '^(bar|baz|yaz)$'
                    }
                  },
                  patternProperties: {
                    '^\\d+$': {type: 'string'}
                  },
                  additionalProperties: false
                }
              }
            })
          }
        }),
        setup: function(context) {
          MongoDBCollectionHttpTest.prototype.setup.apply(this, arguments)
          context.global.idHeaderName = this.service.endpoints.insert.idHeaderName
        },
        teardown: function(context) {
          pong.util.mongoDbCollectionIdGenerator.resetId()
          delete context.global.idHeaderName
          MongoDBCollectionHttpTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'FailInsertSchemaTest',
            description: 'Test POST of array with malformed object',
            setup: function() {
              pong.util.mongoDbCollectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/insert',
                method: 'POST',
                body: [{foo: 'bar'}, {bar: 'baz'}, {foo: 'bur'}]
              }
            },
            resSpec: {
              statusCode: 400,
            }
          },
          {
            name: 'SuccessInsertSchemaTest',
            description: 'Test POST of array with well formed objects',
            setup: function() {
              pong.util.mongoDbCollectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/insert',
                method: 'POST',
                body: [{foo: 'bar'}, {'666': 'bar'}, {'777': 'baz'}]
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepStrictEqual(
                  headers[context.global.idHeaderName],
                  ejson.stringify([getObjectId(0), getObjectId(1), getObjectId(2)]))
                assert.deepStrictEqual(
                  headers.location,
                  url.format(
                    {
                      pathname: '/insert', 
                      query: {_id: [getObjectId(0).toString(), getObjectId(1).toString(), getObjectId(2).toString()]}
                    }))
              },
              body: function(body, context) {
                assert.deepEqual(body, [
                  {_id: getObjectId(0), foo: 'bar'},
                  {_id: getObjectId(1), '666': 'bar'},
                  {_id: getObjectId(2), '777': 'baz'}
                ])
              }
            }
          },
        ]
      }),
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'DoesNotReturnInsertedObjectsConfigInsertTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/insert',
          endpoints: {
            insert: o({
              _type: pong.MongoDBCollection,
              idGenerator: pong.util.mongoDbCollectionIdGenerator,
              enabled: {insert: true},
              collectionName: 'insert',
              insertConfig: {
                returnsInsertedObjects: false
              }
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idHeaderName = this.service.endpoints.insert.idHeaderName
        },
        teardown: function(context) {
          pong.util.mongoDbCollectionIdGenerator.resetId()
          delete context.global.idHeaderName
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'InsertSinglObjectInArrayTest',
            description: 'Test POST of array with single object',
            setup: function() {
              pong.util.mongoDbCollectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/insert',
                method: 'POST',
                headers: {
                  'x-pong': ejson.stringify({
                    insert: {$args: 0}
                  })
                },
                body: [{foo: 'bar'}]
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepStrictEqual(
                  headers[context.global.idHeaderName],
                  ejson.stringify([getObjectId(0)]))
                assert.deepStrictEqual(
                  headers.location,
                  url.format({pathname: '/insert', query: {_id: getObjectId(0).toString()}}))
              },
              body: undefined
            }
          },
          {
            name: 'InsertMultipleObjectsTest',
            description: 'Test POST of array with multiple objects',
            setup: function() {
              pong.util.mongoDbCollectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/insert',
                method: 'POST',
                body: [{foo: 'bar'}, {bar: 'baz'}, {baz: 'yaz'}]
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepStrictEqual(
                  headers[context.global.idHeaderName],
                  ejson.stringify([getObjectId(0), getObjectId(1), getObjectId(2)]))
                assert.deepStrictEqual(
                  headers.location,
                  url.format(
                    {
                      pathname: '/insert', 
                      query: {_id: [getObjectId(0).toString(), getObjectId(1).toString(), getObjectId(2).toString()]}
                    }))
              },
              body: undefined
            }
          },
        ]
      })
    ],
  })
})

