var crypto = require('crypto')

var _ = require('lodash')
var auth = require('basic-auth')
var bcrypt = require('bcryptjs')

var o = require('atom').o(module)
var oo = require('atom').oo(module)
var _o = require('bond')._o(module)

/******************************************************************************
 * @class HttpBasicAuthenticator
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */     
  _type: './Authenticator',

  /**********************************************************************
   * _C
   */  
  _C: function() {
    this._supportedHashFunctions = ['sha256', 'bcrypt', 'none']
    // XXX: do we want to set a default of 'none' or make the user set it
    //      explicitly?
    this.passwordHashFn = 'none'
    this.usernameField = null
    this.passwordField = null
  },

  /**********************************************************************
   * _init
   */
  _init: function() {
    if (_.isUndefined(this.passwordHashFn)) {
      this.passwordHashFn = 'none'
    }
    if (!_.includes(this._supportedHashFunctions, this.passwordHashFn)) {
      throw new Error('unrecognized hash function (' +
                      this.passwordHashFn +
                      '), acceptable hash functions are: ' +
                      this._supportedHashFunctions)
    }
  },

  /**********************************************************************
   * validateCreds
   */
  validateCreds: function(username, password) {
    var result = null

    try {
      result = this.findUser(username)
      if (!result) {
        return undefined
      }
      switch (this.passwordHashFn) {
        case 'bcrypt':
          if (!bcrypt.sync.compare(password, result[this.passwordField])) {
            this.service.logDebug('Password for user ' +
                                  username +
                                  ' failed bcrypt compare')
            result = undefined
          }
          break
        // let other crypto supported hashes fall through
        case 'sha256':
          var hash = crypto.createHash(this.passwordHashFn)
          hash.update(password)
          if (hash.digest('hex') !== result[this.passwordField]) {
            this.service.logDebug('Password for user ' +
                                  username +
                                  ' failed ' +
                                  this.passwordHashFn +
                                  ' comparison')
            result = undefined
          }
          break
        case 'none':
        default:
          if (password !== result[this.passwordField]) {
            this.service.logDebug('Password for user ' + username + ' failed comparison')
            result = undefined
          }
      }
    } catch (e) {
      this.service.logWarning('Problem finding user: ', username, ' -- ', e.stack)
      throw new this.service.errors.InternalServerError()
    }

    return result
  },

  /**********************************************************************
   * authenticate
   */        
  authenticate: function(req) {
    var result = null
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
   * findUser
   *
   * NOTE: this should be extended
   *
   * @param {string} username - The username sent by the client.
   */
  findUser: function(username) {
    if (!this.usernameField) {
      throw new Error(this.constructor.name +
                      '.usernameField is null. Please check your configuration')
    }
    if (!this.passwordField) {
      throw new Error(this.constructor.name +
                      '.passwordField is null. Please check your configuration')
    }
  }

})
