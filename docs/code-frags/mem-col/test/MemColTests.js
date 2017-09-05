var assert = require('assert')
var path = require('path')

var carbon = require('carbon-io')

var __ = carbon.fibers.__(module)
var _o = carbon.bond._o(module)
var carbond = carbon.carbond
var ejson = carbon.ejson
var o = carbon.atom.o(module)
var testtube = carbon.testtube

__(function() {
  module.exports = o.main({
    _type: carbon.testtube.Test,
    name: 'MemColTests',
    tests: [
      o({
        _type: carbond.test.ServiceTest,
        name: 'MemColAdvancedTests',
        description: 'MemCol advanced tests.',
        service: _o('../lib/MemCol'),
        tests: [
          {
            reqSpec: {
              method: 'POST',
              url: '/scoresAdvanced',
              body: [
                {
                  name: 'foo',
                  score: 0
                },
                {
                  name: 'bar',
                  score: 0
                }
              ]
            },
            resSpec: {
              statusCode: 201,
              body: [
                {
                  _id: 0,
                  name: 'foo',
                  score: 0
                },
                {
                  _id: 1,
                  name: 'bar',
                  score: 0
                }
              ]
            }
          },
          {
            reqSpec: {
              method: 'POST',
              url: '/scoresAdvanced',
              body: {
                name: 'baz',
                score: 0
              }
            },
            resSpec: {
              statusCode: 201,
              body: {
                _id: 2,
                name: 'baz',
                score: 0
              }
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/scoresAdvanced'
            },
            resSpec: {
              statusCode: 200,
              body: [
                {
                  _id: 0,
                  name: 'foo',
                  score: 0
                },
                {
                  _id: 1,
                  name: 'bar',
                  score: 0
                },
                {
                  _id: 2,
                  name: 'baz',
                  score: 0
                }
              ]
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/scoresAdvanced',
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
                  score: 0
                }
              ]
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/scoresAdvanced/1'
            },
            resSpec: {
              statusCode: 200,
              body: {
                _id: 1,
                name: 'bar',
                score: 0
              }
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/scoresAdvanced/3'
            },
            resSpec: {
              statusCode: 404,
            }
          },
          {
            reqSpec: {
              method: 'PUT',
              url: '/scoresAdvanced',
              body: [
                {
                  _id: 0,
                  name: 'foo',
                  score: 10
                }
              ]
            },
            resSpec: {
              statusCode: 200,
              body: [
                {
                  _id: 0,
                  name: 'foo',
                  score: 10
                }
              ]
            }
          },
          {
            reqSpec: {
              method: 'PUT',
              url: '/scoresAdvanced/1',
              body: {
                _id: 1,
                name: 'bar',
                score: 4
              }
            },
            resSpec: {
              statusCode: 201,
              body: {
                _id: 1,
                name: 'bar',
                score: 4
              }
            }
          },
          {
            setup: function() {
              this.parent.service.endpoints.scoresAdvanced.scores = {
                0: {_id: 0, name: 'foo', score: 0},
                1: {_id: 1, name: 'bar', score: 0},
                2: {_id: 2, name: 'baz', score: 0},
              }
            },
            teardown: function() {
              var scores = this.parent.service.endpoints.scoresAdvanced.scores
              for (var id in scores) {
                assert.equal(scores[id].score, 1)
              }
            },
            reqSpec: {
              method: 'PATCH',
              url: '/scoresAdvanced',
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
              url: '/scoresAdvanced',
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
              url: '/scoresAdvanced/1',
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
              url: '/scoresAdvanced/666',
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
              url: '/scoresAdvanced',
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
              this.parent.service.endpoints.scoresAdvanced.scores = {
                0: {_id: 0, name: 'foo', score: 0},
                1: {_id: 1, name: 'bar', score: 0},
                2: {_id: 2, name: 'baz', score: 0},
              }
            },
            teardown: function() {
              assert.equal(Object.keys(this.parent.service.endpoints.scoresAdvanced.scores).length, 0)
            },
            reqSpec: {
              method: 'DELETE',
              url: '/scoresAdvanced',
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
              this.parent.service.endpoints.scoresAdvanced.scores = {
                0: {_id: 0, name: 'foo', score: 0},
                1: {_id: 1, name: 'bar', score: 0},
                2: {_id: 2, name: 'baz', score: 0},
              }
            },
            teardown: function() {
              assert.equal(Object.keys(this.parent.service.endpoints.scoresAdvanced.scores).length, 2)
              assert(!('0' in this.parent.service.endpoints.scoresAdvanced.scores))
            },
            reqSpec: {
              method: 'DELETE',
              url: '/scoresAdvanced/0',
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
              url: '/scoresAdvanced/666',
            },
            resSpec: {
              statusCode: 404,
            }
          },
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'MemColBasicTests',
        description: 'MemCol basic tests.',
        service: _o('../lib/MemCol'),
        tests: [
          {
            reqSpec: {
              method: 'POST',
              url: '/scoresBasic',
              body: [
                {
                  name: 'foo',
                  score: 0
                },
                {
                  name: 'bar',
                  score: 0
                }
              ]
            },
            resSpec: {
              statusCode: 201,
              body: [
                {
                  _id: '0',
                  name: 'foo',
                  score: 0
                },
                {
                  _id: '1',
                  name: 'bar',
                  score: 0
                }
              ]
            }
          },
          {
            reqSpec: {
              method: 'POST',
              url: '/scoresBasic',
              body: {
                name: 'baz',
                score: 0
              },
            },
            resSpec: {
              statusCode: 201,
              body: {
                _id: '2',
                name: 'baz',
                score: 0
              },
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/scoresBasic'
            },
            resSpec: {
              statusCode: 200,
              body: [
                {
                  _id: '0',
                  name: 'foo',
                  score: 0
                },
                {
                  _id: '1',
                  name: 'bar',
                  score: 0
                },
                {
                  _id: '2',
                  name: 'baz',
                  score: 0
                }
              ]
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/scoresBasic/0'
            },
            resSpec: {
              statusCode: 200,
              body: {
                _id: '0',
                name: 'foo',
                score: 0
              }
            }
          },
          {
            reqSpec: {
              method: 'GET',
              url: '/scoresBasic/666'
            },
            resSpec: {
              statusCode: 404
            }
          },
          {
            reqSpec: {
              method: 'PUT',
              url: '/scoresBasic',
              body: [
                {
                  _id: '0',
                  name: 'foo',
                  score: 1
                },
                {
                  _id: '1',
                  name: 'bar',
                  score: 1
                },
                {
                  _id: '2',
                  name: 'baz',
                  score: 1
                }
              ]
            },
            resSpec: {
              statusCode: 200,
              body: [
                {
                  _id: '0',
                  name: 'foo',
                  score: 1
                },
                {
                  _id: '1',
                  name: 'bar',
                  score: 1
                },
                {
                  _id: '2',
                  name: 'baz',
                  score: 1
                }
              ]
            }
          },
          {
            reqSpec: {
              method: 'PUT',
              url: '/scoresBasic/666',
              body: {
                _id: '2',
                name: 'yaz',
                score: 1
              }
            },
            resSpec: {
              statusCode: 400,
            }
          },
          {
            teardown: function() {
              assert.equal(this.parent.service.endpoints.scoresBasic.scores['2'].name, 'yaz')
            },
            reqSpec: {
              method: 'PUT',
              url: '/scoresBasic/2',
              body: {
                _id: '2',
                name: 'yaz',
                score: 1
              }
            },
            resSpec: {
              statusCode: 200,
              body: {
                _id: '2',
                name: 'yaz',
                score: 1
              }
            }
          },
          {
            reqSpec: {
              method: 'PATCH',
              url: '/scoresBasic',
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
              url: '/scoresBasic/1',
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
              url: '/scoresBasic'
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
              this.parent.service.endpoints.scoresBasic.scores = {
                0: {_id: 0, name: 'foo', score: 0},
                1: {_id: 1, name: 'bar', score: 0},
                2: {_id: 2, name: 'baz', score: 0},
              }
            },
            teardown: function() {
              assert.equal(Object.keys(this.parent.service.endpoints.scoresBasic.scores).length, 2)
              assert(!('1' in this.parent.service.endpoints.scoresBasic.scores))
            },
            reqSpec: {
              method: 'DELETE',
              url: '/scoresBasic/1'
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

