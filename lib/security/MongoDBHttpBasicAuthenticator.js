var _ = require('lodash')

var connect = require('leafnode').connect

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

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
    this.dbName = undefined
    this.userCollection = undefined
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

    result = c.findOne(query)

    return _.isNull(result) ? undefined : result
  }
  
})
