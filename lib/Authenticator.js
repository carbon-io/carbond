var o = require('maker').o;
var oo = require('maker').oo;
var _ = require('maker')._;

/******************************************************************************
 * @class Authenticator
 */
module.exports = oo({

    /**********************************************************************
     * initialize
     */        
    initialize: function(objectserver) {
    },

    /**********************************************************************
     * authenticate
     */        
    authenticate: function(username, password) {
        return false
    },

    /**********************************************************************
     * findUserByUsername
     */
    findUserByUsername: function(username) {
        return null
    }


})
