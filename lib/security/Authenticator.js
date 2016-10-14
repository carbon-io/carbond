var oo = require('carbon-core').atom.oo(module)

/******************************************************************************
 * @class Authenticator
 */
module.exports = oo({

  /**********************************************************************
   * initialize
   */        
  initialize: function(service) {
    this.service = service
  },
  
  /**********************************************************************
   * authenticate
   */        
  authenticate: function(req) {
    return false
  },

  /**********************************************************************
   * isRootUser
   */
  isRootUser: function(user) {
    return false
  },
  
  /**********************************************************************
   * getAuthenticationHeaders
   */        
  getAuthenticationHeaders: function() {
    return []
  }

})
