var connect = require('@carbon-io/carbon-core').leafnode.connect
var oo = require('@carbon-io/carbon-core').atom.oo(module)
var _ = require('lodash')

/***************************************************************************************************
 * @class MongoDBApiKeyAuthenticator
 */
module.exports = oo({

  /*****************************************************************************
   * _type
   */
  _type: './ApiKeyAuthenticator',

  /*****************************************************************************
   * @constructs MongoDBApiKeyAuthenticator
   * @description An implemetation of {@link class:carbond.security.ApiKeyAuthenticator}
   *              using MongoDB. It queries a MongoDB collection to find a user with
   *              an API key that matches the key sent with the request.
   * @memberof carbond.security
   * @extends carbond.security.ApiKeyAuthenticator
   */
  _C: function() {
    /***************************************************************************
     * @property {string} [dbName=undefined] -- The name of the database to use if
     *                                          there are multiple databases on the
     *                                          parent Service (in {@link prop:carbond.service.dbs})
     */
    this.dbName = undefined

    /***************************************************************************
     * @property {string} userCollection -- The name of the collection
     *                                      in which users are stored
     */
    this.userCollection = undefined

    /***************************************************************************
     * @property {string} apiKeyField -- The name of the field where
     *                                   the API key is on the user documents
     */
    this.apiKeyField = undefined
  },

  /*****************************************************************************
   * @method _init
   * @description Initializes the {@link class:carbond.security.MongoDBApiKeyAuthenticator}
   *              instance. Adds the
   *              {@link prop:carbond.security.MongoDBApiKeyAuthenticator.apiKeyField}
   *              to {@link prop:carbond.security.ApiKeyAuthenticator.maskUserObjectKeys}.
   * @returns {undefined}
   */
  _init: function() {
    if (_.isUndefined(this.maskUserObjectKeys)) {
      this.maskUserObjectKeys = [
        this.apiKeyField
      ]
    }
  },

  /*****************************************************************************
   * @property {leafnode.DB} [db] -- A getter for the database object on the parent Service.
   *                                 If there are multiple databases, it will return the
   *                                 database defined in
   *                                 {@link prop:carbond.security.MongoDBApiKeyAuthenticator.dbName}
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

  /*****************************************************************************
   * @method findUser
   * @description Queries the database for a user which has an API key that matches
   *              the API key sent in the request.
   * @param {string} apiKey -- The API key from the request
   * @throws {Error}
   * @returns {object|undefined} -- An object representing the user if a match is found,
   *                                otherwise undefined.
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
