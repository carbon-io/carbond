var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

var LimiterSelector = require('./LimiterSelector')

/******************************************************************************
 * @class StaticKeyLimiterSelector
 * @implements LimiterSelector
 *
 * Returns a static key independent of the request
 *
 */
var StaticKeyLimiterSelector = oo({
  _type: LimiterSelector,

  _C: function() {
    /**
     * @member {string} - static string to return
     */
    this.staticKey = '*'
  },

  _init: function() {
    if (!_.isString(this.staticKey)) {
      throw new TypeError('"staticKey" must be a string')
    }
  },

  hash: {
    $property: {
      get: function() {
        return this.staticKey
      }
    }
  },

  /**********************************************************************
   * @method key
   *
   * Ignore the current request and return a static key
   *
   * @returns {String} - static key
   */
  key: function(req) {
    return this.staticKey
  }
})

module.exports = StaticKeyLimiterSelector
