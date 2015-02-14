var o = require('maker').o(module);
var oo = require('maker').oo(module);

/******************************************************************************
 * @class Acl
 *
 * 
 * 
 * Example:
 * {
     _type: 'datanode/Acl',
 
 *   permissionDefinitions: {
 *     read: false,
 *     write: false
 *   },
 *   groupDefinitions: { 
 *     user: '_id',
 *     role: 'role',     
 *   },
 *   entries: {
 *     "*": {
 *       read: true, 
 *       write: function(user) { return user.title == "CFO" }
 *     },
 *     "role:Admin": { // group acl based on the 'role' group defined in groupDefinitions
 *        read: true, // equiv to function(user) { return true }
 *        write: true // if omitted would assume the defult defined in permissionDefinitions
 *        execute: true // would raise error ??? // XXX not sure if the is necessary
 *     },
 *     "user:1234": { // user with _id 1234
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
    this.entries = {} // acl entries. mapping of user specifiers to maps of permissions to permission predicates
  },
  
  /**********************************************************************
   * hasPermission
   */       
  hasPermission: function(user, permission) {
    // XXX deal with root user up here?

    // default deny
    if (!this.entries) {
      return false
    }
    
    var matches = {
      userEntry: null, // there should only be one matching user entry. if more match we use the first one we find
      groupEntries: []
    }

    // iterate through and collect matches partitioned by user and group matches (ignore "*")
    for (var userSpec in this.entries) {
      if (userSpec !== "*") { // handle '*' at the end if no match
        if (this._userMatchesSpec(user, userSpec)) {
          var entry = this.entries[userSpec]
          if (this._isUserUserSpec(userSpec)) { // e.g. "user:1234"
            matches.userEntry = entry
            break // there should only be one matching user entry. if more match we use the first one we find
          } else if this._isGroupUserSpec(userSpec) { // e.g. "role:Admin"
            matches.groupEntries.push(entry)
          } else {
            throw new Error("Invalid user spec in ACL: " + userSpec)
          }
        }
      }
    }

    // first check userEntry
    var userEntry = matches.userEntry
    if (userEntry) {
      // If there exists a user entry then we consider it to be a total definition of permissions.
      // Even if the entry for the user omits a definition of the permission, it is assumed to have 
      // the default value for that permission as defined in this.permissionDefinitions
      return this._checkPermissionPredicate(user, userEntry, permission) // XXX should it be getPP() which we then call?
    }

    // If we don't have a userEntry that matches then go through groupEntries
    // If there there is more than one groupEntry then the user must have pemission 
    // granted by ALL groupEntries matched
    if (groupEntries.length > 0) {
      int numGroupEntriesGrantingPermission = 0
      groupEntries.forEach(function(groupEntry) {
        if (this._checkPermissionPredicate(user, groupEntry, permission)) {
          numGroupEntriesGrantingPermission++
        }
      })
      // if they all grant permission then we grant permission
      if (numGroupEntriesGrantingPermission.length == groupEntries.length) {
        return true
      } else {
        // We have at least one matching groupEntry that denies permission so we deny
        return false 
      }
    }
   
    // We don't have a user entry and we dont have any groupEntries so check "*"
    var starEntry = this.entries["*"]
    if (!starEntry) { // if star entry is undefined or false then permission is denied // XXX * = false allowed?
      return false
    }

    return this._checkPermissionPredicate(user, starEntry, permission)
  },
  
  /**********************************************************************
   * _getSpecName
   */       
  _getSpecName(spec) {
    return spec.slice(0, spec.indexOf(':'))
  },

  /**********************************************************************
   * _getSpecValue
   */       
  _getSpecValue(spec) {
    return spec.slice(spec.indexOf(':') + 1)
  },

  /**********************************************************************
   * _userMatchesSpec
   */       
  _userMatchesSpec: function(user, spec) {
    if (!spec || spec.indexOf(':') == -1) {
      throw new Error("Invalid user spec: " + spec)
    }

    var specName = this._getSpecName(spec)
    var specValue = this._getSpecValue(spec)
    
    var result = false
    if (user) {
      var propertyPath = this.groupDefinitions[specName]
      if (propertyPath) {
        var userPropertyValue = this._getUserPropertyValue(user, propertyPath)
        result = userPropertyValue === specValue
      }
    }

    return result
  },

  /**********************************************************************
   * _getUserPropertyValue
   */       
  _getUserPropertyValue: function(user, propertyPath) {
    var pathList = propertyPath.split('.')

    var result = user
    pathList.forEach(function(p) {
      result = result[p]
    })
    
    return result
  },
  
  /**********************************************************************
   * _isUserUserSpec
   */       
  _isUserUserSpec: function(spec) {
    return (spec && spec.indexOf("user:") == 0)
  },

  /**********************************************************************
   * _isGroupUserSpec
   */       
  _isGroupUserSpec: function(spec) {
    var result = false
    if (spec && spec.indexOf(':') > 0) { // -1 interacts poorly with slice in this case so we check first
      var specName = spec.slice(0, spec.indexOf(':'))
      result = this.groupDefinitions[specName] && specName != 'user' // is it defined
    }

    return result
  },

  /**********************************************************************
   * _checkPermissionPredicate
   */       
  checkPermissionPredicate: function(user, aclEntry, permission) {
    if (this.permisionDefinitions[permission] == undefined) {
      // may later decide to return false but want to be strict for now
      throw new Error("Unsupported permission: " + permission) 
    }

    var permissionPredicate = aclEntry[permission]
    if (permissionPredicate == undefined) {
      // already know it is not undefined
      permissionPredicate = this.permissionDefinitions[permission]
    }

    if (typeof(permissionPredicate) == 'boolean') {
      return permissionPredicate
    }

    if (typeof(permissionPredicate) == 'function') {
      return permissionPredicate(user)
    }

    return false
  }
  
})

