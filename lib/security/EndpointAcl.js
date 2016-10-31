var oo = require('@carbon-io/carbon-core').atom.oo(module);
var o  = require('@carbon-io/carbon-core').atom.o(module)

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
  },

  /**********************************************************************
   * andBelow
   *
   * ACL that combines this (parent) with a child.  The resulting ACL will permit the given action
   * if the parent (this) allows "get" and the child either has no ACL or allows the given action.
   */
  andBelow: function(childAcl) {
    var self = this
    return o({
      _type: this.constructor,
      hasPermission: function(user, permission, env) {
        return self.hasPermission(user, 'get', env) && (!childAcl || childAcl.hasPermission(user, permission, env))
      }
    })
  }
})
  
