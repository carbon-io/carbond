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
 * findObject tests
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
    name: 'FindObjectTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'DefaultConfigFindObjectTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/findObject',
          endpoints: {
            findObject: o({
              _type: pong.MongoDBCollection,
              enabled: {findObject: true},
              collection: 'findObject'
            })
          }
        }),
        fixture: {
          findObject: [
            {_id: getObjectId(0), foo: 'bar'},
            {_id: getObjectId(1), bar: 'baz', omit: 'me'},
            {_id: getObjectId(2), baz: 'yaz'}
          ]
        },
        tests: [
          {
            name: 'HeadTest',
            description: 'Test HEAD method',
            reqSpec: {
              url: '/findObject/' + getObjectId(0).toString(),
              method: 'HEAD',
            },
            resSpec: {
              statusCode: 200,
              body: undefined
            }
          },
          {
            name: 'FindObjectTest',
            description: 'Test findObject',
            reqSpec: {
              url: '/findObject/' + getObjectId(0).toString(),
              method: 'GET',
            },
            resSpec: {
              statusCode: 200,
              body: {_id: getObjectId(0), foo: 'bar'}
            }
          },
          {
            name: 'FindObjectNotFoundTest',
            description: 'Test findObject for non-existent',
            reqSpec: {
              url: '/findObject/' + getObjectId(666),
              method: 'GET',
            },
            resSpec: {
              statusCode: 404
            }
          },
          {
            name: 'FindObjectNegativeProjectionTest',
            description: 'Test findObject projection',
            reqSpec: {
              url: '/findObject/' + getObjectId(1).toString(),
              method: 'GET',
              parameters: {
                projection: {omit: 0}
              }
            },
            resSpec: {
              statusCode: 200,
              body: {_id: getObjectId(1), bar: 'baz'}
            }
          },
          {
            name: 'FindObjectPositiveProjectionTest',
            description: 'Test findObject projection',
            reqSpec: {
              url: '/findObject/' + getObjectId(1).toString(),
              method: 'GET',
              parameters: {
                projection: {bar: 1}
              }
            },
            resSpec: {
              statusCode: 200,
              body: {_id: getObjectId(1), bar: 'baz'}
            }
          },
          {
            name: 'FindObjectProjectionBooleanValidationErrorTest',
            description: 'Test findObject projection validation',
            reqSpec: {
              url: '/findObject/' + getObjectId(1).toString(),
              method: 'GET',
              parameters: {
                projection: {omit: -1}
              }
            },
            resSpec: {
              statusCode: 400
            }
          },
          {
            name: 'FindObjectProjectionBooleanValidationErrorTest',
            description: 'Test findObject projection validation',
            reqSpec: {
              url: '/findObject/' + getObjectId(1).toString(),
              method: 'GET',
              parameters: {
                projection: {bar: true}
              }
            },
            resSpec: {
              statusCode: 400
            }
          },
        ]
      })
    ]
  })
})



