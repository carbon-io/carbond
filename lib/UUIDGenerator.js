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
   * @description Generates UUIDs
   * @memberof carbond
   * @extends carbond.IdGenerator
   */
  _C: function() {

    // -----------------------------
    // Computed read-only properties
    // -----------------------------

    /***************************************************************************
     * @property {Function} [_uuid] -- xxx
     * @ignore
     */
    this._uuid = undefined

    // -----------------------
    // Configurable properties
    // -----------------------

    /***************************************************************************
     * @property {number} version -- The UUID version to to use [choices: 1, 4]
     */
    this.version = 1
  },

  /*****************************************************************************
   * @property {Array.<string>} _frozenProperties
   * @description The list of properties to freeze after initialization
   * @readonly
   */
  _frozenProperties: [
    '_uuid'
  ],

   /****************************************************************************
    * @method _init
    * @description Initializes the internal UUID generation function
    * @returns {undefined}
    * @throws {RangeError}
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
   * @description Generates an ID
   * @returns {string}
   */
  generateId: function() {
    return this._uuid()
  }
})
