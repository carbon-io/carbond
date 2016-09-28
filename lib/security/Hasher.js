var _ = require('lodash')

var _o = require('bond')._o(module)
var o = require('atom').o(module)
var oo = require('atom').oo(module)


/******************************************************************************
 * @class Hasher
 * @abstract
 *
 * @property {string} data - data getter/setter
 * @property {string} digest - digest getter
 */
var Hasher = oo({
  /**********************************************************************
   * @method _C
   */
  _C: function() {
    if (this.constructor === Hasher) {
      throw new Error('Abstract')
    }
  },

  /**********************************************************************
   * @method hash
   * @abstract
   *
   * @param {string} data - the data to hash
   *
   * @returns {string} - the digest
   */
  hash: function(data) {
    throw new Error('Abstract')
  },

  /**********************************************************************
   * @method eq
   * @abstract
   *
   * @param {string} data - the data to compare against in its raw form
   * @param {string} digest - the digest to compare against
   *
   * @returns {boolean} - true if the data evaluates to digest
   */
  eq: function(data, digest) {
    return this.hash(data) === digest
  }
})

/******************************************************************************
 * @method getHasher
 * @static
 *
 * Get a hasher class by name.
 *
 * @param {string} name - the name of a hasher
 *
 * @returns {Function} - the constructor for a hasher or undefined if not found
 *
 */
Hasher.getHasher = function(name) {
  if (!(name in Hasher._hashers)) {
    throw new Error('Supported hashers are: ' + Hasher._hashers.toString())
  }
  return Hasher._hashers[name]
}

/******************************************************************************
 * @method getHasherNames
 * @static
 *
 * Get the names of all registered hashers.
 *
 * @returns {Array} - registered hasher names
 *
 */
Hasher.getHasherNames = function() {
  return _.keys(Hasher._hashers)
}

module.exports = Hasher

Hasher._hashers = {
  noop: require('./NoopHasher'),
  sha256: require('./Sha256Hasher'),
  bcrypt: require('./BcryptHasher')
}

