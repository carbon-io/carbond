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
   * _C
   */  
  _C: function() {
    this.passwordHashFn = undefined
    // OR
    // this.passwordHashFn = {
    //   type: bcrypt
    //   salt: "dsdaD",
    // }
  },

  /**********************************************************************
   * authenticate
   */        
  authenticate: function(req) {
    var result
    var creds = auth(req)
    
    if (creds) {
      try {
        var user = creds.name
        var pass = creds.pass
        if (this.passwordHashFn) {
          pass = passwordHashFn(pass) // XXX no this is all wrong for bcrypt 
        } 
        result = this.findUser(name, pass)
      } catch (e) {
        this.service.logWarning("Problem finding user: ", 
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
