var _ = require('lodash')
var Heap = require('heap')

var _o = require('bond')._o(module)
var o = require('atom').o(module)
var oo = require('atom').oo(module)

var Endpoint = require('../Endpoint')
var Operation = require('../Operation')
var Service = require('../Service')

/******************************************************************************
 * @class LimiterPolicyState
 */
var LimiterPolicyState = oo({
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
   * @method visit
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
   * @method visits
   */
  visits: function(selector) {
    if (!(selector in this._state)) {
      return 0
    }
    return this._state[selector].size()
  },

  /**********************************************************************
   * @method purge
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
    var _predicate = _.isInteger(predicate) ? function(ts) {return ts <= predicate} : predicate
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
   * @method reset
   *
   * Delete all state
   */
  reset: function() {
    this._state = {}
  }
})

/******************************************************************************
 * @class LimiterPolicy
 * @abstract
 *
 */
var LimiterPolicy = oo({
  /**********************************************************************
   * @method _C
   */
  _C: function() {
    if (this.constructor === LimiterPolicy) {
      throw new Error('Abstract')
    }

    this.sharedState = false

    this.limiter = undefined
    this.node = undefined

    this._key = undefined
    this._state = undefined
    this._initialized = false
  },

  _init: function() {

  },

  /**********************************************************************
   * @method initialize
   */
  initialize: function(limiter, node) {
    if (this._initialized) {
      throw new Error('double initialization')
    }
    this.limiter = limiter
    this.node = node
    this._initialized = true
  },

  /**********************************************************************
   * XXX: proper jsdoc?
   *
   * A key used to register state with the limiter. This should
   * facilitate global resets of state and sharing of state between
   * limiters in order to apply a limiting policy based on access
   * patterns across endpoints.
   */
  stateKey: {
    $property: {
      get: function() {
        if (_.isUndefined(this._key)) {
          if (this.sharedState) {
            this._key = LimiterPolicy.SHARED_STATE_KEY
          } else {
            if (this.node instanceof Service) {
              this._key = 'service'
            } else if (this.node instanceof Operation) {
              this._key = this.node.endpoint.path + '::' + this.node.name
            } else if (this.node instanceof Endpoint) {
              this._key = this.node.path + '::ALL'
            } else {
              throw new TypeError('node must be an instance of Service, Operation, or Endpoint')
            }
          }
        }
        return this._key
      }
    }
  },

  /**********************************************************************
   * @method initializeState
   */
  initializeState: function(state) {
    if (!(this.sharedState || _.isUndefined(state))) {
      throw new Error('LimiterPolicyState is not shared')
    }
    this._state = _.isUndefined(state) ? o({_type: LimiterPolicyState}) : state
    return this._state
  },

  /**********************************************************************
   * @method
   */
  allow: function(req, res, selector) {
    throw new Error('Abstract')
  }
})

LimiterPolicy.SHARED_STATE_KEY = '__shared__state__'

/******************************************************************************
 * @class LimiterPolicy
 * @abstract
 */
var WindowLimiterPolicy = oo({
  _type: LimiterPolicy,

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

module.exports = {
  LimiterPolicyState: LimiterPolicyState,
  LimiterPolicy: LimiterPolicy,
  WindowLimiterPolicy: WindowLimiterPolicy
}
