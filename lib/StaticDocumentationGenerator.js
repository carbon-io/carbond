var o = require('atom').o(module);
var oo = require('atom').oo(module);


/*******************************************************************************
 * @class StaticDocumentationGenerator
 */
var StaticDocumentationGenerator = oo({
  /**********************************************************************
   * _C
   */
  _C: function(objectServer) {
    this._objectServer = objectServer
  },

  /**********************************************************************
   * generate api docs
   *
   * @abstract
   * @throws Error
   */
  generateDocs: function() {
    throw new Error('not implemented')
  }
})

/*******************************************************************************
 * Map of doc types to generator classes.
 *
 * @protected
 * @memberof StaticDocumentationGenerator
 * @static
 */
StaticDocumentationGenerator._registeredTypes = {}

/*******************************************************************************
 * Register a generator class for a specific type. 
 *
 * @function registerType
 * @memberof StaticDocumentationGenerator
 * @static
 *
 * @param {string} docType
 * @param {class} cls
 */
StaticDocumentationGenerator.registerType = function(docType, cls) {
  if (typeof docType != 'string') {
    throw new TypeError('docType does not appear to be a string')
  }
  // XXX: how do we check that this is a class (constructor) versus a function?
  if (typeof cls != 'function') {
    throw new TypeError('cls does not appear to be a class')
  }
  StaticDocumentationGenerator._registeredTypes[docType] = cls
}

/*******************************************************************************
 * Create a generator for a particular doc type.
 *
 * @function createGenerator
 * @memberof StaticDocumentationGenerator
 * @static
 *
 * @param {string} docType
 * @returns {StaticDocumentationGenerator}
 */
StaticDocumentationGenerator.createGenerator = function(docType, objectServer) {
  if (!docType in StaticDocumentationGenerator._registeredTypes) {
    throw new Error('no handler registered for ' + docType)
  }
  return new StaticDocumentationGenerator._registeredTypes[docType](objectServer)
}

module.exports = StaticDocumentationGenerator

// register doc generator "plugins"
// XXX: can we avoid including these
require('./GHMDGenerator.js')
