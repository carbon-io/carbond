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
 * insertObject tests
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
    name: 'InsertObjectTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'DefaultConfigInsertObjectTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/insertObject',
          endpoints: {
            insertObject: o({
              _type: pong.MongoDBCollection,
              idGenerator: pong.util.mongoDbCollectionIdGenerator,
              enabled: {insertObject: true},
              collectionName: 'insertObject'
            })
          }
        }),
        setup: function(context) {
          MongoDBCollectionHttpTest.prototype.setup.apply(this, arguments)
          context.global.idHeaderName = this.service.endpoints.insertObject.idHeaderName
        },
        teardown: function(context) {
          pong.util.mongoDbCollectionIdGenerator.resetId()
          delete context.global.idHeaderName
          MongoDBCollectionHttpTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'InsertObjectsResultsInBadRequestTest',
            description: 'Test POST of array with multiple objects',
            reqSpec: {
              url: '/insertObject',
              method: 'POST',
              body: [
                {foo: 'bar'},
                {bar: 'baz'},
                {baz: 'yaz'}
              ]
            },
            resSpec: {
              statusCode: 400
            }
          },
          {
            name: 'InsertObjectTest',
            description: 'Test POST of object',
            setup: function() {
              pong.util.mongoDbCollectionIdGenerator.resetId()
              this.parent.dropDb()
            },
            reqSpec: function(context) {
              return {
                url: '/insertObject',
                method: 'POST',
                body: {foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepStrictEqual(
                  headers[context.global.idHeaderName],
                  ejson.stringify(getObjectId(0)))
                assert.deepStrictEqual(
                  headers.location, '/insertObject/' + getObjectId(0).toString())
              },
              body: function(body, context) {
                assert.deepEqual(body, {
                  _id: getObjectId(0),
                  foo: 'bar'
                })
              }
            }
          },
          {
            name: 'InsertObjectWithIdTest',
            description: 'Test POST of object with ID',
            reqSpec: function(context) {
              return {
                url: '/insertObject',
                method: 'POST',
                body: {_id: getObjectId(0), foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 400,
            }
          },
        ]
      }),
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'CustomSchemaConfigInsertObjectTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/insertObject',
          endpoints: {
            insertObject: o({
              _type: pong.MongoDBCollection,
              idGenerator: pong.util.mongoDbCollectionIdGenerator,
              enabled: {insertObject: true},
              collectionName: 'insertObject',
              insertObjectConfig: {
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
          context.global.idHeaderName = this.service.endpoints.insertObject.idHeaderName
        },
        teardown: function(context) {
          pong.util.mongoDbCollectionIdGenerator.resetId()
          delete context.global.idHeaderName
          MongoDBCollectionHttpTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'FailInsertObjectSchemaTest',
            description: 'Test POST of malformed object',
            setup: function() {
              pong.util.mongoDbCollectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/insertObject',
                method: 'POST',
                body: {bar: 'baz'}
              }
            },
            resSpec: {
              statusCode: 400,
            }
          },
          {
            name: 'SuccessInsertObjectSchemaTest',
            description: 'Test POST with well formed object',
            setup: function() {
              pong.util.mongoDbCollectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/insertObject',
                method: 'POST',
                body: {foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepStrictEqual(
                  headers[context.global.idHeaderName],
                  ejson.stringify(getObjectId(0)))
                assert.deepStrictEqual(
                  headers.location, '/insertObject/' + getObjectId(0).toString())
              },
              body: function(body, context) {
                assert.deepEqual(body, {
                  _id: getObjectId(0), foo: 'bar'
                })
              }
            }
          },
        ]
      }),
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'DoesNotReturnInsertedObjectConfigInsertObjectTests',
        service: o({
          _type: carbond.Service,
          dbUri: config.MONGODB_URI + '/insertObject',
          endpoints: {
            insertObject: o({
              _type: pong.MongoDBCollection,
              idGenerator: pong.util.mongoDbCollectionIdGenerator,
              enabled: {insertObject: true},
              collectionName: 'insertObject',
              insertObjectConfig: {
                returnsInsertedObject: false
              }
            })
          }
        }),
        setup: function(context) {
          MongoDBCollectionHttpTest.prototype.setup.apply(this, arguments)
          context.global.idHeaderName = this.service.endpoints.insertObject.idHeaderName
        },
        teardown: function(context) {
          pong.util.mongoDbCollectionIdGenerator.resetId()
          delete context.global.idHeaderName
          MongoDBCollectionHttpTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'InsertObjectTest',
            description: 'Test POST of object',
            setup: function() {
              pong.util.mongoDbCollectionIdGenerator.resetId()
            },
            reqSpec: function(context) {
              return {
                url: '/insertObject',
                method: 'POST',
                body: {foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepStrictEqual(
                  headers[context.global.idHeaderName],
                  ejson.stringify(getObjectId(0)))
                assert.deepStrictEqual(
                  headers.location, '/insertObject/' + getObjectId(0).toString())
              },
              body: undefined
            }
          }
        ]
      })
    ]
  })
})

