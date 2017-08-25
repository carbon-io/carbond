var oo = require('@carbon-io/carbon-core').atom.oo(module)
var tt = require('@carbon-io/carbon-core').testtube

/***************************************************************************************************
 * @namespace carbond.test
 */

/***************************************************************************************************
 * @class ServiceTest
 */
module.exports = oo({

  /*****************************************************************************
   * _type
   */
  _type: tt.HttpTest,

  /*****************************************************************************
   * @constructs ServiceTest
   * @description ServiceTest description
   * @memberof carbond.test
   * @extends test-tube.HttpTest
   */
  _C: function() {
    /****************************************************************************
     * @property {carbond.Service} service -- xxx
     */
    this.service = undefined

    /***************************************************************************
     * @property {boolean} [suppressServiceLogging=true] -- xxx
     */
    this.suppressServiceLogging = true
  },

  /****************************************************************************
   * @method _init
   * @description _init description
   * @returns {undefined} -- undefined
   */
  _init: function() {
    tt.HttpTest.prototype._init.call(this)
  },

  /*****************************************************************************
   * @method setup
   * @description setup
   * @returns {undefined} -- undefined
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

  /*****************************************************************************
   * @method teardown
   * @description teardown
   * @returns {undefined} -- undefined
   */
  teardown: function() {
    try {
      this.service.stop()
    } catch (e) {
      console.error('Error encountered stopping test service: ' + e.toString())
    }
  },

})
