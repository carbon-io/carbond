var o = require('maker').o(module)
var oo = require('maker').oo(module)

/******************************************************************************
 * @class Authenticator
 */
module.exports = oo({

    /**********************************************************************
     * initialize
     */        
    initialize: function(objectserver) {
      this.objectserver = objectserver
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
    }
})
