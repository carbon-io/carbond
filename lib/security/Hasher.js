var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)


/***************************************************************************************************
 * @class Hasher
 * @abstract
 */
var Hasher = oo({
  /*****************************************************************************
   * @constructs Hasher
   * @abstract
   * @description A utility class for cryptographic hash functions
   * @memberof carbond.security
   */
  _C: function() {
    if (this.constructor === Hasher) {
      throw new Error('Abstract')
    }
  },

  /*****************************************************************************
   * @method hash
   * @abstract
   * @description Calculates the hash digest of the input string
   * @param {string} data -- the data to hash
   * @returns {string} -- the digest
   */
  hash: function(data) {
    throw new Error('Abstract')
  },

  /*****************************************************************************
   * @method eq
   * @abstract
   * @description Compares data against a digest
   * @param {string} data -- the data in its raw form
   * @param {string} digest -- the digest to compare against
   * @returns {boolean} -- true if the data evaluates to digest
   */
  eq: function(data, digest) {
    return this.hash(data) === digest
  }
})

/***************************************************************************************************
 * @method getHasher
 * @description Get a hasher class by name.
 * @param {string} name -- the name of a hasher. Supported hashers are *noop*, *sha256*, and *bcrypt.
 * @returns {Function|undefined} -- the constructor for a hasher or undefined if not found
 */
Hasher.getHasher = function(name) {
  if (!(name in Hasher._hashers)) {
    throw new Error('Supported hashers are: ' + Hasher._hashers.toString())
  }
  return Hasher._hashers[name]
}

/***************************************************************************************************
 * @method getHasherNames
 * @description Get the names of all registered hashers.
 * @returns {string[]} - registered hasher names
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

