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
 * remove tests
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
    name: 'RemoveTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'DefaultConfigRemoveTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/remove',
          endpoints: {
            remove: o({
              _type: pong.MongoDBCollection,
              enabled: {remove: true},
              collection: 'remove'
            })
          }
        }),
        fixture: {
          remove: [
            {_id: getObjectId(0), foo: 'bar'},
            {_id: getObjectId(1), bar: 'baz'},
            {_id: getObjectId(0), baz: 'yaz'}
          ]
        },
        tests: [
          {
            name: 'RemoveTest',
            description: 'Test DELETE',
            setup: function() {
              this.parent.populateDb()
            },
            reqSpec: {
              url: '/remove',
              method: 'DELETE',
            },
            resSpec: {
              statusCode: 200,
              body: {n: 3}
            }
          },
          {
            name: 'RemoveWithQueryTest',
            description: 'Test DELETE with query',
            setup: function() {
              this.parent.populateDb()
            },
            teardown: function() {
              assert.equal(this.parent.db.getCollection('remove').find().count(), 2)
            },
            reqSpec: {
              url: '/remove',
              method: 'DELETE',
              parameters: {
                query: {foo: 'bar'}
              }
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
        name: 'QueryDisabledConfigRemoveTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/remove',
          endpoints: {
            remove: o({
              _type: pong.MongoDBCollection,
              enabled: {remove: true},
              collection: 'remove',
              removeConfig: {
                supportsQuery: false
              }
            })
          }
        }),
        fixture: {
          remove: [
            {_id: getObjectId(0), foo: 'bar'},
            {_id: getObjectId(1), bar: 'baz'},
            {_id: getObjectId(0), baz: 'yaz'}
          ]
        },
        tests: [
          {
            name: 'RemoveWithQueryIgnoredTest',
            description: 'Test DELETE with ignored query parameter',
            setup: function() {
              this.parent.populateDb()
            },
            reqSpec: {
              url: '/remove',
              method: 'DELETE',
              parameters: {
                query: {foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 200,
              body: {n: 3}
            }
          },
        ]
      }),
      o({
        _type: testtube.Test,
        name: 'ReturnsRemovedObjectsConfigThrowsTest',
        description: 'Test that configuring returns removed objects throws error',
        doTest: function() {
          assert.throws(function() {
            var service = o({
              _type: pong.Service,
              dbUri: config.MONGODB_URI + '/remove',
              endpoints: {
                remove: o({
                  _type: pong.MongoDBCollection,
                  enabled: {remove: true},
                  collection: 'remove',
                  removeConfig: {
                    returnsRemovedObjects: true
                  }
                })
              }
            })
          })
        }
      })
    ]
  })
})

