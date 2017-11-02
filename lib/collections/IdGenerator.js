var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

/***************************************************************************************************
 * @class IdGenerator
 */
module.exports = oo({
  _type: _o('../IdGenerator'),

  /*****************************************************************************
   * @constructs IdGenerator
   * @description Generates {@link ejson.types.ObjectId} IDs
   * @memberof carbond.collections
   * @extends carbond.IdGenerator
   */
  _C: function() { },

  /*****************************************************************************
   * @method generateId
   * @abstract
   * @description Generates an ID, where the definition of ID is left up to the
   *              implementor
   * @param {carbond.collections.Collection} collection -- The collection that IDs are being generated for
   * @param {carbond.Request} req -- The incoming request
   * @returns {*} -- The ID
   */
  generateId: function(collection, req) {
    throw new Error("Must subclass")
  }
})


