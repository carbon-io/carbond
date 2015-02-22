var o = require('maker').o(module)
var oo = require('maker').oo(module)
var _o = require('maker')._o(module)
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
    var apiKey

    var apiKeyParameterName = this.apiKeyParameterName || "API_KEY"
    var apiKeyIn = this.apiKeyIn || "header"
    if (apiKeyIn === "header") {
//      apiKey = req.get(apiKeyParameterName) // XXX Express > 2.0
      apiKey = req.header(apiKeyParameterName) 
    } else if (apiKeyIn === "query") {
      apiKey = req.query[apiKeyParameterName]
    } else {
      throw this.objectserver.errors.InternalServerError("Malformed authenticator configuration -- " +
                                                         "'apiKeyIn' must be one of 'header' or 'query'")
    }
    
    if (apiKey) {
      try {
        result = this.findUser(apiKey)
      } catch (e) {
        this.objectserver.log.warn("Problem finding user from api key: ", apiKey, " -- ", e.stack)
      }
    }

    return result
  },
  
  /**********************************************************************
   * findUser
   */       
  findUser: function(apiKey) {}

})
