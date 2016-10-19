var assert = require('assert')

var _ = require('lodash')
var mockery = require('mockery')
var sinon = require('sinon')
var toobusy = require('toobusy-js')

var fibers = require('@carbon-io/carbon-core').fibers
var __ = fibers.__(module)
var _o  = require('@carbon-io/carbon-core').bond._o(module)
var o  = require('@carbon-io/carbon-core').atom.o(module)
var oo  = require('@carbon-io/carbon-core').atom.oo(module)
var testtube = require('@carbon-io/carbon-core').testtube

var ApiKeyAuthenticator = require('../../lib/security/ApiKeyAuthenticator')
var Endpoint = require('../../lib/Endpoint')
var Operation = require('../../lib/Operation')
var ServiceTest = require('../../lib/test/ServiceTest')
var limiters = require('../../lib/security/Limiter')

var TooBusyLimiterTestServiceBase = function() {
  // allow use of mockery
  var Service = require('../../lib/Service')
  return oo({
    _type: Service,

    _C: function() {
      this._outstandingReqs = undefined
    },

    _init: function() {
      Service.prototype._init.call(this)
      var self = this

      this.hostname = '127.0.0.1'
      this.port = 8888,
        this.verbosity = 'warn'
      this.enableBusyLimiter = true

      this._pauseReq = 0
      this._passthroughCb = undefined
      this._outstandingReqs = []
      this.middleware.push(function(req, res, next) {
        if (self.pauseReq === 0) {
          return next()
        }
        self._outstandingReqs.push(_.bind(
          function(req, res, next) {
            return next()
          }, self, req, res, next))
        self.pauseReq--
        if (self.pauseReq === 0 && _.isFunction(self.passthroughCb)) {
          self.passthroughCb()
          self.passthroughCb = undefined
        }
      })
      this.endpoints = {
        foo: o({
          _type: Endpoint,
          get: function(req, res) {
            return 'foo'
          }
        })
      }
    },

    pauseReq: {
      $property: {
        get: function() { return this._pauseReq },
        set: function(val) { this._pauseReq = val }
      }
    },

    passthroughCb: {
      $property: {
        get: function() { return this._passthroughCb },
        set: function(val) { this._passthroughCb = val }
      }
    },

    drainOutstandingReqs: function() {
      while (this._outstandingReqs.length > 0) {
        var req = this._outstandingReqs.pop()
        req()
      }
    }
  })
}

var MaxOutstandingReqsLimitedTestService = function(serviceDef, setup, teardown) {
  try {
    if (_.isFunction(setup)) {
      setup()
    }
    var _TooBusyLimiterTestServiceBase = TooBusyLimiterTestServiceBase()
    var _MaxOutstandingReqsLimitedTestService = oo({
      _type: _TooBusyLimiterTestServiceBase,

      description: 'TooBusyLimiter absMaxOutstandingReqs integration test service',

      _init: function () {
        _TooBusyLimiterTestServiceBase.prototype._init.call(this)
        this.busyLimiter = o({
          _type: limiters.TooBusyLimiter,
          absMaxOutstandingReqs: 8
        })
      }
    })
    serviceDef._type = _MaxOutstandingReqsLimitedTestService
    return o(serviceDef)
  } finally {
    if (_.isFunction(teardown)) {
      teardown()
    }
  }
}

var FiberPoolSizeLimitedTestService = function(serviceDef, setup, teardown) {
  try {
    if (_.isFunction(setup)) {
      setup()
    }
    var _TooBusyLimiterTestServiceBase = TooBusyLimiterTestServiceBase()
    var _FiberPoolSizeLimitedTestService = oo({
      _type: _TooBusyLimiterTestServiceBase,

      description: 'TooBusyLimiter useFiberPoolSize integration test service',

      _init: function () {
        _TooBusyLimiterTestServiceBase.prototype._init.call(this)
        this.busyLimiter = o({
          _type: limiters.TooBusyLimiter,
          useFiberPoolSize: true,
          fiberPoolAllowedOverflow: .1,
        })

      }
    })
    serviceDef._type = _FiberPoolSizeLimitedTestService
    return o(serviceDef)
  } finally {
    if (_.isFunction(teardown)) {
      teardown()
    }
  }
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

    // ---------------------------------------------
    // integration tests using absMaxOutstandingReqs
    // ---------------------------------------------

    o({
      _type: ServiceTest,
      name: 'AbsMaxOutstandingReqsIntegrationTests',
      description: 'absMaxOutstandingReqs integration tests',
      service: MaxOutstandingReqsLimitedTestService({}),
      setup: function() {
        ServiceTest.prototype.setup.call(this)
        sinon.stub(this.service.busyLimiter, 'toobusy', function() {
          return false
        })
      },
      teardown: function() {
        this.service.busyLimiter.toobusy.restore()
        ServiceTest.prototype.teardown.call(this)
      },
      tests: [
        {
          setup: function(done) {
            var self = this
            this.results = []
            this.errors = []
            this.resultsReceivedCb = undefined

            try {
              this.parent.service.passthroughCb = function() {
                done()
              }
              this.parent.service.pauseReq = 8
              for (var i = 0; i < 8; i++) {
                _o(this.parent.baseUrl + '/foo').get(function (err, res) {
                  if (err) {
                    self.errors.push(err)
                  } else {
                    self.results.push(res)
                  }
                  if (self.errors.length + self.results.length === 8) {
                    self.resultsReceivedCb()
                  }
                })
              }
            } catch(e) {
              this.parent.service.pauseReq = 0
              this.parent.service.passthroughCb = undefined
              done()
            }
          },
          reqSpec: {
            url: '/foo',
            method: 'get'
          },
          resSpec: {
            statusCode: 503,
            body: {
              code: 503,
              description: 'Service Unavailable',
              message: 'The server is too busy, please try back later.'
            }
          },
          teardown: function(done) {
            var self = this

            self.resultsReceivedCb = function() {
              assert.equal(self.errors.length, 0)
              assert.equal(self.results.length, 8)
              self.parent.service.pauseReq = 0
              done()
            }

            this.parent.service.drainOutstandingReqs()
          }
        },
        {
          reqSpec: {
            url: '/foo',
            method: 'get'
          },
          resSpec: {
            statusCode: 200,
            body: 'foo'
          }
        }
      ]
    }),

    // -------------------------------
    // integration tests using toobusy
    // -------------------------------

    o({
      _type: ServiceTest,
      name: 'TooBusyIntegrationTests',
      description: 'toobusy integration tests',
      service: MaxOutstandingReqsLimitedTestService({}),
      setup: function() {
        ServiceTest.prototype.setup.call(this)
      },
      teardown: function() {
        ServiceTest.prototype.teardown.call(this)
      },
      tests: [
        {
          reqSpec: {
            url: '/foo',
            method: 'get'
          },
          resSpec: {
            statusCode: 200,
            body: 'foo'
          }
        },
        {
          setup: function(done) {
            var self = this
            this.results = []
            this.errors = []
            this.resultsReceivedCb = undefined

            try {
              this.parent.service.passthroughCb = function() {
                sinon.stub(self.parent.service.busyLimiter, 'toobusy', function() {
                  return true
                })
                done()
              }
              this.parent.service.pauseReq = 4
              for (var i = 0; i < 4; i++) {
                _o(this.parent.baseUrl + '/foo').get(function (err, res) {
                  if (err) {
                    self.errors.push(err)
                  } else {
                    self.results.push(res)
                  }
                  if (self.errors.length + self.results.length === 4) {
                    self.resultsReceivedCb()
                  }
                })
              }
            } catch(e) {
              this.parent.service.pauseReq = 0
              this.parent.service.passthroughCb = undefined
              done()
            }
          },
          reqSpec: {
            url: '/foo',
            method: 'get'
          },
          resSpec: function(res) {
            assert.equal(res.statusCode, 503)
            assert.equal(this.parent.service.busyLimiter.outstandingReqs, 4)
            assert.equal(this.parent.service.busyLimiter.maxOutstandingReqs, 4)
            return true
          },
          teardown: function(done) {
            var self = this

            self.resultsReceivedCb = function() {
              assert.equal(self.errors.length, 0)
              assert.equal(self.results.length, 4)
              self.parent.service.pauseReq = 0
              done()
            }
            this.parent.service.busyLimiter.toobusy.restore()
            this.parent.service.drainOutstandingReqs()
          }
        },
        {
          setup: function() {
            sinon.stub(this.parent.service.busyLimiter, 'toobusy', function() {
              return false
            })
          },
          reqSpec: {
            url: '/foo',
            method: 'get'
          },
          resSpec: function(res) {
            assert.equal(res.statusCode, 200)
            assert.equal(this.parent.service.busyLimiter.outstandingReqs, 0)
            assert.equal(this.parent.service.busyLimiter.maxOutstandingReqs, 5)
            return true
          },
          teardown: function() {
            this.parent.service.busyLimiter.toobusy.restore()
          }
        },
        {
          setup: function() {
            sinon.stub(this.parent.service.busyLimiter, 'toobusy', function() {
              return false
            })
          },
          reqSpec: {
            url: '/foo',
            method: 'get'
          },
          resSpec: function(res) {
            assert.equal(res.statusCode, 200)
            assert.equal(this.parent.service.busyLimiter.maxOutstandingReqs, 7)
            return true
          },
          teardown: function() {
            this.parent.service.busyLimiter.toobusy.restore()
          }
        },
        {
          setup: function() {
            sinon.stub(this.parent.service.busyLimiter, 'toobusy', function() {
              return false
            })
          },
          reqSpec: {
            url: '/foo',
            method: 'get'
          },
          resSpec: function(res) {
            assert.equal(res.statusCode, 200)
            assert.equal(this.parent.service.busyLimiter.maxOutstandingReqs, 8)
            return true
          },
          teardown: function() {
            this.parent.service.busyLimiter.toobusy.restore()
          }
        }
      ]
    }),

    // ---------------------------------------
    // integration tests using fiber pool size
    // ---------------------------------------

    o({
      _type: ServiceTest,
      name: 'FiberPoolSizeIntegrationTests',
      description: 'Fiber pool size integration tests',
      service: FiberPoolSizeLimitedTestService(
        {},
        function() {
          mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
          })
          sinon.stub(fibers, 'getFiberPoolSize', function() {
            return 10
          })
          mockery.registerMock('@carbon-io/fibers', fibers)
          mockery.resetCache()
        },
        function() {
          fibers.getFiberPoolSize.restore()
          mockery.disable()
        }
      ),
      setup: function() {
        sinon.stub(this.service.busyLimiter, 'toobusy', function() {
          return false
        })
        ServiceTest.prototype.setup.call(this)
      },
      teardown: function() {
        ServiceTest.prototype.teardown.call(this)
        this.service.busyLimiter.toobusy.restore()
      },
      tests: [
        {
          reqSpec: {
            url: '/foo',
            method: 'get'
          },
          resSpec: {
            statusCode: 200,
            body: 'foo'
          }
        },
        {
          setup: function(done) {
            var self = this
            this.results = []
            this.errors = []
            this.resultsReceivedCb = undefined

            try {
              this.parent.service.passthroughCb = function() {
                done()
              }
              this.parent.service.pauseReq = 11
              for (var i = 0; i < 11; i++) {
                _o(this.parent.baseUrl + '/foo').get(function (err, res) {
                  if (err) {
                    self.errors.push(err)
                  } else {
                    self.results.push(res)
                  }
                  if (self.errors.length + self.results.length === 11) {
                    self.resultsReceivedCb()
                  }
                })
              }
            } catch(e) {
              this.parent.service.pauseReq = 0
              this.parent.service.passthroughCb = undefined
              done()
            }
          },
          reqSpec: {
            url: '/foo',
            method: 'get'
          },
          resSpec: function(res) {
            assert.equal(res.statusCode, 503)
            assert.equal(this.parent.service.busyLimiter.outstandingReqs, 11)
            assert.equal(this.parent.service.busyLimiter.maxOutstandingReqs, 11)
            return true
          },
          teardown: function(done) {
            var self = this

            self.resultsReceivedCb = function() {
              assert.equal(self.errors.length, 0)
              assert.equal(self.results.length, 11)
              self.parent.service.pauseReq = 0
              done()
            }
            this.parent.service.drainOutstandingReqs()
          }
        },
        {
          reqSpec: {
            url: '/foo',
            method: 'get'
          },
          resSpec: {
            statusCode: 200,
            body: 'foo'
          },
        }
      ]
    })
  ]
})

module.exports = TooBusyLimiterTests
