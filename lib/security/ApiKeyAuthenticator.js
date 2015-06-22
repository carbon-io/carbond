var o = require('atom').o(module)
var oo = require('atom').oo(module)
var _o = require('bond')._o(module)
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
    this.apiKeyLocation = "header" // can be "header" or "query"
  },

  /**********************************************************************
   * authenticate
   */        
  authenticate: function(req) {
    var result
    var apiKeyParameter
    var apiKey

    var apiKeyParameterName = this.apiKeyParameterName || "API_KEY"
    var apiKeyLocation = this.apiKeyLocation || "header"
    if (apiKeyLocation === "header") {
//      apiKey = req.get(apiKeyParameterName) // XXX Express > 2.0
      apiKeyParameter = req.header(apiKeyParameterName) 
    } else if (apiKeyLocation === "query") {
      apiKeyParameter = req.query[apiKeyParameterName]
    } else {
      throw new this.objectserver.errors.InternalServerError("Malformed authenticator configuration -- " +
                                                             "'apiKeyLocation' must be one of 'header' or 'query'")
    }
    
    if (apiKeyParameter) {
      try {
//        apiKey = JSON.parse(apiKeyParameter) XXX do we want this or just say it is a string
        apiKey = apiKeyParameter
      } catch (e) {
        throw new this.objectserver.errors.BadRequest("Malformed api key parameter: " + apiKeyParameter +
                                                      ". If the value is a string try enclosing it in double quotes")
      }
      if (apiKey) {
        try {
          result = this.findUser(apiKey)
        } catch (e) {
          this.objectserver.logWarning("Problem finding user from api key: " + apiKey + " -- " + e.stack)
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
