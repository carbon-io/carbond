var EJSON = require('mongodb-extended-json');
var o = require('maker').o(module);
var oo = require('maker').oo(module);

/******************************************************************************
 * @class ObjectAcl
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
  _type: './Acl',

  /**********************************************************************
   * OWNER_SPEC
   */
  OWNER_SPEC: '__owner__',

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.object = null
    this.owner = null
    this.permissionDefinitions = { // mapping of permissions to defaults
      read: false,
      write: false,
      delete: false,
      admin: false
    } 
  },

  /**********************************************************************
   * _userMatchesSpec
   */       
  _userMatchesSpec: function(user, spec) {
    if (spec === this.OWNER_SPEC) {
      if (!this.owner) {
        return false
      }

      // create normal user:<user_id> spec from dynamic OWNER_SPEC
      spec = 'user:' + EJSON.stringify(this.owner) // XXX maybe make it a func? Will be better perf
    } 

    return this._super('_userMatchesSpec')(user, spec)
  },

  /**********************************************************************
   * _checkPermissionPredicate
   */       
  _checkPermissionPredicate: function(user, aclEntry, p) {
    if (typeof(p) === 'object') {
      return this._checkObjectPermissionPredicate(user, aclEntry, p)
    }
   
    return this._super('_checkPermissionPredicate')(user, aclEntry, p)
  },

  /**********************************************************************
   * _checkObjectPermissionPredicate
   */       
  _checkObjectPermissionPredicate: function(user, aclEntry, p) {
    return false
  }


})
  
