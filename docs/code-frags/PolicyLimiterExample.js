var _ = require('lodash')

var cc = require('@carbon-io/carbon-core')
var __ = cc.fibers.__(module)
var _o = cc.bond._o(module)
var o = cc.atom.o(module)
var oo = cc.atom.oo(module)
var tt = cc.testtube

var Service = require('../../lib/Service')
var Endpoint = require('../../lib/Endpoint')

var PolicyLimiter = require('../../lib/limiter/PolicyLimiter')
var StaticKeyLimiterSelector = require('../../lib/limiter/StaticKeyLimiterSelector')
var WindowLimiterPolicy = require('../../lib/limiter/WindowLimiterPolicy')

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
          staticKey: 'foo'
        }),
        policy: o({
          _type: WindowLimiterPolicy,
          window: 1000,
          reqLimit: 1
        }),
      }),
      get: function(req, res) {
        res.status(200)
        res.append('Content-Type', 'text/html')
        res.send('<html><body>foo</body></html>')
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
              staticKey: 'foo/bar'
            }),
            policy: o({
              _type: WindowLimiterPolicy,
              window: 1000,
              reqLimit: 1
            }),
          }),
          get: function() {
            return 'foo/bar'
          }
        })
      }
    }),
    baz: o({
      _type: Endpoint,
      description: 'baz',
      // allow 1 request/s
      limiter: o({
        _type: PolicyLimiter,
        selector: o({
          _type: StaticKeyLimiterSelector,
          staticKey: 'baz'
        }),
        policy: o({
          _type: WindowLimiterPolicy,
          window: 1000,
          reqLimit: 1
        }),
      }),
      get: function() {
        return 'baz'
      }
    })
  }
}

var test = {
  _type: tt.Test,
  setup: function(done) {
  },
  teardown: function(done) {
  }
}

module.exports = {
  PolicyLimiterExample: PolicyLimiterExample,
  test: test
}

if (require.main === module) {
  __.main(function() {
    o.main(PolicyLimiterExample)
  })
}

