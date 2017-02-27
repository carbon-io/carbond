var assert = require('assert')

var _ = require('lodash')
var sinon = require('sinon')

var HttpErrors = require('@carbon-io/carbon-core').HttpErrors
var o  = require('@carbon-io/carbon-core').atom.o(module).main
var testtube = require('@carbon-io/carbon-core').testtube

var FunctionLimiter = require('../../lib/limiter/FunctionLimiter')

module.exports = o({
  _type: testtube.Test,
  name: 'FunctionLimiterTests',
  description: 'FunctionLimitertests',
  setup: function() { },
  teardown: function() { },
  tests: [
    o({
      _type: testtube.Test,
      name: 'TestFnPropertyValidation',
      description: 'Test fn property validation',
      doTest: function() {
        assert.throws(function() {
          o({
            _type: FunctionLimiter,
            _fn: 'foo'
          })
        }, TypeError)
        assert.throws(function() {
          o({
            _type: FunctionLimiter,
            _fn: {}
          })
        }, TypeError)
        assert.throws(function() {
          o({
            _type: FunctionLimiter,
            _fn: function(req) {}
          })
        }, TypeError)
        assert.throws(function() {
          o({
            _type: FunctionLimiter,
            _fn: function(req, res, next, foo) {}
          })
        }, TypeError)
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestThreeArgFunctionLimiter',
      description: 'Test three argument FunctionLimiter',
      doTest: function() {
        var _handleErrorSpy = sinon.spy()
        var nextSpy = sinon.spy()
        var resSpy = sinon.spy()
        resSpy.append = sinon.spy()
        var limiter = o({
          _type: FunctionLimiter,
          _fn: function(req, res, next) {
            if (!req.user ||
              req.user.username != 'foo' ||
              this.state.visits >= 10) {
              return this.sendUnavailable(res, next)
            }
            this.state.visits = _.isUndefined(this.state.visits) ? 1 : this.state.visits + 1
            next()
          }
        })

        limiter.initialize({_handleError: _handleErrorSpy}, undefined)

        limiter.process({}, resSpy, nextSpy)
        assert(nextSpy.called)
        assert(nextSpy.firstCall.args[0] instanceof HttpErrors.ServiceUnavailable)
        // NOTE: during normal flow (i.e., when a limiter is initialized with an
        //       actual instance of Service), _handleError will be called via the 
        //       error handling middleware chain as a side effect of calling 
        //       next(err)
        // assert.equal(_handleErrorSpy.args[0].length, 2)
        // assert(_handleErrorSpy.args[0][0] instanceof HttpErrors.ServiceUnavailable)
        // assert(_handleErrorSpy.args[0][1] === resSpy)
        assert(!_handleErrorSpy.called)
        _handleErrorSpy.reset()
        nextSpy.reset()
        resSpy.reset()

        limiter.process({user: {username: 'bar'}}, resSpy, nextSpy)
        assert(nextSpy.called)
        assert(nextSpy.firstCall.args[0] instanceof HttpErrors.ServiceUnavailable)
        // assert.equal(_handleErrorSpy.args[0].length, 2)
        // assert(_handleErrorSpy.args[0][0] instanceof HttpErrors.ServiceUnavailable)
        // assert(_handleErrorSpy.args[0][1] === resSpy)
        assert(!_handleErrorSpy.called)
        _handleErrorSpy.reset()
        nextSpy.reset()
        resSpy.reset()

        for (var i = 0; i < 10; i++) {
          limiter.process({user: {username: 'foo'}}, resSpy, nextSpy)
          assert(nextSpy.called)
          assert(typeof nextSpy.firstCall.args[0], 'undefined')
          assert(!_handleErrorSpy.called)
          _handleErrorSpy.reset()
          nextSpy.reset()
          resSpy.reset()
        }

        limiter.process({user: {username: 'foo'}}, resSpy, nextSpy)
        assert(nextSpy.called)
        assert(nextSpy.firstCall.args[0] instanceof HttpErrors.ServiceUnavailable)
        // assert.equal(_handleErrorSpy.args[0].length, 2)
        // assert(_handleErrorSpy.args[0][0] instanceof HttpErrors.ServiceUnavailable)
        // assert(_handleErrorSpy.args[0][1] === resSpy)
        assert(!_handleErrorSpy.called)
        _handleErrorSpy.reset()
        nextSpy.reset()
        resSpy.reset()
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestTwoArgFunctionLimiter',
      description: 'Test two argument FunctionLimiter',
      doTest: function() {
        var _handleErrorSpy = sinon.spy()
        var nextSpy = sinon.spy()
        var resSpy = sinon.spy()
        resSpy.append = sinon.spy()
        var limiter = o({
          _type: FunctionLimiter,
          _fn: function(req, res) {
            if (!req.user ||
              req.user.username != 'foo' ||
              this.state.visits >= 10) {
              this.sendUnavailable(res)
              return false
            }
            this.state.visits = _.isUndefined(this.state.visits) ? 1 : this.state.visits + 1
            return true
          }
        })
        
        limiter.initialize({_handleError: _handleErrorSpy}, undefined)

        limiter.process({}, resSpy, nextSpy)
        assert(!nextSpy.called)
        assert.equal(_handleErrorSpy.args[0].length, 2)
        assert(_handleErrorSpy.args[0][0] instanceof HttpErrors.ServiceUnavailable)
        assert(_handleErrorSpy.args[0][1] === resSpy)
        _handleErrorSpy.reset()
        nextSpy.reset()
        resSpy.reset()

        limiter.process({user: {username: 'bar'}}, resSpy, nextSpy)
        assert(!nextSpy.called)
        assert.equal(_handleErrorSpy.args[0].length, 2)
        assert(_handleErrorSpy.args[0][0] instanceof HttpErrors.ServiceUnavailable)
        assert(_handleErrorSpy.args[0][1] === resSpy)
        _handleErrorSpy.reset()
        nextSpy.reset()
        resSpy.reset()

        for (var i = 0; i < 10; i++) {
          limiter.process({user: {username: 'foo'}}, resSpy, nextSpy)
          assert(nextSpy.called)
          assert(!_handleErrorSpy.called)
          _handleErrorSpy.reset()
          nextSpy.reset()
          resSpy.reset()
        }

        limiter.process({user: {username: 'foo'}}, resSpy, nextSpy)
        assert(!nextSpy.called)
        assert.equal(_handleErrorSpy.args[0].length, 2)
        assert(_handleErrorSpy.args[0][0] instanceof HttpErrors.ServiceUnavailable)
        assert(_handleErrorSpy.args[0][1] === resSpy)
        _handleErrorSpy.reset()
        nextSpy.reset()
        resSpy.reset()
      }
    }),
  ]
})
