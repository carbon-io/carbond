var o = require('maker').o(module);
var oo = require('maker').oo(module);

/******************************************************************************
 * @class CollectionAcl
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
 *       insert: true, 
 *       getObject: function(user) { return user.title == "CFO" }
 *       "*": false 
 *     },
 *
 *     'role:"Admin"': { // group acl based on the 'role' group defined in groupDefinitions
 *        getObject: true, // equiv to function(user) { return true }
 *        find: true // if omitted would assume the defult defined in permissionDefinitions
 *        save: true // would raise error ??? // XXX not sure if the is necessary
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
  _type: './EndpointAcl',

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.permissionDefinitions = { // mapping of permissions to defaults
      create: false,
      insert: false,
      update: false,
      save: false,
      remove: false,
      find: false, 
      getObject: false,
      removeObject: false 
    } 
  },

  /**********************************************************************
   * hasPermission
   */       
  hasPermission: function(user, permission) {
    if (permission === 'get') {
      return this.hasPermission(user, 'find')
    }
    if (permission === 'put') {
      return this.hasPermission(user, 'update')
    }
    if (permission === 'post') {
      return this.hasPermission(user, 'insert')
    }
    if (permission === 'create') {
      // slightly different since same permission name
      return this.super('hasPermission')(user, permission)
    }
    if (permission === 'delete') {
      return this.hasPermission(user, 'remove')
    }
    if (permission === 'head') {
      return this.hasPermission(user, 'find')
    }
    if (permission === 'options') {
      return true // XXX I think this is right
    }

    return this.super('hasPermission')(user, permission)
  }

})
  
