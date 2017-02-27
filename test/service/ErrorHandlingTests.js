var assert = require('assert')

var sinon = require('sinon')

var _o = require('@carbon-io/carbon-core').bond._o(module)
var o  = require('@carbon-io/carbon-core').atom.o(module).main
var tt = require('@carbon-io/carbon-core').testtube

var carbond = require('../..')

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

var errorHandlingTests = o({
  _type: carbond.test.ServiceTest,
  service: testService,
  name: 'errorHandlingTests',
  description: 'Error handling tests',
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
      name: 'topLevelErrorHandlingMiddlewareErrorTest',
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
      name: 'errorHandlingMiddlewareFallthroughTest',
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
      name: 'errorHandlingMiddlewareShortCircuitTest',
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

module.exports = errorHandlingTests
