var _ = require('lodash')

var connect = require('@carbon-io/carbon-core').leafnode.connect

var _o = require('@carbon-io/carbon-core').bond._o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

/***************************************************************************************************
 * @class MongoDBHttpBasicAuthenticator
 */
module.exports = oo({

  /*****************************************************************************
   * _type
   */     
  _type: './HttpBasicAuthenticator',
  
  /*****************************************************************************
   * MongoDBHttpBasicAuthenticator
   * @constructs MongoDBHttpBasicAuthenticator
   * @description MongoDBHttpBasicAuthenticator description
   * @memberof carbond.security
   * @extends carbond.security.HttpBasicAuthenticator
   */  
  _C: function() {
    /***************************************************************************
     * @property {xxx} dbName -- xxx
     */
    this.dbName = undefined

    /***************************************************************************
     * @property {xxx} userCollection -- xxx
     */
    this.userCollection = undefined
  },

  /*****************************************************************************
   * @property {xxx} db -- xxx
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
  
  /*****************************************************************************
   * @method findUser
   * @description findUser description
   * @param {xxx} username -- xxx
   * @throws {Error} -- xxx
   * @returns {xxx} -- xxx
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
