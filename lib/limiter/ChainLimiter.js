var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

var Limiter = require('./Limiter')

/******************************************************************************
 * class ChainLimiter
 * extends Limiter
 */
var ChainLimiter = oo({
  _type: Limiter,
  _ctorName: 'ChainLimiter',

  _C: function() {
    this.limiters = undefined
  },

  _init: function() {
    var self = this

    Limiter.prototype._init.call(self)

    if (_.isUndefined(self.limiters)) {
      throw new TypeError('limiters must not be undefined')
    }
    if (!_.isArray(self.limiters)) {
      self.limiters = [self.limiters]
    }
    self.limiters.forEach(function(limiter) {
      if (!(limiter instanceof Limiter)) {
        throw new TypeError('limiters must be an instance of carbond.Limiter')
      } else if (self.preAuth != limiter.preAuth) {
        throw new TypeError('ChainLimiter preAuth mismatch with child limiters')
      }
    })
  },

  /**********************************************************************
   * @inheritdoc
   */
  initialize: function(service, node) {
    Limiter.prototype.initialize.call(this, service, node)
    var self = this
    this.limiters.forEach(function(limiter) {
      limiter.initialize(service, node)
    })
  },

  /**********************************************************************
   * @inheritdoc
   */
  process: function(req, res, next) {
    var called = false
    var args = []
    var skip = false
    var responseSent = false
    var _next = function() {
      called = true
      args = arguments
    }

    this.limiters.forEach(function(limiter) {
      // if we got an error or a response was sent, then "break"
      if (skip || responseSent) {
        return
      }
      limiter.process(req, req, _next)
      if (called) {
        if (args.length > 0) {
          // next will be called below with err arg
          skip = true
        } else {
          // reset next called state
          called = false
        }
      } else {
        // if next not called, assume response sent
        responseSent = true
      }
    })

    if (!responseSent) {
      // if response was not sent, call next (with err if applicable)
      next.apply(undefined, args)
    }
  },
})

module.exports = ChainLimiter
