var o = require('atom').o(module);
var oo = require('atom').oo(module);
var _o = require('bond')._o(module);
var _ = require('lodash')

/******************************************************************************
 * @class RemoveConfig
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */
  _type: './CollectionOperationConfig',

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.supportsQuery = false
    this.querySchema = undefined
  },

  /**********************************************************************
   * remove
   */
  remove: function(options, reqCtx) {
    throw new Error("RemoveOperation.find not implemented")
  }
  
})

