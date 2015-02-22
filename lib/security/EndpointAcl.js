var o = require('maker').o(module);
var oo = require('maker').oo(module);

/******************************************************************************
 * @class EndpointAcl
 * 
 * Example:
 * {
 *    _type: 'datanode/EndpointAcl',
 *
 *   groupDefinitions: { // XXX not sure this is the right name
 *     user: '_id', // can be property path "a.b.c"
 *     role: function(user) { return user.role }  // or can be function  
 *   },
 *   entries: {
 *     "*": {
 *       get: true, 
 *       post: function(user) { return user.title == "CFO" }
 *       "*": false 
 *     },
 *
 *     'role:"Admin"': { // group acl based on the 'role' group defined in groupDefinitions
 *        get: true, // equiv to function(user) { return true }
 *        put: true // if omitted would assume the defult defined in permissionDefinitions
 *        post: true // would raise error ??? // XXX not sure if the is necessary
 *     },
 *     'user:1234}': { // user with _id 1234
 *       ... 
 *     },
 *     'user:"1234"}': { // user with _id "1234"
 *       ... 
 *     },
 *     'user:{"$oid":"1234"}': { // user with ObjectId("1234")
 *       ... 
 *     }
 *   }
 * }
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
  
