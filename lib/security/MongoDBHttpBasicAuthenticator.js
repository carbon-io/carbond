var connect = require('leafnode').connect

var oo = require('carbon-core').atom.oo(module)

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
          result = this.service.dbs[dbName]
        } else {
          result = this.service.db
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
      query[this.passwordField] = password // XXX need to handle hashing
      result = c.findOne(query)
    }
    return result
  }
  
})
