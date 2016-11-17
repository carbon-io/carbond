var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

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
   * @param {string} data - the data to hash
   *
   * @returns {string} - the digest
   */
  hash: function(data) {
    return data
  }
})

module.exports = NoopHasher
