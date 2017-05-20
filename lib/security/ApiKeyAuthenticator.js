var _ = require('lodash')
var auth = require('basic-auth')

var EJSON = require('@carbon-io/carbon-core').ejson
var o = require('@carbon-io/carbon-core').atom.o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var UUIDGenerator = require('../UUIDGenerator')

/******************************************************************************
 * @class ApiKeyAuthenticator
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */
  _type: './Authenticator',

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.apiKeyParameterName = "Api-Key"
    this.apiKeyLocation = "header" // can be "header" or "query"
    this.maskUserObjectKeys = undefined
    this.idGenerator = o({
      _type: UUIDGenerator
    })
  },

  /**********************************************************************
   * _maskUserObject
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

  /**********************************************************************
   * authenticate
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
        debugger
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

  /**********************************************************************
   * generateApiKey
   */
  generateApiKey: function() {
    return this.idGenerator.generateId()
  },

  /**********************************************************************
   * getAuthenticationHeaders
   */
  getAuthenticationHeaders: function() {
    var result = []
    if (this.apiKeyLocation === "header") {
      result.push(this.apiKeyParameterName)
    }
    return result
  },

  /**********************************************************************
   * findUser
   */
  findUser: function(apiKey) {}

})
