var _ = require('lodash')

var EJSON = require('@carbon-io/carbon-core').ejson
var o = require('@carbon-io/carbon-core').atom.o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

/***************************************************************************************************
 * @namespace carbond.security
 */

/***************************************************************************************************
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

  /*****************************************************************************
   * @constructs Acl
   * @description User and group based access control for endpoints
   * @memberof carbond.security
   */
  _C: function() {
    /***************************************************************************
     * @property {Object.<string, boolean|Function>} [permissionDefinitions={}]
     * @description A map of operation name (e.g., 'get' or, for collections,
     *              'find') to predicate. The predicate can be a `boolean` or
     *              `Function`. If it is a function, it should take a user and
     *              env as arguments.
     */
    this.permissionDefinitions = {} // mapping of permissions to defaults

    /***************************************************************************
     * @property {Object.<string, Function|string>} [groupDefinitions={}]
     * @description This is mapping of group names to "extractors". An extractor
     *              can be a function or a string. If it is a function, it should
     *              take a user object as its sole argument and return the group
     *              name as a string. Otherwise, it should be a string in property
     *              path notation (e.g., "foo.bar.baz").
     */
    this.groupDefinitions = {} // set of definitions. each group name (lval) is mapped to a property path

    /***************************************************************************
     * @typedef AclEntry
     * @type {Object}
     * @description This object maps users/groups to permissions.
     * @property {string|Object.<string, string|Function>} user --
     *    This is either a "user spec" or a "group spec". A "user spec" is simply a
     *    string.  This string either maps to a user ID or it is the wildcard character
     *    ("*"), thereby matching any user. A "group spec" is an object with a single
     *    key. The value for this key is the group identifier we expect to find in a user
     *    object. To extract this group identifier, the same key is used to look up an
     *    "extractor" in {@link carbond.security.Acl.groupDefinitions}.
     * @property {Object.<string, boolean|Function>} permissions --
     *    A map of operation name (e.g., 'get' or, for collections, 'find') to predicate.
     *    The predicate can be a `boolean` or `Function`. If it is a function, it
     *    should take a user and env as arguments.
     */

    /***************************************************************************
     * @property {Array.<carbond.security.AclEntry>} [entries=[]]
     * description An array of ACL descriptors. Each descriptor provides the
     *             mechanism to match against a user object by ID or group
     *             membership and determine the whether or not a request is
     *             allowed for the user and operation using some predicate.
     */
    this.entries = [] // acl entries. mapping of user specifiers to maps of permissions to permission predicates
  },

  /*****************************************************************************
   * @method _init
   * @description Initializes the {@link carbond.security.Acl} instance (a no-op
   *              in this case)
   * @returns {undefined}
   */
  _init: function() { },

  /*****************************************************************************
   * @method hasPermission
   * @description Determines whether the current request is allowed based on the
   *              current user (as returned by {@link
   *              carbond.security.Authenticator.authenticate}) and operation
   * @param {Object} user -- A user object
   * @param {string} permission -- The name of the operation being authorized
   * @param {Object.<string, Object>} env -- Request context (e.g., ``{req: req}``)
   * @returns {boolean} -- Whether or not the request is authorized
   * @throws {Error}
   */
  hasPermission: function(user, permission, env) {
    // XXX deal with root user up here?
    if (!user) { // must have a user
      return false
    }

    // default deny if no entries defined XXX maybe this should be permissionDefs
    // lookup right?
    if (!this.entries) {
      return false
    }

    // XXX: can this be moved to _init()? this should fail during initialization and not on
    //      every request
    if (!Array.isArray(this.entries)) {
      throw new Error(
        'Malformed ACL entries. Must be an array. Found: ' + JSON.stringify(this.entries))
    }

    var matches = {
      userEntry: null, // there should only be one matching user entry. if more
                       // match we use the last one we find
      groupEntries: [],
      wildcardEntry: null
    }

    // iterate through and collect matches partitioned by user and group
    // matches (ignore '*')
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
          throw new Error('ACL invalid state. Unrecognized user spec: ' + userSpec)
        }
      }
    })

    // First check for user entry match. If one exists use that
    var userEntry = matches.userEntry
    if (userEntry) {
      // If there exists a user entry then we consider it to be a total
      // definition of permissions.  Even if the entry for the user omits a
      // definition of the permission, it is assumed to have the default value
      // for that permission as defined in this.permissionDefinitions
      //
      // XXX should it be getPP() which we then call?
      return this._checkPermission(user, userEntry, permission, env)
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

  /*****************************************************************************
   * @method and
   * @description Generates an ACL that is the logical conjunction of this ACL
   *              and a second ACL
   * @param {carbond.security.Acl} acl -- The second ACL
   * @returns {carbond.security.Acl}
   */
  and: function(acl) {
    var self = this // for now fail hard if no acl
    return o({
      _type: this.constructor,
      hasPermission: function(user, permission, env) {
        return self.hasPermission(user, permission, env) && acl.hasPermission(user, permission, env)
      }
    })
  },

  /*****************************************************************************
   * @method or
   * @description or Generates an ACL that is the logical disjunction of this ACL
   *                 and a second ACL
   * @param {carbond.security.Acl} acl -- The second ACL
   * @returns {carbond.security.Acl}
   */
  or: function(acl) { // for now fail hard if no acl
    var self = this
    return o({
      _type: this.constructor,
      hasPermission: function(user, permission, env) {
        return self.hasPermission(user, permission, env) || acl.hasPermission(user, permission, env)
      }
    })
  },

  /*****************************************************************************
   * @method _entriesGrantPermission
   * @description Determines whether a set of ACL entries collectively authorize
   *              a request
   * @param {Array.<carbond.security.AclEntry>} entries --
   *    An array of ACL entries to be evaluated against the current request
   * @param {Object} user -- The user object as returned by {@link
   *                         carbond.security.Authenticator.authenticate}
   * @param {string} permission -- The name of the operation being authorized
   * @param {Object.<string, Object>} env -- Request context (e.g., ``{req: req}``)
   * @returns {boolean} -- ``true`` if all entries evaluate to ``true`` for the
   *                       user and current request
   */
  _entriesGrantPermission: function(entries, user, permission, env) {
    var numEntriesGrantingPermission = 0

    var self = this
    entries.forEach(function(entry) {
      if (self._checkPermission(user, entry, permission, env)) {
        numEntriesGrantingPermission++
      }
    })

    // if they all grant permission then we grant permission, othewise we
    // have at least one matching entry that denies permission so we deny
    return numEntriesGrantingPermission == entries.length
  },

  /*****************************************************************************
   * @method _userMatchesSpec
   * @description Determines whether the user field in an {@link
   *              carbond.security.AclEntry} represents a "user sepc"
   * @param {Object} user -- The user object as returned by {@link
   *                         carbond.security.Authenticator.authenticate}
   * @param {string|Object.<string, string|Function>} spec --
   *    A {@link typedef:carbond.security.AclEntry.user} property
   * @returns {boolean}
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

    throw new Error('ACL entry user spec is not recognized: ' +
                    JSON.stringify(spec))
  },

  /*****************************************************************************
   * @method _getUserPropertyValue
   * @description Retrieves a value from the user object by property path or by
   *              an "extractor" function
   * @param {Object} user -- The user object as returned by {@link
   *                         carbond.security.Authenticator.authenticate}
   * @param {string|Function} extractor --
   *    Used to "extract" some property from the user object
   * @returns {*|undefined} -- The property value
   */
  _getUserPropertyValue: function(user, extractor) {
    if (typeof(extractor) == 'function') {
      return extractor(user)
    }

    // otherwise assume it is a string propertyPath
    return _.get(user, extractor)
  },

  /*****************************************************************************
   * @method _isUserUserSpec
   * @description Determines whether the user field in an {@link
   *              carbond.security.AclEntry} represents a "user sepc"
   * @param {string|Object.<string, string|Function>} spec --
   *    A {@link typedef:carbond.security.AclEntry.user} property
   * @returns {boolean}
   */
  _isUserUserSpec: function(spec) {
    return (typeof(spec) !== 'object')
  },

  /*****************************************************************************
   * @method _isGroupUserSpec
   * @description Determines whether the user field in an {@link
   *              carbond.security.AclEntry} represents a "group sepc"
   * @param {string|Object.<string, string|Function>} spec --
   *    A {@link typedef:carbond.security.AclEntry.user} property
   * @returns {boolean}
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

  /*****************************************************************************
   * @method _checkPermission
   * @description Checks whether the current request is authorized given a single
   *              {@link carbond.security.AclEntry} using the predicated defined
   *              by this entry or or some default predicate as defined in
   *              {@link carbond.security.Acl.permissionDefinitions}
   * @param {Object} user -- The user object as returned by {@link
   *                         carbond.security.Authenticator.authenticate}
   * @param {carbond.security.AclEntry} aclEntry --
   *    An ACL entry to be evaluated against the current request
   * @param {string} permission -- The name of the operation being authorized
   * @param {Object.<string, Object>} env -- Request context (e.g., ``{req: req}``)
   * @returns {boolean}
   */
  _checkPermission: function(user, aclEntry, permission, env) {
    if (this.permissionDefinitions[permission] == undefined) {
      // may later decide to return false but want to be strict for now
      throw new Error('Unsupported permission: ' + permission)
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

  /*****************************************************************************
   * @method _checkPermissionPredicate
   * @description Evaluates a predicate against the current request
   * @param {Object} user -- The user object as returned by {@link
   *                         carbond.security.Authenticator.authenticate}
   * @param {carbond.security.AclEntry} aclEntry --
   *    An ACL entry to be evaluated against the current request
   * @param {string} permission -- The name of the operation being authorized
   * @param {boolean|Function} p -- The predicate to evaluate against the current
   *                                request
   * @param {Object.<string, Object>} env -- Request context (e.g., ``{req: req}``)
   * @returns {boolean}
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

