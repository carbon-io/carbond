var assert = require('assert')
var path = require('path')

var _ = require('lodash')

var core = require('@carbon-io/carbon-core')

var __ = core.fibers.__(module)
var _o = core.bond._o(module)
var o = core.atom.o(module)
var testtube = core.testtube

var carbond = require('../../../..')

__(function() {
  module.exports = o.main({
    _type: testtube.Test,
    name: 'SimpleAuthorizationTests',
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'EndpointACLTests',
        service: _o(
          '../../standalone-examples/ServiceSimpleAuthorizationExample').Service1,
        _mongoFixtures: {
          db: path.join(path.dirname(module.filename), 
                        '..', 
                        'fixtures', 
                        'SimpleAuthorizationDB.json')
        },
        tests: [
          // -- role:Admin
          {
            reqSpec: {
              method: 'GET',
              url: '/hello',
              headers: {
                API_KEY: 'a'
              }
            },
            resSpec: {
              statusCode: 200,
              body: {
                msg: 'Hello World!'
              }
            }
          },
          {
            reqSpec: {
              method: 'POST',
              url: '/hello',
              headers: {
                API_KEY: 'a'
              },
              body: {
                hello: 'world'
              }
            },
            resSpec: {
              statusCode: 200,
              body: {
                msg: 'Hello World! {"hello":"world"}'
              }
            }
          },
          // -- title:CFO
          {
            reqSpec: {
              method: 'GET',
              url: '/hello',
              headers: {
                API_KEY: 'b'
              }
            },
            resSpec: {
              statusCode: 200,
              body: {
                msg: 'Hello World!'
              }
            }
          },
          {
            reqSpec: {
              method: 'POST',
              url: '/hello',
              headers: {
                API_KEY: 'b'
              },
              body: {
                hello: 'world'
              }
            },
            resSpec: {
              statusCode: 200,
              body: {
                msg: 'Hello World! {"hello":"world"}'
              }
            }
          },
          // -- user:10002 
          {
            reqSpec: {
              method: 'GET',
              url: '/hello',
              headers: {
                API_KEY: 'c'
              }
            },
            resSpec: {
              statusCode: 403
            }
          },
          {
            reqSpec: {
              method: 'POST',
              url: '/hello',
              headers: {
                API_KEY: 'c'
              },
              body: {
                readdown: 'writeup'
              }
            },
            resSpec: {
              statusCode: 200,
              body: {
                msg: 'Hello World! {"readdown":"writeup"}'
              }
            }
          },
          // -- *
          {
            reqSpec: {
              method: 'GET',
              url: '/hello',
              headers: {
                API_KEY: 'd'
              }
            },
            resSpec: {
              statusCode: 200,
              body: {
                msg: 'Hello World!'
              }
            }
          },
          {
            reqSpec: {
              method: 'POST',
              url: '/hello',
              headers: {
                API_KEY: 'd'
              },
              body: {
                boo: 'hoo'
              }
            },
            resSpec: {
              statusCode: 403
            }
          }
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'CollectionACLTests',
        setup: function() {
          throw new testtube.errors.SkipTestError('re-enable when collections are finished')
        },
        service: _o(
          '../../standalone-examples/ServiceSimpleAuthorizationExample').Service2,
        _mongoFixtures: {
          db: path.join(path.dirname(module.filename), 
                        '..', 
                        'fixtures', 
                        'SimpleAuthorizationDB.json')
        },
        tests: [
          // -- role:Admin
          {
            reqSpec: {
              method: 'GET',
              url: '/hello',
              headers: {
                API_KEY: 'a'
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(val) {
                assert(_.isArray(val))
                assert.equal(val.length, 1)
                assert.equal(val[0].msg, 'foo')
              }
            }
          },
          {
            reqSpec: {
              method: 'POST',
              url: '/hello',
              headers: {
                API_KEY: 'a'
              },
              body: {
                msg: 'bar'
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(val) {
                assert('carbonio-id' in val)
                assert(core.ejson.isObjectId(
                  core.ejson.parse(val['carbonio-id'])))
              },
              body: null
            }
          },
          // -- title:CFO
          {
            reqSpec: {
              method: 'GET',
              url: '/hello',
              headers: {
                API_KEY: 'b'
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(val) {
                assert(_.isArray(val))
                assert.equal(val.length, 2)
                assert.deepEqual(_.intersection(
                  ['foo', 'bar'], _.map(val, function(val) {return val['msg']})),
                  ['foo', 'bar'])
              }
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/hello/000000000000000000000000',
              headers: {
                API_KEY: 'b'
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(val) {
                assert(_.isObject(val))
                assert.equal(val.msg, 'foo')
              }
            }
          },
          {
            reqSpec: {
              method: 'POST',
              url: '/hello',
              headers: {
                API_KEY: 'b'
              },
              body: {
                msg: 'bar'
              }
            },
            resSpec: {
              statusCode: 403
            }
          },
          // -- user:10002 
          {
            reqSpec: {
              method: 'GET',
              url: '/hello',
              headers: {
                API_KEY: 'c'
              }
            },
            resSpec: {
              statusCode: 403
            }
          },
          {
            reqSpec: {
              method: 'POST',
              url: '/hello',
              headers: {
                API_KEY: 'c'
              },
              body: {
                msg: 'baz'
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(val) {
                assert('carbonio-id' in val)
                assert(core.ejson.isObjectId(
                  core.ejson.parse(val['carbonio-id'])))
              },
              body: null
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/hello/000000000000000000000000',
              headers: {
                API_KEY: 'c'
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(val) {
                assert(_.isObject(val))
                assert.equal(val.msg, 'foo')
              }
            }
          },
          // -- *
          {
            reqSpec: {
              method: 'GET',
              url: '/hello',
              headers: {
                API_KEY: 'd'
              }
            },
            resSpec: {
              statusCode: 403
            }
          },
          {
            reqSpec: {
              method: 'POST',
              url: '/hello',
              headers: {
                API_KEY: 'd'
              },
              body: {
                boo: 'hoo'
              }
            },
            resSpec: {
              statusCode: 403
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/hello/000000000000000000000000',
              headers: {
                API_KEY: 'd'
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(val) {
                assert(_.isObject(val))
                assert.equal(val.msg, 'foo')
              }
            }
          },
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'ExternalACLTests',
        setup: function() {
          throw new testtube.errors.SkipTestError('re-enable when collections are finished')
        },
        service: _o(
          '../../standalone-examples/ServiceExternalACLExample'),
        _mongoFixtures: {
          db: path.join(path.dirname(module.filename), 
                        '..', 
                        'fixtures', 
                        'SimpleAuthorizationDB.json')
        },
        tests: [
          // -- role:Admin
          {
            reqSpec: {
              method: 'GET',
              url: '/hello',
              headers: {
                API_KEY: 'a'
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(val) {
                assert(_.isArray(val))
                assert.equal(val.length, 1)
                assert.equal(val[0].msg, 'foo')
              }
            }
          },
          {
            reqSpec: {
              method: 'POST',
              url: '/hello',
              headers: {
                API_KEY: 'a'
              },
              body: {
                msg: 'bar'
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(val) {
                assert('carbonio-id' in val)
                assert(core.ejson.isObjectId(
                  core.ejson.parse(val['carbonio-id'])))
              },
              body: null
            }
          },
          // -- title:CFO
          {
            reqSpec: {
              method: 'GET',
              url: '/hello',
              headers: {
                API_KEY: 'b'
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(val) {
                assert(_.isArray(val))
                assert.equal(val.length, 2)
                assert.deepEqual(_.intersection(
                  ['foo', 'bar'], _.map(val, function(val) {return val['msg']})),
                  ['foo', 'bar'])
              }
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/hello/000000000000000000000000',
              headers: {
                API_KEY: 'b'
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(val) {
                assert(_.isObject(val))
                assert.equal(val.msg, 'foo')
              }
            }
          },
          {
            reqSpec: {
              method: 'POST',
              url: '/hello',
              headers: {
                API_KEY: 'b'
              },
              body: {
                msg: 'bar'
              }
            },
            resSpec: {
              statusCode: 403
            }
          },
          // -- user:10002 
          {
            reqSpec: {
              method: 'GET',
              url: '/hello',
              headers: {
                API_KEY: 'c'
              }
            },
            resSpec: {
              statusCode: 403
            }
          },
          {
            reqSpec: {
              method: 'POST',
              url: '/hello',
              headers: {
                API_KEY: 'c'
              },
              body: {
                msg: 'baz'
              }
            },
            resSpec: {
              statusCode: 201,
              headers: function(val) {
                assert('carbonio-id' in val)
                assert(core.ejson.isObjectId(
                  core.ejson.parse(val['carbonio-id'])))
              },
              body: null
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/hello/000000000000000000000000',
              headers: {
                API_KEY: 'c'
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(val) {
                assert(_.isObject(val))
                assert.equal(val.msg, 'foo')
              }
            }
          },
          // -- *
          {
            reqSpec: {
              method: 'GET',
              url: '/hello',
              headers: {
                API_KEY: 'd'
              }
            },
            resSpec: {
              statusCode: 403
            }
          },
          {
            reqSpec: {
              method: 'POST',
              url: '/hello',
              headers: {
                API_KEY: 'd'
              },
              body: {
                boo: 'hoo'
              }
            },
            resSpec: {
              statusCode: 403
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/hello/000000000000000000000000',
              headers: {
                API_KEY: 'd'
              }
            },
            resSpec: {
              statusCode: 200,
              body: function(val) {
                assert(_.isObject(val))
                assert.equal(val.msg, 'foo')
              }
            }
          },
        ]
      })
    ]
  })
})


