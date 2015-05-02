var o = require('atom').o(module);
var oo = require('atom').oo(module);

var fs = require('fs')
var _ = require('underscore')

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
    this.serverCertPath = undefined, 
    this.serverKeyPath = undefined, 
    this.serverKeyPassphrase = undefined, 
    this.trustedCertsPaths = undefined, 
    this.crl = undefined,
    this.ciphers = undefined,
    this.ecdhCurve = undefined,
    this.dhparam = undefined,
    this.handshakeTimeout = undefined,
    this.honorCipherOrder = undefined,
    this.requestCert = false, // XXX if this or rejectUnauthorized then not working without client cert
    this.rejectUnauthorized = false, // XXX rejectUnauthorized or do it how microservice does it? 
    this.checkServerIdentity = undefined,
    this.NPNProtocols = undefined,
    this.SNICallback = undefined,
    this.sessionTimeout = undefined,
    this.ticketKeys = undefined,
    this.sessionIdContext = undefined,
    this.secureProtocol = 'TLSv1_method', // XXX this may not need to be default long-term but safer now
    this.secureOptions = undefined
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
      result.ca = this._loadCertificates(options.trustedCertsPaths)
    }
      
    if (this.serverKeyPassphrase) {
      result.passphrase = this.serverKeyPassword
      delete this.serverKeyPassword
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

