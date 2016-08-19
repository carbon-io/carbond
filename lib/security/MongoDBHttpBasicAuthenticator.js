var connect = require('leafnode').connect
var _o = require('bond')._o(module)
var o = require('atom').o(module)
var oo = require('atom').oo(module)

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
  findUser: function(username) {
    var result

    // XXX: add method to `Authenticator` to check for required fields and use that instead
    _o('./HttpBasicAuthenticator').prototype.findUser.call(this, username)

    if (!this.db) {
      throw new Error("MongoDBApiKeyAuthenticator: could not authenticate because db is undefined")
    }

    if (!this.userCollection) {
      throw new Error("MongoDBApiKeyAuthenticator: could not authenticate because userCollection is undefined")
    }

    var c = this.db.getCollection(this.userCollection)
    var query = {}

    query[this.usernameField] = username

    return c.findOne(query)
  }
  
})
