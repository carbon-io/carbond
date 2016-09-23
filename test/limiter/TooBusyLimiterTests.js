var assert = require('assert')

var _ = require('lodash')
var sinon = require('sinon')

var fibers = require('@carbon-io/fibers')
var __ = fibers.__(module)
var o  = require('atom').o(module)
var oo  = require('atom').oo(module)
var testtube = require('test-tube')
var toobusy = require('toobusy-js')

var ApiKeyAuthenticator = require('../../lib/security/ApiKeyAuthenticator')
var Service = require('../../lib/Service')
var Endpoint = require('../../lib/Endpoint')
var Operation = require('../../lib/Operation')
var ServiceTest = require('../../lib/test/ServiceTest')
var limiters = require('../../lib/security/Limiter')

var TooBusyLimiterTestServiceBase = oo({
  _type: Service,

  _C: function() {
    this._outstandingReqs = undefined
  },

  _init: function() {
    TestService.prototype._init.call(this)
    var self = this

    this.hostname = '127.0.0.1'
    this.port = 8888,
    this.verbosity = 'warn'
    this.busyLimiter = true

    this._outstandingReqs = []
    this.middleware.append(function(req, res, next) {
      self._outstandingReqs.append(_.bind(
        function(req, res, next) {
          return next()
        }, self, req, res, next))
    })
  },

  finishOutstandingReqs: function() {
    while (this._outstandingReqs.length > 0) {
      var req = this._outstandingReqs.pop()
      req()
    }
  },

  endpoints: {
    foo: o({
      _type: Endpoint,
      get: function(req, res) {
        return 'foo'
      }
    })
  }
})

var MaxOutstandingReqsLimitedTestService = {
  _type: TooBusyLimiterTestServiceBase,

  description: 'TooBusyLimiter integration test service',

  tooBusyLimiter: o({
    _type: limiters.TooBusyLimiter,
    absMaxOutstandingReqs: 8
  }),
}

var FiberPoolLimitedTestService = {
  _type: TooBusyLimiterTestServiceBase,

  description: 'TooBusyLimiter integration test service',

  tooBusyLimiter: o({
    _type: limiters.TooBusyLimiter,
    useFiberPoolSize: true,
    fiberPoolAllowedOverflow: .1,
  }),
}

var TooBusyLimiterTests = o({
  _type: testtube.Test,
  name: 'TooBusyLimiterTests',
  description: 'TooBusyLimiter tests',
  setup: function() { },
  teardown: function() { },
  tests: [

    // unit tests

    o({
      _type: testtube.Test,
      name: 'TestValidation',
      description: 'Test validation',
      doTest: function() {
        var limiter = undefined
        var vals = [0, 1.5, -1, "10"]
        vals.forEach(function(val) {
          assert.throws(function() {
            limiter = o({
              _type: limiters.TooBusyLimiter,
              absMaxOutstandingReqs: val
            })
          }, TypeError)
        })
        vals = [1, 10, Math.pow(10, 6)]
        vals.forEach(function(val) {
          assert.doesNotThrow(function () {
            limiter = o({
              _type: limiters.TooBusyLimiter,
              absMaxOutstandingReqs: val
            })
          })
        })
        vals = [-1, "10"]
        vals.forEach(function(val) {
          assert.throws(function() {
            limiter = o({
              _type: limiters.TooBusyLimiter,
              fiberPoolAllowedOverflow: val
            })
          }, TypeError)
        })
        vals = [0, .1, Math.pow(10, 6)]
        vals.forEach(function(val) {
          assert.doesNotThrow(function () {
            limiter = o({
              _type: limiters.TooBusyLimiter,
              fiberPoolAllowedOverflow: val
            })
          })
        })
        var props = ['toobusyMaxLag', 'toobusyInterval']
        vals = [0, .5, "10"]
        props.forEach(function(prop) {
          vals.forEach(function(val) {
            assert.throws(function() {
              limiter = o({
                _type: limiters.TooBusyLimiter,
                [prop]: val
              })
            }, TypeError)
          })
        })
        vals = [17, 100, Math.pow(10, 6)]
        props.forEach(function(prop) {
          vals.forEach(function(val) {
            assert.doesNotThrow(function() {
              limiter = o({
                _type: limiters.TooBusyLimiter,
                [prop]: val
              })
            }, TypeError)
          })
        })
      }
    }),
    o({
      _type: testtube.Test,
      name: 'TestInit',
      description: 'Test init',
      doTest: function() {
        var limiter = o({
          _type: limiters.TooBusyLimiter,
          absMaxOutstandingReqs: 10
        })
        assert.equal(limiter.maxOutstandingReqs, 10)
        limiter = o({
          _type: limiters.TooBusyLimiter,
          useFiberPoolSize: true,
          fiberPoolAllowedOverflow: .1
        })
        assert.equal(limiter.maxOutstandingReqs,
                     fibers.getFiberPoolSize() + fibers.getFiberPoolSize() *.1)
        limiter = o({
          _type: limiters.TooBusyLimiter,
          toobusyMaxLag: 1000,
          toobusyInterval: 1000
        })
        assert.equal(toobusy.maxLag(), 1000)
        assert.equal(toobusy.interval(), 1000)
      }
    }),

    // integration tests using absMaxOutstandingReqs

    o({
      _type: ServiceTest,
      name: 'AbsMaxOutstandingReqsIntegrationTests',
      description: 'absMaxOutstandingReqs integration tests',
      service: o({
        _type: MaxOutstandingReqsLimitedTestService
      }),
      setup: function() { },
      teardown: function() { },
      tests: [

      ]
    })

    // integration tests using fiber pool size
  ]
})

module.exports = TooBusyLimiterTests
