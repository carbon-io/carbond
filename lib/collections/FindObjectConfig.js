var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module);

var STRINGS = {}

/***************************************************************************************************
 * @class FindObjectConfig
 */
var FindObjectConfig = oo({
  _ctorName: 'FindObjectConfig',

  /*****************************************************************************
   * _type
   */
  _type: './CollectionOperationConfig',

  /*****************************************************************************
   * @constructs FindObjectConfig
   * @description The find object config
   * @memberof carbond.collections
   * @extends carbond.collections.CollectionOperationConfig
   */
  _C: function() { }
})

Object.defineProperty(FindObjectConfig, '_STRINGS', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: STRINGS
})

module.exports = FindObjectConfig
