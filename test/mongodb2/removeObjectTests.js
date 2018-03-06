var assert = require('assert')

var __ = require('@carbon-io/carbon-core').fibers.__(module)
var o = require('@carbon-io/carbon-core').atom.o(module)
var testtube = require('@carbon-io/carbon-core').testtube

var pong = require('../fixtures/pong')
var getObjectId = pong.util.getObjectId
var config = require('../Config')
var MongoDBCollectionHttpTest = require('./MongoDBCollectionHttpTest')

/**************************************************************************
 * removeObject tests
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
    name: 'RemoveObjectTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'DefaultConfigRemoveObjectTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/removeObject',
          endpoints: {
            removeObject: o({
              _type: pong.MongoDBCollection,
              enabled: {removeObject: true},
              collectionName: 'removeObject',
            }),
          },
        }),
        fixture: {
          removeObject: [
            {_id: getObjectId(0), foo: 'bar'},
            {_id: getObjectId(1), bar: 'baz'},
            {_id: getObjectId(2), baz: 'yaz'},
          ],
        },
        tests: [
          {
            name: 'RemoveObjectTest',
            description: 'Test DELETE',
            reqSpec: {
              url: '/removeObject/' + getObjectId(0).toString(),
              method: 'DELETE',
            },
            resSpec: {
              statusCode: 200,
              body: {n: 1},
            },
          },
        ],
      }),
      o({
        _type: testtube.Test,
        name: 'ReturnsRemovedObjectConfigThrowsTest',
        description: 'Test that configuring returns removed object throws error',
        doTest: function() {
          assert.throws(function() {
            var service = o({
              _type: pong.Service,
              dbUri: config.MONGODB_URI + '/removeObject',
              endpoints: {
                removeObject: o({
                  _type: pong.MongoDBCollection,
                  enabled: {removeObject: true},
                  collectionName: 'removeObject',
                  removeObjectConfig: {
                    returnsRemovedObject: true,
                  },
                }),
              },
            })
          })
        },
      }),
    ],
  })
})

