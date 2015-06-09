var o = require('atom').o(module);
var oo = require('atom').oo(module);

/******************************************************************************
 * @class EndpointAcl
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */
  _type: './Acl',

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.permissionDefinitions = { // mapping of permissions to defaults
      get: false,
      put: false,
      post: false,
      create: false,
      delete: false,
      head: false, // XXX is this like options or like the rest?
      options: true // XXX do we need this since we handle options special?
    } 
  }
})
  
