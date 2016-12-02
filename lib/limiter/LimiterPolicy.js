var _ = require('lodash')
var _o = require('@carbon-io/carbon-core').bond._o(module)
var o = require('@carbon-io/carbon-core').atom.o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var Endpoint = require('../Endpoint')
var Operation = require('../Operation')
var Service = require('../Service')

var LimiterPolicyState = require('./LimiterPolicyState')

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
   * @property stateKey
   *
   * @readonly
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
   * @property state
   *
   * @readonly
   *
   * A pointer to the {@link carbond.limiter.LimiterPolicyState.
   */
  state: {
    $property: {
      get: function() {
        return this._state
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
   * @method allow
   *
   * @abstract
   */
  allow: function(req, res, selector) {
    throw new Error('Abstract')
  }
})

LimiterPolicy.SHARED_STATE_KEY = '__shared__state__'

module.exports = LimiterPolicy
