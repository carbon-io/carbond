var _ = require('lodash')
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var DEFAULT_UNAUTHENTICATED_ERROR = "Could not authenticate user."

/***************************************************************************************************
 * @class Authenticator
 * @abstract
 * @description An abstract class used for authenticating requests. Authenticators should extend
 *              this class and implement their own authenticate method.
 * @memberof carbond.security
 */
module.exports = oo({

  /*****************************************************************************
   * @method initialize
   * @description Initializes the authenticator. Called by {@link carbond.Service.start}
   *              on the parent Service and sets `this.service` to the parent Service.
   * @param {carbond.Service} service -- The parent Service
   * @returns {undefined}
   */
  initialize: function(service) {
    this.service = service
  },

  /*****************************************************************************
   * @method getService
   * @description A getter for the parent Service
   * @returns {carbond.Service} -- The parent Service
   */
  getService: function() {
    return this.service
  },

  /*****************************************************************************
   * @method throwUnauthenticated
   * @description Throws a 401 Unauthorized Error.
   * @param {string} msg -- The message returned with the 401 error.
   * @throws {HttpErrors.Unauthorized}
   * @returns {undefined}
   */
  throwUnauthenticated: function(msg) {
    // XXX: we need to include the `WWW-Athenticate` response header when
    //      authentication fails. see http://www.ietf.org/rfc/rfc2617.txt
    //      section 3.2.1

    var errorMsg = _.isUndefined(msg) ? DEFAULT_UNAUTHENTICATED_ERROR : msg

    throw new this.service.errors.Unauthorized(errorMsg)
  },

  /*****************************************************************************
   * @method authenticate
   * @abstract
   * @description Authenticates the user for a request. Should be implemented by subclasses,
   *              for example: {@link class:carbond.security.MongoDBHttpBasicAuthenticator}.
   * @param {carbond.Request} req -- The current request
   *
   * @returns {Object|undefined} -- This should return an object representing the
   *                                user *or* undefined if the credendtials
   *                                are missing.
   * @throws {HttpErrors.Unauthorized} -- If credentials are present
   *                                      but they fail verification.
   * @throws {HttpErrors.InternalServerError} -- If there is an exception
   *                                             on user lookup.
   */
  authenticate: function(req) {
    return undefined
  }

})
