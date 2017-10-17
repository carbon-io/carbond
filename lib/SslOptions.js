var fs = require('fs')

var _ = require('lodash')

var oo = require('@carbon-io/carbon-core').atom.oo(module);

/***************************************************************************************************
 * @class SslOptions
 *
 * Adapted from:
 *  https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener
 */
module.exports = oo({

  /*****************************************************************************
   * @constructs SslOptions
   * @description SslOptions class description
   * @memberof carbond
   */
  _C: function() {
    /***************************************************************************
     * @property {string} serverCertPath -- xxx
     */
    this.serverCertPath = null,

    /***************************************************************************
     * @property {string} serverKeyPath -- xxx
     */
    this.serverKeyPath = null,

    /***************************************************************************
     * @property {string} serverKeyPassphrase -- xxx
     */
    this.serverKeyPassphrase = null,

    /***************************************************************************
     * @property {string} trustedCertsPaths -- xxx
     */
    this.trustedCertsPaths = null,

    /***************************************************************************
     * @property {xxx} crl -- xxx
     */
    this.crl = null,

    /***************************************************************************
     * @property {xxx} ciphers -- xxx
     */
    this.ciphers = null,

    /***************************************************************************
     * @property {xxx} ecdhCurve -- xxx
     */
    this.ecdhCurve = null,

    /***************************************************************************
     * @property {xxx} dhparam -- xxx
     */
    this.dhparam = null,

    /***************************************************************************
     * @property {xxx} handshakeTimeout -- xxx
     */
    this.handshakeTimeout = null,

    /***************************************************************************
     * @property {xxx} honorCipherOrder -- xxx
     */
    this.honorCipherOrder = null,

    /***************************************************************************
     * @property {boolean} [requestCert=false] -- xxx
     */
    this.requestCert = false, // XXX if this or rejectUnauthorized then not working without client cert

    /***************************************************************************
     * @property {boolean} [rejectUnauthorized=false] -- xxx
     */
    this.rejectUnauthorized = false, // XXX rejectUnauthorized or do it how microservice does it?

    /***************************************************************************
     * @property {xxx} checkServerIdentity --  xxx
     */
    this.checkServerIdentity = null,

    /***************************************************************************
     * @property {xxx} NPNProtocols -- xxx
     */
    this.NPNProtocols = null,

    /***************************************************************************
     * @property {xxx} SNICallback -- xxx
     */
    this.SNICallback = null,

    /***************************************************************************
     * @property {number} sessionTimeout -- xxx
     */
    this.sessionTimeout = null,

    /***************************************************************************
     * @property {xxx} ticketKeys -- xxx
     */
    this.ticketKeys = null,

    /***************************************************************************
     * @property {xxx} sessionIdContext -- xxx
     */
    this.sessionIdContext = null,

    /***************************************************************************
     * @property {string} [secureProtocol=TLSv1_method] -- xxx
     */
    this.secureProtocol = 'TLSv1_method', // XXX this may not need to be default long-term but safer now

    /***************************************************************************
     * @property {xxx} secureOptions -- xxx
     */
    this.secureOptions = null
  },

  /*****************************************************************************
   * @method isEnabled
   * @description isEnabled description
   * @returns {string} -- xxx
   */
  isEnabled: function() {
    return !!this.serverCertPath
  },

  /*****************************************************************************
   * @method asHttpsOptions
   * @description asHttpsOptions description
   * @returns {xxx} -- xxx
   */
  asHttpsOptions: function() {
    var result = {}

    _.extend(result, this)

    result.cert = fs.readFileSync(this.serverCertPath)
    result.key = fs.readFileSync(this.serverKeyPath)
    if (this.trustedCertsPaths) {
      result.ca = this._loadCertificates(this.trustedCertsPaths)
    }

    if (this.serverKeyPassphrase) {
      result.passphrase = this.serverKeyPassphrase
      delete this.serverKeyPassphrase
    }

    return result
  },

  /*****************************************************************************
   * @method _loadCertificates
   * @description _loadCertificates description
   * @param {xxx} spec -- xxx
   * @returns {xxx} -- xxx
   */
  _loadCertificates: function(spec) {
    var self = this
    if (Array.isArray(spec)) {
      return spec.reduce(function (result, element) {
        return result.concat(self._loadCertificates(element))
      }, [])
    } else if (fs.statSync(spec).isDirectory()) {
      // Be sure to load only files and symlinks, don't recurse down directories
      return self._loadCertificates(
        fs.readdirSync(spec).map(function (f) {
          return path.join(spec, f)
        }).filter(function (f) {
          return fs.statSync(f).isFile()
        })
      )
    } else {
      return fs.readFileSync(spec)
    }
  }

})

