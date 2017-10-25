var _ = require('lodash')
var auth = require('basic-auth')

var EJSON = require('@carbon-io/carbon-core').ejson
var o = require('@carbon-io/carbon-core').atom.o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var UUIDGenerator = require('../UUIDGenerator')

/***************************************************************************************************
 * @class ApiKeyAuthenticator
 * @abstract
 */
module.exports = oo({

  /*****************************************************************************
   * _type
   */
  _type: './Authenticator',

  /*****************************************************************************
   * @constructs ApiKeyAuthenticator
   * @description An abstract class for API key authentication
   * @memberof carbond.security
   * @extends carbond.security.Authenticator
   */
  _C: function() {

    /***************************************************************************
     * @property {string} [apiKeyParameterName=Api-Key] -- The name of the API key parameter
     */
    this.apiKeyParameterName = "Api-Key"

    /***************************************************************************
     * @property {string} [apiKeyLocation=header] -- The loaction of the API key, either
     *                                               *header* or *query*.
     */
    this.apiKeyLocation = "header" // can be "header" or "query"

    /***************************************************************************
     * @property {string[]} [maskUserObjectKeys=undefined] -- An array of properties that should
     *                                            be masked on the user object in
     *                                            the logs. Used for masking sensitive
     *                                            information.
     */
    this.maskUserObjectKeys = undefined

    /***************************************************************************
     * @property {carbond.IdGenerator} [idGenerator]
     * @default {@link carbond.UUIDGenerator}
     * @description The ID generator to generate API keys.
     */
    this.idGenerator = o({
      _type: UUIDGenerator
    })
  },

  /*****************************************************************************
   * @method _maskUserObject
   * @description Masks sensitive information on the user object. It replaces the
   *              values for each key in {@link prop:carbond.security.maksUserObjectKeys}
   *              with **** (defined in {@link prop:carbond.service.maskSecret}). This
   *              is used when outputting the use object to the logs.
   * @param {object} user -- Object representing the user
   * @returns {object} -- The user object with sensitive values replaced with ****
   */
  _maskUserObject: function(user) {
    var self = this
    if (_.isArray(this.maskUserObjectKeys)) {
      user = _.cloneDeep(user)
      this.maskUserObjectKeys.forEach(function(key) {
        _.set(user, key, self.getService().maskSecret(_.get(user, key)))
      })
    }
    return user
  },

  /*****************************************************************************
   * @method authenticate
   * @description Authenticates the current request using an API key. Returns
   *              a user object that matches the API Key sent with the request.
   *              If no user matching the API key is found,
   *              throws a 401 Unauthorized error.
   * @param {Request} req -- The current request
   * @returns {object} -- An object representing the user
   * @throws {HttpErrors.Unauthorized} -- If no user matching the API key is found
   * @throws {HttpErrors.InternalServerError} -- If {@link carbond.security.ApiKeyAuthenticator.apiKeyLocation}
   *                                             is malformed, or if there is an error
   *                                             finding the user.
   */
  authenticate: function(req) {
    this.getService().logDebug("ApiKeyAuthenticator.authenticate()")

    var result = undefined
    var apiKey = undefined

    var apiKeyParameterName = this.apiKeyParameterName
    var apiKeyLocation = this.apiKeyLocation || "header"
    if (apiKeyLocation === "header") {
      apiKey = req.header(apiKeyParameterName)
    } else if (apiKeyLocation === "query") {
      apiKey = req.query[apiKeyParameterName]
    } else {
      throw new this.getService().errors.InternalServerError(
        "Malformed authenticator configuration -- " +
        "'apiKeyLocation' must be one of 'header' or 'query'")
    }

    this.getService().logDebug(
      "ApiKeyAuthenticator.authenticate(): Key name: " +
      apiKeyParameterName)
    this.getService().logDebug(
      "ApiKeyAuthenticator.authenticate(): Key location: " +
      apiKeyLocation)
    this.getService().logDebug(
      "ApiKeyAuthenticator.authenticate(): Key value: " +
      this.getService().maskSecret(apiKey))
    if (apiKey) {
      try {
        result = this.findUser(apiKey)
        this.getService().logDebug(
          "ApiKeyAuthenticator.authenticate(): Key: " +
          this.getService().maskSecret(apiKey) + ", User: " +
          EJSON.stringify(this._maskUserObject(result)))
      } catch (e) {
        this.getService().logError(
          "Problem finding user from api key: " +
          this.getService().maskSecret(apiKey) +
          " -- " + e.stack)
        throw new this.getService().errors.InternalServerError(
          "Could not authenticate user.")
      }
      if (!result) {
        this.throwUnauthenticated()
      }
    }

    return result
  },

  /*****************************************************************************
   * @method generateApiKey
   * @description Generates a UUID using {@link prop:carbond.security.ApiKeyAuthenticator.idGenerator}
   * @returns {string} -- A UUID (see [Wikipedia]{@link https://en.wikipedia.org/wiki/Universally_unique_identifier})
   */
  generateApiKey: function() {
    return this.idGenerator.generateId()
  },

  /*****************************************************************************
   * @method getAuthenticationHeaders
   * @description Gets an array containing
   *              {@link prop:carbond.security.ApiKeyAuthenticator.apiKeyParameterName}
   * @returns {string[]} -- An array containing the name of the header which contains
   *                        the API key. An empty array if the location of the API
   *                        key is in the querystring.
   */
  getAuthenticationHeaders: function() {
    // XXX: This function isn't used
    var result = []
    if (this.apiKeyLocation === "header") {
      result.push(this.apiKeyParameterName)
    }
    return result
  },

  /*****************************************************************************
   * @method findUser
   * @abstract
   * @description An abstract method for finding the user from an API key. Should
   *              be implemented by subclasses. For example,
   *              {@link class:carbond.security.MongoDBApiKeyAuthenticator}
   * @param {string} apiKey -- The API Key that was sent with this request
   * @returns {object} -- A user object
   */
  findUser: function(apiKey) {}
})
