var express = require('express')
var o = require('maker').o
var oo = require('maker').oo
var _o = require('maker')._o

/******************************************************************************
 * @class HttpBasicAuthenticator
 */
module.exports = oo({

    /**********************************************************************
     * _type
     */     
    _type: 'datanode/lib/Authenticator',

    /**********************************************************************
     * initialize
     */        
    initialize: function(objectserver) {
        var me = this
        objectserver._app.use(express.basicAuth(function(u, p) {
            return me.authenticate(u, p)
        }))  
    },

    /**********************************************************************
     * authenticate
     */        
    authenticate: function(username, password) {
        return false
    }


})
