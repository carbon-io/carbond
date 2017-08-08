var _ = require('lodash')
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var DEFAULT_UNAUTHENTICATED_ERROR = "Could not authenticate user."

/***************************************************************************************************
 * @class Authenticator
 * @memberof carbond.security
 */
module.exports = oo({

  /*****************************************************************************
   * @method initialize
   * @description initialize description
   * @param {xxx} service -- xxx
   * @returns {xxx} -- xxx
   */
  initialize: function(service) {
    this.service = service
  },

  /*****************************************************************************
   * @method getService
   * @description getService description
   * @returns {xxx} -- xxx
   */
  getService: function() {
    return this.service
  },

  /*****************************************************************************
   * @method throwUnauthenticated
   * @description throwUnauthenticated description
   * @param {xxx} msg -- xxx
   * @throws {Service.errors.Unauthorized} -- xxx
   * @returns {undefined} -- undefined
   */
  throwUnauthenticated: function(msg) {
    // XXX: we need to include the `WWW-Athenticate` response header when
    //      authentication fails. see http://www.ietf.org/rfc/rfc2617.txt
    //      section 3.2.1
    throw new this.service.errors.Unauthorized(
      _.isUndefined(msg) ? msg : DEFAULT_UNAUTHENTICATED_ERROR)
  },

  /*****************************************************************************
   * @method authenticate
   * @description authenticate description
   * @param {xxx} req -- xxx
   *
   * @returns {Object|undefined} -- This should return an object representing
   *                                user *or* undefined if the credendtials
   *                                are missing
   * @throws {Service.errors.Unauthorized} -- If credentials are present
   *                                          but they fail verification.
   * @throws {Service.errors.InternalServerError} -- If there is an exception
   *                                                 on user lookup.
   */
  authenticate: function(req) {
    return undefined
  },

  /*****************************************************************************
   * @method isRootUser
   * @description isRootUser description
   * @param {xxx} user -- xxx
   * @returns {boolean} -- xxx
   */
  isRootUser: function(user) {
    return false
  },

  /*****************************************************************************
   * @method getAuthenticationHeaders
   * @description getAuthenticationHeaders description
   * @returns {xxx} -- xxx
   */
  getAuthenticationHeaders: function() {
    return []
  }

})
