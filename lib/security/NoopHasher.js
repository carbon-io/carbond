var _ = require('lodash')

var oo = require('atom').oo(module)

var Hasher = require('./Hasher')


/******************************************************************************
 * @class NoopHasher
 * @extends Hasher
 *
 * NOOP hasher (plain text)
 *
 */
var NoopHasher = oo({
  /**********************************************************************
   * _type
   */
  _type: Hasher,

  /**********************************************************************
   * @method hash
   *
   * @param {string} data - the data to hash (if undefined, should use
   *                        this.data)
   *
   * @returns {string} - the digest
   * @throws {Error} - throws if data and this.data are undefined
   */
  hash: function(data) {
    return this._validateData(data)
  },

  /**********************************************************************
   * @method eq
   *
   * @param {string} data - the data to compare against in its raw form
   * @param {string} [digest=this.digest] - the digest to compare against
   *
   * @returns {boolean} - true if the data evaluates to digest
   * @throws {Error} - throws if digest and this.digest are undefined
   */
  eq: function(data, digest) {
    return this.hash(data) === this._validateDigest(digest)
  }
})

module.exports = NoopHasher
