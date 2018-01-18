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
  _ctorName: 'ServiceTest',

  /*****************************************************************************
   * @constructs ServiceTest
   * @description A test harness for testing {@link carbond.Service}\ s. This will
   *              automatically startup and shutdown a service as part of the test's
   *              setup and teardown phase.
   * @memberof carbond.test
   * @extends testtube.HttpTest
   */
  _C: function() {
    /****************************************************************************
     * @property {carbond.Service} service -- The service instance to test
     */
    this.service = undefined

    /***************************************************************************
     * @property {boolean} [suppressServiceLogging=true]
     * @description Flag to suppress service logging to the console
     */
    this.suppressServiceLogging = true

    /***************************************************************************
     * @property {string} [serviceEnv='development']
     * @description Sets the service's {@link carbond.Service.env} for testing
     */
    this.serviceEnv = 'development'
  },

  /****************************************************************************
   * @method _init
   * @description Delegates to the parent class _init method
   * @returns {undefined}
   */
  _init: function() {
    tt.HttpTest.prototype._init.call(this)
  },

  /*****************************************************************************
   * @method setup
   * @description Performs setup operations for this test, namely starting the
   *              service to be tested and configuring service logging
   * @returns {undefined}
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
   * @description Performs teardown operations for this test, namely stopping the
   *                       service
   * @returns {undefined}
   */
  teardown: function() {
    try {
      this.service.stop()
    } catch (e) {
      console.error('Error encountered stopping test service: ' + e.toString())
    }
  }
})
