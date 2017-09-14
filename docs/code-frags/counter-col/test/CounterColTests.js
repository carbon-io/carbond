var assert = require('assert')
var path = require('path')

var carbon = require('carbon-io')

var __ = carbon.fibers.__(module)
var _o = carbon.bond._o(module)
var carbond = carbon.carbond
var ejson = carbon.ejson
var o = carbon.atom.o(module)
var testtube = carbon.testtube

var ObjectId = ejson.types.ObjectId

__(function() {
  module.exports = o.main({
    _type: carbon.testtube.Test,
    name: 'CounterColTests',
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'MemCacheCounterAdvancedTests',
        description: 'MemCacheCounter advanced tests.',
        service: _o('../lib/CounterCol'),
        tests: [
          {
            reqSpec: {
              method: 'POST',
              url: '/memCacheCounterAdvanced',
              body: [
                {
                  name: 'foo',
                  count: 0
                },
                {
                  name: 'bar',
                  count: 0
                }
              ]
            },
            resSpec: {
              statusCode: 201,
              body: [
                {
                  _id: 0,
                  name: 'foo',
                  count: 0
                },
                {
                  _id: 1,
                  name: 'bar',
                  count: 0
                }
              ]
            }
          },
          {
            reqSpec: {
              method: 'POST',
              url: '/memCacheCounterAdvanced',
              body: {
                name: 'baz',
                count: 0
              }
            },
            resSpec: {
              statusCode: 201,
              body: {
                _id: 2,
                name: 'baz',
                count: 0
              }
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/memCacheCounterAdvanced'
            },
            resSpec: {
              statusCode: 200,
              body: [
                {
                  _id: 0,
                  name: 'foo',
                  count: 0
                },
                {
                  _id: 1,
                  name: 'bar',
                  count: 0
                },
                {
                  _id: 2,
                  name: 'baz',
                  count: 0
                }
              ]
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/memCacheCounterAdvanced',
              parameters: {
                skip: 1,
                limit: 1
              }
            },
            resSpec: {
              statusCode: 200,
              body: [
                {
                  _id: 1,
                  name: 'bar',
                  count: 0
                }
              ]
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/memCacheCounterAdvanced/1'
            },
            resSpec: {
              statusCode: 200,
              body: {
                _id: 1,
                name: 'bar',
                count: 0
              }
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/memCacheCounterAdvanced/3'
            },
            resSpec: {
              statusCode: 404,
            }
          },
          {
            reqSpec: {
              method: 'PUT',
              url: '/memCacheCounterAdvanced',
              body: [
                {
                  _id: 0,
                  name: 'foo',
                  count: 10
                }
              ]
            },
            resSpec: {
              statusCode: 200,
              body: [
                {
                  _id: 0,
                  name: 'foo',
                  count: 10
                }
              ]
            }
          },
          {
            reqSpec: {
              method: 'PUT',
              url: '/memCacheCounterAdvanced/1',
              body: {
                _id: 1,
                name: 'bar',
                count: 4
              }
            },
            resSpec: {
              statusCode: 201,
              body: {
                _id: 1,
                name: 'bar',
                count: 4
              }
            }
          },
          {
            setup: function() {
              this.parent.service.endpoints.memCacheCounterAdvanced.cache = {
                0: {_id: 0, name: 'foo', count: 0},
                1: {_id: 1, name: 'bar', count: 0},
                2: {_id: 2, name: 'baz', count: 0},
              }
            },
            teardown: function() {
              var cache = this.parent.service.endpoints.memCacheCounterAdvanced.cache
              for (var id in cache) {
                assert.equal(cache[id].count, 1)
              }
            },
            reqSpec: {
              method: 'PATCH',
              url: '/memCacheCounterAdvanced',
              body: {
                $inc: 1
              }
            },
            resSpec: {
              statusCode: 200,
              body: {
                n: 3
              }
            }
          },
          {
            reqSpec: {
              method: 'PATCH',
              url: '/memCacheCounterAdvanced',
              body: {
                $inc: 1,
                $dec: 1
              }
            },
            resSpec: {
              statusCode: 400,
            }
          },
          {
            reqSpec: {
              method: 'PATCH',
              url: '/memCacheCounterAdvanced/1',
              body: {
                $inc: 1
              }
            },
            resSpec: {
              statusCode: 200,
              body: {
                n: 1
              }
            }
          },
          {
            reqSpec: {
              method: 'PATCH',
              url: '/memCacheCounterAdvanced/666',
              body: {
                $inc: 1
              }
            },
            resSpec: {
              statusCode: 404,
            }
          },
          {
            reqSpec: {
              method: 'DELETE',
              url: '/memCacheCounterAdvanced',
            },
            resSpec: {
              statusCode: 200,
              body: [
                {_id: 0, name: 'foo', count: 1},
                {_id: 1, name: 'bar', count: 2},
                {_id: 2, name: 'baz', count: 1},
              ]
            }
          },
          {
            setup: function() {
              this.parent.service.endpoints.memCacheCounterAdvanced.cache = {
                0: {_id: 0, name: 'foo', count: 0},
                1: {_id: 1, name: 'bar', count: 0},
                2: {_id: 2, name: 'baz', count: 0},
              }
            },
            teardown: function() {
              assert.equal(Object.keys(this.parent.service.endpoints.memCacheCounterAdvanced.cache).length, 0)
            },
            reqSpec: {
              method: 'DELETE',
              url: '/memCacheCounterAdvanced',
            },
            resSpec: {
              statusCode: 200,
              body: [
                {_id: 0, name: 'foo', count: 0},
                {_id: 1, name: 'bar', count: 0},
                {_id: 2, name: 'baz', count: 0},
              ]
            }
          },
          {
            setup: function() {
              this.parent.service.endpoints.memCacheCounterAdvanced.cache = {
                0: {_id: 0, name: 'foo', count: 0},
                1: {_id: 1, name: 'bar', count: 0},
                2: {_id: 2, name: 'baz', count: 0},
              }
            },
            teardown: function() {
              assert.equal(Object.keys(this.parent.service.endpoints.memCacheCounterAdvanced.cache).length, 2)
              assert(!('0' in this.parent.service.endpoints.memCacheCounterAdvanced.cache))
            },
            reqSpec: {
              method: 'DELETE',
              url: '/memCacheCounterAdvanced/0',
            },
            resSpec: {
              statusCode: 200,
              body: {
                n: 1
              }
            }
          },
          {
            reqSpec: {
              method: 'DELETE',
              url: '/memCacheCounterAdvanced/666',
            },
            resSpec: {
              statusCode: 404,
            }
          },
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'MemCacheCounterBasicTests',
        description: 'MemCacheCounter basic tests.',
        service: _o('../lib/CounterCol'),
        tests: [
          {
            reqSpec: {
              method: 'POST',
              url: '/memCacheCounterBasic',
              body: [
                {
                  name: 'foo',
                  count: 0
                },
                {
                  name: 'bar',
                  count: 0
                }
              ]
            },
            resSpec: {
              statusCode: 201,
              body: [
                {
                  _id: '0',
                  name: 'foo',
                  count: 0
                },
                {
                  _id: '1',
                  name: 'bar',
                  count: 0
                }
              ]
            }
          },
          {
            reqSpec: {
              method: 'POST',
              url: '/memCacheCounterBasic',
              body: {
                name: 'baz',
                count: 0
              },
            },
            resSpec: {
              statusCode: 201,
              body: {
                _id: '2',
                name: 'baz',
                count: 0
              },
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/memCacheCounterBasic'
            },
            resSpec: {
              statusCode: 200,
              body: [
                {
                  _id: '0',
                  name: 'foo',
                  count: 0
                },
                {
                  _id: '1',
                  name: 'bar',
                  count: 0
                },
                {
                  _id: '2',
                  name: 'baz',
                  count: 0
                }
              ]
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/memCacheCounterBasic/0'
            },
            resSpec: {
              statusCode: 200,
              body: {
                _id: '0',
                name: 'foo',
                count: 0
              }
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/memCacheCounterBasic/666'
            },
            resSpec: {
              statusCode: 404
            }
          },
          {
            reqSpec: {
              method: 'PUT',
              url: '/memCacheCounterBasic',
              body: [
                {
                  _id: '0',
                  name: 'foo',
                  count: 1
                },
                {
                  _id: '1',
                  name: 'bar',
                  count: 1
                },
                {
                  _id: '2',
                  name: 'baz',
                  count: 1
                }
              ]
            },
            resSpec: {
              statusCode: 200,
              body: [
                {
                  _id: '0',
                  name: 'foo',
                  count: 1
                },
                {
                  _id: '1',
                  name: 'bar',
                  count: 1
                },
                {
                  _id: '2',
                  name: 'baz',
                  count: 1
                }
              ]
            }
          },
          {
            reqSpec: {
              method: 'PUT',
              url: '/memCacheCounterBasic/666',
              body: {
                _id: '2',
                name: 'yaz',
                count: 1
              }
            },
            resSpec: {
              statusCode: 400,
            }
          },
          {
            teardown: function() {
              assert.equal(this.parent.service.endpoints.memCacheCounterBasic.cache['2'].name, 'yaz')
            },
            reqSpec: {
              method: 'PUT',
              url: '/memCacheCounterBasic/2',
              body: {
                _id: '2',
                name: 'yaz',
                count: 1
              }
            },
            resSpec: {
              statusCode: 200,
              body: {
                _id: '2',
                name: 'yaz',
                count: 1
              }
            }
          },
          {
            reqSpec: {
              method: 'PATCH',
              url: '/memCacheCounterBasic',
              body: {n: 1}
            },
            resSpec: {
              statusCode: 200,
              body: {
                n: 3
              }
            }
          },
          {
            reqSpec: {
              method: 'PATCH',
              url: '/memCacheCounterBasic/1',
              body: {n: 1}
            },
            resSpec: {
              statusCode: 200,
              body: {
                n: 1
              }
            }
          },
          {
            reqSpec: {
              method: 'DELETE',
              url: '/memCacheCounterBasic'
            },
            resSpec: {
              statusCode: 200,
              body: {
                n: 3
              }
            }
          },
          {
            setup: function() {
              this.parent.service.endpoints.memCacheCounterBasic.cache = {
                0: {_id: 0, name: 'foo', count: 0},
                1: {_id: 1, name: 'bar', count: 0},
                2: {_id: 2, name: 'baz', count: 0},
              }
            },
            teardown: function() {
              assert.equal(Object.keys(this.parent.service.endpoints.memCacheCounterBasic.cache).length, 2)
              assert(!('1' in this.parent.service.endpoints.memCacheCounterBasic.cache))
            },
            reqSpec: {
              method: 'DELETE',
              url: '/memCacheCounterBasic/1'
            },
            resSpec: {
              statusCode: 200,
              body: {
                n: 1
              }
            }
          },
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'MongoCounterBasicTests',
        description: 'MongoCounter basic tests.',
        service: _o('../lib/CounterCol'),
        setup: function() {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          this.collection = this.service.db.getCollection('mongo-counter')
          this.collection.deleteMany()
        },
        teardown: function() {
          this.collection.deleteMany()
          carbond.test.ServiceTest.prototype.teardown.apply(this, arguments)
        },
        tests: [
          {
            reqSpec: {
              method: 'POST',
              url: '/mongoCounterBasic',
              body: [
                {
                  name: 'foo',
                  count: 0
                },
                {
                  name: 'bar',
                  count: 0
                }
              ]
            },
            resSpec: {
              statusCode: 201,
              body: [
                {
                  _id: ObjectId('000000000000000000000000'),
                  name: 'foo',
                  count: 0
                },
                {
                  _id: ObjectId('000000000000000000000001'),
                  name: 'bar',
                  count: 0
                }
              ]
            }
          },
          {
            reqSpec: {
              method: 'POST',
              url: '/mongoCounterBasic',
              body: {
                name: 'baz',
                count: 0
              },
            },
            resSpec: {
              statusCode: 201,
              body: {
                _id: ObjectId('000000000000000000000002'),
                name: 'baz',
                count: 0
              },
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/mongoCounterBasic'
            },
            resSpec: {
              statusCode: 200,
              body: [
                {
                  _id: ObjectId('000000000000000000000000'),
                  name: 'foo',
                  count: 0
                },
                {
                  _id: ObjectId('000000000000000000000001'),
                  name: 'bar',
                  count: 0
                },
                {
                  _id: ObjectId('000000000000000000000002'),
                  name: 'baz',
                  count: 0
                }
              ]
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/mongoCounterBasic/000000000000000000000000'
            },
            resSpec: {
              statusCode: 200,
              body: {
                _id: ObjectId('000000000000000000000000'),
                name: 'foo',
                count: 0
              }
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/mongoCounterBasic/000000000000000000000666'
            },
            resSpec: {
              statusCode: 404
            }
          },
          {
            reqSpec: {
              method: 'PUT',
              url: '/mongoCounterBasic',
              body: [
                {
                  _id: ObjectId('000000000000000000000000'),
                  name: 'foo',
                  count: 1
                },
                {
                  _id: ObjectId('000000000000000000000001'),
                  name: 'bar',
                  count: 1
                },
                {
                  _id: ObjectId('000000000000000000000002'),
                  name: 'baz',
                  count: 1
                }
              ]
            },
            resSpec: {
              statusCode: 200,
              body: [
                {
                  _id: ObjectId('000000000000000000000000'),
                  name: 'foo',
                  count: 1
                },
                {
                  _id: ObjectId('000000000000000000000001'),
                  name: 'bar',
                  count: 1
                },
                {
                  _id: ObjectId('000000000000000000000002'),
                  name: 'baz',
                  count: 1
                }
              ]
            }
          },
          {
            reqSpec: {
              method: 'PUT',
              url: '/mongoCounterBasic/000000000000000000000666',
              body: {
                _id: ObjectId('000000000000000000000002'),
                name: 'yaz',
                count: 1
              }
            },
            resSpec: {
              statusCode: 400,
            }
          },
          {
            teardown: function() {
              assert.equal(
                this.parent.collection.findOne({_id: ObjectId('000000000000000000000002')}).name,
                'yaz')
            },
            reqSpec: {
              method: 'PUT',
              url: '/mongoCounterBasic/000000000000000000000002',
              body: {
                _id: ObjectId('000000000000000000000002'),
                name: 'yaz',
                count: 1
              }
            },
            resSpec: {
              statusCode: 200,
              body: {
                _id: ObjectId('000000000000000000000002'),
                name: 'yaz',
                count: 1
              }
            }
          },
          {
            reqSpec: {
              method: 'PATCH',
              url: '/mongoCounterBasic',
              body: {n: 1}
            },
            resSpec: {
              statusCode: 200,
              body: {
                n: 3
              }
            }
          },
          {
            reqSpec: {
              method: 'PATCH',
              url: '/mongoCounterBasic/000000000000000000000001',
              body: {n: 1}
            },
            resSpec: {
              statusCode: 200,
              body: {
                n: 1
              }
            }
          },
          {
            reqSpec: {
              method: 'DELETE',
              url: '/mongoCounterBasic'
            },
            resSpec: {
              statusCode: 200,
              body: {
                n: 3
              }
            }
          },
          {
            setup: function() {
              this.parent.collection.deleteMany()
              this.parent.collection.insertMany([
                {_id: ObjectId('000000000000000000000000'), name: 'foo', count: 0},
                {_id: ObjectId('000000000000000000000001'), name: 'bar', count: 0},
                {_id: ObjectId('000000000000000000000002'), name: 'baz', count: 0},
              ])
            },
            teardown: function() {
              assert.equal(this.parent.collection.find().count(), 2)
              assert.equal(this.parent.collection.findOne({_id: ObjectId('000000000000000000000001')}), null)
            },
            reqSpec: {
              method: 'DELETE',
              url: '/mongoCounterBasic/000000000000000000000001'
            },
            resSpec: {
              statusCode: 200,
              body: {
                n: 1
              }
            }
          },
        ]
      })
    ]
  })
})

