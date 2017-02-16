var oo = require('@carbon-io/carbon-core').atom.oo(module)

var Limiter = require('./Limiter')
var LimiterSelector = require('./LimiterSelector')
var LimiterPolicy = require('./LimiterPolicy')

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
      this.sendUnavailable(res, next)
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

module.exports = PolicyLimiter
