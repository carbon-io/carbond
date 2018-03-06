var ObjectId = require('@carbon-io/carbon-core').leafnode.mongodb.ObjectId
var oo = require('@carbon-io/carbon-core').atom.oo(module)

/***************************************************************************************************
 * @class ObjectIdGenerator
 */
module.exports = oo({
  _ctorName: 'ObjectIdGenerator',

  /*****************************************************************************
   * _type
   */
  _type: './IdGenerator',

  /*****************************************************************************
   * @constructs ObjectIdGenerator
   * @description Generates {@link ejson.types.ObjectId} IDs
   * @memberof carbond
   * @extends carbond.IdGenerator
   */
  _C: function() {
    /***************************************************************************
     * @property {boolean} [generateStrings=false]
     * @description Whether or not to return a ``string`` representation of the
     *              {@link ejson.types.ObjectId}
     */
    this.generateStrings = false
  },

  /*****************************************************************************
   * @method generateId
   * @description Generates an {@link ejson.types.ObjectId}
   * @override
   * @returns {ejson.types.ObjectId|string} -- Returns the {@link
   *                                           ejson.types.ObjectId} instance of
   *                                           a ``string`` if configured to do so
   */
  generateId: function() {
    var result = new ObjectId()
    if (this.generateStrings) {
      result = result.toString()
    }

    return result
  },

})

