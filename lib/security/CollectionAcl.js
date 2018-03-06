var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)

/***************************************************************************************************
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

  /*****************************************************************************
   * _type
   */
  _type: './EndpointAcl',
  _ctorName: 'CollectionAcl',

  /*****************************************************************************
   * @constructs CollectionAcl
   * @description CollectionAcl description
   * @memberof carbond.security
   * @extends carbond.security.EndpointAcl
   */
  _C: function() {
    /***************************************************************************
     * @property {object} permissionDefinitions -- mapping of permissions to
     *                                             defaults
     */
    this.permissionDefinitions = { // mapping of permissions to defaults
      insert: false,
      find: false,
      save: false,
      update: false,
      remove: false,
      insertObject: false,
      findObject: false,
      saveObject: false,
      updateObject: false,
      removeObject: false,
    }
  },

  /*****************************************************************************
   * @method hasPermission
   * @description hasPermission description
   * @param {xxx} user -- xxx
   * @param {xxx} permission -- xxx
   * @param {xxx} env -- xxx
   * @returns {xxx} -- xxx
   */
  hasPermission: function(user, permission, env) {
    if (permission === 'get') {
      return this.hasPermission(user, 'find', env)
    }
    if (permission === 'patch') {
      return this.hasPermission(user, 'update', env)
    }
    if (permission === 'post') {
      // XXX: is this safe?
      if (_.isArray(env.req.body)) {
        return this.hasPermission(user, 'insert', env)
      } else {
        return this.hasPermission(user, 'insertObject', env)
      }
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
    if (permission === 'put') {
      return this.hasPermission(user, 'save', env)
    }

    return _o('./EndpointAcl').prototype.hasPermission.call(this, user, permission, env)

  },

})

