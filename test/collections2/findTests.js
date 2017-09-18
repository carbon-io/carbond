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
    name: 'findTests',

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'defaultConfigFindTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            find: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {find: true}
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.find.idParameter
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
                url: '/find',
                method: 'HEAD',
                headers: {
                  'x-pong': ejson.stringify({
                    find: [
                      {[context.global.idParameter]: '0', foo: 'bar'},
                      {[context.global.idParameter]: '1', bar: 'baz'},
                      {[context.global.idParameter]: '2', baz: 'yaz'}
                    ]
                  })
                }
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
            name: 'FindReturnObjectValidationErrorTest',
            description: 'Test validation on find return value',
            reqSpec: function(context) {
              return {
                url: '/find',
                method: 'GET',
                headers: {
                  'x-pong': ejson.stringify({
                    find: {[context.global.idParameter]: '0', foo: 'bar'}
                  })
                }
              }
            },
            resSpec: {
              statusCode: 500
            }
          },
          {
            name: 'FindTest',
            description: 'Test find',
            reqSpec: function(context) {
              return {
                url: '/find',
                method: 'GET',
                headers: {
                  'x-pong': ejson.stringify({
                    find: [
                      {[context.global.idParameter]: '0', foo: 'bar'},
                      {[context.global.idParameter]: '1', bar: 'baz'},
                      {[context.global.idParameter]: '2', baz: 'yaz'}
                    ]
                  })
                }
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert(_.isNil(headers.link))
              },
              body: function(body, context) {
                assert.deepStrictEqual(body, [
                  {[context.global.idParameter]: '0', foo: 'bar'},
                  {[context.global.idParameter]: '1', bar: 'baz'},
                  {[context.global.idParameter]: '2', baz: 'yaz'}
                ])
              }
            }
          },
          {
            name: 'FindIdQueryTest',
            description: 'Test find with id query',
            setup: function() {
              this.findSpy = sinon.spy(this.parent.service.endpoints.find, 'find')
            },
            teardown: function(context) {
              try {
                assert(this.findSpy.called)
                assert.deepEqual(
                  this.findSpy.firstCall.args[0][context.global.idParameter],
                  ['0', '1', '2'])
              } finally {
                this.findSpy.restore()
              }
            },
            reqSpec: function(context) {
              return {
                url: '/find',
                method: 'GET',
                parameters: {
                  [context.global.idParameter]: ['0', '1', '2']
                },
                headers: {
                  'x-pong': ejson.stringify({
                    find: [
                      {[context.global.idParameter]: '0', foo: 'bar'},
                      {[context.global.idParameter]: '1', bar: 'baz'},
                      {[context.global.idParameter]: '2', baz: 'yaz'}
                    ]
                  })
                }
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert(_.isNil(headers.link))
              },
              body: function(body, context) {
                assert.deepStrictEqual(body, [
                  {[context.global.idParameter]: '0', foo: 'bar'},
                  {[context.global.idParameter]: '1', bar: 'baz'},
                  {[context.global.idParameter]: '2', baz: 'yaz'}
                ])
              }
            }
          },
          {
            name: 'FindPageSkipAndLimitParametersIgnoredTest',
            description: 'Test find',
            setup: function() {
              this.findSpy = sinon.spy(this.parent.service.endpoints.find, 'find')
            },
            teardown: function() {
              try {
                assert.equal(
                  _.intersection(
                    ['skip', 'limit', 'page'],
                    _.keys(this.findSpy.firstCall.args[0])).length, 0)
              } finally {
                this.findSpy.restore()
              }
            },
            reqSpec: function(context) {
              return {
                url: '/find',
                method: 'GET',
                parameters: {
                  skip: 6,
                  limit: 6,
                  page: 6
                },
                headers: {
                  'x-pong': ejson.stringify({
                    find: [{[context.global.idParameter]: '0', foo: 'bar'}]
                  })
                }
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert(_.isNil(headers.link))
              },
              body: function(body, context) {
                assert.deepStrictEqual(body, [{[context.global.idParameter]: '0', foo: 'bar'}])
              }
            }
          },
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'noIdQueryConfigFindTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            find: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {find: true},
              findConfig: {
                supportsIdQuery: false
              }
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.find.idParameter
        },
        teardown: function(context) {
          delete context.global.idParameter
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'idQueryIgnoredTest',
            description: 'Test that the id query parameter is ignored',
            setup: function() {
              this.findSpy = sinon.spy(this.parent.service.endpoints.find, 'find')
            },
            teardown: function(context) {
              try {
                assert(!(context.global.idParameter in this.findSpy.firstCall.args[0]))
              } finally {
                this.findSpy.restore()
              }
            },
            reqSpec: function(context) {
              return {
                url: '/find',
                method: 'GET',
                parameters: {
                  [context.global.idParameter]: 0
                },
                headers: {
                  'x-pong': ejson.stringify({
                    find: []
                  })
                }
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert(_.isNil(headers.link))
              },
              body: function(body, context) {
                assert.deepStrictEqual(body, [])
              }
            }
          }
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'skipAndLimitConfigFindTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            find: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {find: true},
              findConfig: {
                supportsSkipAndLimit: true
              }
            })
          }
        }),
        tests: [
          {
            name: 'skipAndLimitTest',
            description: 'Test that skip and limit parameters are honored',
            setup: function() {
              this.findSpy = sinon.spy(this.parent.service.endpoints.find, 'find')
            },
            teardown: function(context) {
              try {
                assert.equal(
                  _.intersection(
                    ['skip', 'limit'],
                    _.keys(this.findSpy.firstCall.args[0])).length, 2)
              } finally {
                this.findSpy.restore()
              }
            },
            reqSpec: function(context) {
              return {
                url: '/find',
                method: 'GET',
                parameters: {
                  skip: 1,
                  limit: 1
                },
                headers: {
                  'x-pong': ejson.stringify({
                    find: []
                  })
                }
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert(_.isNil(headers.link))
              },
              body: function(body, context) {
                assert.deepStrictEqual(body, [])
              }
            }
          },
          {
            name: 'pageNotHonoredTest',
            description: 'Test that page parameter is not honored',
            setup: function() {
              this.preFindOperationSpy = sinon.spy(this.parent.service.endpoints.find, 'preFindOperation')
              this.findSpy = sinon.spy(this.parent.service.endpoints.find, 'find')
            },
            teardown: function(context) {
              try {
                assert(!('page' in this.preFindOperationSpy.firstCall.args[1].parameters))
                assert.equal(
                  _.intersection(
                    ['page', 'skip', 'limit'],
                    _.keys(this.findSpy.firstCall.args[0])).length, 2)
                assert.equal(this.findSpy.firstCall.args[0].skip, 6)
                assert.equal(this.findSpy.firstCall.args[0].limit, 6)
              } finally {
                this.findSpy.restore()
                this.preFindOperationSpy.restore()
              }
            },
            reqSpec: function(context) {
              return {
                url: '/find',
                method: 'GET',
                parameters: {
                  page: 6,
                  skip: 6,
                  limit: 6,
                },
                headers: {
                  'x-pong': ejson.stringify({
                    find: []
                  })
                }
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert(_.isNil(headers.link))
              },
              body: function(body, context) {
                assert.deepStrictEqual(body, [])
              }
            }
          }
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'pageConfigFindTests',
        service: o({
          _type: pong.Service,
          endpoints: {
            find: o({
              _type: pong.Collection,
              idGenerator: pong.util.collectionIdGenerator,
              enabled: {find: true},
              findConfig: {
                supportsPagination: true,
                pageSize: 2,
                maxPageSize: 10
              }
            })
          }
        }),
        setup: function(context) {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          context.global.idParameter = this.service.endpoints.find.idParameter
        },
        teardown: function(context) {
          delete context.global.idParameter
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            name: 'basicPaginationTest',
            description: 'Test basic pagination',
            setup: function() {
              this.preFindOperationSpy = sinon.spy(this.parent.service.endpoints.find, 'preFindOperation')
              this.findSpy = sinon.spy(this.parent.service.endpoints.find, 'find')
            },
            teardown: function(context) {
              try {
                assert.equal(this.preFindOperationSpy.firstCall.args[1].parameters.page, 3)
                // NOTE: this is expected to be 2 since page is removed from the context and
                //       passed in terms of skip and limit instead
                assert.equal(
                  _.intersection(
                    ['page', 'skip', 'limit'],
                    _.keys(this.findSpy.firstCall.args[0])).length, 2)
                assert.equal(this.findSpy.firstCall.args[0].skip, 6)
                assert.equal(this.findSpy.firstCall.args[0].limit, 2)
              } finally {
                this.findSpy.restore()
                this.preFindOperationSpy.restore()
              }
            },
            reqSpec: function(context) {
              return {
                url: '/find',
                method: 'GET',
                parameters: {
                  page: 3
                },
                headers: {
                  'x-pong': ejson.stringify({
                    find: [
                      {[context.global.idParameter]: '6', foo: 'bar'},
                      {[context.global.idParameter]: '7', bar: 'baz'}
                    ]
                  })
                }
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert.equal(
                  headers.link,
                  '<http://localhost:8888/find?page=2>; rel="prev", <http://localhost:8888/find?page=4>; rel="next"')
              },
              body: function(body, context) {
                assert.deepStrictEqual(body, [
                  {[context.global.idParameter]: '6', foo: 'bar'},
                  {[context.global.idParameter]: '7', bar: 'baz'}
                ])
              }
            }
          },
          {
            name: 'noPrevLinkPaginationTest',
            description: 'Test absence of prev link on first page',
            setup: function() {
              this.preFindOperationSpy = sinon.spy(this.parent.service.endpoints.find, 'preFindOperation')
              this.findSpy = sinon.spy(this.parent.service.endpoints.find, 'find')
            },
            teardown: function(context) {
              try {
                assert.equal(this.preFindOperationSpy.firstCall.args[1].parameters.page, 0)
                assert.equal(
                  _.intersection(
                    ['page', 'skip', 'limit'],
                    _.keys(this.findSpy.firstCall.args[0])).length, 2)
              } finally {
                this.findSpy.restore()
                this.preFindOperationSpy.restore()
              }
            },
            reqSpec: function(context) {
              return {
                url: '/find',
                method: 'GET',
                headers: {
                  'x-pong': ejson.stringify({
                    find: [
                      {[context.global.idParameter]: '0', foo: 'bar'},
                      {[context.global.idParameter]: '1', bar: 'baz'}
                    ]
                  })
                }
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert.equal(
                  headers.link,
                  '<http://localhost:8888/find?page=1>; rel="next"')
              },
              body: function(body, context) {
                assert.deepStrictEqual(body, [
                  {[context.global.idParameter]: '0', foo: 'bar'},
                  {[context.global.idParameter]: '1', bar: 'baz'}
                ])
              }
            }
          },
          {
            name: 'noNextLinkPaginationTest',
            description: 'Test absence of next link on last page',
            setup: function() {
              this.preFindOperationSpy = sinon.spy(this.parent.service.endpoints.find, 'preFindOperation')
              this.findSpy = sinon.spy(this.parent.service.endpoints.find, 'find')
            },
            teardown: function(context) {
              try {
                assert.equal(this.preFindOperationSpy.firstCall.args[1].parameters.page, 2)
                assert.equal(
                  _.intersection(
                    ['page', 'skip', 'limit'],
                    _.keys(this.findSpy.firstCall.args[0])).length, 2)
              } finally {
                this.findSpy.restore()
                this.preFindOperationSpy.restore()
              }
            },
            reqSpec: function(context) {
              return {
                url: '/find',
                method: 'GET',
                parameters: {
                  page: 2
                },
                headers: {
                  'x-pong': ejson.stringify({
                    find: [
                      {[context.global.idParameter]: '4', foo: 'bar'}
                    ]
                  })
                }
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert.equal(
                  headers.link,
                  '<http://localhost:8888/find?page=1>; rel="prev"')
              },
              body: function(body, context) {
                assert.deepStrictEqual(body, [
                  {[context.global.idParameter]: '4', foo: 'bar'},
                ])
              }
            }
          },
          {
            name: 'noNextLinkPaginationTest',
            description: 'Test absence of next link on last page',
            setup: function() {
              this.preFindOperationSpy = sinon.spy(this.parent.service.endpoints.find, 'preFindOperation')
              this.findSpy = sinon.spy(this.parent.service.endpoints.find, 'find')
            },
            teardown: function(context) {
              try {
                assert.equal(this.preFindOperationSpy.firstCall.args[1].parameters.page, 2)
                assert.equal(
                  _.intersection(
                    ['page', 'skip', 'limit'],
                    _.keys(this.findSpy.firstCall.args[0])).length, 2)
              } finally {
                this.findSpy.restore()
                this.preFindOperationSpy.restore()
              }
            },
            reqSpec: function(context) {
              return {
                url: '/find',
                method: 'GET',
                parameters: {
                  page: 2
                },
                headers: {
                  'x-pong': ejson.stringify({
                    find: [
                      {[context.global.idParameter]: '4', foo: 'bar'}
                    ]
                  })
                }
              }
            },
            resSpec: {
              statusCode: 200,
              headers: function(headers) {
                assert.equal(
                  headers.link,
                  '<http://localhost:8888/find?page=1>; rel="prev"')
              },
              body: function(body, context) {
                assert.deepStrictEqual(body, [
                  {[context.global.idParameter]: '4', foo: 'bar'},
                ])
              }
            }
          },
        ]
      }),
    ]
  })
})


