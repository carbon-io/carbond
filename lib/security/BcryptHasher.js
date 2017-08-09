var _ = require('lodash')
var bcrypt = require('bcryptjs')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

var Hasher = require('./Hasher')

/***************************************************************************************************
 * @class BcryptHasher
 * @extends Hasher
 *
 */
var BcryptHasher = oo({
  /*****************************************************************************
   * _type
   */
  _type: Hasher,

  /*****************************************************************************
   * @constructs BcryptHasher
   * @description BcryptHasher description
   * @memberof carbond.security
   * @extends carbond.security.Hasher
   */
  _C: function() {
    /***************************************************************************
     * @property {integer} rounds -- the number of rounds to use
     */
    this.rounds = undefined
  },

  /*****************************************************************************
   * @method hash
   * @description hash description
   * @param {string} data -- the data to hash
   * @returns {string} -- the digest
   */
  hash: function(data) {
    return bcrypt.hashSync.apply(
      undefined,
      [data, _.isInteger(this.rounds) ? this.rounds : undefined])
  },

  /*****************************************************************************
   * @method eq
   * @description eq description
   * @param {string} data -- the data to compare against in its raw form
   * @param {string} digest -- the digest to compare against
   * @returns {boolean} -- true if the data evaluates to digest
   */
  eq: function(data, digest) {
    return bcrypt.compareSync(data, digest)
  }
})

module.exports = BcryptHasher
