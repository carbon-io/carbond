var oo = require('@carbon-io/carbon-core').atom.oo(module)

module.exports = oo({
  _ctorName: 'IdGenerator',

  /*****************************************************************************
   * @constructs IdGenerator
   * @description IdGenerator base class
   * @memberof carbond
   */
  _C: function() { },

  /*****************************************************************************
   * @method generateId
   * @abstract
   * @description Generates an ID, where the definition of ID is left up to the
   *              implementor
   * @returns {*} -- The ID
   */
  generateId: function() {
    throw new Error('Must subclass')
  },
})

