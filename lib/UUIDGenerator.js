var ObjectId = require('@carbon-io/carbon-core').leafnode.mongodb.ObjectId
var uuid = require('uuid')

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
   * @constructs UUIDGenerator
   * @description UUIDGenerator description
   * @memberof carbond
   * @extends carbond.IdGenerator
   */
  _C: function() {
    /***************************************************************************
     * @property {number} version -- xxx
     */
    this.version = 1

    /***************************************************************************
     * @property {xxx} _uuid -- xxx
     */
    this._uuid = undefined
  },

   /****************************************************************************
    * @method _init
    * @description _init description
    * @returns {undefined} -- undefined
    */
  _init: function() {
    switch (this.version) {
      case 1:
        this._uuid = uuid.v1
        break
      case 4:
        this._uuid = uuid.v4
        break
      default:
        throw new RangeError(
          'UUID versions 1 and 4 are supported, got: ' + this.version)
    }
  },

  /*****************************************************************************
   * @method generateId
   * @description generateId description
   * @returns {xxx} -- xxx
   */     
  generateId: function() {
    return this._uuid()
  }
})
