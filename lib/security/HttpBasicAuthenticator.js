var _ = require('lodash')
var auth = require('basic-auth')

var Hasher = require('./Hasher')

var oo = require('@carbon-io/carbon-core').atom.oo(module)

/***************************************************************************************************
 * @class HttpBasicAuthenticator
 * @extends Authenticator
 */
module.exports = oo({
  /*****************************************************************************
   * _type
   */
  _type: './Authenticator',

  /*****************************************************************************
   * @constructs HttpBasicAuthenticator
   * @description An authenticator for the Basic HTTP Authenitcation Scheme.
   * @memberof carbond.security
   * @extends carbond.security.Authenticator
   */
  _C: function() {
    /***************************************************************************
     * @property {string|function} [passwordHashFn=noop] -- Either a string representing a
     *                                                      {@link class:carbond.security.Hasher}
     *                                                      (possible values are *noop*, *sha256*,
     *                                                      and *bcrypt*), or a custom function
     *                                                      which takes a string and returns a
     *                                                      hashed string.
     */
    this.passwordHashFn = 'noop'

    /***************************************************************************
     * @property {string} usernameField -- Name of the field that contains the
     *                                     username in the database.
     */
    this.usernameField = undefined

    /***************************************************************************
     * @property {string} passwordField -- Name of the field that contains the
     *                                     password in the database.
     */
    this.passwordField = undefined
  },

  /*****************************************************************************
   * @method _init
   * @description Checks that {@link prop:carbond.security.passwordHashFn} is a
   *              string or a function. If it is a string that represents a
   *              {@link class:carbond.security.Hasher}, sets the property to a
   *              new instance of that Hasher.
   * @returns {undefined}
   * @throws {TypeError} -- if this.passwordHashFn cannot be resolved to
   *                        an instance of {@link class:carbond.security.Hasher},
   *                        or isn't a function.
   */
  _init: function() {
    if (_.isUndefined(this.passwordHashFn)) {
      this.passwordHashFn = 'noop'
    }
    if (_.isString(this.passwordHashFn)) {
      if (!_.includes(Hasher.getHasherNames(), this.passwordHashFn)) {
        throw new Error('unrecognized hash function (' +
          this.passwordHashFn +
          '), acceptable hash functions are: ' +
          Hasher.getHasherNames())
      }
      this.passwordHashFn = Hasher.getHasher(this.passwordHashFn)
    }
    if (_.isFunction(this.passwordHashFn)) {
      this.passwordHashFn = new this.passwordHashFn
    }
    if (!(this.passwordHashFn instanceof Hasher)) {
      throw new TypeError
    }
  },

  /*****************************************************************************
   * @method validateCreds
   * @description Finds a user matching a username and password. The password is
   *              checked using the hash function.
   * @param {string} username -- username from the HTTP request
   * @param {string} password -- password from the HTTP request
   * @throws {Service.errors.InternalServerError} -- 500 Internal Server Error
   * @returns {object|undefined} -- Object representing the user if a user matching
   *                                the username and password is found. Otherwise
   *                                returns undefined.
   */
  validateCreds: function(username, password) {
    var result = undefined

    try {
      result = this.findUser(username)
      if (!result) {
        this.service.logDebug('auth failed due to failed user lookup')
        result = undefined
      } else if (!this.passwordHashFn.eq(password, result[this.passwordField])) {
        this.service.logDebug('auth failed due to failed password comparison')
        result = undefined
      }
    } catch (e) {
      this.service.logWarning('Problem finding user: ', username, ' -- ', e.stack)
      throw new this.service.errors.InternalServerError("Could not authenticate user.")
    }

    return result
  },

  /*****************************************************************************
   * @method authenticate
   * @description Authenticates a request using HTTP Baisc. Returns
   *              a user object that matches the username and passwordsent with
   *              the request. If no user matching the username and password is found,
   *              throws a 401 Unauthorized error.
   * @param {Request} req -- The current request
   * @returns {object|undefined} -- An object representing the user. Undefined if
   *                                no credentials are found on the request.
   * @throws {HttpErrors.Unauthorized} -- If credentials weren't validated
   */
  authenticate: function(req) {
    var result = undefined
    var creds = auth(req)

    if (creds) {
      var user = creds.name
      var pass = creds.pass
      result = this.validateCreds(user, pass)
      if (!result) {
        this.throwUnauthenticated()
      }
    }

    return result
  },

  /*****************************************************************************
   * @method findUser
   * @abstract
   * @description Find a user matching a username. Must be implemented by subcalsses.
   * @param {string} username -- The username sent by the client.
   * @throws {Error} -- If the usernameField or passwordField are undefined.
   */
  findUser: function(username) {
    if (!this.usernameField) {
      throw new Error(this.constructor.name +
                      '.usernameField is undefined. Please check your configuration')
    }
    if (!this.passwordField) {
      throw new Error(this.constructor.name +
                      '.passwordField is undefined. Please check your configuration')
    }
  }

})
