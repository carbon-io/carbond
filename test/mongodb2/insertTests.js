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
    name: 'insertTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'defaultConfigInsertTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            insert: o({
              _type: pong.MongoDBCollection,
              idGenerator: pong.util.mongoDbCollectionIdGenerator,
              enabled: {insert: true}
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.insert.idParameter
          context.global.idHeader = this.service.endpoints.insert.idHeader
          debugger
        },
        teardown: function(context) {
          pong.util.mongoDbCollectionIdGenerator.resetId()
          delete context.global.idHeader
          delete context.global.idParameter
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
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
                assert.deepEqual(
                  headers[context.global.idHeader],
                  ejson.stringify([getObjectId(0)]))
                assert.deepEqual(
                  headers.location,
                  url.format({pathname: '/insert', query: {[context.global.idParameter]: getObjectId(0).toString()}}))
              },
              body: function(body, context) {
                assert.deepEqual(body, [{
                  [context.global.idParameter]: getObjectId(0),
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
                body: [{foo: 'bar'}, {bar: 'baz'}, {baz: 'yaz'}]
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                assert.deepEqual(
                  headers[context.global.idHeader],
                  ejson.stringify([getObjectId(0), getObjectId(1), getObjectId(2)]))
                assert.deepEqual(
                  headers.location,
                  url.format(
                    {
                      pathname: '/insert',
                      query: {
                        [context.global.idParameter]: [
                          getObjectId(0).toString(),
                          getObjectId(1).toString(),
                          getObjectId(2).toString()
                        ]
                      }
                    }))
              },
              body: function(body, context) {
                assert.deepEqual(body, [
                  {[context.global.idParameter]: getObjectId(0), foo: 'bar'},
                  {[context.global.idParameter]: getObjectId(1), bar: 'baz'},
                  {[context.global.idParameter]: getObjectId(2), baz: 'yaz'}
                ])
              }
            }
          }
        ]
      })
    ],
  })
})

