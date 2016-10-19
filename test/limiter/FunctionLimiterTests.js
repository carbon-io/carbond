var assert = require('assert')

var _ = require('lodash')
var sinon = require('sinon')

var HttpErrors = require('@carbon-io/carbon-core').HttpErrors
var o  = require('@carbon-io/carbon-core').atom.o(module)
var testtube = require('@carbon-io/carbon-core').testtube

var limiters = require('../../lib/security/Limiter')

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
            _type: limiters.FunctionLimiter,
            _fn: 'foo'
          })
        }, TypeError)
        assert.throws(function() {
          o({
            _type: limiters.FunctionLimiter,
            _fn: {}
          })
        }, TypeError)
        assert.throws(function() {
          o({
            _type: limiters.FunctionLimiter,
            _fn: function(req) {}
          })
        }, TypeError)
        assert.throws(function() {
          o({
            _type: limiters.FunctionLimiter,
            _fn: function(req, res, next, foo) {}
          })
        }, TypeError)
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestFunctionLimiter',
      description: 'Test FunctionLimiter',
      doTest: function() {
        var _handleErrorSpy = sinon.spy()
        var nextSpy = sinon.spy()
        var resSpy = sinon.spy()
        resSpy.append = sinon.spy()
        var limiters_ = [
          o({
            _type: limiters.FunctionLimiter,
            _fn: function(req, res, next) {
              if (!req.user ||
                req.user.username != 'foo' ||
                this.state.visits >= 10) {
                this.sendUnavailable(res)
                return
              }
              this.state.visits = _.isUndefined(this.state.visits) ? 1 : this.state.visits + 1
              next()
            }
          }),
          o({
            _type: limiters.FunctionLimiter,
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
        ]
        limiters_.forEach(function(limiter) {
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
        })
      }
    }),
  ]
})
