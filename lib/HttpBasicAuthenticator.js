var o = require('maker').o(module)
var oo = require('maker').oo(module)
var _o = require('maker')._o(module)
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
        this.objectserver.log.warn("Problem finding user: ", 
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
