var oo = require('@carbon-io/carbon-core').atom.oo(module);

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
    this.selfAndBelow = false // If true this EndpointAcl will apply to descendants 
    this.permissionDefinitions = { // mapping of permissions to defaults
      get: false,
      put: false,
      patch: false,
      post: false,
      delete: false,
      head: false, // XXX is this like options or like the rest?
      options: true // XXX do we need this since we handle options special?
    } 
  }
})
  
