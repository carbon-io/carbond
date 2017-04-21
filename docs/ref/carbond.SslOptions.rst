.. class:: carbond.SslOptions
    :heading:

.. |br| raw:: html
 
   <br />

==================
carbond.SslOptions
==================

Instances of this class represent a set of ssl related options for an ObjectServer. Options mostly mirror those of the Node.js `tls <https://nodejs.org/api/tls.html#tls_tls_connect_port_host_options_callback>`_ and `https <https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener>`_ modules.

Configuration
=============

..  code-block:: javascript

    {
        _type: carbon.carbond.SslOptions,

        serverCertPath: <string>,
        serverKeyPath: <string>, 
        [serverKeyPassphrase: <string>], 
        [trustedCertsPaths = <string>], 
        [crl: <string>],
        [ciphers: <string>],
        [ecdhCurve (<string> | false)],
        [dhparam: <string],
        [handshakeTimeout: <number>],
        [honorCipherOrder: <boolean>],
        [requestCert: <boolean>], 
        [rejectUnauthorized: <boolean>],
        [checkServerIdentity = <function>],
        [NPNProtocols: (<Array> | <Buffer)],
        [SNICallback: <function>],
        [sessionTimeout: <number>],
        [ticketKeys: <Buffer>],
        [sessionIdContext: <string>],
        [secureProtocol: <string>],
        [secureOptions: <string>]
    }

Properties
==========

.. class:: carbond.SslOptions
    :noindex:
    :hidden:

    .. attribute:: carbond.SslOptions.checkServerIdentity

        .. csv-table::
            :class: details-table

            "checkServerIdentity(*servername, cert*)", :class:`function`
            "Default", ``null``
            "Description", "Provide an override for checking server's hostname against the certificate. Should return an error if verification fails. Return undefined if passing."

    .. attribute:: carbond.SslOptions.ciphers

        .. csv-table::
            :class: details-table

            "ciphers", :class:`string`
            "Default", ``null``
            "Description", "A string describing the ciphers to use or exclude. See note on the BEAST attack `here <https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener>`_."

    .. attribute:: carbond.SslOptions.crl

        .. csv-table::
            :class: details-table

            "crl", :class:`string`
            "Default", ``null``
            "Description", "Either a string or list of strings of PEM encoded CRLs (Certificate Revocation List)."

    .. attribute:: carbond.SslOptions.dhparam

        .. csv-table::
            :class: details-table

            "dhparam", :class:`string`
            "Default", ``null``
            "Description", "DH parameter file to use for DHE key agreement. Use openssl dhparam command to create it. If the file is invalid to load, it is silently discarded."

    .. attribute:: carbond.SslOptions.ecdhCurve

        .. csv-table::
            :class: details-table

            "ecdhCurve", :class:`string` | :class:`boolean`
            "Default", ``null``
            "Description", "A string describing a named curve to use for ECDH key agreement or false to disable ECDH."

    .. attribute:: carbond.SslOptions.handshakeTimeout

        .. csv-table::
            :class: details-table

            "handshakeTimeout", :class:`string`
            "Default", ``null``
            "Description", "Abort the connection if the SSL/TLS handshake does not finish in this many milliseconds. The default is 120 seconds."

    .. attribute:: carbond.SslOptions.honorCipherOrder

        .. csv-table::
            :class: details-table

            "honorCipherOrder", :class:`boolean`
            "Default", ``null``
            "Description", "When choosing a cipher, use the server's preferences instead of the client preferences."

    .. attribute:: carbond.SslOptions.NPNProtocols

        .. csv-table::
            :class: details-table

            "NPNProtocols", :class:`object`
            "Default", ``null``
            "Description", "An array of possible NPN protocols. (Protocols should be ordered by their priority)."

    .. attribute:: carbond.SslOptions.rejectUnauthorized

        .. csv-table::
            :class: details-table

            "rejectUnauthorized", :class:`boolean`
            "Default", ``false``
            "Description", "If true the server will reject any connection which is not authorized with the list of supplied CAs. This option only has an effect if requestCert is true. Default: false."

    .. attribute:: carbond.SslOptions.requestCert

        .. csv-table::
            :class: details-table

            "requestCert", :class:`boolean`
            "Default", ``false``
            "Description", "If true the server will request a certificate from clients that connect and attempt to verify that certificate. Default: false."

    .. attribute:: carbond.SslOptions.SNICallback

        .. csv-table::
            :class: details-table

            "SNICallback (*servername, cb*)", :class:`function`
            "Default", ``null``
            "Description", "A function that will be called if client supports SNI TLS extension. Two argument will be passed to it: ``servername``, and ``cb``. ``SNICallback`` should invoke ``cb(null, ctx)``, where ctx is a ``SecureContext`` instance. (You can use ``tls.createSecureContext(...)`` to get proper ``SecureContext``). If ``SNICallback`` wasn't provided - default callback with high-level API will be used."

    .. attribute:: carbond.SslOptions.secureOptions

        .. csv-table::
            :class: details-table

            "secureOptions", :class:`string`
            "Default", ``null``
            "Description", "Set server options. For example, to disable the SSLv3 protocol set the ``SSL_OP_NO_SSLv3`` flag. See `SSL_CTX_set_options <https://www.openssl.org/docs/manmaster/ssl/SSL_CTX_set_options.html>`_ for all available options."

    .. attribute:: carbond.SslOptions.secureProtocol

        .. csv-table::
            :class: details-table

            "secureProtocol", :class:`string`
            "Default", ``TLSv1_method``
            "Description", "The SSL method to use, e.g. ``SSLv3_method`` to force SSL version 3. The possible values depend on your installation of OpenSSL and are defined in the constant ``SSL_METHODS``."

    .. attribute:: carbond.SslOptions.serverCertPath

        .. csv-table::
            :class: details-table

            "serverCertPath", :class:`string`
            "Default", ``null``
            "Description", "The path to the server certificate."

    .. attribute:: carbond.SslOptions.serverKeyPassPhrase

        .. csv-table::
            :class: details-table

            "serverKeyPassPhrase", :class:`string`
            "Default", ``null``
            "Description", "A string of passphrase for the private key or pfx."

    .. attribute:: carbond.SslOptions.serverKeyPath

        .. csv-table::
            :class: details-table

            "serverKeyPath", :class:`string`
            "Default", ``null``
            "Description", "The path to the private key."

    .. attribute:: carbond.SslOptions.sessionIdContext

        .. csv-table::
            :class: details-table

            "sessionIdContext", :class:`object`
            "Default", ``null``
            "Description", "A string containing an opaque identifier for session resumption. If ``requestCert`` is ``true``, the default is MD5 hash value generated from command-line. Otherwise, the default is not provided."

    .. attribute:: carbond.SslOptions.sessionTimeout

        .. csv-table::
            :class: details-table

            "sessionTimeout", :class:`number`
            "Default", ``null``
            "Description", "An integer specifying the seconds after which TLS session identifiers and TLS session tickets created by the server are timed out. See SSL_CTX_set_timeout for more details."

    .. attribute:: carbond.SslOptions.ticketKeys

        .. csv-table::
            :class: details-table

            "ticketKeys", :class:`object`
            "Default", ``null``
            "Description", "A 48-byte ``Buffer`` instance consisting of 16-byte prefix, 16-byte hmac key, 16-byte AES key. You could use it to accept tls session tickets on multiple instances of tls server."

    .. attribute:: carbond.SslOptions.trustedCertsPaths

        .. csv-table::
            :class: details-table

            "trustedCertsPaths", :class:`string`
            "Default", ``null``
            "Description", "A path or array of paths to find trusted CA certificates."

Methods
=======

.. class:: carbond.SslOptions
    :noindex:
    :hidden:

    .. function:: carbond.SslOptions.isEnabled

        .. csv-table::
            :class: details-table

            "isEnabled ()", ""
            "Arguments", ``undefined``
            "Returns", ``undefined``
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

    .. function:: carbond.SslOptions.asHttpsOptions

        .. csv-table::
            :class: details-table

            "asHttpsOptions ()", ""
            "Arguments", ``undefined``
            "Returns", :class:`object`
            "Descriptions", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo            re magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du    is a    ute     irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cu    pidatat     non proi    dent, sunt in culpa qui officia deserunt mollit anim id est laborum."

Examples
========

..  code-block:: javascript

    var carbon = require('carbon-io')
    var o   = carbon.atom.o(module)
    var __  = carbon.fiber.__(module, true)

    var path = require('path')

    __(function() {
      module.exports = o({
        _type: carbon.carbond.ObjectServer,
        port: 8888,

        sslOptions: {
          serverCertPath: path.join(__dirname, 'cert.pem'),
          serverKeyPath: path.join(__dirname, 'key.pem')
        },

        endpoints : {
          "hello": o({
            _type: carbon.carbond.Endpoint,

            get: function(req) {
              return { "msg" : "Hello world!" }
            }
          })
        }

      })
    })