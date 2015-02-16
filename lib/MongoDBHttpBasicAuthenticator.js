var connect = require('leafnode').connect
var o = require('maker').o(module)
var oo = require('maker').oo(module)

/******************************************************************************
 * @class MongoDBHttpBasicAuthenticator
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */     
  _type: './HttpBasicAuthenticator',
  
  /**********************************************************************
   * _C
   */  
  _C: function() {
    this.dbName = null
    this.userCollection = null
    this.usernameField = null
    this.passwordField = null
  },

  /**********************************************************************
   * db
   */        
  db: {
    $property: {
      get: function() {
        var result
        if (this.dbName) {
          result = this.objectserver.dbs[dbName]
        } else {
          result = this.objectserver.db
        }
        return result
      }
    }
  },
  
  /**********************************************************************
   * findUser
   */        
  findUser: function(username, password) {
    var result    
    if (this.db && this.userCollection) {
      var c = this.db.getCollection(this.userCollection)
      var query = {}
      query[this.usernameField] = username
      query[this.passwordField] = password
      result = c.findOne(query)
    }
    return result
  }
  
})
