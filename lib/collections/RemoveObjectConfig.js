var o = require('atom').o(module);
var oo = require('atom').oo(module);
var _o = require('bond')._o(module);
var _ = require('lodash')

/******************************************************************************
 * @class RemoveObjectConfig
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */
  _type: './CollectionOperationConfig',

  /**********************************************************************
   * _C
   */
  _C: function() {},

  /**********************************************************************
   * removeObject
   */
  removeObject: function(id, reqCtx) {
    throw new Error("RemoveObjectOperation.removeObject not implemented")
  }
  
})

