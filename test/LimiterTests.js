var assert = require('assert')

var _ = require('lodash')
var sinon = require('sinon')

var _o = require('bond')._o(module)
var HttpErrors = require('http-errors')
var o  = require('atom').o(module)
var oo  = require('atom').oo(module)
var testtube = require('test-tube')

var Endpoint = require('../lib/Endpoint')
var limiters = require('../lib/security/Limiter')
var limiterPolicies = require('../lib/security/LimiterPolicy')
var limiterSelectors = require('../lib/security/LimiterSelector')
var Operation = require('../lib/Operation')
var Service = require('../lib/Service')

module.exports = o({
  _type: testtube.Test,
  name: 'LimiterFrameworkTests',
  description: 'Limiter framework tests',
  setup: function() { },
  teardown: function() { },
  tests: [
    //
    // Limiter tests
    //
    o({
      _type: testtube.Test,
      name: 'LimiterTests',
      description: 'Limiter interface tests',
      tests: [
        o({
          _type: testtube.Test,
          name: 'TestInstantiate',
          description: 'Test instantiate',
          doTest: function () {
            assert.throws(function() {
              var limiter = o({_type: limiters.Limiter})
            }, Error)
          }
        }),
        o({
          _type: testtube.Test,
          name: 'TestSendUnavailable',
          description: 'Test `sendUnavailable`',
          setup: function () {
            sinon.stub(limiters.Limiter.prototype, '_C', function() {})
          },
          teardown: function () {
            limiters.Limiter.prototype._C.restore()
          },
          doTest: function () {
            var _handleErrorSpy = sinon.spy()
            var resSpy = sinon.spy()
            resSpy.append = sinon.spy()
            var limiter = o({_type: limiters.Limiter})
            limiter.initialize({_handleError: _handleErrorSpy}, undefined)
            limiter.sendUnavailable(resSpy, 60)
            assert(_handleErrorSpy.called)
            assert.equal(_handleErrorSpy.args[0].length, 2)
            assert(_handleErrorSpy.args[0][0] instanceof HttpErrors.ServiceUnavailable)
            assert(_handleErrorSpy.args[0][1] === resSpy)
            assert(resSpy.append.args[0][0] === 'Retry-After')
            assert(resSpy.append.args[0][1] === '60')
          }
        }),
      ]
    }),

    //
    // LimiterSelector tests
    //

    o({
      _type: testtube.Test,
      name: 'LimiterSelectorTests',
      description: 'LimiterSelector interface tests',
      tests: [
        o({
          _type: testtube.Test,
          name: 'TestInstantiate',
          description: 'Test instantiation fails',
          doTest: function() {
            assert.throws(function() {
              var limiterSelector = o({_type: limiters.LimiterSelector})
            }, Error)
          }
        }),
      ]
    }),

    //
    // StaticKeyLimiterSelector tests
    //

    o({
      _type: testtube.Test,
      name: 'StaticKeyLimiterSelectorTests',
      description: 'StaticKeyLimiterSelector tests',
      setup: function() { },
      teardown: function() { },
      tests: [
        o({
          _type: testtube.Test,
          name: 'TestStaticKeyValidation',
          description: 'Test staticKey property validation',
          doTest: function() {
            [null, undefined, {foo: 'bar'}, function () {var foo = 'bar'}].forEach(function(val) {
              assert.throws(function() {
                o({_type: limiterSelectors.StaticKeyLimiterSelector, staticKey: val})
              }, TypeError)
            })
          }
        }),
        o({
          _type: testtube.Test,
          name: 'TestHash',
          description: 'Test hash',
          doTest: function() {
            var s1 = o({_type: limiterSelectors.StaticKeyLimiterSelector, staticKey: 'foo'})
            var s2 = o({_type: limiterSelectors.StaticKeyLimiterSelector, staticKey: 'bar'})
            assert(s1.hash === s1.hash)
            assert(s1.hash != s2.hash)
            assert(s2.hash === s2.hash)
          }
        }),
        o({
          _type: testtube.Test,
          name: 'TestKeyFn',
          description: 'Test key function',
          doTest: function () {
            var s1 = o({_type: limiterSelectors.StaticKeyLimiterSelector, staticKey: 'foo'})
            var s2 = o({_type: limiterSelectors.StaticKeyLimiterSelector, staticKey: 'bar'})
            assert.equal(s1.key(), 'foo')
            assert.equal(s2.key(), 'bar')
          }
        })
      ]
    }),

    //
    // ReqPropertyLimiterSelector tests
    //

    o({
      _type: testtube.Test,
      name: 'ReqPropertyLimiterSelectorTests',
      description: 'ReqPropertyLimiterSelector tests',
      tests: [
        o({
          _type: testtube.Test,
          name: 'TestPropertyPathValidation',
          description: 'Test property path validation',
          doTest: function() {
            var s = undefined
            var vals = [null, undefined, '', {foo: 'bar'}, function () {var foo = 'bar'}]
            vals.forEach(function (val) {
              assert.throws(function () {
                s = o({_type: limiterSelectors.ReqPropertyLimiterSelector, propertyPath: val})
              }, TypeError)
            })
            assert.doesNotThrow(function() {
              s = o({_type: limiterSelectors.ReqPropertyLimiterSelector, propertyPath: 'foo.bar.baz'})
            })
            assert.deepEqual(s.propertyPath, ['foo', 'bar', 'baz'])
          }
        }),
        o({
          _type: testtube.Test,
          name: 'TestTransformValidation',
          description: 'Test transform validation',
          doTest: function() {
            var s = undefined
            var vals = [null, {foo: 'bar'}]
            vals.forEach(function (val) {
              assert.throws(function () {
                s = o({
                  _type: limiterSelectors.ReqPropertyLimiterSelector,
                  propertyPath: 'foo',
                  transform: val
                })
              }, TypeError)
            })
            var transform = function(val) { return val + 'bar'}
            assert.doesNotThrow(function() {
              s = o({
                _type: limiterSelectors.ReqPropertyLimiterSelector,
                propertyPath: 'foo',
                transform: transform
              })
            })
            assert.equal(s.transform, transform)
          }
        }),
        o({
          _type: testtube.Test,
          name: 'TestKeyFn',
          description: 'Test key function',
          doTest: function() {
            var req = {
              foo: {
                bar: {
                  baz: 1
                }
              },
              bar: {
                baz: {
                  foo: 2
                }
              },
              baz: {
                foo: {
                  bar: 3
                }
              }
            }
            var s = o({
              _type: limiterSelectors.ReqPropertyLimiterSelector,
              propertyPath: 'foo.bar.baz'
            })
            assert.equal(s.key(req), 1)
            s = o({
              _type: limiterSelectors.ReqPropertyLimiterSelector,
              propertyPath: 'bar.baz.foo'
            })
            assert.equal(s.key(req), 2)
            s = o({
              _type: limiterSelectors.ReqPropertyLimiterSelector,
              propertyPath: 'baz.foo.bar'
            })
            assert.equal(s.key(req), 3)
          }
        }),
        o({
          _type: testtube.Test,
          name: 'TestTransform',
          description: 'Test transform',
          doTest: function() {
            var s = o({
              _type: limiterSelectors.ReqPropertyLimiterSelector,
              propertyPath: 'foo.bar',
              transform: function(val) {
                return val.split('').reverse().join('')
              }
            })
            assert.equal(s.key({foo: {bar: 'abcd'}}), 'dcba')
          }
        }),
      ]
    }),

    //
    // FunctionLimiter tests
    //

    o({
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
    }),

    //
    // LimiterPolicyState tests
    //

    o({
      _type: testtube.Test,
      name: 'LimiterPolicyStateTests',
      description: 'LimiterPolicyState tests',
      setup: function() { },
      teardown: function() { },
      tests: [
        o({
          _type: testtube.Test,
          name: 'TestVisit',
          description: 'Test visit method',
          setup: function() { },
          teardown: function() { },
          doTest: function() {
            var state = o({_type: limiterPolicies.LimiterPolicyState})

            // validation

            assert.throws(function() {
              state.visit({}, 1, 1)
            }, TypeError)
            assert.throws(function() {
              state.visit({}, 'foo', 'bar')
            }, TypeError)

            // test retention
            var timestamps = [0, 10, 20, 30]
            timestamps.forEach(function(ts) {
              state.visit({}, 'foo', ts)
            })
            var timestamps_ = _.sortBy(state._state.foo.toArray())
            assert.deepEqual(timestamps_, timestamps)
            state.reset()

            // test selector switching

            var ts = 0
            var selectors = ['foo', 'bar', 'baz']
            selectors.forEach(function(selector) {
              state.visit({}, selector, ts)
              ts += 10
            })
            assert.deepEqual(_.sortBy(_.keys(state._state)), _.sortBy(selectors))
            var ts = 0
            selectors.forEach(function(selector) {
              assert.equal(1, state._state[selector].size())
              assert.equal(ts, state._state[selector].pop())
              ts += 10
            })
          }
        }),
        o({
          _type: testtube.Test,
          name: 'TestVisits',
          description: 'Test visits method',
          doTest: function() {
            var state = o({_type: limiterPolicies.LimiterPolicyState})
            var timestamps = [0, 1, 2, 3, 4, 5]
            var selectors = ['foo', 'bar', 'baz']
            selectors.forEach(function(selector) {
              assert.equal(state.visits(selector), 0)
              timestamps.forEach(function(ts) {
                state.visit({}, selector, ts)
              })
            })
            selectors.forEach(function(selector) {
              assert.equal(state.visits(selector), 6)
            })
          }
        }),
        o({
          _type: testtube.Test,
          name: 'TestPurge',
          description: 'Test purge method',
          doTest: function() {
            var state = o({_type: limiterPolicies.LimiterPolicyState})
            var timestamps = [0, 1, 2, 3, 4, 5]
            var selectors = ['foo', 'bar', 'baz']

            // test purge doesn't barf when state selector doesn't exist
            assert.doesNotThrow(function() {
              state.purge(3, 'foo')
            }, TypeError)
            selectors.forEach(function(selector) {
              timestamps.forEach(function(ts) {
                state.visit({}, selector, ts)
              })
            })
            var numPurged = state.purge(2, 'foo')
            assert.equal(numPurged, 3)
            assert.deepEqual(_.sortBy(state._state.foo.toArray()), [3, 4, 5])
            assert.deepEqual(_.sortBy(state._state.bar.toArray()), timestamps)
            assert.deepEqual(_.sortBy(state._state.baz.toArray()), timestamps)
            numPurged = state.purge(2)
            assert.equal(numPurged, 6)
            assert.deepEqual(_.sortBy(state._state.foo.toArray()), [3, 4, 5])
            assert.deepEqual(_.sortBy(state._state.bar.toArray()), [3, 4, 5])
            assert.deepEqual(_.sortBy(state._state.baz.toArray()), [3, 4, 5])
            numPurged = state.purge(function(val) {
              return val < 4
            })
            assert.equal(numPurged, 3)
            assert.deepEqual(_.sortBy(state._state.foo.toArray()), [4, 5])
            assert.deepEqual(_.sortBy(state._state.bar.toArray()), [4, 5])
            assert.deepEqual(_.sortBy(state._state.baz.toArray()), [4, 5])
            numPurged = state.purge(5)
            assert.equal(numPurged, 6)
            assert.equal(_.keys(state._state).length, 0)
          }
        }),
        o({
          _type: testtube.Test,
          name: 'TestReset',
          description: 'Test reset method',
          doTest: function() {
            var state = o({_type: limiterPolicies.LimiterPolicyState})
            state.visit({}, 'foo', 1)
            state.visit({}, 'bar', 1)
            assert.equal(_.keys(state._state).length, 2)
            state.reset()
            assert.equal(_.keys(state._state).length, 0)
          }
        }),
      ]
    }),

    //
    // LimiterPolicy tests
    //

    o({
      _type: testtube.Test,
      name: 'LimiterPolicyTests',
      description: 'LimiterPolicy tests',
      LimiterPolicy_: oo({
        _type: limiterPolicies.LimiterPolicy
      }),
      setup: function() {
        var self = this
        this.tests.forEach(function(test) {
          test.parent = self
        })
        sinon.stub(Endpoint.prototype, '_init')
        sinon.stub(Operation.prototype, '_init')
        sinon.stub(Service.prototype, '_init')
      },
      teardown: function() {
        Endpoint.prototype._init.restore()
        Operation.prototype._init.restore()
        Service.prototype._init.restore()
      },
      Policy: function(node, sharedState) {
        var limiterPolicy = o({
          _type: this.LimiterPolicy_,
          sharedState: _.isUndefined(sharedState) ? false : sharedState
        })
        limiterPolicy.initialize({}, node)
        return limiterPolicy
      },
      tests: [
        o({
          _type: testtube.Test,
          name: 'TestInstantiation',
          description: 'Test instantiation',
          doTest: function() {
            assert.throws(function() {
              var limiterPolicy = o({
                _type: limiterPolicies.LimiterPolicy
              })
            }, Error)
          }
        }),
        o({
          _type: testtube.Test,
          name: 'TestStateKey',
          description: 'Test stateKey property',
          doTest: function() {
            // shared state

            var node = o({_type: Service})
            var policy = this.parent.Policy(node, true)
            assert.equal(policy.stateKey, limiterPolicies.LimiterPolicy.SHARED_STATE_KEY)

            // double instantiation
            assert.throws(function() {
              policy.initialize({}, node)
            }, Error)

            // service level
            node = o({_type: Service})
            policy = this.parent.Policy(node)
            assert.equal(policy.stateKey, 'service')

            // operation level
            node = o({
              _type: Operation,
              endpoint: {
                path: '/foo'
              },
              name: 'GET'
            })
            policy = this.parent.Policy(node)
            assert.equal(policy.stateKey, '/foo::GET')

            // endpoint level
            node = o({
              _type: Endpoint,
              path: '/foo'
            })
            policy = this.parent.Policy(node)
            assert.equal(policy.stateKey, '/foo::ALL')

            // node validation
            policy = this.parent.Policy({})
            assert.throws(function() {
              var key = policy.stateKey
            }, TypeError)
          }
        }),
        o({
          _type: testtube.Test,
          name: 'TestStateKey',
          description: 'Test initializeState',
          doTest: function() {
            var node = o({_type: Service})
            var policy = this.parent.Policy(node)
            var state = policy.initializeState()

            // state should be an instance of LimiterPolicyState
            assert(state instanceof limiterPolicies.LimiterPolicyState)
            // we should get a different instance back on initialization
            assert.notEqual(policy.initializeState(), state)
            // non shared state policies should throw assertion error if a state instance is passed in
            assert.throws(function() {
              policy.initializeState(state)
            }, Error)

            policy = this.parent.Policy(node, true)
            state = o({_type: limiterPolicies.LimiterPolicyState})

            // shared state policies should return the state that was passed in
            assert.equal(policy.initializeState(state), state)
          }
        }),
      ]
    }),

    //
    // WindowLimiterPolicy tests
    //

    o({
      _type: testtube.Test,
      name: 'WindowLimiterPolicyTests',
      description: 'WindowLimiterPolicy tests',
      tests: [
        o({
          _type: testtube.Test,
          name: 'TestValidation',
          description: 'Test validation',
          doTest: function() {
            var vals = ['foo', -1, {}]
            vals.forEach(function(val) {
              assert.throws(function() {
                o({
                  _type: limiterPolicies.WindowLimiterPolicy,
                  window: val
                })
              }, TypeError)
            })
            vals.forEach(function(val) {
              assert.throws(function() {
                o({
                  _type: limiterPolicies.WindowLimiterPolicy,
                  reqLimit: val
                })
              }, TypeError)
            })
            assert.doesNotThrow(function() {
              o({
                _type: limiterPolicies.WindowLimiterPolicy,
                window: 10000,
                reqLimit: 10
              })
            }, TypeError)
          }
        }),
        o({
          _type: testtube.Test,
          name: 'TestValidation',
          description: 'Test validation',
          setup: function() {
            var results = [
              0,    // allow
              500,  // reject
              1000, // allow
              1500, // reject
              1900, // reject
              2000  // allow
            ]
            sinon.stub(Date, 'now', function() {
              return results.shift()
            })
          },
          teardown: function() {
            Date.now.restore()
          },
          doTest: function() {
            var policy = o({
              _type: limiterPolicies.WindowLimiterPolicy,
              window: 1000,
              reqLimit: 1
            })
            policy.initializeState()
            assert(policy.allow(undefined, undefined, 'foo'))
            assert(!policy.allow(undefined, undefined, 'foo'))
            assert(policy.allow(undefined, undefined, 'foo'))
            assert(!policy.allow(undefined, undefined, 'foo'))
            assert(!policy.allow(undefined, undefined, 'foo'))
            assert(policy.allow(undefined, undefined, 'foo'))
          }
        })
      ]
    }),

    //
    // PolicyLimiter tests
    //

    o({
      _type: testtube.Test,
      name: 'PolicyLimiterTests',
      description: 'PolicyLimiter tests',
      setup: function() {
        var self = this
        this.tests.forEach(function(test) {
          test.parent = self
        })
        sinon.stub(Service.prototype, '_init')
      },
      teardown: function() {
        Service.prototype._init.restore()
      },
      tests: [
        o({
          _type: testtube.Test,
          name: 'TestValidation',
          description: 'Test validation',
          doTest: function() {
            var selectors = ['a', 1, {}]
            selectors.forEach(function(selector) {
              assert.throws(function() {
                o({
                  _type: limiters.PolicyLimiter,
                  selector: selector,
                  policy: o({_type: limiterPolicies.WindowLimiterPolicy})
                })
              }, TypeError)
            })
            var policies = ['a', 1, {}]
            policies.forEach(function(policy) {
              assert.throws(function() {
                o({
                  _type: limiters.PolicyLimiter,
                  selector: o({_type: limiterSelectors.StaticKeyLimiterSelector}),
                  policy: policy
                })
              }, TypeError)
            })
          }
        }),
        o({
          _type: testtube.Test,
          name: 'TestInitialize',
          description: 'Test initialize method',
          doTest: function() {
            var service = o({_type: Service})
            var limiter = o({
              _type: limiters.PolicyLimiter,
              selector: o({
                _type: limiterSelectors.StaticKeyLimiterSelector,
                staticKey: 'foo'
              }),
              policy: o({_type: limiterPolicies.WindowLimiterPolicy})
            })
            limiter.initialize(service, service)
            assert.equal(_.keys(limiters.PolicyLimiter._state).length, 1)
            assert('service' in limiters.PolicyLimiter._state)
            assert.equal(_.keys(limiters.PolicyLimiter._state.service).length, 1)
            assert('foo' in limiters.PolicyLimiter._state.service)
            var endpoint = o({
              _type: Endpoint,
              path: '/bar'
            })
            var limiter1 = o({
              _type: limiters.PolicyLimiter,
              selector: o({
                _type: limiterSelectors.StaticKeyLimiterSelector,
                staticKey: 'foo'
              }),
              policy: o({_type: limiterPolicies.WindowLimiterPolicy})
            })
            limiter1.initialize(service, endpoint)
            assert.equal(_.keys(limiters.PolicyLimiter._state).length, 2)
            assert('/bar::ALL' in limiters.PolicyLimiter._state)
            assert.equal(_.keys(limiters.PolicyLimiter._state['/bar::ALL']).length, 1)
            assert('foo' in limiters.PolicyLimiter._state['/bar::ALL'])
            var operation = o({
              _type: Operation,
              endpoint: ({
                _type: Endpoint,
                path: '/baz'
              }),
              name: 'GET'
            })
            var limiter2 = o({
              _type: limiters.PolicyLimiter,
              selector: o({
                _type: limiterSelectors.StaticKeyLimiterSelector,
                staticKey: 'foo'
              }),
              policy: o({_type: limiterPolicies.WindowLimiterPolicy})
            })
            limiter2.initialize(service, operation)
            assert.equal(_.keys(limiters.PolicyLimiter._state).length, 3)
            assert('/baz::GET' in limiters.PolicyLimiter._state)
            assert.equal(_.keys(limiters.PolicyLimiter._state['/baz::GET']).length, 1)
            assert('foo' in limiters.PolicyLimiter._state['/baz::GET'])
            var limiter3 = o({
              _type: limiters.PolicyLimiter,
              selector: o({
                _type: limiterSelectors.StaticKeyLimiterSelector,
                key: 'foo'
              }),
              policy: o({_type: limiterPolicies.WindowLimiterPolicy})
            })
            assert.throws(function () {
              limiter3.initialize(service, {})
            }, TypeError)
          }
        }),
        o({
          _type: testtube.Test,
          name: 'TestPolicyLimiter',
          description: 'Test PolicyLimiter',
          setup: function() {
            var results = [
              0,    // allow
              500,  // reject
              1000, // allow
              1500, // reject
              1900, // reject
              2000  // allow
            ]
            sinon.stub(Date, 'now', function() {
              return results.shift()
            })
          },
          teardown: function() {
            Date.now.restore()
          },
          doTest: function() {
            var limiter = o({
              _type: limiters.PolicyLimiter,
              selector: o({_type: limiterSelectors.StaticKeyLimiterSelector}),
              policy: o({
                _type: limiterPolicies.WindowLimiterPolicy,
                window: 1000,
                reqLimit: 1
              })
            })
            sinon.stub(limiter, 'sendUnavailable', function() {})
            var nextSpy = sinon.spy()
            var service = o({_type: Service})
            limiter.initialize(service, service)
            for (var i = 0; i < 6; i++) {
              limiter.process({}, {}, nextSpy)
            }
            assert.equal(limiter.sendUnavailable.callCount, 3)
            assert.equal(nextSpy.callCount, 3)
          }
        })
      ]
    }),

    //
    // ChainLimiter tests
    //

    o({
      _type: testtube.Test,
      name: 'ChainLimiterTests',
      description: 'ChainLimiter tests',
      setup: function() {
        var self = this
        this.tests.forEach(function(test) {
          test.parent = self
        })
        sinon.stub(Service.prototype, '_init')
        this.service = o({_type: Service})
      },
      teardown: function() {
        Service.prototype._init.restore()
      },
      buildLimiter: function(visits) {
        visits = _.isUndefined(visits) ? 1 : visits
        return o({
          _type: limiters.FunctionLimiter,
          _fn: function(req, res) {
            if (!('visits' in this.state)) {
              this.state.visits = 0
            }
            if (this.state.visits === visits) {
              this.sendUnavailable(res)
              return false
            }
            this.state.visits += 1
            return true
          }
        })
      },
      tests: [
        o({
          _type: testtube.Test,
          name: 'TestInitialize',
          description: 'Test initialize method',
          doTest: function() {
            var self = this
            var limiters_ = [
              this.parent.buildLimiter(),
              this.parent.buildLimiter(),
              this.parent.buildLimiter()
            ]
            limiters_.forEach(function(limiter) {
              sinon.spy(limiter, 'initialize')
            })
            var limiterChain = o({
              _type: limiters.ChainLimiter,
              limiters: limiters_
            })
            limiterChain.initialize(this.parent.service, this.parent.service)
            limiters_.forEach(function(limiter) {
              assert(limiter.initialize.called)
              assert.equal(limiter.service, self.parent.service)
              assert.equal(limiter.node, self.parent.service)
            })
          }
        }),
        o({
          _type: testtube.Test,
          name: 'TestChainLimiter',
          description: 'Test ChainLimiter',
          doTest: function() {
            var self = this
            var limiters_ = [
              this.parent.buildLimiter(3),
              this.parent.buildLimiter(2),
              this.parent.buildLimiter(1)
            ]
            limiters_.forEach(function(limiter) {
              sinon.stub(limiter, 'sendUnavailable', function() { })
            })
            var limiterChain = o({
              _type: limiters.ChainLimiter,
              limiters: limiters_
            })
            limiterChain.initialize(this.parent.service, this.parent.service)

            var next = sinon.spy()

            var reset = function() {
              next.reset()
              limiters_.forEach(function(limiter) {
                limiter.sendUnavailable.reset()
              })
            }

            // req passes through
            limiterChain.process({}, {}, next)
            assert(next.called)
            assert.equal(0, next.firstCall.args.length)
            limiters_.forEach(function(limiter) {
              assert(!limiter.sendUnavailable.called)
            })
            reset()

            // req rejected by last limiter in chain
            limiterChain.process({}, {}, next)
            assert(!next.called)
            assert(!limiters_[0].sendUnavailable.called)
            assert(!limiters_[1].sendUnavailable.called)
            assert(limiters_[2].sendUnavailable.called)
            reset()

            // req rejected by second limiter in chain
            limiterChain.process({}, {}, next)
            assert(!next.called)
            assert(!limiters_[0].sendUnavailable.called)
            assert(limiters_[1].sendUnavailable.called)
            assert(!limiters_[2].sendUnavailable.called)
            reset()

            // req rejected by first limiter in chain
            limiterChain.process({}, {}, next)
            assert(!next.called)
            assert(limiters_[0].sendUnavailable.called)
            assert(!limiters_[1].sendUnavailable.called)
            assert(!limiters_[2].sendUnavailable.called)
            reset()

            sinon.stub(limiters_[0], 'process', function(req, res, next) {
              next(new Error('foo'))
            })
            limiterChain.process({}, {}, next)
            assert(next.called)
            assert.equal(next.firstCall.args.length, 1)
            assert(next.firstCall.args[0] instanceof Error)
            assert(!limiters_[0].sendUnavailable.called)
            assert(!limiters_[1].sendUnavailable.called)
            assert(!limiters_[2].sendUnavailable.called)
            reset()
            limiters_[0].process.restore()
          }
        }),
      ]
    })
  ]
})

