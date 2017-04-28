var oo = require('@carbon-io/carbon-core').atom.oo(module)
var tt = require('@carbon-io/carbon-core').testtube
    
function sleep(ms, cb) {
  setTimeout(function() {
    cb()
  }, ms)
}

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
    if (this.suppressServiceLogging) {
      this.service.verbosity = 'fatal' 
    }

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
    try {
      this.service.stop()
      sleep.sync(1000)
    } catch (e) {
      console.error('Error encountered stopping test service: ' + e.toString())
    }
  },

})
