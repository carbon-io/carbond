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
   * @description HttpBasicAuthenticator description
   * @memberof carbond.security
   * @extends carbond.security.Authenticator
   */
  _C: function() {
    /***************************************************************************
     * @property {string} [passwordHashFn=noop] -- xxx
     */
    this.passwordHashFn = 'noop'

    /***************************************************************************
     * @property {string} usernameField -- xxx
     */
    this.usernameField = undefined

    /***************************************************************************
     * @property {string} passwordField -- xxx
     */
    this.passwordField = undefined
  },

  /*****************************************************************************
   * @method _init
   * @description _init description
   * @returns {undefined} -- undefined
   * @throws {TypeError} -- if this.passwordHashFn cannot be resolved to
   *                        an instance of {@link Hasher}
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
   * @description validateCreds description
   * @param {string} username -- xxx
   * @param {string} password -- xxx
   * @throws {Service.errors.InternalServerError} -- xxx
   * @returns {xxx} -- xxx
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
   * @description authenticate
   * @param {xxx} req -- xxx
   * @returns {xxx} -- xxx
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
   * @description findUser NOTE: this should be extended
   * @param {string} username -- The username sent by the client.
   * @throws {Error} -- xxx
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
