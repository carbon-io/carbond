var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

var Hasher = require('./Hasher')


/***************************************************************************************************
 * @class NoopHasher
 * @description A NOOP "hasher" which just returns the data as the digest.
 *              Useful as a placeholder or for testing purposes. This offers no security.
 *              A real hash function such as {@link class:carbond.security.BcryptHasher}
 *              should be used in production.
 * @memberof carbond.security
 * @extends Hasher
 */
var NoopHasher = oo({
  /*****************************************************************************
   * _type
   */
  _type: Hasher,

  /*****************************************************************************
   * @method hash
   * @description Returns the input data unchanged
   * @param {string} data -- the data to "hash"
   * @returns {string} -- the digest (which is just the input data)
   */
  hash: function(data) {
    return data
  }
})

module.exports = NoopHasher
