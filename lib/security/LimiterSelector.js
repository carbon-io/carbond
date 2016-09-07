var assert = require('assert')

var _ = require('lodash')

var _o = require('bond')._o(module)
var o = require('atom').o(module)
var oo = require('atom').oo(module)

/******************************************************************************
 * @class LimiterSelector
 * @interface
 *
 * Subclasses should extract the "key" from an incoming request that will be
 * used to bucket similar requests being managed by a particular policy.
 *
 */
var LimiterSelector = oo({
  _C: function() {
    if (this.constructor === LimiterSelector) {
      throw new Error('Interface')
    }
  },

  /**********************************************************************
   * @property hash
   *
   * A key that is unique for similar instantiations of a
   * LimiterSelector (e.g., Limiter(a).hash === Limiter(a).hash &&
   * Limiter(a).hash !== Limiter(b).hash).
   */
  hash: {
    $property: {
      get: function() {
        throw new Error('Not implemented')
      }
    }
  },

  /**********************************************************************
   * @method key
   *
   * Extract the limiter key from req.
   *
   * XXX: should probably log to debug if key is not found
   *
   * @param {express.request} req - the current request
   *
   * @returns {String|undefined} - the key used to lookup the appropriate
   *                               limiter bucket or undefined if the key
   *                               is not found or can not be generated
   */
  key: function(req) {
    throw new Error('Not Implemented')
  }
})

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

/******************************************************************************
 * @class ReqPropertyLimiterSelector
 * @implements LimiterSelector
 *
 *
 * Use the property lookup string to extract the key from the current request.
 *
 */
var ReqPropertyLimiterSelector = oo({
  _type: LimiterSelector,

  _C: function() {
    /**
     * @member {String} - property path to "key" (e.g.,
     *                    "parameters.header.foo")
     */
    this.propertyPath = undefined
    /**
     * @member {Function|undefined} - apply the transform to the key extracted
     *                                via {@link propertyPath}
     */
    this.transform = undefined
  },

  _init: function() {
    if (!_.isString(this.propertyPath) || this.propertyPath.length === 0) {
      throw new TypeError('"propertyPath" must be a string')
    }
    this.propertyPath = this.propertyPath.split('.')
    if (!_.isUndefined(this.transform) && !_.isFunction(this.transform)) {
      throw new TypeError('"transform" must be undefined or a function')
    }
  },

  hash: {
    $property: {
      get: function() {
        return this.propertyPath
      }
    }
  },

  /**********************************************************************
   * @inheritdoc
   */
  key: function(req) {
    var key = req
    this.propertyPath.forEach(function(prop) {
      key = key[prop]
      if (_.isUndefined(key)) {
        return key
      }
    })
    if (_.isFunction(this.transform)) {
      key = this.transform(key)
    }
    assert(!_.isObject(key))
    return key
  }
})

module.exports = {
  LimiterSelector: LimiterSelector,
  StaticKeyLimiterSelector: StaticKeyLimiterSelector,
  ReqPropertyLimiterSelector: ReqPropertyLimiterSelector
}

