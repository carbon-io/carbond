var assert = require('assert')

var sinon = require('sinon')

var __ = require('@carbon-io/carbon-core').fibers.__(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)
var ejson = require('@carbon-io/carbon-core').ejson
var o  = require('@carbon-io/carbon-core').atom.o(module)
var tt = require('@carbon-io/carbon-core').testtube

var carbond = require('../..')

var pong = require('../fixtures/pong')

var testService = o({
  _type: carbond.Service,
  throwError: false,
  skipTopLevelErrorHandler: false,
  middleware: [
    function(req, res, next) {
      if (testService.throwError) {
        return next(new testService.errors.Forbidden('thou shall not pass!'))
      }
      next()
    }
  ],
  errorHandlingMiddleware: [
    sinon.spy(function(err, req, res, next) {
      next(err)
    }),
    sinon.spy(function(err, req, res, next) {
      if (testService.skipTopLevelErrorHandler) {
        res.status(500).send({error: 'errorHandlingMiddleware'})
      } else {
        next(err)
      }
    })
  ],
  _handleError: sinon.spy(function() {
    carbond.Service.prototype._handleError.apply(this, arguments)
  }),
  resetSpies: function() {
    this._handleError.reset()
    this.errorHandlingMiddleware.forEach(function(spy) {
      spy.reset()
    })
  },
  endpoints: {
    foo: o({
      _type: carbond.Endpoint,
      get: {
        service: function(req, res) {
          return {foo: 'bar'}
        }
      }
    })
  }
})

__(function() {
  var errorHandlingTests = o.main({
    _type: tt.Test,
    name: 'ErrorHandlingTests',
    description: 'Error handling tests',
    tests: [
      o({
        _type: tt.Test,
        name: 'ProductionModeErrorHandlingTests',
        tests: [
          o({
            _type: carbond.test.ServiceTest,
            name: 'ErrorSanitizationTests',
            service: o({
              _type: pong.Service,
              env: 'production',
              endpoints: {
                foo: o({
                  _type: pong.Endpoint,
                  '$get.responses': {
                    200: {
                      schema: {
                        type: 'object',
                        properties: {
                          foo: {type: 'string'}
                        },
                        required: ['foo'],
                        additionalProperties: false
                      }
                    }
                  }
                })
              }
            }),
            tests: [
              {
                reqSpec: {
                  url: '/foo',
                  method: 'GET',
                  headers: {
                    'x-pong': ejson.stringify({
                      get: {foo: 'foo'}
                    })
                  }
                },
                resSpec: {
                  statusCode: 200,
                  body: {foo: 'foo'}
                }
              },
              {
                reqSpec: {
                  url: '/foo',
                  method: 'GET',
                  headers: {
                    'x-pong': ejson.stringify({
                      get: {bar: 'bar'}
                    })
                  }
                },
                resSpec: {
                  statusCode: 500,
                  body: {
                    code: 500,
                    description: 'Internal Server Error'
                  }
                }
              }
            ]
          }),
        ]
      }),
      o({
        _type: tt.Test,
        name: 'DevelopmentModeErrorHandlingTests',
        tests: [
          o({
            _type: carbond.test.ServiceTest,
            name: 'ErrorSanitizationTests',
            service: o({
              _type: pong.Service,
              env: 'development',
              endpoints: {
                foo: o({
                  _type: pong.Endpoint,
                  '$get.responses': {
                    200: {
                      schema: {
                        type: 'object',
                        properties: {
                          foo: {type: 'string'}
                        },
                        required: ['foo'],
                        additionalProperties: false
                      }
                    }
                  }
                })
              }
            }),
            tests: [
              {
                reqSpec: {
                  url: '/foo',
                  method: 'GET',
                  headers: {
                    'x-pong': ejson.stringify({
                      get: {foo: 'foo'}
                    })
                  }
                },
                resSpec: {
                  statusCode: 200,
                  body: {foo: 'foo'}
                }
              },
              {
                setup: function() {
                  var stub = sinon.stub(console, 'error').callsFake(function() {
                    // XXX: there is an asynchonous call to console.error that happens after the
                    //      the response is sent and no way to stub the function in express that
                    //      does this... this works for now, but if another call is introduced, this
                    //      will fail and a stack trace will be printed during testing. not the end of
                    //      the world, but something to be aware of.
                    stub.restore()
                  })
                },
                reqSpec: {
                  url: '/foo',
                  method: 'GET',
                  headers: {
                    'x-pong': ejson.stringify({
                      get: {bar: 'bar'}
                    })
                  }
                },
                resSpec: {
                  statusCode: 500,
                  body: function(body) {
                    assert(
                      body.startsWith(
                        'Error: Output did not validate against: Additional properties not allowed: bar'))
                  }
                }
              }
            ]
          }),
        ]
      }),
      o({
        _type: carbond.test.ServiceTest,
        name: 'ErrorHandlingMiddlewareTests',
        description: 'Error handling middleware tests',
        service: testService,
        tests: [
          {
            name: 'topLevelErrorHandlingMiddlewareNoErrorTest',
            setup: function() {
              this.parent.service.resetSpies()
            },
            teardown: function() {
              assert(!this.parent.service._handleError.called)
            },
            reqSpec: {
              url: '/foo',
              method: 'GET'
            },
            resSpec: {
              statusCode: 200,
              body: {foo: 'bar'}
            }
          },
          {
            name: 'TopLevelErrorHandlingMiddlewareErrorTest',
            setup: function() {
              this.parent.service.resetSpies()
              this.parent.service.throwError = true
            },
            teardown: function() {
              assert(this.parent.service._handleError.calledOnce)
              this.parent.service.throwError = false
            },
            reqSpec: {
              url: '/foo',
              method: 'GET'
            },
            resSpec: {
              statusCode: 403,
              body: {
                code: 403,
                description: 'Forbidden',
                message: 'thou shall not pass!'
              }
            }
          },
          {
            name: 'ErrorHandlingMiddlewareFallthroughTest',
            setup: function() {
              this.parent.service.resetSpies()
              this.parent.service.throwError = true
            },
            teardown: function() {
              assert(this.parent.service._handleError.calledOnce)
              assert.equal(this.parent.service.errorHandlingMiddleware[0].callCount, 1)
              assert.equal(this.parent.service.errorHandlingMiddleware[1].callCount, 1)
              this.parent.service.throwError = false
            },
            reqSpec: {
              url: '/foo',
              method: 'GET'
            },
            resSpec: {
              statusCode: 403,
              body: {
                code: 403,
                description: 'Forbidden',
                message: 'thou shall not pass!'
              }
            }
          },
          {
            name: 'ErrorHandlingMiddlewareShortCircuitTest',
            setup: function() {
              this.parent.service.resetSpies()
              this.parent.service.throwError = true
              this.parent.service.skipTopLevelErrorHandler = true
            },
            teardown: function() {
              assert(!this.parent.service._handleError.called)
              assert.equal(this.parent.service.errorHandlingMiddleware[0].callCount, 1)
              assert.equal(this.parent.service.errorHandlingMiddleware[1].callCount, 1)
              this.parent.service.throwError = false
              this.parent.service.skipTopLevelErrorHandler = false
            },
            reqSpec: {
              url: '/foo',
              method: 'GET'
            },
            resSpec: {
              statusCode: 500,
              body: {
                error: 'errorHandlingMiddleware'
              }
            }
          },
        ]
      })
    ]
  })
  module.exports = errorHandlingTests
})
