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

* ```serverCertPath```: The path 
* ```serverKeyPath```: The foo

Methods
----------
_none_

Examples
----------
