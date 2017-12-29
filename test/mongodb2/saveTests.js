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
 * save tests
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
    name: 'SaveTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'DefaultConfigSaveTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/save',
          endpoints: {
            save: o({
              _type: pong.MongoDBCollection,
              enabled: {save: true},
              collectionName: 'save'
            })
          }
        }),
        fixture: {
          save: [
          ]
        },
        tests: [
          {
            name: 'SaveSingleObjectInArrayTest',
            description: 'Test PUT of array with single object',
            reqSpec: {
              url: '/save',
              method: 'PUT',
              body: [
                {_id: getObjectId(0), foo: 'bar'},
              ]
            },
            resSpec: {
              statusCode: 200,
              body: [{_id: getObjectId(0), foo: 'bar'}]
            }
          },
          {
            name: 'SaveMultipleObjectsTest',
            description: 'Test PUT of array with multiple objects',
            reqSpec: {
              url: '/save',
              method: 'PUT',
              body: [
                {_id: getObjectId(0), foo: 'bar'},
                {_id: getObjectId(1), bar: 'baz'},
                {_id: getObjectId(2), baz: 'yaz'}
              ]
            },
            resSpec: {
              statusCode: 200,
              body: [
                {_id: getObjectId(0), foo: 'bar'},
                {_id: getObjectId(1), bar: 'baz'},
                {_id: getObjectId(2), baz: 'yaz'}
              ]
            }
          },
          {
            name: 'SaveSingleObjectWithoutIdTest',
            description: 'Test PUT of array with single object without and ID',
            reqSpec: {
              url: '/save',
              method: 'PUT',
              body: [
                {foo: 'bar'},
              ]
            },
            resSpec: {
              statusCode: 400
            }
          },
          {
            name: 'SaveMultipleObjectsWithoutIdsTest',
            description: 'Test PUT of array with multiple objects without IDs',
            reqSpec: {
              url: '/save',
              method: 'PUT',
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
        ]
      }),
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'CustomSchemaConfigSaveTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/save',
          endpoints: {
            save: o({
              _type: pong.MongoDBCollection,
              enabled: {save: true},
              collectionName: 'save',
              saveConfig: {
                saveSchema: {
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
        fixture: [],
        tests: [
          {
            name: 'FailSaveSchemaTest',
            description: 'Test PUT of array with malformed object',
            reqSpec: {
              url: '/save',
              method: 'PUT',
              body: [
                {_id: getObjectId(0), foo: 'bar'},
                {_id: getObjectId(1), bar: 'baz'},
                {_id: getObjectId(2), foo: 'bur'},
              ]
            },
            resSpec: {
              statusCode: 400,
            }
          },
          {
            name: 'SuccessSaveSchemaTest',
            description: 'Test PUT of array with multiple objects',
            reqSpec: {
              url: '/save',
              method: 'PUT',
              body: [
                {_id: getObjectId(0), foo: 'bar'},
                {_id: getObjectId(1), '666': 'bar'},
                {_id: getObjectId(2), '777': 'baz'}
              ]
            },
            resSpec: {
              statusCode: 200,
              body: [
                {_id: getObjectId(0), foo: 'bar'},
                {_id: getObjectId(1), '666': 'bar'},
                {_id: getObjectId(2), '777': 'baz'}
              ]
            }
          },
        ]
      }),
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'DoesNotReturnSavedObjectsConfigSaveTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/save',
          endpoints: {
            save: o({
              _type: pong.MongoDBCollection,
              enabled: {save: true},
              collectionName: 'save',
              saveConfig: {
                returnsSavedObjects: false
              }
            })
          }
        }),
        tests: [
          {
            name: 'SaveSingleObjectInArrayTest',
            description: 'Test PUT of array with single object',
            reqSpec: {
              url: '/save',
              method: 'PUT',
              body: [
                {_id: getObjectId(0), foo: 'bar'},
              ]
            },
            resSpec: {
              statusCode: 204,
              body: undefined
            }
          },
          {
            name: 'SaveMultipleObjectsTest',
            description: 'Test PUT of array with multiple objects',
            reqSpec: {
              url: '/save',
              method: 'PUT',
              body: [
                {_id: getObjectId(0), foo: 'bar'},
                {_id: getObjectId(1), bar: 'baz'},
                {_id: getObjectId(2), baz: 'yaz'}
              ]
            },
            resSpec: {
              statusCode: 204,
              body: undefined
            }
          },
        ]
      })
    ]
  })
})

