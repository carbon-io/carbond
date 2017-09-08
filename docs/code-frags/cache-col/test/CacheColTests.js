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
    name: 'CacheColTests',
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'MemCacheAdvancedTests',
        description: 'MemCache advanced tests.',
        service: _o('../lib/CacheCol'),
        tests: [
          {
            reqSpec: {
              method: 'POST',
              url: '/memCacheAdvanced',
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
              url: '/memCacheAdvanced',
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
              url: '/memCacheAdvanced'
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
              url: '/memCacheAdvanced',
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
              url: '/memCacheAdvanced/1'
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
              url: '/memCacheAdvanced/3'
            },
            resSpec: {
              statusCode: 404,
            }
          },
          {
            reqSpec: {
              method: 'PUT',
              url: '/memCacheAdvanced',
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
              url: '/memCacheAdvanced/1',
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
              this.parent.service.endpoints.memCacheAdvanced.cache = {
                0: {_id: 0, name: 'foo', count: 0},
                1: {_id: 1, name: 'bar', count: 0},
                2: {_id: 2, name: 'baz', count: 0},
              }
            },
            teardown: function() {
              var cache = this.parent.service.endpoints.memCacheAdvanced.cache
              for (var id in cache) {
                assert.equal(cache[id].count, 1)
              }
            },
            reqSpec: {
              method: 'PATCH',
              url: '/memCacheAdvanced',
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
              url: '/memCacheAdvanced',
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
              url: '/memCacheAdvanced/1',
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
              url: '/memCacheAdvanced/666',
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
              url: '/memCacheAdvanced',
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
              this.parent.service.endpoints.memCacheAdvanced.cache = {
                0: {_id: 0, name: 'foo', count: 0},
                1: {_id: 1, name: 'bar', count: 0},
                2: {_id: 2, name: 'baz', count: 0},
              }
            },
            teardown: function() {
              assert.equal(Object.keys(this.parent.service.endpoints.memCacheAdvanced.cache).length, 0)
            },
            reqSpec: {
              method: 'DELETE',
              url: '/memCacheAdvanced',
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
              this.parent.service.endpoints.memCacheAdvanced.cache = {
                0: {_id: 0, name: 'foo', count: 0},
                1: {_id: 1, name: 'bar', count: 0},
                2: {_id: 2, name: 'baz', count: 0},
              }
            },
            teardown: function() {
              assert.equal(Object.keys(this.parent.service.endpoints.memCacheAdvanced.cache).length, 2)
              assert(!('0' in this.parent.service.endpoints.memCacheAdvanced.cache))
            },
            reqSpec: {
              method: 'DELETE',
              url: '/memCacheAdvanced/0',
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
              url: '/memCacheAdvanced/666',
            },
            resSpec: {
              statusCode: 404,
            }
          },
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'MemCacheBasicTests',
        description: 'MemCache basic tests.',
        service: _o('../lib/CacheCol'),
        tests: [
          {
            reqSpec: {
              method: 'POST',
              url: '/memCacheBasic',
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
              url: '/memCacheBasic',
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
              url: '/memCacheBasic'
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
              url: '/memCacheBasic/0'
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
              url: '/memCacheBasic/666'
            },
            resSpec: {
              statusCode: 404
            }
          },
          {
            reqSpec: {
              method: 'PUT',
              url: '/memCacheBasic',
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
              url: '/memCacheBasic/666',
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
              assert.equal(this.parent.service.endpoints.memCacheBasic.cache['2'].name, 'yaz')
            },
            reqSpec: {
              method: 'PUT',
              url: '/memCacheBasic/2',
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
              url: '/memCacheBasic',
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
              url: '/memCacheBasic/1',
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
              url: '/memCacheBasic'
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
              this.parent.service.endpoints.memCacheBasic.cache = {
                0: {_id: 0, name: 'foo', count: 0},
                1: {_id: 1, name: 'bar', count: 0},
                2: {_id: 2, name: 'baz', count: 0},
              }
            },
            teardown: function() {
              assert.equal(Object.keys(this.parent.service.endpoints.memCacheBasic.cache).length, 2)
              assert(!('1' in this.parent.service.endpoints.memCacheBasic.cache))
            },
            reqSpec: {
              method: 'DELETE',
              url: '/memCacheBasic/1'
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
        name: 'MongoCacheBasicTests',
        description: 'MongoCache basic tests.',
        service: _o('../lib/CacheCol'),
        setup: function() {
          carbond.test.ServiceTest.prototype.setup.apply(this, arguments)
          this.collection = this.service.db.getCollection('mongo-cache')
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
              url: '/mongoCacheBasic',
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
              url: '/mongoCacheBasic',
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
              url: '/mongoCacheBasic'
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
              url: '/mongoCacheBasic/000000000000000000000000'
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
              url: '/mongoCacheBasic/000000000000000000000666'
            },
            resSpec: {
              statusCode: 404
            }
          },
          {
            reqSpec: {
              method: 'PUT',
              url: '/mongoCacheBasic',
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
              url: '/mongoCacheBasic/000000000000000000000666',
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
              url: '/mongoCacheBasic/000000000000000000000002',
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
              url: '/mongoCacheBasic',
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
              url: '/mongoCacheBasic/000000000000000000000001',
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
              url: '/mongoCacheBasic'
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
              url: '/mongoCacheBasic/000000000000000000000001'
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

