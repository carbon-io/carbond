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
 * update tests
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
    name: 'UpdateTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'DefaultConfigUpdateTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/update',
          endpoints: {
            update: o({
              _type: pong.MongoDBCollection,
              enabled: {update: true},
              collection: 'update'
            })
          }
        }),
        tests: [
          {
            name: 'UpdateTest',
            description: 'Test PATCH',
            setup: function() {
              this.parent.populateDb({
                update: [{foo: 'baz'}]
              })
            },
            teardown: function() {
              try {
                assert.equal(this.parent.db.getCollection('update').findOne().foo, 'bar')
              } finally {
                this.parent.dropDb()
              }
            },
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              body: {
                $set: {foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 200,
              body: {n: 1}
            }
          },
          {
            name: 'UpdateNoBodyBadRequestTest',
            description: 'Test PATCH with no body results in bad request',
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              // NOTE: an undefined body gets converted to `{}` which complies with the default
              //       update schema
            },
            resSpec: {
              statusCode: 400
            }
          },
          {
            name: 'UpdateUpsertNotSupportedAndIgnoredTest',
            description: 'Test upsert throws when not supported',
            setup: function() {
              this.parent.dropDb()
            },
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              parameters: {
                upsert: true
              },
              body: {
                $set: {foo: 'bar'}
              }
            },
            resSpec: {
              statusCode: 200,
              body: {n: 0}
            }
          },
        ]
      }),
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'SupportsUpsertDoesNotReturnUpsertedObjectsConfigUpdateTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/update',
          endpoints: {
            update: o({
              _type: pong.MongoDBCollection,
              enabled: {update: true},
              collection: 'update',
              updateConfig: {
                supportsUpsert: true
              }
            })
          }
        }),
        setup: function(context) {
          MongoDBCollectionHttpTest.prototype.setup.apply(this, arguments)
          context.global.idHeader = this.service.endpoints.update.idHeader
        },
        teardown: function(context) {
          delete context.global.idHeader
          MongoDBCollectionHttpTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'UpdateWithUpsertTest',
            description: 'Test PATCH results in upsert when requested',
            setup: function() {
              this.parent.dropDb()
              pong.util.mongoDbCollectionIdGenerator.resetId()
            },
            teardown: function(context) {
              assert.deepEqual(
                this.parent.db.getCollection('update').findOne(),
                {_id: context.local._id, foo: 'bar'})
            },
            reqSpec: function(context) {
              return {
                url: '/update',
                method: 'PATCH',
                parameters: {
                  upsert: true
                },
                body: {
                  $set: {foo: 'bar'}
                }
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                var parsedLocation = url.parse(headers.location, true)
                assert(!_.isArray(parsedLocation.query._id))
                assert.doesNotThrow(function() {
                  context.local._id = new ejson.types.ObjectId(parsedLocation.query._id)
                })
                assert.deepEqual(
                  ejson.parse(headers[context.global.idHeader]),
                  [context.local._id])
              },
              body: {n: 1}
            }
          }
        ]
      }),
      o({
        _type: testtube.Test,
        name: 'ConfigureReturnsUpsertedObjectsThrowsTest',
        doTest: function() {
          assert.throws(function() {
            var service = o({
              _type: pong.Service,
              dbUri: config.MONGODB_URI + '/update',
              endpoints: {
                update: o({
                  _type: pong.MongoDBCollection,
                  enabled: {update: true},
                  collection: 'update',
                  updateConfig: {
                    supportsUpsert: true,
                    returnsUpsertedObjects: true
                  }
                })
              }
            })
          })
        }
      }),
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'UpdateQueryTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/update',
          endpoints: {
            update: o({
              _type: pong.MongoDBCollection,
              enabled: {update: true},
              collection: 'update',
              updateConfig: {
                supportsUpsert: true
              }
            })
          }
        }),
        fixture: {
          update: [
            {_id: getObjectId(0), foo: 'bar'},
            {_id: getObjectId(1), bar: 'baz'},
            {_id: getObjectId(2), baz: 'yaz'},
          ]
        },
        setup: function(context) {
          MongoDBCollectionHttpTest.prototype.setup.apply(this, arguments)
          context.global.idHeader = this.service.endpoints.update.idHeader
        },
        teardown: function(context) {
          delete context.global.idHeader
          MongoDBCollectionHttpTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'QueryUpdateTest',
            description: 'Test query parameter for update',
            setup: function() {
              this.parent.populateDb()
            },
            teardown: function() {
              assert.equal(
                this.parent.db.getCollection('update').find({updated: true}).count(), 2)
            },
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              parameters: {
                query: {
                  $or: [
                    {foo: 'bar'},
                    {bar: 'baz'}
                  ]
                }
              },
              body: {
                $set: {updated: true}
              }
            },
            resSpec: {
              statusCode: 200,
              body: {n: 2}
            }
          },
          {
            name: 'QueryUpdateWithUpsertTest',
            description: 'Test query parameter for update with upsert',
            setup: function() {
              this.parent.populateDb()
            },
            teardown: function(context) {
              assert.equal(
                assert.deepEqual(
                  this.parent.db.getCollection('update').findOne({_id: context.local._id}),
                  {_id: context.local._id, yaz: 'raz', upserted: true}))
            },
            reqSpec: {
              url: '/update',
              method: 'PATCH',
              parameters: {
                query: {
                  yaz: 'raz',
                },
                upsert: true
              },
              body: {
                $set: {upserted: true}
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(headers, context) {
                context.local._id = ejson.parse(headers[context.global.idHeader])[0]
              },
              body: {n: 1}
            }
          }
        ]
      }),
      o({
        _type: testtube.util.SkipTest,
        name: 'QueryDisabledTests',
        description: 'Implement me'
      })
    ]
  })
})

