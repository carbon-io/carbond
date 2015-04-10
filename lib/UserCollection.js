var o = require('maker').o(module);
var oo = require('maker').oo(module);
var _o = require('maker')._o(module);

/******************************************************************************
 * @class UserCollection
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */
  _type: "./MongoDBCollection", 

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.passwordField = null
    this.apiKeyField = null // optional, if not null will provide support for autogen features
    this.newUserTemplate = null
    this.allowUnauthenticated = ['post']
  },

  /**********************************************************************
   * insert
   */
  insert: function(obj) {
    if (!obj[this.passwordField]) {
      throw this.objectserver.errors.BadRequest("Missing password field")
    }

    obj[this.passwordField] = this.encrypt(obj[this.passwordField])
    
    if (obj[this.apiKeyField]) {
      obj[this.apiKeyField] = this.encrypt(obj[this.apiKeyField])
    }

    return this._super('insert')(obj)
  },

  /**********************************************************************
   * encrypt
   */
  encrypt: function(s) {
    return "ENCRYPTED:" + s // XXX come back and do SHA
  },


})
