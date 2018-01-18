var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

var LimiterPolicy = require('./LimiterPolicy')

/******************************************************************************
 * class LimiterPolicy
 * @abstract
 */
var WindowLimiterPolicy = oo({
  _type: LimiterPolicy,
  _ctorName: 'WindowLimiterPolicy',

  _C: function() {
    this.window = 1000
    this.reqLimit = 1
  },

  _init: function() {
    LimiterPolicy.prototype._init.call(this)
    if (!_.isInteger(this.window) || this.window < 0) {
      throw new TypeError('"window" must be an integer >= 0')
    }
    if (!_.isInteger(this.reqLimit) || this.reqLimit < 0) {
      throw new TypeError('"reqLimit" must be an integer >= 0')
    }
  },

  /**********************************************************************
   * @inheritdoc
   */
  allow: function(req, res, selector) {
    var now = Date.now()
    this._state.purge(now - this.window, selector)
    if (this._state.visits(selector) >= this.reqLimit) {
      return false
    }
    this._state.visit(req, selector, now)
    return true
  }
})

module.exports = WindowLimiterPolicy
