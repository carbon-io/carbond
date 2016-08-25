var crypto = require('crypto')

var _o = require('bond')._o(module)
var o = require('atom').o(module)
var oo = require('atom').oo(module)

var Hasher = require('./Hasher')

/******************************************************************************
 * @class Sha256Hasher
 * @extends Hasher
 *
 * XXX: make this more generic to support anything supported by
 *      crypto.createHash
 */
var Sha256Hasher = oo({
  /**********************************************************************
   * _type
   *
   */
  _type: Hasher,

  /**********************************************************************
   * @method _C
   *
   */
  _C: function() {
    /**
     * @member {string} ['hex'] - the type of digest to output
     */
    this.digestType = 'hex'
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
    var hash = crypto.createHash('sha256')
    hash.update(this._validateData(data))
    return hash.digest(this.digestType)
  }
})

module.exports = Sha256Hasher
