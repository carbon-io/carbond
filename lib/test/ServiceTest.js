var oo = require('@carbon-io/carbon-core').atom.oo(module)
var tt = require('@carbon-io/carbon-core').testtube

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
    this.suppressServiceLogging = true
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
    function sleep(ms, cb) {
      setTimeout(function() {
        cb()
      }, ms)
    }

    if (this.suppressServiceLogging) {
      this.service.verbosity = 'fatal' 
    }

    for (var i=0; i<3; i++) {
      try {
        this.service.start()
        break
      } catch (e) {
        if (i === 2) {
          throw new Error(
            'Failed to start server. Port ' + 
            this.service.port + 
            ' already bound.')
        }
        if (e.message.includes('EADDRINUSE')) {
          console.warn('caught EADDRINUSE, will try again in 1 second...')
          sleep.sync(1000)
        } else {
          throw e
        }
      }
    }

    // XXX: Service.sslOptions is not initialized until start is called
    var sslOptions = this.service.sslOptions
    var scheme = (sslOptions && sslOptions.isEnabled()) ? 'https' : 'http'
    this.baseUrl = `${scheme}://localhost:${this.service.port}`
  },

  /**********************************************************************
   * teardown
   */
  teardown: function() {
    try {
      this.service.stop()
    } catch (e) {
      console.error('Error encountered stopping test service: ' + e.toString())
    }
  },

})
