var connect = require('leafnode').connect
var o = require('maker').o;
var oo = require('maker').oo;
var _o = require('maker')._o;

/******************************************************************************
 * @class MongoDBHttpBasicAuthenticator
 */
module.exports = oo({

    /**********************************************************************
     * _type
     */     
    _type: 'datanode/lib/HttpBasicAuthenticator',

    /**********************************************************************
     * mongodbURI
     */        
    mongodbURI: null,

    /**********************************************************************
     * _db
     */        
    _db: null,

    /**********************************************************************
     * userCollection
     */        
    userCollection: null,

    /**********************************************************************
     * usernameField
     */        
    usernameField: "username",

    /**********************************************************************
     * passwordField
     */        
    passwordField: "password",

    /**********************************************************************
     * authenticate
     */        
    authenticate: function(username, password) {
        console.log("authenticate()")
        var result = false

        var db = this._getDatabase()
        if (db && this.userCollection) {
            var c = db.getCollection(this.userCollection)
            var query = {}
            query[this.usernameField] = username
            query[this.passwordField] = password
            var user = c.findOne(query)
            if (user) {
                result = true
            }
        }

        return result
    },

    /**********************************************************************
     * findUserByUsername
     */
    findUserByUsername: function(username) {
        var result = null
        var db = this._getDatabase()
        if (db && this.userCollection) {
            var c = db.getCollection(this.userCollection)
            var query = {}
            query[this.usernameField] = username
            result = c.findOne(query)
        }
        return result
    },

    /**********************************************************************
     * _getDatabase
     */
    _getDatabase: function() {
        var result = null
        var db = this._db
        if (db) {
            result = db
        } else {
            var uri = this.mongodbURI
            if (uri) {
                result = connect(uri)
            }
        }
        return result
    }

})
