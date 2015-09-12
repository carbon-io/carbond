var EJSON = require('mongodb-extended-json');
var o = require('atom').o(module);
var oo = require('atom').oo(module);

/******************************************************************************
 * @class Acl
 *
 * 
 * 
 * Example:
 * {
 *    _type: 'datanode/Acl',
 *
 *   permissionDefinitions: {
 *     read: false,
 *     write: false
 *   },
 *   groupDefinitions: { // XXX not sure this is the right name
 *     user: '_id', // can be property path "a.b.c"
 *     role: function(user) { return user.role }  // or can be function  
 *     title: function(user) { return user.title }  // or can be function  
 *   }
 *   entries: {
 *     "*": {
 *       userSpec: { title: CEO } // XXX is this better?
 *       read: true, 
 *       write: function(user) { return user.title == "CFO" }
 *       "*": false 
 *     },
 *     'role:"Admin"': { // group acl based on the 'role' group defined in groupDefinitions
 *        read: true, // equiv to function(user) { return true }
 *        write: true // if omitted would assume the defult defined in permissionDefinitions
 *        execute: true // would raise error ??? // XXX not sure if the is necessary
 *     },
 * 
 *     'user:1234': { // user with _id 1234
 *       ... 
 *     },
 *     'user:"1234"': { // user with _id "1234"
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
   * _C
   */
  _C: function() {
    this.permissionDefinitions = {} // mapping of permissions to defaults
    this.groupDefinitions = {} // set of definitions. each group name (lval) is mapped to a property path
    this.entries = [] // acl entries. mapping of user specifiers to maps of permissions to permission predicates
  },

  /**********************************************************************
   * _init
   */     
  _init: function() {
  },

  /**********************************************************************
   * hasPermission
   */       
  hasPermission: function(user, permission, env) {
    // XXX deal with root user up here?
    if (!user) { // must have a user
      return false
    }

    if (!this.entries) { // default deny if no entries defined XXX maybe this should be permissionDefs lookup right?
      return false
    }

    if (!Array.isArray(this.entries)) {
      throw new Error("Malformed ACL entries. Must be an array. Found: " + JSON.stringify(this.entries))
    }
    
    var matches = {
      userEntry: null, // there should only be one matching user entry. if more match we use the first one we find
      groupEntries: [], 
      wildcardEntry: null
    }

    // iterate through and collect matches partitioned by user and group matches (ignore '*')
    var self = this
    this.entries.forEach(function(entry) {
      var userSpec = entry.user
      if (userSpec === '*') {
        matches.wildcardEntry = entry
      } else if (self._userMatchesSpec(user, userSpec)) {
        if (self._isUserUserSpec(userSpec)) {
          matches.userEntry = entry
        } else if (self._isGroupUserSpec(userSpec)) {
          matches.groupEntries.push(entry)
        } else {
          throw new Error("ACL invalid state. Unrecognized user spec: " + userSpec)
        }
      } 
    })

    // First check for user entry match. If one exists use that
    var userEntry = matches.userEntry
    if (userEntry) {
      // If there exists a user entry then we consider it to be a total definition of permissions.
      // Even if the entry for the user omits a definition of the permission, it is assumed to have 
      // the default value for that permission as defined in this.permissionDefinitions
      return this._checkPermission(user, userEntry, permission, env) // XXX should it be getPP() which we then call?
    }
    
    // Next, go through groupEntries. If there there is more than one 
    // groupEntry then the user must have pemission granted by ALL 
    // groupEntries matched
    var groupEntries = matches.groupEntries
    if (groupEntries.length > 0) { 
      return this._entriesGrantPermission(groupEntries, user, permission, env)
    } 
   
    // Finally if there is a wildcard match use that
    if (matches.wildcardEntry) {
      return this._checkPermission(user, matches.wildcardEntry, permission, env)    
    } 

    return false
  },
  
  /**********************************************************************
   * and
   */   
  and: function(acl) {
    var self = this
    return o({
      _type: this.constructor,
      hasPermission: function(user, permission, env) {
        return self.hasPermission(user, permission, env) && acl.hasPermission(user, permission, env)
      }
    })
  },

  /**********************************************************************
   * or
   */   
  or: function(acl) {
    var self = this
    return o({
      _type: this.constructor,
      hasPermission: function(user, permission, env) {
        return self.hasPermission(user, permission, env) || acl.hasPermission(user, permission, env)
      }
    })
  },

  /**********************************************************************
   * _entriesGrantPermission
   */       
  _entriesGrantPermission: function(entries, user, permission, env) {
    var result = false
    var numEntriesGrantingPermission = 0

    var self = this
    entries.forEach(function(entry) {
      if (self._checkPermission(user, entry, permission, env)) {
        numEntriesGrantingPermission++
      }
    })
    // if they all grant permission then we grant permission
    if (numEntriesGrantingPermission == entries.length) {
      result = true
    } else {
      // We have at least one matching entry that denies permission so we deny
      result = false 
    }
  
    return result
  },

  /**********************************************************************
   * _userMatchesSpec
   */       
  _userMatchesSpec: function(user, spec) {
    if (!user || !spec) {
      return false
    }

    if (spec === '*') {
      return true
    }

    if (this._isUserUserSpec(spec)) {
      return (user._id === spec)
    } else if (this._isGroupUserSpec(spec)) {
      var groupName = Object.keys(spec)[0]
      var groupValue = spec[groupName]
      var extractor = this.groupDefinitions[groupName]
      if (!extractor) {
        return false
      }

      var userValue = this._getUserPropertyValue(user, extractor)
      return (userValue === groupValue)
    }
    
    throw new Error("ACL entry user spec is not recognized: " + 
                    JSON.stringify(spec))
  },

  /**********************************************************************
   * _getUserPropertyValue
   */       
  _getUserPropertyValue: function(user, extractor) {
    if (typeof(extractor) == 'function') {
      return extractor(user)
    }
      
    var propertyPath = extractor
    // otherwise assume it is a string propertyPath
    var pathList = propertyPath.split('.')

    var result = user
    pathList.forEach(function(p) {
      if (result) {
        result = result[p]
      } 
    })
    
    return result
  },
  
  /**********************************************************************
   * _isUserUserSpec
   */       
  _isUserUserSpec: function(spec) {
    return (typeof(spec) !== 'object')
  },

  /**********************************************************************
   * _isGroupUserSpec
   */       
  _isGroupUserSpec: function(spec) {
    if (typeof(spec) !== 'object') {
      return false
    }

    var keys = Object.keys(spec)
    if (keys.length !== 1) {
      return false
    }

    var result = false
    var groupName = keys[0]
    if (this.groupDefinitions[groupName]) {
      result = true
    } 

    return result
  },

  /**********************************************************************
   * _checkPermission
   */       
  _checkPermission: function(user, aclEntry, permission, env) {
    if (this.permissionDefinitions[permission] == undefined) {
      // may later decide to return false but want to be strict for now
      throw new Error("Unsupported permission: " + permission) 
    }
    
    var permissions = aclEntry.permissions
    var permissionPredicate = permissions[permission]
    if (permissionPredicate === undefined) {
      // check if we have '*' permission
      if (permissions['*']) {
        permissionPredicate = permissions['*']
      } else {
        // Already know permission is defined in permisionDefinitions
        // so we grab the default from there
        permissionPredicate = this.permissionDefinitions[permission]
      }
    }

    return this._checkPermissionPredicate(user, aclEntry, permissionPredicate, env)
  },
  
  /**********************************************************************
   * _checkPermissionPredicate
   */       
  _checkPermissionPredicate: function(user, aclEntry, p, env) {
    if (typeof(p) === 'boolean') {
      return p
    }

    if (typeof(p) === 'function') {
      return p(user, env)
    }

    return false
  }

})

