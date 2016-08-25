var _ = require('lodash')
var bcrypt = require('bcryptjs')

var _o = require('bond')._o(module)
var o = require('atom').o(module)
var oo = require('atom').oo(module)

var Hasher = require('./Hasher')

/******************************************************************************
 * @class BcryptHasher
 * @extends Hasher
 *
 */
var BcryptHasher = oo({
  /**********************************************************************
   * _type
   */
  _type: Hasher,

  /**********************************************************************
   * @method _C
   *
   */
  _C: function() {
    /**
     * @member {integer} [<library default>] - the number of rounds to
     *                                         use
     */
    this.rounds = undefined
  },

  /**********************************************************************
   * @method hash
   *
   * @param {string} [data=this.data] - the data to hash (if undefined,
   *                                    should use this.data)
   *
   * @returns {string} - the digest
   * @throws {TypeError} - throws if data and this.data are undefined
   */
  hash: function(data) {
    return bcrypt.hashSync.apply(
      undefined,
      [this._validateData(data),
       _.isInteger(this.rounds) ? this.rounds : undefined])
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
    return bcrypt.compareSync(data, this._validateDigest(digest))
  }
})

module.exports = BcryptHasher
