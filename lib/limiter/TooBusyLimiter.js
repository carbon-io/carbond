var util = require('util')

var _ = require('lodash')
var fibers = require('@carbon-io/carbon-core').fibers
var toobusy = require('toobusy-js')
var onFinished = require('on-finished')

var HttpErrors = require('@carbon-io/carbon-core').HttpErrors
var oo = require('@carbon-io/carbon-core').atom.oo(module)
var o = require('@carbon-io/carbon-core').atom.o(module)

var FunctionLimiter = require('./FunctionLimiter')

/******************************************************************************
 * class TooBusyLimiter
 * @extends FunctionLimiter
 */
var TooBusyLimiter = oo({
  _type: FunctionLimiter,
  _ctorName: 'TooBusyLimiter',

  _C: function() {
    /**
     * The absolute maximum number of outstanding requests [default: Infinity]
     * @member {integer}
     */
    this.absMaxOutstandingReqs = Infinity
    /**
     * Use Fiber's pool size to set absMaxOutstandingReqs
     * @member {boolean}
     */
    this.useFiberPoolSize = false
    /**
     * The allowed fiber pool overflow as a percentage of the current pool size
     * (absMaxOutstandingReqs == Fiber.poolSize + Fiber.poolSize * fiberPoolAllowedOverflow)
     * @member {boolean}
     */
    this.fiberPoolAllowedOverflow = 0
    /**
     * threshold for event loop lag when deciding if the process is "too busy" (milliseconds)
     * NOTE: this is simply exposing a parameter used by the underlying "toobusy-js" module
     * @member {integer}
     */
    this.toobusyMaxLag = 70
    /**
     * interval between event loop lag checks
     * NOTE: this is simply exposing a parameter used by the underlying "toobusy-js" module
     * @member {integer}
     */
    this.toobusyInterval = 500
    /**
     * The current upper bound on oustanding requests
     * @type {integer}
     * @private
     */
    this._maxOutstandingReqs = 0
    /**
     * The current number of outstanding requests
     * @type {integer}
     * @private
     */
    this._outstandingReqs = 0
    /**
     * The current exponent by which _maxOutstandingReqs will be increased
     * @type {integer}
     * @private
     */
    this._growthExponent = 0
  },

  _init: function() {
    FunctionLimiter.prototype._init.call(this)
    var self = this

    this.throttlingResponse = o({
      type: HttpErrors.ServiceUnavailable,
      message: 'The server is too busy, please try back later.'
    });

    if (self.absMaxOutstandingReqs != Infinity && !_.isInteger(self.absMaxOutstandingReqs) ||
      self.absMaxOutstandingReqs <= 0) {
      throw new TypeError('absMaxOutstandingReqs must be Infinity or a positive integer')
    }

    if (!_.isNumber(self.fiberPoolAllowedOverflow) ||
      self.fiberPoolAllowedOverflow < 0) {
      throw new TypeError('fiberPoolAllowedOverflow must be a positive number')
    }

    // hard limits embedded in the toobusy module
    // XXX: can't depend on toobusy to report value errors since it uses a "falsey" test on
    //      the new value
    var intProps = {
      toobusyMaxLag: 10,
      toobusyInterval: 16
    }
    for (var prop in intProps) {
      if (!_.isInteger(self[prop])) {
        throw new TypeError(prop + ' must be an integer')
      } else if (self[prop] <= intProps[prop]) {
        throw new TypeError(prop + ' must be > ' + intProps[prop])
      }
    }
  },

  initialize: function(service, node) {
    FunctionLimiter.prototype.initialize.call(this, service, node)
    var self = this

    if (this.useFiberPoolSize) {
      var updateAbsMaxOutstanding = function() {
        self.absMaxOutstandingReqs = Math.round(
          fibers.getFiberPoolSize() + 
          self.fiberPoolAllowedOverflow * 
          fibers.getFiberPoolSize())
      }
      var updateAbsMaxOutstandingTimer = setInterval(function() {
        updateAbsMaxOutstanding()
      }, 1000)
      updateAbsMaxOutstanding()
      self.service.logDebug('TooBusyLimiter registering for Service stop event')
      this.service.on('stop', function() {
        self.service.logDebug('TooBusyLimiter received Service stop event')
        clearInterval(updateAbsMaxOutstandingTimer)
      })
    }
    this._maxOutstandingReqs = this.absMaxOutstandingReqs
    this.toobusy.maxLag(this.toobusyMaxLag)
    this.toobusy.interval(this.toobusyInterval)
  },

  // XXX: here to allow stubbing
  toobusy: toobusy,

  maxOutstandingReqs: {
    '$property': {
      get: function() {
        return this._maxOutstandingReqs
      }
    }
  },

  outstandingReqs: {
    '$property': {
      get: function() {
        return this._outstandingReqs
      }
    }
  },

  fn: function(req, res, next) {
    var self = this
    var numReqs = self._outstandingReqs + 1
    var toobusy_ = this.toobusy()
    var poolExhausted = numReqs > fibers.getFiberPoolSize()

    if (toobusy_) {
      this.service.logWarning(
        util.format('Node event loop falling behind (%d reqs), sending 503',
                    numReqs))
    } else if (numReqs > self.maxOutstandingReqs) {
      this.service.logWarning(
        util.format('Too many requests (%d reqs > %d max reqs), sending 503',
                    numReqs, this.maxOutstandingReqs))
    }

    // poolExhausted doesn't actually influence whether or not the request is
    // rejected, leaving this here for development purposes
    if (poolExhausted) {
      this.service.logDebug(
        util.format('Fiber pool exhausted (%d reqs > %d fibers)',
          numReqs, fibers.getFiberPoolSize()))
    }

    // if this request would push the number of outstanding requests over the max
    // or the event loop is starting to lag, we reevaluate the current max and
    // send out the 503
    if (numReqs > self.maxOutstandingReqs || toobusy_) {
      if (toobusy_) {
        self._maxOutstandingReqs = self._outstandingReqs < 1 ? 1 : self._outstandingReqs
        self._growthExponent = 0
      }
      return self.sendUnavailable(res, next)
    }

    // grow the number of allowed requests up to the configured absolute
    if (self.maxOutstandingReqs < self.absMaxOutstandingReqs) {
      self._maxOutstandingReqs = Math.min(self.maxOutstandingReqs + Math.pow(2, self._growthExponent), self.absMaxOutstandingReqs)
      self._growthExponent += 1
    }

    // update the number of outstanding reqs
    self._outstandingReqs = numReqs
    // set callback to adjust this number once the request has finished
    // XXX: should we be setting this on the request or response? will this fire
    //      if a response never gets sent?
    onFinished(res, function(err, res) {
      self._outstandingReqs -= 1
    })
    // pass the baton
    return next()
  }

})

module.exports = TooBusyLimiter
