.. class:: carbond.SslOptions
    :heading:

.. |br| raw:: html

   <br />

==================
carbond.SslOptions
==================

All options relating to SSL for HTTPS server creation

Instance Properties
-------------------

.. class:: carbond.SslOptions
    :noindex:
    :hidden:

    .. attribute:: ciphers

       :type: string
       :default: undefined

       A string listing supported and unsupported ciphers (see https://www.openssl.org/docs/man1.0.2/apps/ciphers.html for ciphers and format). If omitted, the default ciphers for your version of NodeJS will be used (see ``tls`` documentation for details).


    .. attribute:: crl

       :type: string
       :default: undefined

       A certificate revocation list in PEM format


    .. attribute:: dhparam

       :type: string
       :default: undefined

       Diffie Hellman parameters (use ``openssl dhparam`` to generate). Note, if these are invalid, they will be silently discarded and the accompanying ciphers will be disabled. Key length must be greater than 1024 bits.


    .. attribute:: ecdhCurve

       :type: string
       :default: undefined

       A string describing a named curve to use for ECDH key agreement or false to disable ECDH. See ``crypto.getCurves()`` for a list of supported curve names.


    .. attribute:: handshakeTimeout

       :type: number
       :default: undefined

       Amount of time in milliseconds to wait for the handshake to complete before throwing an error. If omitted, the default value of 120 seconds will be used.


    .. attribute:: honorCipherOrder

       :type: boolean
       :default: ``true``

       Use the server's preferred cipher instead of the client's


    .. attribute:: NPNProtocols

       :type: string[]
       :default: undefined

       An array of possible NPN protocols, listed in order of priority


    .. attribute:: rejectUnauthorized

       :type: boolean
       :default: false

       Reject connections whose client certificate is not authorized by any of the CAs. This is only applicable if :class:`~carbond.SslOptions.requestCert` is ``true``.


    .. attribute:: requestCert

       :type: boolean
       :default: false

       Whether of not to request and verify the client's certificate


    .. attribute:: secureProtocol

       :type: string
       :default: ``'TLSv1_method'``

       The SSL method to use. The possible values depend on the version of OpenSSL installed in the environment. See https://www.openssl.org/docs/man1.0.2/ssl/SSL_CTX_new.html for possible values.


    .. attribute:: serverKeyPassphrase

       :type: string
       :default: undefined

       The server key passphrase (this will be sanitized after initialization)


    .. attribute:: serverKeyPath

       :type: string
       :required:

       Path to the server private key in PEM format


    .. attribute:: sessionIdContext

       :type: string
       :default: undefined

       A string containing an opaque identifier for session resumption. If requestCert is true, the default is a 128 bit truncated SHA1 hash value generated from the command-line. Otherwise, a default is not provided.


    .. attribute:: sessionTimeout

       :type: number
       :default: undefined

       The number of seconds after which TLS sessions should timeout. If omitted, the default is 300 seconds.


    .. attribute:: SNICallback

       :type: function
       :default: undefined

       A callback that takes the arguments ``servername`` and ``cb``. This will be called if the client supports SNI TLS extension and should call ``cb`` with ``(null, ctx)``, where ``ctx`` is a ``SecureContext`` instance as returned by ``tls.createSecureContext(...)``. If this omitted, Node's default callback will be used (see Node documentation for more details).


    .. attribute:: ticketKeys

       :type: Buffer
       :default: undefined

       A 48 byte ``Buffer`` instance with a 16-byte prefix, a 16-byte HMAC key, and a 16-byte AES key. This can be used to accept TLS session tickets on multiple instances of the TLS server.


    .. attribute:: trustedCertsPaths

       :type: string[]
       :default: undefined

       Paths to all trusted CAs. If this is omitted, well known trusted CAs will be used (e.g. Verisign). Used to authorize connections


Methods
-------

.. class:: carbond.SslOptions
    :noindex:
    :hidden:

    .. function:: asHttpsOptions()

        :rtype: Object

        Transforms the options managed by ``SslOptions`` into a format that is appropriate for ``https.createServer``

    .. function:: isEnabled()

        :rtype: boolean

        Tests if this options instance is valid for use
