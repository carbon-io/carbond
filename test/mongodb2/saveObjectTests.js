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
 * saveObject tests
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
    name: 'SaveObjectTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'DefaultConfigSaveObjectTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/saveObject',
          endpoints: {
            saveObject: o({
              _type: pong.MongoDBCollection,
              enabled: {saveObject: true},
              collectionName: 'saveObject'
            })
          }
        }),
        setup: function(context) {
          MongoDBCollectionHttpTest.prototype.setup.apply(this, arguments)
          context.global.idHeaderName = this.service.endpoints.saveObject.idHeaderName
        },
        teardown: function(context) {
          delete context.global.idHeaderName
          MongoDBCollectionHttpTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'SaveObjectsResultsInBadRequestTest',
            description: 'Test PUT of array with multiple objects',
            reqSpec: {
              url: '/saveObject/' + getObjectId(0).toString(),
              method: 'PUT',
              body: [
                {_id: getObjectId(0), foo: 'bar'},
                {_id: getObjectId(1), bar: 'baz'},
                {_id: getObjectId(2), baz: 'yaz'}
              ]
            },
            resSpec: {
              statusCode: 400
            }
          },
          {
            name: 'SaveObjectExistingTest',
            description: 'Test PUT of existing object',
            setup: function() {
              this.parent.populateDb({
                saveObject: [{_id: getObjectId(0), foo: 'bar'}]
              })
            },
            reqSpec: {
              url: '/saveObject/' + getObjectId(0),
              method: 'PUT',
              body: {_id: getObjectId(0), foo: 'bar'}
            },
            resSpec: {
              statusCode: 200,
              body: {_id: getObjectId(0), foo: 'bar'}
            }
          },
          {
            name: 'SaveObjectCreatedTest',
            description: 'Test PUT of new object',
            setup: function() {
              this.parent.dropDb()
            },
            reqSpec: {
              url: '/saveObject/' + getObjectId(0).toString(),
              method: 'PUT',
              body: {_id: getObjectId(0), foo: 'bar'}
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepStrictEqual(
                  headers[context.global.idHeaderName],
                  ejson.stringify(getObjectId(0)))
                assert.deepStrictEqual(
                  headers.location, '/saveObject/' + getObjectId(0).toString())
              },
              body: {
                _id: getObjectId(0),
                foo: 'bar'
              }
            }
          },
        ]
      }),
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'CustomSchemaConfigSaveObjectTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/saveObject',
          endpoints: {
            saveObject: o({
              _type: pong.MongoDBCollection,
              enabled: {saveObject: true},
              collectionName: 'saveObject',
              saveObjectConfig: {
                saveObjectSchema: {
                  type: 'object',
                  properties: {
                    _id: {type: 'ObjectId'},
                    foo: {
                      type: 'string',
                      pattern: '^(bar|baz|yaz)$'
                    }
                  },
                  required: ['_id'],
                  patternProperties: {
                    '^\\d+$': {type: 'string'}
                  },
                  additionalProperties: false
                }
              }
            })
          }
        }),
        tests: [
          {
            name: 'FailSaveObjectSchemaTest',
            description: 'Test PUT of malformed object',
            reqSpec: {
              url: '/saveObject/' + getObjectId(0),
              method: 'PUT',
              body: {_id: getObjectId(0), bar: 'baz'}
            },
            resSpec: {
              statusCode: 400,
            }
          },
          {
            name: 'SuccessSaveObjectSchemaTest',
            description: 'Test PUT with well formed object',
            reqSpec: {
              url: '/saveObject/' + getObjectId(0),
              method: 'PUT',
              body: {_id: getObjectId(0), foo: 'bar'}
            },
            resSpec: {
              statusCode: 201,
              body: {_id: getObjectId(0), foo: 'bar'}
            }
          },
        ]
      }),
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'DoesNotReturnSavedObjectConfigSaveObjectTest',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/saveObject',
          endpoints: {
            saveObject: o({
              _type: pong.MongoDBCollection,
              enabled: {saveObject: true},
              collectionName: 'saveObject',
              saveObjectConfig: {
                returnsSavedObject: false
              }
            })
          }
        }),
        fixture: {
          saveObject: [{_id: getObjectId(0), foo: 'bar'}]
        },
        tests: [
          {
            name: 'SaveObjectExistingTest',
            description: 'Test PUT of existing object',
            reqSpec: {
              url: '/saveObject/' + getObjectId(0).toString(),
              method: 'PUT',
              body: {_id: getObjectId(0), foo: 'bar'}
            },
            resSpec: {
              statusCode: 204,
              body: undefined
            }
          }
        ]
      })
    ]
  })
})

