var o = require('atom').o(module)
var oo = require('atom').oo(module)
var _o = require('bond')._o(module)
var auth = require('basic-auth')
var EJSON = require('mongodb-extended-json')

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
  },

  /**********************************************************************
   * authenticate
   */        
  authenticate: function(req) {
    this.service.logDebug("ApiKeyAuthenticator.authenticate()")

    var result
    var apiKeyParameter
    var apiKey

    var apiKeyParameterName = this.apiKeyParameterName
    var apiKeyLocation = this.apiKeyLocation || "header"
    if (apiKeyLocation === "header") {
      apiKeyParameter = req.header(apiKeyParameterName) 
    } else if (apiKeyLocation === "query") {
      apiKeyParameter = req.query[apiKeyParameterName]
    } else {
      throw new this.service.errors.InternalServerError("Malformed authenticator configuration -- " +
                                                        "'apiKeyLocation' must be one of 'header' or 'query'")
    }
    
    this.service.logDebug("ApiKeyAuthenticator.authenticate(): Key name: " + apiKeyParameterName)
    this.service.logDebug("ApiKeyAuthenticator.authenticate(): Key location: " + apiKeyLocation)
    this.service.logDebug("ApiKeyAuthenticator.authenticate(): Key value: " + apiKeyParameter)
    if (apiKeyParameter) {
      try {
        apiKey = apiKeyParameter
      } catch (e) {
        throw new this.service.errors.BadRequest("Malformed api key parameter: " + apiKeyParameter +
                                                 ". If the value is a string try enclosing it in double quotes")
      }
      if (apiKey) {
        try {
          result = this.findUser(apiKey)
          this.service.logDebug("ApiKeyAuthenticator.authenticate(): Key: " + apiKey + 
                                     ", User: " + EJSON.stringify(result))
        } catch (e) {
          this.service.logError("Problem finding user from api key: " + apiKey + " -- " + e.stack)
          throw new this.service.errors.InternalServerError("Could not authenticate user.")
        }
      }
    }

    return result
  },
  
  /**********************************************************************
   * getAuthenticationHeaders
   */        
  getAuthenticationHeaders: function() {
    return [this.apiKeyParameterName]
  },

  /**********************************************************************
   * findUser
   */       
  findUser: function(apiKey) {}

})
