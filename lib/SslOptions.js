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
  _ctorName: 'SslOptions',

  /*****************************************************************************
   * @constructs SslOptions
   * @description All options relating to SSL for HTTPS server creation
   * @memberof carbond
   */
  _C: function() {
    /***************************************************************************
     * @property {string} serverCertPath -- Path to the server certificate in PEM
     *                                      format
     */
    this.serverCertPath = null,

    /***************************************************************************
     * @property {string} serverKeyPath -- Path to the server private key in PEM
     *                                     format
     */
    this.serverKeyPath = null,

    /***************************************************************************
     * @property {string?} [serverKeyPassphrase] -- The server key passphrase (this
     *                                              will be sanitized after
     *                                              initialization)
     */
    this.serverKeyPassphrase = null,

    /***************************************************************************
     * @property {Array.<string>?} [trustedCertsPaths]
     * @description Paths to all trusted CAs. If this is omitted, well known trusted
     *              CAs will be used (e.g. Verisign). Used to authorize connections
     */
    this.trustedCertsPaths = null,

    /***************************************************************************
     * @property {Array.<string>?} crlPaths -- Paths to any certificate revocation
     *                                         lists in PEM format
     * @todo https://github.com/carbon-io/carbond/issues/255
     * @ignore
     */
    // this.crlPaths = null,

    /***************************************************************************
     * @property {string?} [crl] -- A certificate revocation list in PEM format
     */
    this.crl = null,

    /***************************************************************************
     * @property {string?} [ciphers]
     * @description A string listing supported and unsupported ciphers (see
     *              https://www.openssl.org/docs/man1.0.2/apps/ciphers.html for
     *              ciphers and format). If omitted, the default ciphers for your
     *              version of NodeJS will be used (see ``tls`` documentation for
     *              details).
     */
    this.ciphers = null,

    /***************************************************************************
     * @property {string?} [ecdhCurve]
     * @description A string describing a named curve to use for ECDH key
     *              agreement or false to disable ECDH. See ``crypto.getCurves()``
     *              for a list of supported curve names.
     */
    this.ecdhCurve = null,

    /***************************************************************************
     * @property {string?} [dhparam]
     * @description Diffie Hellman parameters (use ``openssl dhparam`` to generate).
     *              Note, if these are invalid, they will be silently discarded and
     *              the accompanying ciphers will be disabled. Key length must be
     *              greater than 1024 bits.
     */
    this.dhparam = null,

    /***************************************************************************
     * @property {number?} [handshakeTimeout]
     * @description Amount of time in milliseconds to wait for the handshake to
     *              complete before throwing an error. If omitted, the default
     *              value of 120 seconds will be used.
     */
    this.handshakeTimeout = null,

    /***************************************************************************
     * @property {boolean} [honorCipherOrder=true]
     * @description Use the server's preferred cipher instead of the client's
     */
    this.honorCipherOrder = true,

    /***************************************************************************
     * @property {boolean} [requestCert=false]
     * @description Whether of not to request and verify the client's certificate
     */
    this.requestCert = false,

    /***************************************************************************
     * @property {boolean} [rejectUnauthorized=false]
     * @description Reject connections whose client certificate is not authorized
     *              by any of the CAs. This is only applicable if {@link
     *              carbond.SslOptions.requestCert} is ``true``.
     */
    this.rejectUnauthorized = false,

    /***************************************************************************
     * @property {Function?} [checkServerIdentity]
     * @description A callback that takes the arguments ``servername`` and ``cert``.
     *              It should through an error if the server's hostname does not
     *              match the cert and return ``undefined`` if verified.
     * @todo is there a reason this is here on the server side?
     * @ignore
     */
    this.checkServerIdentity = null,

    /***************************************************************************
     * @property {Array.<string>?} [NPNProtocols]
     * @description An array of possible NPN protocols, listed in order of priority
     */
    this.NPNProtocols = null,

    /***************************************************************************
     * @property {Function?} [SNICallback]
     * @description A callback that takes the arguments ``servername`` and ``cb``.
     *              This will be called if the client supports SNI TLS extension and
     *              should call ``cb`` with ``(null, ctx)``, where ``ctx`` is a
     *              ``SecureContext`` instance as returned by
     *              ``tls.createSecureContext(...)``. If this omitted, Node's default
     *              callback will be used (see Node documentation for more details).
     */
    this.SNICallback = null,

    /***************************************************************************
     * @property {number} [sessionTimeout]
     * @description The number of seconds after which TLS sessions should timeout.
     *              If omitted, the default is 300 seconds.
     */
    this.sessionTimeout = null,

    /***************************************************************************
     * @property {Buffer?} [ticketKeys]
     * @description A 48 byte ``Buffer`` instance with a 16-byte prefix, a
     *              16-byte HMAC key, and a 16-byte AES key. This can be used to
     *              accept TLS session tickets on multiple instances of the TLS
     *              server.
     */
    this.ticketKeys = null,

    /***************************************************************************
     * @property {string?} [sessionIdContext]
     * @description A string containing an opaque identifier for session
     *              resumption. If requestCert is true, the default is a 128 bit
     *              truncated SHA1 hash value generated from the command-line.
     *              Otherwise, a default is not provided.
     */
    this.sessionIdContext = null,

    /***************************************************************************
     * @property {string} [secureProtocol='TLSv1_method']
     * @description The SSL method to use. The possible values depend on the
     *              version of OpenSSL installed in the environment. See
     *              https://www.openssl.org/docs/man1.0.2/ssl/SSL_CTX_new.html
     *              for possible values.
     */
    this.secureProtocol = 'TLSv1_method', // XXX this may not need to be default long-term but safer now

    /***************************************************************************
     * @property {xxx} secureOptions -- xxx
     * @todo this doesn't appear to be used anywhere. get rid of it?
     * @ignore
     */
    this.secureOptions = null
  },

  /*****************************************************************************
   * @method isEnabled
   * @description Tests if this options instance is valid for use
   * @returns {boolean}
   */
  isEnabled: function() {
    return !!this.serverCertPath
  },

  /*****************************************************************************
   * @method asHttpsOptions
   * @description Transforms the options managed by ``SslOptions`` into a format
   *              that is appropriate for ``https.createServer``
   * @returns {Object}
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
   * @description Reads all certificates in a number of directories and concatenates
   *              them into a single string
   * @param {Array|string} spec -- An array of filesystem paths for directories
   *                               containing certificates or the certificates
   *                               themselves, or a single path for a directory or
   *                               certificate
   * @returns {string}
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

