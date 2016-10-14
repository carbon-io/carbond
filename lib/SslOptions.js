var fs = require('fs')

var _ = require('lodash')

var oo = require('carbon-core').atom.oo(module);

/******************************************************************************
 * @class SslOptions
 * 
 * Adapted from:
 *  https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener
 */
module.exports = oo({

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.serverCertPath = null, 
    this.serverKeyPath = null, 
    this.serverKeyPassphrase = null, 
    this.trustedCertsPaths = null, 
    this.crl = null,
    this.ciphers = null,
    this.ecdhCurve = null,
    this.dhparam = null,
    this.handshakeTimeout = null,
    this.honorCipherOrder = null,
    this.requestCert = false, // XXX if this or rejectUnauthorized then not working without client cert
    this.rejectUnauthorized = false, // XXX rejectUnauthorized or do it how microservice does it? 
    this.checkServerIdentity = null,
    this.NPNProtocols = null,
    this.SNICallback = null,
    this.sessionTimeout = null,
    this.ticketKeys = null,
    this.sessionIdContext = null,
    this.secureProtocol = 'TLSv1_method', // XXX this may not need to be default long-term but safer now
    this.secureOptions = null
  },
    
  /**********************************************************************
   * isEnabled
   */
  isEnabled: function() {
    return !!this.serverCertPath
  },

  /**********************************************************************
   * asHttpsOptions
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

  /**********************************************************************
   * _loadCertificates
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

