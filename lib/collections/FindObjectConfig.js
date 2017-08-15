var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module);

var STRINGS = {}

/***************************************************************************************************
 * @class FindObjectConfig
 */
var FindObjectConfig = oo({

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

FindObjectConfig._STRINGS = STRINGS

module.exports = FindObjectConfig
