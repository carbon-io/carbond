var o = require('atom').o(module)
var oo = require('atom').oo(module)
var _o = require('bond')._o(module)
var __ = require('@carbon-io/fibers').__(module)
var tt = require('test-tube')
var _ = require('lodash')
var assert = require('assert')
var EJSON = require('ejson')
var HttpError = require('http-errors').HttpError

/******************************************************************************
 * @class ServiceTest
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */
  _type: tt.HttpTest,

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.service = undefined
  },

  /**********************************************************************
   * _init
   */
  _init: function() {
    tt.HttpTest.prototype._init.call(this)
  },

  /**********************************************************************
   * setup
   */
  setup: function() {
    this.service.start()
    // XXX: Service.sslOptions is not initialized until start is called
    var sslOptions = this.service.sslOptions
    var scheme = (sslOptions && sslOptions.isEnabled()) ? 'https' : 'http'
    this.baseUrl = `${scheme}://localhost:${this.service.port}`
  },

  /**********************************************************************
   * teardown
   */
  teardown: function() {
    this.service.stop()
  },

})
