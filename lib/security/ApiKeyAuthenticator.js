var o = require('atom').o(module)
var oo = require('atom').oo(module)
var _o = require('atom')._o(module)
var auth = require('basic-auth')

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
    this.apiKeyParameterName = "API_KEY"
    this.apiKeyIn = "header" // can be "header" or "query"
  },

  /**********************************************************************
   * authenticate
   */        
  authenticate: function(req) {
    var result
    var apiKeyParameter
    var apiKey

    var apiKeyParameterName = this.apiKeyParameterName || "API_KEY"
    var apiKeyIn = this.apiKeyIn || "header"
    if (apiKeyIn === "header") {
//      apiKey = req.get(apiKeyParameterName) // XXX Express > 2.0
      apiKeyParameter = req.header(apiKeyParameterName) 
    } else if (apiKeyIn === "query") {
      apiKeyParameter = req.query[apiKeyParameterName]
    } else {
      throw this.objectserver.errors.InternalServerError("Malformed authenticator configuration -- " +
                                                         "'apiKeyIn' must be one of 'header' or 'query'")
    }
    
    if (apiKeyParameter) {
      try {
        apiKey = JSON.parse(apiKeyParameter)
      } catch (e) {
        throw this.objectserver.errors.BadRequest("Malformed api key parameter: " + apiKeyParameter +
                                                 ". If the value is a string try enclosing it in double quotes")
      }
      if (apiKey) {
        try {
          result = this.findUser(apiKey)
        } catch (e) {
          this.objectserver.log.warn("Problem finding user from api key: ", apiKey, " -- ", e.stack)
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
