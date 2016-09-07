var _ = require('lodash')

var _o = require('bond')._o(module)
var HttpErrors = require('http-errors')
var o = require('atom').o(module)
var oo = require('atom').oo(module)

var LimiterSelector = require('./LimiterSelector')


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
     * @member {carbond.Service|carbond.Endpoint|carbond.Operation}
     *
     * XXX: better name for this? node represents the top level `Service`, an
     *      `Endpoint`, or an `Operation`.
     */
    this.node = undefined
  },

  /**********************************************************************
   * @method initialize
   *
   * @param {carbond.Service} service - the root `Service` object
   * @param {carbond.Service|carbond.Endpoint|carbond.Operation} [node] -
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
   */
  sendUnavailable: function(res) {
    // XXX: probably shouldn't be using protected method
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
   * fn should have one of two signatures:
   *
   * - fn(req, res, next)
   * - fn(req, res)
   *
   * if fn has the signature (req, res), it should return true if the
   * request is allowed and false otherwise.
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

    /**
     * @member {boolean}
     */
    this.preAuth = false

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
    if (this.policy.allow(req, selector)) {
      next()
    } else {
      this.sendUnavailable()
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
 * @class LimiterChain
 * @extends Limiter
 */
var LimiterChain = oo({
  _type: Limiter,

  _C: function() {
    this.limiters = undefined
  },

  _init: function() {
    Limiter.prototype._init.call(this)
    if (_.isUndefined(this.limiters)) {
      throw new TypeError('limiters must not be undefined')
    }
    if (!_.isArray(this.limiters)) {
      this.limiters = [this.limiters]
    }
    this.limiters.forEach(function(limiter) {
      if (!(limiter instanceof Limiter)) {
        throw new TypeError('limiters must be an instance of carbond.Limiter')
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
   *
   */
  process: function(req, res, next) {

    var allow = _.map(this.limiters, function(limiter) {
      return
    })
  }
})

module.exports = {
  Limiter: Limiter,
  FunctionLimiter: FunctionLimiter,
  PolicyLimiter: PolicyLimiter,
  LimiterChain: LimiterChain
}
