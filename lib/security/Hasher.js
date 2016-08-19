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
    this._data = undefined
    this._digest = undefined
  },

  /**********************************************************************
   * data
   *
   * XXX: proper jsdoc?
   */
  data: {
    $property: {
      get: function() {
        return this._data
      },
      set: function(data) {
        this._data = data
        this._digest = undefined
      }
    }
  },

  /**********************************************************************
   * digest
   *
   * XXX: proper jsdoc?
   */
  digest: {
    $property: {
      get: function() {
        if (_.isUndefined(this._digest)) {
          if (!_.isUndefined(this._data)) {
            this._digest = this.hash()
          }
        }
        return this._digest
      },
      set: function(digest) {
        this._digest = undefined
      }
    }
  },

  _validateData: function(data) {
    if (_.isUndefined(data)) {
      if (_.isUndefined(this.data)) {
        throw new TypeError('data and this.data undefined')
      }
      return this.data
    }
    return data
  },

  /**********************************************************************
   * @method hash
   * @abstract
   *
   * @param {string} data - the data to hash (if undefined, should use
   *                        this.data)
   *
   * @returns {string} - the digest
   * @throws {Error} - throws if data and this.data are undefined
   */
  hash: function(data) {
    throw new Error('Abstract')
  },

  _validateDigest: function(digest) {
    if (_.isUndefined(digest)) {
      if (_.isUndefined(this.digest)) {
        throw new TypeError('digest and this.digest undefined')
      }
      digest = this.digest
    }
    return digest
  },

  /**********************************************************************
   * @method eq
   * @abstract
   *
   * @param {string} data - the data to compare against in its raw form
   * @param {string} [digest=this.digest] - the digest to compare against
   *
   * @returns {boolean} - true if the data evaluates to digest
   * @throws {Error} - throws if digest and this.digest are undefined
   */
  eq: function(data, digest) {
    throw new Error('Abstract')
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

