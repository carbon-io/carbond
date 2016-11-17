var crypto = require('crypto')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

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
   * @param {string} data - the data to hash
   *
   * @returns {string} - the digest
   */
  hash: function(data) {
    var hash = crypto.createHash('sha256')
    hash.update(data)
    return hash.digest(this.digestType)
  }
})

module.exports = Sha256Hasher
