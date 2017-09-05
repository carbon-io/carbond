var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

/***************************************************************************************************
 * @class IdGenerator
 * @memberof carbond
 */
module.exports = oo({
  _type: _o('../IdGenerator'),

  /*****************************************************************************
   * @method generateId
   * @param {carbond.collections.Collection} collection -- The collection that IDs are being generated for
   * @param {carbond.Request} req -- The incoming request
   */
  generateId: function(collection, req) {
    throw new Error("Must subclass")
  }
})


