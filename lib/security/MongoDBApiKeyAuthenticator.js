var connect = require('@carbon-io/carbon-core').leafnode.connect
var oo = require('@carbon-io/carbon-core').atom.oo(module)
var _ = require('lodash')

/******************************************************************************
 * @class MongoDBApiKeyAuthenticator
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */
  _type: './ApiKeyAuthenticator',

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.dbName = undefined
    this.userCollection = undefined
    this.apiKeyField = undefined
  },

  /**********************************************************************
   * _init
   */
  _init: function() {
    if (_.isUndefined(this.maskUserObjectKeys)) {
      this.maskUserObjectKeys = [
        this.apiKeyField
      ]
    }
  },

  /**********************************************************************
   * db
   */
  db: {
    $property: {
      get: function() {
        var result
        if (this.dbName) {
          result = this.service.dbs[this.dbName]
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
  findUser: function(apiKey) {
    var result

    if (!this.db) {
      throw new Error("MongoDBApiKeyAuthenticator: could not authenticate because db is undefined")
    }

    if (!this.userCollection) {
      throw new Error("MongoDBApiKeyAuthenticator: could not authenticate because userCollection is undefined")
    }

    var c = this.db.getCollection(this.userCollection)
    var query = {}
    if (!this.apiKeyField) {
      throw new Error("MongoDBApiKeyAuthenticator.apiKeyField is undefined. Please check your configuration")
    }
    query[this.apiKeyField] = apiKey
    result = c.findOne(query)

    return _.isNull(result) ? undefined : result
  }

})
