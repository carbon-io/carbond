var _ = require('lodash')
var Heap = require('heap')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

/******************************************************************************
 * @class LimiterPolicyState
 */
var LimiterPolicyState = oo({
  _ctorName: 'LimiterPolicyState',

  _C: function() {
    this._state = undefined
  },

  _init: function() {
    this._state = {}
  },

  _initStateForSelector: function(selector) {
    var state = this._state[selector]
    if (_.isUndefined(state)) {
      this._state[selector] = state = new Heap()
    }
    return state
  },

  /**********************************************************************
   * method visit
   *
   * @param {Request} req - the inbound request (XXX: keep this?)
   * @param {String} selector - the "key" that we are rate limiting on
   * @param {Integer} timestamp - the time at which this request was
   *                              "processed"
   */
  visit: function(req, selector, timestamp) {
    if (!_.isString(selector)) {
      throw TypeError('selector must be a string')
    }
    var state = this._initStateForSelector(selector)
    if (_.isUndefined(timestamp)) {
      timestamp = Date.now()
    }
    if (!_.isInteger(timestamp)) {
      throw TypeError('timestamp must be a number')
    }
    state.push(timestamp)
  },

  /**********************************************************************
   * method visits
   */
  visits: function(selector) {
    if (!(selector in this._state)) {
      return 0
    }
    return this._state[selector].size()
  },

  /**********************************************************************
   * method purge
   *
   * Remove all state that matches both {@link selector} and
   * {@link predicate}
   *
   * XXX: think more about how this should behave in a shared context
   *
   * @param {Integer|Function} predicate - if this is an `Integer`, all
   *                                       elements that are <= `predicate`
   *                                       will be purged, otherwise
   *                                       elements will be purged until
   *                                       `predicate` returns `false`
   * @param {String} selector - if present, only purge elements that
   *                            match `selector`
   *
   * @returns {Integer} - the number of elements removed
   */
  purge: function(predicate, selector) {
    var self = this
    var keys = _.isUndefined(selector) ? _.keys(this._state) : [selector]
    var _predicate = _.isInteger(predicate) ? function(ts) {
      return ts <= predicate
    } : predicate
    var numPurged = 0
    keys.forEach(function(key) {
      if (_.isUndefined(self._state[key])) {
        return
      }
      while (_predicate(self._state[key].peek())) {
        self._state[key].pop()
        numPurged += 1
      }
      if (self._state[key].size() === 0) {
        delete self._state[key]
      }
    })
    return numPurged
  },

  /**********************************************************************
   * method reset
   *
   * Delete all state
   */
  reset: function() {
    this._state = {}
  },
})

module.exports = LimiterPolicyState
