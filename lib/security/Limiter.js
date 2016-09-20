/**
 * @todo Integrate with {@link collections.Collection}
 */

var util = require('util')

var _ = require('lodash')
var Fiber = require('fibers')
var toobusy = require('toobusy-js')
var onFinished = require('on-finished')

var _o = require('bond')._o(module)
var HttpErrors = require('http-errors')
var o = require('atom').o(module)
var oo = require('atom').oo(module)

var LimiterSelector = require('./LimiterSelector').LimiterSelector
var LimiterPolicy = require('./LimiterPolicy').LimiterPolicy


/******************************************************************************
 * @interface Limiter
 */
var Limiter = oo({
  _C: function() {
    if (this.constructor === Limiter) {
      throw new Error('Interface')
    }
    /**
     * @member {carbond.Service}
     */
    this.service = undefined

    /**
     * @member {Service|Endpoint|Operation}
     *
     * @todo better name for this? node represents the top level {@link Service},
     *       an {@link Endpoint}, or an {@link Operation}
     */
    this.node = undefined

    /**
     * @member {boolean}
     */
    this.preAuth = false

  },

  /**********************************************************************
   * @method initialize
   *
   * @param {Service} service - the root `Service` object
   * @param {Service|carbond.Endpoint|carbond.Operation} [node] -
   *        the endpoint that this limiter is guarding
   */
  initialize: function(service, node) {
    this.service = service
    this.node = node
  },

  /**********************************************************************
   * @method process
   *
   * @param {Request} req - the request received
   * @param {Response} res - the response to be sent
   * @param {Function} next - pass control to the next request processor
   */
  process: function(req, res, next) {
    throw new Error('Not implemented')
  },

  /**********************************************************************
   * @method sendUnavailable
   *
   * Send a generic "service unavailable" response. Subclasses should
   * customize if they need to message something more specific.
   *
   * @param {Response} res - the Response object
   * @param {integer} [retryAfter=60] - amount of time the client should
   *                                    wait before retrying the request
   *                                    (if null, do not include the header)
   * @throws TypeError
   */
  sendUnavailable: function(res, retryAfter) {
    // XXX: probably shouldn't be using protected method
    if (_.isUndefined(retryAfter)) {
      retryAfter = 60
    }
    if (!(_.isNull(retryAfter) || _.isInteger(retryAfter))) {
      throw new TypeError('retryAfter must be undefined, null, or an integer')
    }
    if (!_.isNull(retryAfter)) {
      res.append('Retry-After', retryAfter.toString())
    }
    this.service._handleError(new HttpErrors.ServiceUnavailable(), res)
  }
})

/******************************************************************************
 * @class FunctionLimiter
 * @implements Limiter
 */
var FunctionLimiter = oo({
  _type: Limiter,

  _C: function() {
    this._fn = undefined
    this._state = undefined
  },

  _init: function() {
    Limiter.prototype._init.call(this)
    if (!_.isFunction(this.fn)) {
      throw new TypeError('fn must be a function')
    }
    if (this.fn.length < 2 || this.fn.length > 3) {
      throw new TypeError('fn must take 2 or 3 args')
    }
    this._state = {}
  },

  /**********************************************************************
   * @property fn
   *
   * @description
   * </pre>
   * fn should have one of two signatures:
   *
   * - fn(req, res, next)
   * - fn(req, res)
   *
   * if fn has the signature (req, res), it should return true if the
   * request is allowed and false otherwise.
   * </pre>
   */
  fn: {
    $property: {
      get: function() {
        return this._fn
      },
      set: function(fn) {
        assert(_.isFunction(fn))
        this._fn = fn
      }
    }
  },

  state: {
    $property: {
      get: function() {
        return this._state
      }
    }
  },

  /**********************************************************************
   * @inheritdoc
   */
  process: function(req, res, next) {
    try {
      if (this.fn.length === 2) {
          if (this.fn.call(this, req, res)) {
            next()
          }
      } else {
        this.fn.call(this, req, res, next)
      }
    } catch (err) {
      next(err)
    }
  }
})

/******************************************************************************
 * @class PolicyLimiter
 * @implements Limiter
 */
var PolicyLimiter = oo({
  _type: Limiter,

  /**********************************************************************
   * @method _C
   */
  _C: function() {

    /**
     * @member {carbond.security.LimiterSelector}
     */
    this.selector = undefined

    /**
     * @member {carbond.security.LimiterPolicy}
     */
    this.policy = undefined
  },

  /**********************************************************************
   * @method _init
   */
  _init: function() {
    Limiter.prototype._init.call(this)
    if (!(this.selector instanceof LimiterSelector)) {
      throw new TypeError('"selector" must be an instance of `LimiterSelector`')
    }
    if (!(this.policy instanceof LimiterPolicy)) {
      throw new TypeError('"policy" must be an instance of `LimiterPolicy`')
    }
  },

  /**********************************************************************
   * @inheritdoc
   */
  initialize: function(service, node) {
    Limiter.prototype.initialize.call(this, service, node)
    // cascade initialization
    this.policy.initialize(this, node)

    // manage state
    var stateKey = this.policy.stateKey
    if (!(stateKey in PolicyLimiter._state)) {
      PolicyLimiter._state[stateKey] = {}
    }
    PolicyLimiter._state[stateKey][this.selector.hash] =
      this.policy.initializeState(
        PolicyLimiter._state[stateKey][this.selector.hash])
  },

  /**********************************************************************
   * @inheritdoc
   */
  process: function(req, res, next) {
    var selector = this.selector.key(req)
    if (this.policy.allow(req, res, selector)) {
      next()
    } else {
      this.sendUnavailable(res)
    }
  }
})

PolicyLimiter._state = {}

PolicyLimiter.resetState = function () {
  for (var stateKey in PolicyLimiter._state) {
    for (var selectorHash in PolicyLimiter._state[stateKey]) {
      PolicyLimiter._state[stateKey][selectorHash].reset()
    }
  }
}

/******************************************************************************
 * @class ChainLimiter
 * @extends Limiter
 */
var ChainLimiter = oo({
  _type: Limiter,

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
      if (skip || responseSent) return
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
  }
})

/******************************************************************************
 * @class TooBusyLimiter
 * @extends FunctionLimiter
 */
var TooBusyLimiter = oo({
  _type: FunctionLimiter,

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
     * @member
     */
    this.toobusyMaxLag = 70
    /**
     * interval between event loop lag checks
     * NOTE: this is simply exposing a parameter used by the underlying "toobusy-js" module
     * @member
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

    if (self.absMaxOutstandingReqs != Infinity   &&
        !_.isInteger(self.absMaxOutstandingReqs) ||
        self.absMaxOutstandingReqs <= 0) {
      throw new TypeError('absMaxOutstandingReqs must be Infinity or a positive integer')
    }

    if (!_.isNumber(self.fiberPoolAllowedOverflow) ||
        self.fiberPoolAllowedOverflow < 0) {
      throw new TypeError('fiberPoolAllowedOverflow must be a positive number')
    }

    var intProps = [
      'toobusyMaxLag',
      'toobusyInterval'
    ]
    intProps.forEach(function(prop) {
      if (!_.isInteger(self[prop])) {
        throw new Error(prop + ' must be an integer')
      } else if (self[prop] <= 0) {
        throw new Error(prop + ' must be > 0')
      }
    })

    if (this.useFiberPoolSize) {
      self.absMaxOutstandingReqs = Math.round(
        Fiber.poolSize + this.fiberPoolAllowedOverflow * Fiber.poolSize)
    }
    this._maxOutstandingReqs = this.absMaxOutstandingReqs
    toobusy.maxLag(this.toobusyMaxLag)
    toobusy.interval(this.toobusyInterval)
  },

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
    var toobusy_ = toobusy()
    var poolExhausted = numReqs > Fiber.poolSize

    if (toobusy_) {
      this.service.logWarning(
        util.format('Node event loop falling behind (%d reqs), sending 503',
                    numReqs))
    } else if (numReqs > self.maxOutstandingReqs) {
      this.service.logWarning(
        util.format('Too many requests (%d reqs > %d max reqs), sending 503',
                    numReqs, this.maxOutstandingReqs))
    }

    // poolExhausted doesn't actually influence whether of not the request is
    // rejected, leaving this here for development purposes
    if (poolExhausted) {
      this.service.logDebug(
        util.format('Fiber pool exhausted (%d reqs > %d fibers)',
          numReqs, Fiber.poolSize))
    }

    // if this request would push the number of outstanding requests over the max
    // or the event loop is starting to lag, we reevaluate the current max and
    // send out the 503
    if (numReqs > self.maxOutstandingReqs || toobusy_) {
      if (toobusy_) {
        self._maxOutstandingReqs = self._outstandingReqs
        self._growthExponent = 0
      }
      return self.sendUnavailable(res)
    }

    // grow the number of allowed requests up to the configured absolute
    if (self.maxOutstandingReqs < self.absMaxOutstandingReqs) {
      self.maxOutstandingReqs = Math.min(self.maxOutstandingReqs +
                                         Math.pow(2, self._growthExponent),
                                         self.absMaxOutstandingReqs)
      self._growthExponent += 1
    }

    // update the number of outstanding reqs
    self._outstandingReqs = numReqs
    // set callback to adjust this number once the request has finished
    // XXX: should we be setting this on Result? would this be called even if a
    //      response is never sent?
    onFinished(req, function(err, req) {
      self._outstandingReqs -= 1
    })
    // pass the baton
    return next()
  }

})

module.exports = {
  Limiter: Limiter,
  FunctionLimiter: FunctionLimiter,
  PolicyLimiter: PolicyLimiter,
  ChainLimiter: ChainLimiter,
  TooBusyLimiter: TooBusyLimiter
}
