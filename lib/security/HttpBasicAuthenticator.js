var _ = require('lodash')
var auth = require('basic-auth')

var o = require('atom').o(module)
var oo = require('atom').oo(module)
var _o = require('bond')._o(module)

var Hasher = require('./Hasher')

/******************************************************************************
 * @class HttpBasicAuthenticator
 * @extends Authenticator
 */
module.exports = oo({
  /**********************************************************************
   * _type
   */
  _type: './Authenticator',

  /**********************************************************************
   * @method _C
   */  
  _C: function() {
    this.passwordHashFn = 'noop'
    this.usernameField = undefined
    this.passwordField = undefined
  },

  /**********************************************************************
   * @method _init
   *
   * @throws {TypeError} - if this.passwordHashFn cannot be resolved to
   *                       an instance of {@link Hasher}
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

  /**********************************************************************
   * @method validateCreds
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
      throw new this.service.errors.InternalServerError()
    }

    return result
  },

  /**********************************************************************
   * @method authenticate
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
  
  /**********************************************************************
   * @method findUser
   *
   * NOTE: this should be extended
   *
   * @param {string} username - The username sent by the client.
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
