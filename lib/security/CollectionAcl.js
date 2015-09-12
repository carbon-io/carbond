var o = require('atom').o(module);
var oo = require('atom').oo(module);

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
 *       findObject: function(user) { return user.title == "CFO" }
 *       "*": false 
 *     },
 *
 *     'role:"Admin"': { // group acl based on the 'role' group defined in groupDefinitions
 *        findObject: true, // equiv to function(user) { return true }
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
      find: false, 
      insert: false,
      update: false,
      remove: false,
      findObject: false,
      saveObject: false,
      updateObject: false,
      removeObject: false 
    } 
  },

  /**********************************************************************
   * hasPermission
   */       
  hasPermission: function(user, permission, env) {
    if (permission === 'get') {
      return this.hasPermission(user, 'find', env)
    }
    if (permission === 'put') {
      return false // you can't put to a Collection
    }
    if (permission === 'patch') {
      return this.hasPermission(user, 'update', env)
    }
    if (permission === 'post') {
      return this.hasPermission(user, 'insert', env)
    }
    if (permission === 'delete') {
      return this.hasPermission(user, 'remove', env)
    }
    if (permission === 'head') {
      return this.hasPermission(user, 'find', env)
    }
    if (permission === 'options') {
      return true // XXX I think this is right
    }

    return _o('./EndpointAcl').prototype.hasPermission.call(this, user, permission, env)

  }

})
  
