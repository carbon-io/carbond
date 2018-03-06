var cc = require('@carbon-io/carbon-core')
var __ = cc.fibers.__(module)
var o = cc.atom.o(module)

var Service = require('../../../lib/Service')
var Endpoint = require('../../../lib/Endpoint')

var PolicyLimiter = require('../../../lib/limiter/PolicyLimiter')
var StaticKeyLimiterSelector = require('../../../lib/limiter/StaticKeyLimiterSelector')
var WindowLimiterPolicy = require('../../../lib/limiter/WindowLimiterPolicy')

var PolicyLimiterExample = {
  _type: Service,

  serviceName: 'PolicyLimiterExample',
  description: 'PolicyLimiter example service',

  endpoints: {
    foo: o({
      _type: Endpoint,
      description: 'foo',
      // allow 1 request/s
      limiter: o({
        _type: PolicyLimiter,
        selector: o({
          _type: StaticKeyLimiterSelector,
          staticKey: 'foo',
        }),
        policy: o({
          _type: WindowLimiterPolicy,
          window: 1000,
          reqLimit: 1,
        }),
      }),
      get: function(req, res) {
        return {get: 'foo'}
      },
      endpoints: {
        bar: o({
          _type: Endpoint,
          description: 'foo/bar',
          // allow 1 request/s
          limiter: o({
            _type: PolicyLimiter,
            selector: o({
              _type: StaticKeyLimiterSelector,
              staticKey: 'foo/bar',
            }),
            policy: o({
              _type: WindowLimiterPolicy,
              window: 1000,
              reqLimit: 1,
            }),
          }),
          get: function() {
            return {get: 'foo/bar'}
          },
        }),
      },
    }),
    baz: o({
      _type: Endpoint,
      description: 'baz',
      // allow 1 request/s
      limiter: o({
        _type: PolicyLimiter,
        selector: o({
          _type: StaticKeyLimiterSelector,
          staticKey: 'baz',
        }),
        policy: o({
          _type: WindowLimiterPolicy,
          window: 1000,
          reqLimit: 1,
        }),
      }),
      get: function() {
        return {get: 'baz'}
      },
    }),
  },
}

module.exports = PolicyLimiterExample

if (require.main === module) {
  __.main(function() {
    o.main(PolicyLimiterExample)
  })
}

