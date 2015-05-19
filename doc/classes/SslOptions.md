class SslOptions
----------

Instances of this class represent a set of ssl related options for an ```ObjectServer```. Options mostly mirror those of the Node.js [```tls```](https://nodejs.org/api/tls.html#tls_tls_connect_port_host_options_callback) and [```https```](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) modules.

Configuration
----------

```
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
```

Properties
----------

* ```serverCertPath```: The path the server certificate.
* ```serverKeyPath```: The path to the private key.
* ```serverKeyPassphrase```: A string of passphrase for the private key or pfx.
* ```trustedCertsPaths```: A path or array of paths to find trusted CA certificates.
* ```crl```: Either a string or list of strings of PEM encoded CRLs (Certificate Revocation List).
* ```ciphers```: A string describing the ciphers to use or exclude. See note on the BEAST attack [here](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener)
* ```ecdhCurve```: A string describing a named curve to use for ECDH key agreement or false to disable ECDH.
* ```dhparam```: DH parameter file to use for DHE key agreement. Use openssl dhparam command to create it. If the file is invalid to load, it is silently discarded.
* ```handshakeTimeout```: Abort the connection if the SSL/TLS handshake does not finish in this many milliseconds. The default is 120 seconds.
* ```honorCipherOrder```: When choosing a cipher, use the server's preferences instead of the client preferences.
* ```requestCert```: If true the server will request a certificate from clients that connect and attempt to verify that certificate. Default: false.
* ```rejectUnauthorized```: If true the server will reject any connection which is not authorized with the list of supplied CAs. This option only has an effect if requestCert is true. Default: false.
* ```checkServerIdentity(servername, cert)```: Provide an override for checking server's hostname against the certificate. Should return an error if verification fails. Return undefined if passing.
* ```NPNProtocols```: An array of possible NPN protocols. (Protocols should be ordered by their priority).
* ```SNICallback(servername, cb)```: A function that will be called if client supports SNI TLS extension. Two argument will be passed to it: ```servername```, and ```cb```. ```SNICallback``` should invoke ```cb(null, ctx)```, where ctx is a ```SecureContext``` instance. (You can use ```tls.createSecureContext(...)``` to get proper ```SecureContext```). If ```SNICallback``` wasn't provided - default callback with high-level API will be used.
* ```sessionTimeout```: An integer specifying the seconds after which TLS session identifiers and TLS session tickets created by the server are timed out. See [```SSL_CTX_set_timeout```](https://www.openssl.org/docs/ssl/SSL_CTX_set_timeout.html) for more details.
* ```ticketKeys```: A 48-byte ```Buffer``` instance consisting of 16-byte prefix, 16-byte hmac key, 16-byte AES key. You could use it to accept tls session tickets on multiple instances of tls server.
* ```sessionIdContext```: A string containing an opaque identifier for session resumption. If ```requestCert``` is ```true```, the default is MD5 hash value generated from command-line. Otherwise, the default is not provided.
* ```secureProtocol```: The SSL method to use, e.g. ```SSLv3_method``` to force SSL version 3. The possible values depend on your installation of OpenSSL and are defined in the constant [```SSL_METHODS```](https://www.openssl.org/docs/ssl/ssl.html#DEALING_WITH_PROTOCOL_METHODS).
* ```secureOptions```: Set server options. For example, to disable the SSLv3 protocol set the ```SSL_OP_NO_SSLv3``` flag. See [```SSL_CTX_set_options```](https://www.openssl.org/docs/ssl/SSL_CTX_set_options.html) for all available options.

Methods
----------
_none_

Examples
----------

```node
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

```
