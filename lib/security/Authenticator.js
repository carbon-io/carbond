var _ = require('lodash')

var o = require('atom').o(module)
var oo = require('atom').oo(module)

var DEFAULT_UNAUTHENTICATED_ERROR = "Could not authenticate user."

/******************************************************************************
 * @class Authenticator
 */
module.exports = oo({

  /**********************************************************************
   * initialize
   */        
  initialize: function(service) {
    this.service = service
  },

  /**********************************************************************
   * throwUnauthenticated
   */
  throwUnauthenticated: function(msg) {
    // XXX: we need to include the `WWW-Athenticate` response header when
    //      authentication fails. see http://www.ietf.org/rfc/rfc2617.txt
    //      section 3.2.1
    throw new this.service.errors.Unauthorized(
      _.isUndefined(msg) ? msg : DEFAULT_UNAUTHENTICATED_ERROR)
  },

  /**********************************************************************
   * authenticate
   *
   * @returns {Object|undefined} - This should return an object representing
   *                               user *or* undefined if the credendtials
   *                               are missing
   * @throws {Service.errors.Unauthorized} - If credentials are present
   *                                         but they fail verification.
   * @throws {Service.errors.InternalServerError} - If there is an exception
   *                                                on user lookup.
   */
  authenticate: function(req) {
    return undefined
  },

  /**********************************************************************
   * isRootUser
   */
  isRootUser: function(user) {
    return false
  },
  
  /**********************************************************************
   * getAuthenticationHeaders
   */        
  getAuthenticationHeaders: function() {
    return []
  }

})
