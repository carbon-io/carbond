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
 * find tests
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
    name: 'FindTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'DefaultConfigFindTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/find',
          endpoints: {
            find: o({
              _type: pong.MongoDBCollection,
              enabled: {find: true},
              collection: 'find'
            })
          }
        }),
        fixture: {
          find: [
            {_id: getObjectId(0), foo: 'bar', bar: 9},
            {_id: getObjectId(1), bar: 'baz', bar: 3},
            {_id: getObjectId(2), baz: 'yaz', bar: 5}
          ]
        },
        tests: [
          {
            name: 'HeadTest',
            description: 'Test HEAD method',
            reqSpec: function(context) {
              return {
                url: '/find',
                method: 'HEAD',
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert(_.isNil(headers.link))
              },
              body: undefined
            }
          },
          {
            name: 'FindTest',
            description: 'Test find',
            reqSpec: function(context) {
              return {
                url: '/find',
                method: 'GET',
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert(_.isNil(headers.link))
              },
              body: function(body, context) {
                assert.deepEqual(body, this.parent.fixture.find)
              }
            }
          },
          {
            name: 'FindIdQueryTest',
            description: 'Test find with id query',
            reqSpec: function(context) {
              return {
                url: '/find',
                method: 'GET',
                parameters: {
                  _id: [getObjectId(0).toString(), getObjectId(1).toString()]
                }
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert(_.isNil(headers.link))
              },
              body: function(body, context) {
                assert.deepEqual(body, this.parent.fixture.find.slice(0, 2))
              }
            }
          },
          {
            name: 'FindPageSkipAndLimitParametersEnabledByDefaultTest',
            description: 'Test find',
            setup: function() {
              this.parent.populateDb({
                find: _.map(
                  _.range(this.parent.service.endpoints.find.findConfig.pageSize * 2),
                  function() { return {foo: 'bar'} }
                )
              })
            },
            teardown: function() {
              this.parent.populateDb()
            },
            reqSpec: function(context) {
              return {
                url: '/find',
                method: 'GET',
                parameters: {
                  skip: 1,
                  limit: 1,
                  page: 1
                }
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert.equal(
                  headers.link,
                  '<http://localhost:8888/find?page=0&skip=1&limit=1>; rel="prev", ' +
                  '<http://localhost:8888/find?page=2&skip=1&limit=1>; rel="next"')
              },
              body: function(body, context) {
                assert.deepEqual(body, [
                  {_id: getObjectId(51), foo: 'bar'}
                ])
              }
            }
          },
          {
            name: 'FindQueryTest',
            description: 'Test find with query',
            reqSpec: {
              url: '/find',
              method: 'GET',
              parameters: {
                query: {
                  bar: {$gt: 5}
                },
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert(_.isNil(headers.link))
              },
              body: function(body, context) {
                assert.deepEqual(body, this.parent.fixture.find.slice(0, 1))
              }
            }

          },
          {
            name: 'FindQueryAndIdQueryTest',
            description: 'Test find with query and id query parameters',
            reqSpec: function(context) {
              return {
                url: '/find',
                method: 'GET',
                parameters: {
                  _id: [getObjectId(0).toString(), getObjectId(1).toString()],
                  query: {bar: {$lt: 10}}
                }
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert(_.isNil(headers.link))
              },
              body: function(body, context) {
                assert.deepEqual(body, this.parent.fixture.find.slice(0, 2))
              }
            }
          },
          {
            name: 'FindSortTest',
            reqSpec: {
              url: '/find',
              method: 'GET',
              parameters: {
                sort: {bar: 1},
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert(_.isNil(headers.link))
              },
              body: function(body, context) {
                assert.deepEqual(body, _.sortBy(this.parent.fixture.find, function(object) {
                  return object.bar
                }))
              }
            }
          },
          {
            name: 'FindProjectionTest',
            reqSpec: {
              url: '/find',
              method: 'GET',
              parameters: {
                projection: {foo: 1},
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert(_.isNil(headers.link))
              },
              body: function(body, context) {
                assert.deepEqual(
                  body,
                  _.map(this.parent.fixture.find, _.partialRight(_.pick, ['_id', 'foo'])))
              }
            }
          },
        ]
      }),
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'NoIdQueryConfigFindTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/find',
          endpoints: {
            find: o({
              _type: pong.MongoDBCollection,
              enabled: {find: true},
              collection: 'find',
              findConfig: {
                supportsIdQuery: false
              }
            })
          }
        }),
        fixture: {
          find: [
            {_id: getObjectId(0), foo: 'bar'},
            {_id: getObjectId(1), bar: 'baz'},
            {_id: getObjectId(2), baz: 'yaz'}
          ]
        },
        tests: [
          {
            name: 'idQueryIgnoredTest',
            description: 'Test that the id query parameter is ignored',
            reqSpec: function(context) {
              return {
                url: '/find',
                method: 'GET',
                parameters: {_id: getObjectId(0)}
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(body, context) {
                assert.deepEqual(body, this.parent.fixture.find)
              }
            }
          }
        ]
      }),
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'PageOverridesSkipAndLimitDisabledConfigFindTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/find',
          endpoints: {
            find: o({
              _type: pong.MongoDBCollection,
              enabled: {find: true},
              collection: 'find',
              findConfig: {
                supportsSkipAndLimit: false
              }
            })
          }
        }),
        fixture: {
          find: [
            {_id: getObjectId(0), foo: 'bar'},
            {_id: getObjectId(1), bar: 'baz'},
            {_id: getObjectId(2), baz: 'yaz'}
          ]
        },
        tests: [
          {
            name: 'skipAndLimitTest',
            description: 'Test that skip and limit parameters are honored',
            reqSpec: function(context) {
              return {
                url: '/find',
                method: 'GET',
                parameters: {
                  skip: 1,
                  limit: 1
                },
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert.equal(headers.link, '<http://localhost:8888/find?page=1&skip=1&limit=1>; rel="next"')
              },
              body: function(body, context) {
                assert.deepEqual(body, this.parent.fixture.find.slice(1,2))
              }
            }
          },
        ]
      }),
      o({
        _type: MongoDBCollectionHttpTest,
        name: 'PageDisabledSkipAndLimitStillEnabledConfigFindTests',
        service: o({
          _type: pong.Service,
          dbUri: config.MONGODB_URI + '/find',
          endpoints: {
            find: o({
              _type: pong.MongoDBCollection,
              enabled: {find: true},
              collection: 'find',
              findConfig: {
                supportsPagination: false
              }
            })
          }
        }),
        fixture: {
          find: [
            {_id: getObjectId(0), foo: 'bar'},
            {_id: getObjectId(1), bar: 'baz'},
            {_id: getObjectId(2), baz: 'yaz'}
          ]
        },
        tests: [
          {
            name: 'skipAndLimitTest',
            description: 'Test that skip and limit parameters are honored',
            reqSpec: {
              url: '/find',
              method: 'GET',
              parameters: {
                skip: 1,
                limit: 1
              },
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert(_.isNil(headers.link))
              },
              body: function(body, context) {
                assert.deepEqual(body, this.parent.fixture.find.slice(1, 2))
              }
            }
          },
          {
            name: 'pageNotHonoredTest',
            description: 'Test that page parameter is not honored',
            reqSpec: {
              url: '/find',
              method: 'GET',
              parameters: {
                page: 1,
                skip: 1,
                limit: 1
              },
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert(_.isNil(headers.link))
              },
              body: function(body, context) {
                assert.deepEqual(body, this.parent.fixture.find.slice(1, 2))
              }
            }
          }
        ]
      }),
    ]
  })
})


