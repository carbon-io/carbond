var crypto = require('crypto')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

var Hasher = require('./Hasher')

/***************************************************************************************************
 * @class Sha256Hasher
 * @extends Hasher
 *
 * XXX: make this more generic to support anything supported by
 *      crypto.createHash
 */
var Sha256Hasher = oo({
  /*****************************************************************************
   * _type
   *
   */
  _type: Hasher,
  _ctorName: 'Sha256Hasher',

  /*****************************************************************************
   * @constructs Sha256Hasher
   * @description A utility class for the SHA-256 hash function
   * @memberof carbond.security
   * @extends carbond.security.Hasher
   */
  _C: function() {
    /***************************************************************************
     * @property {string} [digestType=hex] -- the type of digest to output. Can be
     *                                        *hex*, *latin1*, or *base64*.
     */
    this.digestType = 'hex'
  },

  /*****************************************************************************
   * @method hash
   * @description Calculates the SHA-256 digest of the input string
   * @param {string} data -- the data to hash
   * @returns {string} -- the SHA-256 digest
   */
  hash: function(data) {
    var hash = crypto.createHash('sha256')
    hash.update(data)
    return hash.digest(this.digestType)
  },
})

module.exports = Sha256Hasher
