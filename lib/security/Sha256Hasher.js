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

  /*****************************************************************************
   * @constructs Sha256Hasher
   * @description Sha256Hasher description
   * @memberof carbond.security
   * @extends carbond.security.Hasher
   */
  _C: function() {
    /***************************************************************************
     * @property {string} [digestType=hex] -- the type of digest to output
     */
    this.digestType = 'hex'
  },

  /*****************************************************************************
   * @method hash
   * @description hash description
   * @param {string} data -- the data to hash
   * @returns {string} -- the digest
   */
  hash: function(data) {
    var hash = crypto.createHash('sha256')
    hash.update(data)
    return hash.digest(this.digestType)
  }
})

module.exports = Sha256Hasher
