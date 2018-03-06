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
  _ctorName: 'MongoDBHttpBasicAuthenticator',

  /*****************************************************************************
   * MongoDBHttpBasicAuthenticator
   * @constructs MongoDBHttpBasicAuthenticator
   * @description An implemetation of {@link class:carbond.security.HttpBasicAuthenticator}
   *              using MongoDB. It queries a MongoDB collection to find a user with
   *              a username and password that matches the username and password sent with the request.
   * @memberof carbond.security
   * @extends carbond.security.HttpBasicAuthenticator
   */
  _C: function() {
    /***************************************************************************
     * @property {string} dbName -- The name of the database to use if
     *                              there are multiple databases on the
     *                              parent Service (in {@link prop:carbond.service.dbs})
     */
    this.dbName = undefined

    /***************************************************************************
     * @property {string} userCollection -- The name of the collection
     *                                      in which users are stored
     */
    this.userCollection = undefined
  },

  /*****************************************************************************
  d@property {leafnode.DB} [db] -- A getter for the database object on the parent Service.
   *                               If there are multiple databases, it will return the
   *                               database defined in
   *                               {@link prop:carbond.security.MongoDBHttpBasicAuthenticator.dbName}
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
      },
    },
  },

  /*****************************************************************************
   * @method findUser
   * @description Queries the database for a user which has a username that matches
   *              the username sent in the request.
   * @param {string} username -- The username sent by the client.
   * @throws {Error} -- If the database or collection are undefined.
   * @returns {Object|undefined} -- An object representing the user if a match is found,
   *                                otherwise undefined.
   */
  findUser: function(username) {
    var result

    // XXX: add method to `Authenticator` to check for required fields and use that instead
    _o('./HttpBasicAuthenticator').prototype.findUser.call(this, username)

    if (!this.db) {
      throw new Error('MongoDBApiKeyAuthenticator: could not authenticate because db is undefined')
    }

    if (!this.userCollection) {
      throw new Error('MongoDBApiKeyAuthenticator: could not authenticate because userCollection is undefined')
    }

    var c = this.db.getCollection(this.userCollection)
    var query = {}

    query[this.usernameField] = username

    result = c.findOne(query)

    return _.isNull(result) ? undefined : result
  },

})
