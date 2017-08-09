var oo = require('@carbon-io/carbon-core').atom.oo(module);

/***************************************************************************************************
 * @class IdGenerator
 * @memberof carbond
 */
module.exports = oo({

  /*****************************************************************************
   * generateId
   * @method generateId
   */
  generateId: function() {
    throw new Error("Must subclass")
  }
})

