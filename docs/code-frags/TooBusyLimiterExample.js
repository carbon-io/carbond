var cc = require('@carbon-io/carbon-core')
var fibers = cc.fibers
var __ = cc.fibers.__(module)
var o = cc.atom.o(module)
var oo = cc.atom.oo(module)

var Service = require('../../lib/Service')
var Endpoint = require('../../lib/Endpoint')

var TooBusyLimiter = require('../../lib/limiter/TooBusyLimiter')

var TooBusyLimiterExample = {
  _type: Service,
  
  serviceName: 'TooBusyLimiterExample',
  description: 'TooBusyLimiter example service',

  // to enable the busy limiter, make sure to use the "--enable-busy-limiter" flag
  // you can also lower Fibers's pool size with the "--fiber-pool-size" flag
  busyLimiter: o({
    _type: TooBusyLimiter,
    useFiberPoolSize: true,
    fiberPoolAllowedOverflow: .2
  }),

  doStart: function(options) {
    var self = this
    this.loggingInterval = setInterval(function() {
      self.logInfo('max outstanding requests: ' + self.busyLimiter.maxOutstandingReqs)
      self.logInfo('outstanding requests: ' + self.busyLimiter.outstandingReqs)
    }, 500)
  },

  doStop: function() {
    if (typeof this.loggingInterval != 'undefined') {
      clearInterval(this.loggingInterval)
    }
  },

  endpoints: {
    foo: o({
      _type: Endpoint,
      description: 'foo',
      get: function(req, res, next) {
        setTimeout(function() {
          res.json({get: 'foo'})
        }, 500)
      }
    })
  }
}

module.exports = TooBusyLimiterExample

if (require.main === module) {
  __.main(function() {
    o.main(TooBusyLimiterExample)
  })
}


