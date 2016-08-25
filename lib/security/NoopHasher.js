var _ = require('lodash')

var oo = require('atom').oo(module)

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
   * @param {string} data - the data to hash (if undefined, should use
   *                        this.data)
   *
   * @returns {string} - the digest
   * @throws {Error} - throws if data and this.data are undefined
   */
  hash: function(data) {
    return this._validateData(data)
  }
})

module.exports = NoopHasher
