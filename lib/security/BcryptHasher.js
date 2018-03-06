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
  _ctorName: 'BcryptHasher',

  /*****************************************************************************
   * @constructs BcryptHasher
   * @description A utility class for the bcrypt hashing function
   * @memberof carbond.security
   * @extends carbond.security.Hasher
   */
  _C: function() {
    /***************************************************************************
     * @property {integer} [rounds=10] -- the number of rounds to use
     *
     * XXX: The underlying bcryptjs library defaults to 10 rounds. Should probably
     *      explicitly define that.
     */
    this.rounds = undefined
  },

  /*****************************************************************************
   * @method hash
   * @description Calculates the bcrypt digest of the input string
   * @param {string} data -- the data to hash
   * @returns {string} -- the digest
   */
  hash: function(data) {
    return bcrypt.hashSync.apply(
      undefined,
      [data, _.isInteger(this.rounds) ? this.rounds : undefined]
    )
  },

  /*****************************************************************************
   * @method eq
   * @description Compares data against a bcrypt digest
   * @param {string} data -- the data in its raw form
   * @param {string} digest -- the digest to compare against
   * @returns {boolean} -- true if the data evaluates to digest
   */
  eq: function(data, digest) {
    return bcrypt.compareSync(data, digest)
  },
})

module.exports = BcryptHasher
