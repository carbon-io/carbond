var o = require('atom').o(module)
var oo = require('atom').oo(module)
var _o = require('bond')._o(module)
var auth = require('basic-auth')

/******************************************************************************
 * @class HttpBasicAuthenticator
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */     
  _type: './Authenticator',
  
  /**********************************************************************
   * authenticate
   */        
  authenticate: function(req) {
    var result
    var creds = auth(req)
    
    if (creds) {
      try {
        result = this.findUser(creds.name, creds.pass)
      } catch (e) {
        this.objectserver.logWarning("Problem finding user: ", 
                                     creds ? creds.name : undefined , 
                                     " -- ", e.stack)
      }
    }

    return result
  },
  
  /**********************************************************************
   * findUser
   */       
  findUser: function(username, password) {}

})
