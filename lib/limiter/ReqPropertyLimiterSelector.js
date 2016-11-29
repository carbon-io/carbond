var assert = require('assert')

var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

var LimiterSelector = require('./LimiterSelector')

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

module.exports = ReqPropertyLimiterSelector
