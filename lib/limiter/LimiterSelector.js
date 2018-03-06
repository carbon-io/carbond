var oo = require('@carbon-io/carbon-core').atom.oo(module)

/******************************************************************************
 * class LimiterSelector
 * @interface
 *
 * Subclasses should extract the "key" from an incoming request that will be
 * used to bucket similar requests being managed by a particular policy.
 *
 */
var LimiterSelector = oo({
  _ctorName: 'LimiterSelector',

  _C: function() {
    if (this.constructor === LimiterSelector) {
      throw new Error('Interface')
    }
  },

  /**********************************************************************
   * property hash
   *
   * A key that is unique for similar instantiations of a
   * LimiterSelector (e.g., LimiterSelector(a).hash ===
   * LimiterSelector(a).hash && LimiterSelector(a).hash !==
   * LimiterSelector(b).hash).
   *
   */
  hash: {
    $property: {
      get: function() {
        throw new Error('Not implemented')
      },
    },
  },

  /**********************************************************************
   * method key
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
  },
})


module.exports = LimiterSelector
