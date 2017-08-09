var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

var Hasher = require('./Hasher')


/***************************************************************************************************
 * @class NoopHasher
 * @description NOOP hasher (plain text)
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
   * @description hash description
   * @param {string} data -- the data to hash
   * @returns {string} -- the digest
   */
  hash: function(data) {
    return data
  }
})

module.exports = NoopHasher
