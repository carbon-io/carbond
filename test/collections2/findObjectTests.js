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
    name: 'findObjectTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'defaultConfigFindObjectTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            findObject: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {findObject: true}
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.findObject.idParameter
        },
        teardown: function(context) {
          delete context.global.idParameter
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'HeadTest',
            description: 'Test HEAD method',
            reqSpec: function(context) {
              return {
                url: '/findObject/0',
                method: 'HEAD',
                headers: {
                  'x-pong': ejson.stringify({
                    findObject: {[context.global.idParameter]: '0', foo: 'bar'}
                  })
                }
              }
            },
            resSpec: {
              statusCode: 200,
              body: undefined
            }
          },
          {
            name: 'FindObjectReturnArrayValidationErrorTest',
            description: 'Test validation on find return value',
            reqSpec: function(context) {
              return {
                url: '/findObject/0',
                method: 'GET',
                headers: {
                  'x-pong': ejson.stringify({
                    findObject: [{[context.global.idParameter]: '0', foo: 'bar'}]
                  })
                }
              }
            },
            resSpec: {
              statusCode: 500
            }
          },
          {
            name: 'FindObjectTest',
            description: 'Test findObject',
            reqSpec: function(context) {
              return {
                url: '/findObject/0',
                method: 'GET',
                headers: {
                  'x-pong': ejson.stringify({
                    findObject: {[context.global.idParameter]: '0', foo: 'bar'}
                  })
                }
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(body, context) {
                assert.deepStrictEqual(body, {[context.global.idParameter]: '0', foo: 'bar'})
              }
            }
          },
          {
            name: 'FindObjectNotFoundTest',
            description: 'Test findObject for non-existent',
            reqSpec: function(context) {
              return {
                url: '/findObject/666',
                method: 'GET',
                headers: {
                  'x-pong': ejson.stringify({
                    findObject: null
                  })
                }
              }
            },
            resSpec: {
              statusCode: 404
            }
          },
        ]
      })
    ]
  })
})



