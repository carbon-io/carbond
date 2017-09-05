var ObjectId = require('@carbon-io/carbon-core').leafnode.mongodb.ObjectId
var oo = require('@carbon-io/carbon-core').atom.oo(module)

/***************************************************************************************************
 * @class ObjectIdGenerator
 */
module.exports = oo({

  /*****************************************************************************
   * _type
   */
  _type: './IdGenerator',

  /*****************************************************************************
   * @constructs ObjectIdGenerator
   * @description ObjectIdGenerator class description
   * @memberof carbond
   * @extends carbond.IdGenerator
   */
  _C: function() {
    /***************************************************************************
     * @property {boolean} [generateStrings=false] -- xx
     */
    this.generateStrings = false
  },

  /*****************************************************************************
   * @method generateId
   * @description generateId description
   * @override
   * @returns {xxx} -- xxx
   */
  generateId: function() {
    var result = new ObjectId()
    if (this.generateStrings) {
      result = result.toString()
    }

    return result
  }

})

